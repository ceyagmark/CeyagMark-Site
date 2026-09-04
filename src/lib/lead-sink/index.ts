import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { DataSource, Lead } from "@/lib/data/types";

// Same rule as the notification port: a skipped or stubbed send logs
// explicitly as skipped, never silently as sent (ADR-001 #11). The DB write
// already happened by the time this runs (createLead/createBooking), this
// port only handles the two forward sinks: Hub and the local pipeline file.

const PIPELINE_FILE = join(process.cwd(), "data", "hub-pipeline-log.jsonl");

async function sinkToHub(lead: Lead): Promise<{ status: "sent" | "skipped" | "failed"; detail?: string }> {
  const url = process.env.HUB_INTAKE_URL;
  if (!url) return { status: "skipped", detail: "HUB_INTAKE_URL not set" };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lead }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { status: "failed", detail: `Hub responded ${res.status}` };
    return { status: "sent" };
  } catch (err) {
    return { status: "failed", detail: err instanceof Error ? err.message : "unknown error" };
  }
}

async function sinkToFile(lead: Lead): Promise<{ status: "sent" | "skipped" | "failed"; detail?: string }> {
  try {
    await mkdir(join(process.cwd(), "data"), { recursive: true });
    const record = {
      // AgencyOS-pipeline-shaped record (Lead model field names), written
      // inside this repo, never into Agency/, which is frozen until
      // 2026-08-29 (Agency/baseline-week.md).
      source: "ceyagmark-nextjs",
      leadSource: lead.source,
      stage: lead.stage,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      fields: lead.fields,
      createdAt: lead.createdAt,
    };
    await appendFile(PIPELINE_FILE, `${JSON.stringify(record)}\n`, "utf-8");
    return { status: "sent" };
  } catch (err) {
    return { status: "failed", detail: err instanceof Error ? err.message : "unknown error" };
  }
}

export async function sinkLead(dataSource: DataSource, lead: Lead) {
  const [hubResult, fileResult] = await Promise.all([sinkToHub(lead), sinkToFile(lead)]);
  await Promise.all([
    dataSource.logLeadSink({ leadId: lead.id, sink: "db", status: "sent" }),
    dataSource.logLeadSink({ leadId: lead.id, sink: "hub", ...hubResult }),
    dataSource.logLeadSink({ leadId: lead.id, sink: "file", ...fileResult }),
  ]);
}
