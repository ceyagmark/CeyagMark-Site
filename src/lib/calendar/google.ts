import { createSign } from "node:crypto";

/**
 * Bookings written straight into Shashika's Google Calendar.
 *
 * Same approach as the Perth Pre-Purchase Inspection build, for the same
 * reasons:
 *
 * **A service account, not OAuth.** OAuth would mean a consent screen, a
 * refresh token stored somewhere, and that token quietly expiring months later
 * — a failure that surfaces as "my calendar stopped updating" with nobody
 * watching. A service account has no user session to expire. The calendar is
 * shared with the service account's address once, by hand, and it keeps
 * working.
 *
 * **Not an .ics subscription.** Google refreshes subscribed feeds on its own
 * schedule, often every 12 to 24 hours. For same-week consulting slots that is
 * worse than nothing: the calendar would show a free evening that was booked
 * yesterday. Rejected on behaviour, not effort. (The .ics attachment on the
 * confirmation email is a different thing and stays — that is for the customer,
 * who adds it once and never syncs again.)
 *
 * **Everything fails soft.** A calendar outage must never stop someone booking.
 * Every function returns null or false instead of throwing, and callers treat
 * the sync as a nice-to-have.
 *
 * Setup, once:
 *   1. Google Cloud Console -> create a project -> enable the Google Calendar API.
 *   2. Create a service account -> Keys -> Add key -> JSON. Download it.
 *   3. Google Calendar -> Settings -> the calendar -> Share with specific people
 *      -> add the JSON's `client_email` -> "Make changes to events".
 *   4. Set GOOGLE_CALENDAR_CLIENT_EMAIL, GOOGLE_CALENDAR_PRIVATE_KEY (the
 *      JSON's private_key, newlines kept as literal \n) and GOOGLE_CALENDAR_ID
 *      (the calendar's address, usually the gmail).
 */

const SCOPE = "https://www.googleapis.com/auth/calendar.events";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const TIME_ZONE = "Asia/Colombo";

export function calendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CALENDAR_CLIENT_EMAIL &&
      process.env.GOOGLE_CALENDAR_PRIVATE_KEY &&
      process.env.GOOGLE_CALENDAR_ID,
  );
}

const base64url = (input: Buffer | string) =>
  Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/**
 * The calendar event id, derived from the confirmation code.
 *
 * Google lets the caller choose an event id, which means cancelling does not
 * need the id stored anywhere: it can be recomputed. That is deliberate — the
 * alternative was a column on `bookings` and a migration to apply by hand on a
 * live database, for a decorative-until-it-isn't sync.
 *
 * Ids must be 5-1024 characters of base32hex (0-9 and a-v), so the code is
 * hex-encoded rather than lowercased: confirmation codes contain letters like
 * Y and Z that are outside that alphabet. The prefix is "cm" and not "cym" for
 * exactly the same reason — w, x, y and z are all invalid, and an id Google
 * rejects fails at event creation, not at review.
 */
export function calendarEventId(confirmationCode: string): string {
  // padEnd guarantees the 5-character minimum. Real codes are CYM-XXXXXX and
  // encode to 22 characters, so this never fires today; it is here so that a
  // future short code cannot make Google reject the event at booking time.
  return `cm${Buffer.from(confirmationCode, "utf8").toString("hex")}`.padEnd(5, "0");
}

/** Access tokens last an hour; minting one per request would be wasteful. */
let cachedToken: { value: string; expiresAt: number } | null = null;

async function accessToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const email = process.env.GOOGLE_CALENDAR_CLIENT_EMAIL;
  // Most hosts cannot hold real newlines in an env var, so the key is stored
  // with literal \n and restored here.
  const key = process.env.GOOGLE_CALENDAR_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) return null;

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({ iss: email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }),
  );

  try {
    const signer = createSign("RSA-SHA256");
    signer.update(`${header}.${claims}`);
    const signature = base64url(signer.sign(key));

    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: `${header}.${claims}.${signature}`,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error("[calendar] token request failed", response.status, await response.text());
      return null;
    }

    const data = (await response.json()) as { access_token?: string; expires_in?: number };
    if (!data.access_token) return null;

    cachedToken = {
      value: data.access_token,
      expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
    };
    return cachedToken.value;
  } catch (error) {
    console.error("[calendar] could not mint an access token", error);
    return null;
  }
}

export type CalendarBooking = {
  confirmationCode: string;
  sessionTypeName: string;
  startsAt: string;
  endsAt: string;
  customerName: string;
  customerEmail: string;
  notes?: string | null;
  manageUrl: string;
};

function eventBody(booking: CalendarBooking) {
  return {
    id: calendarEventId(booking.confirmationCode),
    // What a month view on a phone shows, so it leads with who and what rather
    // than the confirmation code.
    summary: `${booking.customerName} · ${booking.sessionTypeName}`,
    description: [
      `Confirmation: ${booking.confirmationCode}`,
      `Email: ${booking.customerEmail}`,
      booking.notes ? `Notes: ${booking.notes}` : null,
      "",
      `Manage: ${booking.manageUrl}`,
    ]
      .filter(Boolean)
      .join("\n"),
    start: { dateTime: new Date(booking.startsAt).toISOString(), timeZone: TIME_ZONE },
    end: { dateTime: new Date(booking.endsAt).toISOString(), timeZone: TIME_ZONE },
    reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 30 }] },
  };
}

async function call(path: string, method: string, body?: unknown): Promise<Response | null> {
  const token = await accessToken();
  if (!token) return null;
  const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID ?? "");

  try {
    return await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    console.error("[calendar] request failed", error);
    return null;
  }
}

/** True if the event now exists on the calendar. Never throws. */
export async function createCalendarEvent(booking: CalendarBooking): Promise<boolean> {
  if (!calendarConfigured()) return false;

  const response = await call("/events", "POST", eventBody(booking));
  // 409 means an event with this id is already there, which is the state we
  // wanted. It happens on a retried request, not on a real double booking:
  // the id comes from the confirmation code, which is unique per booking.
  if (response?.status === 409) return true;
  if (!response?.ok) {
    if (response) console.error("[calendar] create failed", response.status, await response.text());
    return false;
  }
  return true;
}

export async function deleteCalendarEvent(confirmationCode: string): Promise<boolean> {
  if (!calendarConfigured()) return false;

  const id = encodeURIComponent(calendarEventId(confirmationCode));
  const response = await call(`/events/${id}`, "DELETE");
  // 404/410 mean it is already gone, which is the outcome we wanted.
  return Boolean(
    response && (response.ok || response.status === 404 || response.status === 410),
  );
}
