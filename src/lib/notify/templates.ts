import type { CreateBookingResult } from "@/lib/data/types";
import { ownerAlertRecipient, type Email } from "@/lib/notify";
import { buildIcs, googleCalendarUrl, type CalendarEvent } from "@/lib/notify/calendar";

const SITE_URL = "https://ceyagmark.com";
const ORGANIZER_NAME = "CeyagMark";
const WHATSAPP = "https://wa.me/94703727895";

const DATE_FMT = new Intl.DateTimeFormat("en-LK", {
  timeZone: "Asia/Colombo",
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/* ------------------------------------------------------------------ *
 * Email shell
 *
 * Email clients are not browsers. No CSS variables, no flexbox, no grid,
 * no external stylesheet: Gmail strips <style> in many contexts and Outlook
 * renders through Word. So everything here is a table with inline styles and
 * literal hex colours, mirroring the site tokens by hand.
 * ------------------------------------------------------------------ */

const C = {
  page: "#050a16",
  card: "#0c1730",
  cardSoft: "#0f1c38",
  border: "#1e2c4a",
  text: "#eef3fc",
  soft: "#b3c0db",
  mute: "#74829f",
  brand: "#2e86ff",
  glow: "#6aa6ff",
  good: "#46d39a",
} as const;

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/** User-supplied values reach these templates. Never interpolate them raw. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Row = { label: string; value: string; accent?: boolean };

type ShellInput = {
  /** The grey line under the subject in an inbox list. Worth writing deliberately. */
  preheader: string;
  eyebrow: string;
  heading: string;
  intro: string;
  rows?: Row[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  footNote?: string;
};

function rowsHtml(rows: Row[]): string {
  return rows
    .map(
      (r, i) => `
        <tr>
          <td style="padding:${i === 0 ? "0" : "14px"} 0 0;">
            <div style="font:600 11px/1.4 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${C.mute};">${esc(r.label)}</div>
            <div style="font:${r.accent ? "700 20px" : "500 16px"}/1.5 ${FONT};color:${r.accent ? C.good : C.text};padding-top:4px;${r.accent ? "letter-spacing:.06em;" : ""}">${esc(r.value)}</div>
          </td>
        </tr>`
    )
    .join("");
}

/** Bulletproof button: a table, because Outlook ignores padding on <a>. */
function buttonHtml(label: string, href: string, kind: "primary" | "ghost"): string {
  const bg = kind === "primary" ? C.brand : C.cardSoft;
  const fg = kind === "primary" ? "#ffffff" : C.text;
  const border = kind === "primary" ? C.brand : C.border;
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 10px;">
      <tr>
        <td align="center" bgcolor="${bg}" style="border-radius:10px;border:1px solid ${border};">
          <a href="${esc(href)}" style="display:block;padding:14px 26px;font:600 15px/1.2 ${FONT};color:${fg};text-decoration:none;border-radius:10px;">${esc(label)}</a>
        </td>
      </tr>
    </table>`;
}

function shell(input: ShellInput): string {
  const { preheader, eyebrow, heading, intro, rows, primaryCta, secondaryCta, footNote } = input;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<title>${esc(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};">
  <div style="display:none;font-size:1px;color:${C.page};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${esc(preheader)}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${C.page};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;">

          <tr>
            <td style="padding:0 4px 22px;">
              <a href="${SITE_URL}" style="font:700 22px/1 ${FONT};letter-spacing:-.03em;color:${C.text};text-decoration:none;">Ceyag<span style="color:${C.brand};">mark</span></a>
            </td>
          </tr>

          <tr>
            <td style="background:${C.card};border:1px solid ${C.border};border-radius:16px;padding:32px 28px;">
              <div style="font:600 11px/1.4 ${FONT};letter-spacing:.18em;text-transform:uppercase;color:${C.glow};">${esc(eyebrow)}</div>
              <h1 style="margin:12px 0 0;font:600 27px/1.2 ${FONT};letter-spacing:-.02em;color:${C.text};">${esc(heading)}</h1>
              <p style="margin:14px 0 0;font:400 16px/1.6 ${FONT};color:${C.soft};">${esc(intro)}</p>

              ${
                rows && rows.length > 0
                  ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:26px 0 0;border-top:1px solid ${C.border};padding-top:22px;">
                       ${rowsHtml(rows)}
                     </table>`
                  : ""
              }

              ${
                primaryCta || secondaryCta
                  ? `<div style="margin:28px 0 0;">
                       ${primaryCta ? buttonHtml(primaryCta.label, primaryCta.href, "primary") : ""}
                       ${secondaryCta ? buttonHtml(secondaryCta.label, secondaryCta.href, "ghost") : ""}
                     </div>`
                  : ""
              }

              ${
                footNote
                  ? `<p style="margin:24px 0 0;padding-top:20px;border-top:1px solid ${C.border};font:400 14px/1.6 ${FONT};color:${C.mute};">${footNote}</p>`
                  : ""
              }
            </td>
          </tr>

          <tr>
            <td style="padding:22px 4px 0;">
              <p style="margin:0;font:400 13px/1.6 ${FONT};color:${C.mute};">
                CeyagMark, Sri Lanka &nbsp;·&nbsp;
                <a href="${SITE_URL}" style="color:${C.mute};text-decoration:underline;">ceyagmark.com</a> &nbsp;·&nbsp;
                <a href="${WHATSAPP}" style="color:${C.mute};text-decoration:underline;">WhatsApp</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ------------------------------------------------------------------ *
 * Templates
 * ------------------------------------------------------------------ */

type Booking = Extract<CreateBookingResult, { ok: true }>;

function calendarEventFor(booking: Booking, organizerEmail: string): CalendarEvent {
  return {
    uid: `${booking.confirmationCode}@ceyagmark.com`,
    title: `${booking.sessionTypeName} — CeyagMark`,
    description: `Confirmation code: ${booking.confirmationCode}\nManage or cancel: ${SITE_URL}/booking/${booking.manageToken}`,
    startsAt: booking.startsAt,
    endsAt: booking.endsAt,
    organizerEmail,
    organizerName: ORGANIZER_NAME,
    attendeeEmail: booking.customerEmail,
    attendeeName: booking.customerName,
    url: `${SITE_URL}/booking/${booking.manageToken}`,
  };
}

export function bookingConfirmationEmail(booking: Booking): Email {
  const when = DATE_FMT.format(new Date(booking.startsAt));
  const manageUrl = `${SITE_URL}/booking/${booking.manageToken}`;
  const organizerEmail = ownerAlertRecipient(booking.ownerAlertEmail);
  const event = calendarEventFor(booking, organizerEmail);
  const gcalUrl = googleCalendarUrl(event);

  return {
    to: booking.customerEmail,
    subject: `Booked: ${booking.sessionTypeName}, ${booking.confirmationCode}`,
    text: `Hi ${booking.customerName},\n\nYour ${booking.sessionTypeName} is confirmed for ${when} (Asia/Colombo time).\n\nConfirmation code: ${booking.confirmationCode}\n\nAdd it to your calendar: ${gcalUrl}\n\nNeed to change or cancel? ${manageUrl}\n\nIf anything comes up, message us on WhatsApp: ${WHATSAPP}\n\nSee you then.\nCeyagMark`,
    html: shell({
      preheader: `${when}, Asia/Colombo. Confirmation code ${booking.confirmationCode}.`,
      eyebrow: "Booking confirmed",
      heading: `You're booked, ${booking.customerName.split(" ")[0] ?? booking.customerName}`,
      intro: `Your ${booking.sessionTypeName} is confirmed. The calendar invite is attached, and the details are below.`,
      rows: [
        { label: "When", value: `${when} (Asia/Colombo)` },
        { label: "Session", value: booking.sessionTypeName },
        { label: "Confirmation code", value: booking.confirmationCode, accent: true },
      ],
      primaryCta: { label: "Add to Google Calendar", href: gcalUrl },
      secondaryCta: { label: "Change or cancel", href: manageUrl },
      footNote: `Something come up? Reply to this email, or <a href="${WHATSAPP}" style="color:${C.glow};text-decoration:underline;">message us on WhatsApp</a>. We usually reply within a few hours.`,
    }),
    attachments: [
      {
        filename: `ceyagmark-${booking.confirmationCode}.ics`,
        content: buildIcs(event),
        contentType: "text/calendar; charset=utf-8; method=PUBLISH",
      },
    ],
  };
}

export function bookingOwnerAlertEmail(booking: Booking): Email {
  const when = DATE_FMT.format(new Date(booking.startsAt));
  const organizerEmail = ownerAlertRecipient(booking.ownerAlertEmail);
  const event = calendarEventFor(booking, organizerEmail);

  return {
    to: organizerEmail,
    subject: `New booking: ${booking.sessionTypeName}, ${when}`,
    text: `${booking.customerName} (${booking.customerEmail}) booked ${booking.sessionTypeName} for ${when} (Asia/Colombo time). Confirmation code ${booking.confirmationCode}.\n\nAdd to your calendar: ${googleCalendarUrl(event)}\n\nAll bookings: ${SITE_URL}/admin/bookings`,
    html: shell({
      preheader: `${booking.customerName} booked ${booking.sessionTypeName} for ${when}.`,
      eyebrow: "New booking",
      heading: `${booking.customerName} booked a session`,
      intro: `Confirmed and already in their inbox. Add it to your own calendar below.`,
      rows: [
        { label: "When", value: `${when} (Asia/Colombo)` },
        { label: "Session", value: booking.sessionTypeName },
        { label: "Name", value: booking.customerName },
        { label: "Email", value: booking.customerEmail },
        { label: "Confirmation code", value: booking.confirmationCode, accent: true },
      ],
      primaryCta: { label: "Add to my calendar", href: googleCalendarUrl(event) },
      secondaryCta: { label: "Open admin bookings", href: `${SITE_URL}/admin/bookings` },
      footNote: `Reply straight to <a href="mailto:${esc(booking.customerEmail)}" style="color:${C.glow};text-decoration:underline;">${esc(booking.customerEmail)}</a> to reach them.`,
    }),
    attachments: [
      {
        filename: `ceyagmark-${booking.confirmationCode}.ics`,
        content: buildIcs(event),
        contentType: "text/calendar; charset=utf-8; method=PUBLISH",
      },
    ],
  };
}

export function leadReceivedEmail(
  ownerEmail: string,
  leadName: string,
  leadEmail: string,
  source: string
): Email {
  const to = ownerAlertRecipient(ownerEmail);
  return {
    to,
    subject: `New lead (${source}): ${leadName}`,
    text: `${leadName} (${leadEmail}) submitted the ${source} form on ceyagmark.com.\n\nAll leads: ${SITE_URL}/admin/leads`,
    html: shell({
      preheader: `${leadName} submitted the ${source} form.`,
      eyebrow: "New lead",
      heading: `${leadName} got in touch`,
      intro: `They submitted the ${source} form on ceyagmark.com.`,
      rows: [
        { label: "Name", value: leadName },
        { label: "Email", value: leadEmail },
        { label: "Source", value: source },
      ],
      primaryCta: { label: `Reply to ${leadName}`, href: `mailto:${leadEmail}` },
      secondaryCta: { label: "Open admin leads", href: `${SITE_URL}/admin/leads` },
    }),
  };
}
