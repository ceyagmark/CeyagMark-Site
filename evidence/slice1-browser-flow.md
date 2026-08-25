# Slice 1+2 — browser-driven evidence

Driven live against `npm run dev` (PGlite, `CEYAG_DEV_DB=1`) via the Claude Code browser
pane, 2026-08-25. Not curl — real clicks, real form fills, read back via `get_page_text`
after each step.

## Happy path, 1280px

1. `/book` → 6 session types render with correct prices (LKR 3,000/$20 … LKR 9,000/$60,
   discovery calls "Free").
2. Clicked "Strategy Session (30 min)" → availability loads, correctly skips Sat/Sun,
   correctly starts today's list at 13:00 (min_lead_time_minutes=120 filtered out the
   morning slots given the server's current time).
3. Clicked "14:00" under "Wed, Aug 26" → details form renders with the picked
   session/date/time restated.
4. Filled Name/Email/Phone/Notes, clicked "Confirm booking" → "Booked. Strategy Session
   (30 min) confirmed. Confirmation code CYM-AV843J." + a working WhatsApp deep link.
5. Server log (`preview_logs`) showed both notifications logged as `skipped` (no
   `NOTIFY_FROM_EMAIL` set), never silently `sent` — confirms the notification-log
   contract.
6. `/admin/login` → signed in with the dev password → `/admin/bookings` (no bookings
   shown at that point because the server had been restarted since — see cold-start note
   below) → logged out via `/api/admin/logout` → direct navigation to `/admin/bookings`
   correctly redirected to `/admin/login` (auth gate works both ways).
7. Logged back in, made a fresh discovery-call booking, confirmed it via
   `/api/bookings` JSON response, opened its `/booking/{manageToken}` page, saw the
   correct session/date/confirmation code, clicked "Cancel this booking" → "This booking
   is cancelled." confirmed.

## Cold start (V1 gate item 1)

Stopped and restarted the dev server (a full process restart, fresh in-memory PGlite) mid
session. Migrations + seed re-applied automatically, `/book` rendered session types
correctly on the first request after restart.

## 375px

`/book` at 375×812: `document.documentElement.scrollWidth === clientWidth` (no horizontal
scroll). All six session-type cards measured 89.6–113.6px tall × 327px wide — well over
the 44×44px tap-target floor.

## Network failure injected mid-flow (V4 item 2)

Patched `window.fetch` to reject any request to `/api/bookings` with `TypeError: Failed to
fetch`, then drove a real discovery-call booking through to the details step and
submitted. **Observed:** "Could not reach the server. Check your connection and try
again." rendered in place, the submit button re-enabled, and all typed field values
(name, email) were preserved. Restored `fetch`, resubmitted the identical form without
retyping anything → booked successfully (`CYM-JNPQYK`).

## Hostile input (V4 item 3), against `/api/leads`

| Input | Result |
|---|---|
| Empty body `{}` | 400 `VALIDATION_ERROR`, per-field "Required" messages for source/name/email |
| `fields.message` = 10,000-char string | 400 `VALIDATION_ERROR`, "String must contain at most 2000 character(s)" |
| `name` = `<script>alert(1)</script>` | 200, lead saved. Rendered in `/admin/leads` as literal text — console logged React's own "Encountered a script tag... never executed when rendering on the client" warning, confirming no execution |
| `fields.message` = Sinhala + emoji (`මම ලංකාවෙන් 🔥🎯🚀`) | 200, accepted and stored without corruption |

## Integration harness (real SQL, not mocks)

`npm run db:check` — 8/8 passing (saved: `slice1-db-check.txt`). Covers: a booking
succeeds; an identical slot is rejected; a slot inside the post-session buffer is
rejected (proves buffer enforcement, not just raw duration); the slot right after the
buffer clears succeeds; a too-soon booking is rejected; cancel releases the slot; a
cancelled slot can be rebooked; two concurrent `create_booking` calls for the same slot
produce exactly one winner (serialised by PGlite's single connection — a real two-
connection Postgres proof is still open, same limitation PPI documented).

`npm test` (vitest) — 10/10 passing (saved: `slice1-vitest.txt`): booking/lead schema
validation including the empty-name message, the 10,000-char rejection, Sinhala/emoji
acceptance, malformed WhatsApp number rejection, the unbounded-fields-object cap, and
token shape/uniqueness.

`npm run check-migrations` — 3/3 sequential, no gaps (saved:
`slice1-check-migrations.txt`).

`CEYAG_DEV_DB= npx next build` — clean production build, correct static/dynamic route
split (saved: `slice1-build.txt`).

## Not verified

- Motion/animation — none has been built yet (Slice 4). Nothing to verify.
- A real two-connection Postgres concurrency proof (needs an actual Supabase project).
- Real email delivery (no `RESEND_API_KEY`; `ConsoleNotifier` only).
- Screenshots — the browser pane in this environment does not composite (documented
  workspace limitation); every check above was done by reading rendered text/DOM state
  and network/console logs, not by looking at pixels.
