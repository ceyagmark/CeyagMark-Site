/**
 * Calendar invites for confirmed bookings.
 *
 * Two independent paths, because neither one alone reaches everybody:
 *   - an .ics attachment, which Apple Mail, Outlook and Gmail all offer to add
 *   - an "Add to Google Calendar" link, for people who read mail in a browser
 *     and ignore attachments
 *
 * Both describe the same event. If they ever disagree, the .ics is canonical:
 * it carries the UID, so a later update or cancellation can replace the entry
 * rather than creating a second one.
 */

export type CalendarEvent = {
  /** Stable per booking. Reused by any later update so calendars replace, not duplicate. */
  uid: string;
  title: string;
  description: string;
  startsAt: string; // ISO instant
  endsAt: string; // ISO instant
  organizerEmail: string;
  organizerName: string;
  attendeeEmail: string;
  attendeeName: string;
  url: string;
};

/** ISO instant -> `YYYYMMDDTHHMMSSZ`, the only form every calendar client agrees on. */
function icsStamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) throw new Error(`calendar: unparseable date ${iso}`);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** RFC 5545 §3.3.11: backslash, semicolon, comma and newline are structural. */
function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * RFC 5545 §3.1: content lines are limited to 75 octets, continuations begin
 * with a space. Outlook is the strict one here; an unfolded long SUMMARY is a
 * classic reason an invite silently fails to import.
 */
function fold(line: string): string {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;

  const parts: string[] = [];
  let start = 0;
  while (start < bytes.length) {
    let end = Math.min(start + (start === 0 ? 75 : 74), bytes.length);
    // Never split a multi-byte character across a fold.
    while (end > start && end < bytes.length && (bytes[end]! & 0xc0) === 0x80) end--;
    parts.push((start === 0 ? "" : " ") + bytes.subarray(start, end).toString("utf8"));
    start = end;
  }
  return parts.join("\r\n");
}

export function buildIcs(event: CalendarEvent): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CeyagMark//Booking//EN",
    "CALSCALE:GREGORIAN",
    // PUBLISH, not REQUEST: this is a confirmation of something already booked,
    // not an invitation awaiting an accept/decline the site would never see.
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${esc(event.uid)}`,
    `DTSTAMP:${icsStamp(new Date().toISOString())}`,
    `DTSTART:${icsStamp(event.startsAt)}`,
    `DTEND:${icsStamp(event.endsAt)}`,
    `SUMMARY:${esc(event.title)}`,
    `DESCRIPTION:${esc(event.description)}`,
    `URL:${esc(event.url)}`,
    `ORGANIZER;CN=${esc(event.organizerName)}:mailto:${event.organizerEmail}`,
    `ATTENDEE;CN=${esc(event.attendeeName)};ROLE=REQ-PARTICIPANT:mailto:${event.attendeeEmail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(event.title)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  // CRLF is required by the spec, not a Windows detail.
  return lines.map(fold).join("\r\n") + "\r\n";
}

/** One-click add for people who read mail in a browser tab. */
export function googleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${icsStamp(event.startsAt)}/${icsStamp(event.endsAt)}`,
    details: `${event.description}\n\n${event.url}`,
    ctz: "Asia/Colombo",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
