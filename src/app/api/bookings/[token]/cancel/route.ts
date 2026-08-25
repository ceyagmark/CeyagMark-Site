import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data";
import { apiError } from "@/lib/api-error";

export async function POST(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  try {
    const dataSource = await getDataSource();
    const result = await dataSource.cancelBooking(token);
    if (!result.ok) return apiError("NOT_FOUND", "Booking not found.");
    return NextResponse.json({ ok: true });
  } catch {
    return apiError("INTERNAL_ERROR", "Could not cancel the booking.");
  }
}
