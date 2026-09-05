import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data";
import { apiError } from "@/lib/api-error";
import { deleteCalendarEvent } from "@/lib/calendar/google";

export async function POST(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  try {
    const dataSource = await getDataSource();
    // Read before cancelling: cancelBooking reports only ok/not-found, and the
    // confirmation code is what the calendar event id is derived from.
    const booking = await dataSource.getBookingByToken(token);
    const result = await dataSource.cancelBooking(token);
    if (!result.ok) return apiError("NOT_FOUND", "Booking not found.");

    // Fail-soft, and after the cancellation is committed. A stale event left on
    // the calendar is a nuisance; a cancellation that fails because Google is
    // down would leave someone unable to cancel at all.
    if (booking) {
      void deleteCalendarEvent(booking.confirmationCode).catch(() => {});
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/bookings/[token]/cancel:", err);
    return apiError("INTERNAL_ERROR", "Could not cancel the booking.");
  }
}
