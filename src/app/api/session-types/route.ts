import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data";
import { apiError } from "@/lib/api-error";

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const sessionTypes = await dataSource.getActiveSessionTypes();
    return NextResponse.json({ sessionTypes });
  } catch {
    return apiError("INTERNAL_ERROR", "Could not load session types.");
  }
}
