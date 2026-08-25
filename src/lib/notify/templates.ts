import type { CreateBookingResult } from "@/lib/data/types";

const DATE_FMT = new Intl.DateTimeFormat("en-LK", {
  timeZone: "Asia/Colombo",
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function bookingConfirmationEmail(booking: Extract<CreateBookingResult, { ok: true }>) {
  const when = DATE_FMT.format(new Date(booking.startsAt));
  const manageUrl = `https://ceyagmark.com/booking/${booking.manageToken}`;
  return {
    to: booking.customerEmail,
    subject: `Booked: ${booking.sessionTypeName} — ${booking.confirmationCode}`,
    text: `Hi ${booking.customerName},\n\nYour ${booking.sessionTypeName} is confirmed for ${when} (Asia/Colombo time).\n\nConfirmation code: ${booking.confirmationCode}\n\nNeed to cancel? ${manageUrl}\n\nSee you then.\nCeyagMark`,
  };
}

export function bookingOwnerAlertEmail(booking: Extract<CreateBookingResult, { ok: true }>) {
  const when = DATE_FMT.format(new Date(booking.startsAt));
  return {
    to: booking.ownerAlertEmail,
    subject: `New booking: ${booking.sessionTypeName} — ${when}`,
    text: `${booking.customerName} (${booking.customerEmail}) booked ${booking.sessionTypeName} for ${when} (Asia/Colombo time). Confirmation code ${booking.confirmationCode}.`,
  };
}

export function leadReceivedEmail(ownerEmail: string, leadName: string, leadEmail: string, source: string) {
  return {
    to: ownerEmail,
    subject: `New lead (${source}): ${leadName}`,
    text: `${leadName} (${leadEmail}) submitted the ${source} form on ceyagmark.com.`,
  };
}
