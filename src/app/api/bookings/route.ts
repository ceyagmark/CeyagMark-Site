import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/data";
import { apiError } from "@/lib/api-error";
import { createBookingSchema } from "@/lib/validation/booking";
import { isRateLimited, clientKey } from "@/lib/rate-limit";
import { sendAndLog } from "@/lib/notify";
import { bookingConfirmationEmail, bookingOwnerAlertEmail } from "@/lib/notify/templates";
import { createCalendarEvent } from "@/lib/calendar/google";

// POST acts; GET never does (PPI trap, see /api/availability).
export async function POST(request: Request) {
  if (isRateLimited(`booking:${clientKey(request)}`, 5, 10 * 60 * 1000)) {
    return apiError("RATE_LIMITED", "Too many attempts. Try again in a few minutes.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("VALIDATION_ERROR", "Invalid request body.");
  }

  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return apiError("VALIDATION_ERROR", first?.message ?? "Invalid booking.", { issues: parsed.error.issues });
  }

  try {
    const dataSource = await getDataSource();
    const result = await dataSource.createBooking(parsed.data);

    if (!result.ok) {
      return apiError(result.errorCode, result.message);
    }

    // Failure design (C5): email is fail-open. The booking is already
    // committed by the time we get here, so a send failure is logged and
    // never surfaces as a failed booking.
    // Same fail-open reasoning covers the calendar: the booking is committed
    // before any of this runs, so a Google outage must not turn a successful
    // booking into an error the customer sees.
    await Promise.all([
      sendAndLog(dataSource, bookingConfirmationEmail(result), "booking_confirmation"),
      sendAndLog(dataSource, bookingOwnerAlertEmail(result), "booking_owner_alert"),
      createCalendarEvent({
        confirmationCode: result.confirmationCode,
        sessionTypeName: result.sessionTypeName,
        startsAt: result.startsAt,
        endsAt: result.endsAt,
        customerName: result.customerName,
        customerEmail: result.customerEmail,
        notes: parsed.data.notes,
        manageUrl: `https://ceyagmark.com/booking/${result.manageToken}`,
      }),
    ]);

    return NextResponse.json({
      booking: {
        confirmationCode: result.confirmationCode,
        manageToken: result.manageToken,
        startsAt: result.startsAt,
        endsAt: result.endsAt,
        sessionTypeName: result.sessionTypeName,
      },
    });
  } catch (err) {
    console.error("POST /api/bookings:", err);
    return apiError("INTERNAL_ERROR", "Could not create the booking.");
  }
}
