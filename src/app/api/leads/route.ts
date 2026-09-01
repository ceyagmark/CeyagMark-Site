import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data";
import { apiError } from "@/lib/api-error";
import { createLeadSchema } from "@/lib/validation/lead";
import { isRateLimited, clientKey } from "@/lib/rate-limit";
import { sendAndLog } from "@/lib/notify";
import { leadReceivedEmail } from "@/lib/notify/templates";
import { sinkLead } from "@/lib/lead-sink";

// Every lead writes to the database first; the success state on the caller's
// side renders only after this responds 200 — fixes the audit finding that
// /contact showed success while the fetch was silently skipped.
export async function POST(request: Request) {
  if (isRateLimited(`lead:${clientKey(request)}`, 10, 10 * 60 * 1000)) {
    return apiError("RATE_LIMITED", "Too many attempts. Try again in a few minutes.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("VALIDATION_ERROR", "Invalid request body.");
  }

  const parsed = createLeadSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return apiError("VALIDATION_ERROR", first?.message ?? "Invalid submission.", { issues: parsed.error.issues });
  }

  try {
    const dataSource = await getDataSource();
    const lead = await dataSource.createLead(parsed.data);

    await sinkLead(dataSource, lead);

    // site_settings.owner_alert_email is not exposed through the DataSource
    // port yet (only create_booking reads it, server-side) — see BUILD-NOTES
    // open items. Falls back to the same real, published contact seeded there.
    const ownerEmail = process.env.SEED_OWNER_EMAIL ?? "growth@ceyagmark.com";
    await sendAndLog(dataSource, leadReceivedEmail(ownerEmail, lead.name, lead.email, lead.source), "lead_received", {
      leadId: lead.id,
    });

    return NextResponse.json({ lead: { id: lead.id } });
  } catch (err) {
    console.error("POST /api/leads:", err);
    return apiError("INTERNAL_ERROR", "Could not save your submission.");
  }
}
