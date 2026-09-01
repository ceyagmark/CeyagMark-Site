import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data";
import { apiError } from "@/lib/api-error";

// Render-only lookup for the manage page. GET never mutates.
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  try {
    const dataSource = await getDataSource();
    const booking = await dataSource.getBookingByToken(token);
    if (!booking) return apiError("NOT_FOUND", "Booking not found.");
    return NextResponse.json({ booking });
  } catch (err) {
    console.error("GET /api/bookings/[token]:", err);
    return apiError("INTERNAL_ERROR", "Could not load the booking.");
  }
}
