import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data";
import { apiError } from "@/lib/api-error";
import { availabilityQuerySchema } from "@/lib/validation/booking";

// GET decides nothing (PPI trap: "mail scanners prefetch URLs. Render on GET,
// act on POST."). This only reads.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = availabilityQuerySchema.safeParse({
    sessionTypeId: searchParams.get("sessionTypeId"),
    from: searchParams.get("from"),
    to: searchParams.get("to"),
  });
  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Invalid availability query.", { issues: parsed.error.issues });
  }
  try {
    const dataSource = await getDataSource();
    const slots = await dataSource.getAvailability(parsed.data.sessionTypeId, parsed.data.from, parsed.data.to);
    return NextResponse.json({ slots });
  } catch (err) {
    console.error("GET /api/availability:", err);
    return apiError("INTERNAL_ERROR", "Could not load availability.");
  }
}
