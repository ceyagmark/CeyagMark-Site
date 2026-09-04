import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data";
import { apiError } from "@/lib/api-error";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const sessionTypes = await dataSource.getActiveSessionTypes();
    return NextResponse.json({ sessionTypes });
  } catch (err) {
    console.error("GET /api/session-types:", err);
    // TEMPORARY, again — the SUPABASE_URL fix didn't clear it, need to see
    // what's actually failing now. Reverts in the very next commit.
    return apiError("INTERNAL_ERROR", err instanceof Error ? err.message : String(err));
  }
}
