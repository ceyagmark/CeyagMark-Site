# Schema doc — Slice 0

Postgres (Supabase in prod, PGlite in dev/test — same SQL runs on both, see ADR-001 #4).
Every table: `id uuid default gen_random_uuid()`, `created_at timestamptz default now()`.
Workflows walked, per W3: (1) visitor books a consulting session or a free discovery call,
(2) visitor submits contact / free-audit / growth-audit quiz, (3) admin reads bookings and
leads. Every table below maps to a step in one of these three. No speculative tables.

Timezone (W5): all timestamps stored `timestamptz` UTC. Display timezone is
**Asia/Colombo (UTC+5:30)**, applied only at render via `Intl.DateTimeFormat` — never
hardcoded as a raw offset, since Sri Lanka does not observe DST but the code should name
the zone, not compute the offset by hand.

Money (W5): integer minor units on every price column. LKR columns store whole rupees as
integers (the existing site already quotes LKR as whole numbers: 14999, 3000 — there is no
LKR cents convention to preserve). USD columns store integer cents. No `FLOAT`/`REAL` on
any money column, no `parseFloat`/`Number()` on a money value in application code.

---

## `session_types`

What a visitor can book. Seeded, not visitor-writable.

1. **Key:** surrogate `id uuid`. `slug` is unique but not the key — a slug can be renamed
   for SEO, an id must not.
2. **Owner:** none — global catalog, not tenant-scoped (single-tenant app).
3. **Deletion story:** forbid. A session type referenced by an existing booking must never
   disappear from history; deactivate via `active boolean`, never delete.
4. **Migration path:** additive. New session types are new rows; price changes are new
   values on existing rows (the *booking* freezes its own price at creation, see below —
   this table is a live catalog, not a price history).
5. **Read/write matrix:** public read (booking page renders active types); write only via
   migration/seed, no API route can write this table.

| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| slug | text unique | `consulting-30`, `consulting-60`, `consulting-90`, `discovery-leak-report`, `discovery-fix-sprint`, `discovery-build-and-run` |
| kind | text | `consulting` \| `discovery` — discovery calls are free, gate on this not on price |
| name | text | "Strategy Session (30 min)" etc, shown on the booking page |
| duration_minutes | int | 30 / 60 / 90 |
| price_lkr | int | integer rupees; 0 for discovery calls |
| price_usd_cents | int | integer cents; 0 for discovery calls |
| buffer_minutes | int | gap held after the session before the next can start |
| active | boolean default true | |

## `availability_rules`

Weekly recurring pattern — which days and what daily window. Kept separate from
`site_settings` per the PPI trap ("business hours are half-derived… do not infer the
window from session times").

1. **Key:** surrogate `id`.
2. **Owner:** none, single-tenant.
3. **Deletion story:** hard delete allowed — this is a rule, not a record of a past event;
   deleting a day-of-week rule just stops offering that day going forward, nothing
   historical references it.
4. **Migration path:** additive; changing hours is an update, not a new table.
5. **Read/write matrix:** public read (drives the calendar); write only via seed/migration
   in Slice 1 (no admin UI for this in Slice 2 — flagged as an open item, see BUILD-NOTES).

| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| day_of_week | int | 0=Sunday … 6=Saturday |
| start_time | time | local Asia/Colombo wall-clock time, e.g. `09:00` |
| end_time | time | e.g. `17:00` |
| slot_interval_minutes | int | how often a new start is offered within the window |

## `availability_overrides`

One-off exceptions: a full-day blackout, a partial blackout, or an added slot.

1. **Key:** surrogate `id`.
2. **Owner:** none.
3. **Deletion story:** hard delete allowed — an override is a standing instruction, not a
   log of something that happened.
4. **Migration path:** additive.
5. **Read/write matrix:** public read; write only via seed/migration in Slice 1 (no admin
   UI yet — open item).

| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| date | date | Asia/Colombo calendar date |
| kind | text | `blackout_full` \| `blackout_partial` \| `extra_window` |
| start_time | time nullable | required for partial/extra |
| end_time | time nullable | required for partial/extra |
| reason | text nullable | shown nowhere public; admin-only note |

## `customers`

Upserted at booking time, keyed by email — mirrors PPI's `create_booking` pattern of one
SQL write path doing the customer upsert and the booking insert together.

1. **Key:** surrogate `id`. Email is unique but not the key (emails can typo-correct via
   support; the id must survive that).
2. **Owner:** none, single-tenant.
3. **Deletion story:** **forbid via app code, not a DB constraint** — a customer with
   bookings is referenced by history; a Sri Lankan PDPA erasure request is satisfied by
   redacting `name`/`phone`/`email` columns to a tombstone value, never by deleting the row
   (W4: erasure by column redaction, not row deletion).
4. **Migration path:** additive.
5. **Read/write matrix:** no direct public read; written only inside `create_booking`;
   read by admin (`/admin/bookings`) joined through bookings.

| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| email | text unique | |
| name | text | |
| phone | text nullable | |
| updated_at | timestamptz | bumped on every upsert |

## `bookings`

The core booking record. One SQL function (`create_booking`) is the only write path, per
the PPI trap list ("one SQL function decides, and its returned flag gates every email").

1. **Key:** surrogate `id uuid`. `confirmation_code` (short human-readable, e.g.
   `CYM-4F2A1`) is a natural-feeling identifier but is NOT the key — it exists only for the
   customer to quote back; the id is what every foreign key and URL token actually uses.
2. **Owner:** none, single-tenant; the `customer_id` scopes it to a customer for admin
   filtering, not for access control (no customer login in this build).
3. **Deletion story:** **forbid.** A booking is a business record; cancellation is a status
   transition (`status = 'cancelled'`), never a row delete — this is what lets the overlap
   constraint and the admin history both stay correct. Money is not involved here (no
   payment gateway), but the same rule that protects PPI's payment records applies to any
   record an operator relies on for a schedule.
4. **Migration path:** additive; the overlap constraint (below) is added in the same
   migration that creates the table, not bolted on later — PPI added it from day one and
   this build has no reason to relax that.
5. **Read/write matrix:** public write only through `create_booking()` (never a raw
   `INSERT` from a route handler); public read of a single booking only via its unguessable
   `manage_token` (the `/booking/[token]` page — Slice 2+); admin read of all bookings.

| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| confirmation_code | text unique | human-facing, generated in `create_booking` |
| session_type_id | uuid fk → session_types | |
| customer_id | uuid fk → customers | |
| starts_at | timestamptz | |
| ends_at | timestamptz | `starts_at + duration_minutes` at booking time — stored, not recomputed, so a later change to `session_types.duration_minutes` never rewrites history (same reasoning as PPI's frozen add-on prices) |
| hold_until | timestamptz | `ends_at + buffer_minutes`, stored (not a generated index expression) — Postgres rejects a GiST index expression built from `timestamptz + interval` because that operator is STABLE, not IMMUTABLE (found by the exclusion constraint failing to create on first run, not assumed) |
| status | text | `confirmed` \| `cancelled` \| `completed` \| `no_show` |
| notes | text nullable | free text from the visitor, length-capped at 2000 chars (C7) |
| manage_token | text unique | opaque random token for the customer's own manage link; never the `id` (an `id` is sequential-feeling and used elsewhere in URLs/logs; the token is single-purpose) |
| whatsapp_e164 | text nullable | for the wa.me confirmation deep link |
| created_at | timestamptz | |

**Overlap constraint** (the PPI trap, item 1): an exclusion constraint on
`tstzrange(starts_at, hold_until)` **`WHERE status = 'confirmed'`** — only a
confirmed booking holds a slot; `cancelled`/`completed`/`no_show` never block a new
booking. This is the full list of statuses that exist, so there is no silent gap.

## `leads`

Contact form, free-audit application, growth-audit CTA, built-by funnel. Field-for-field
compatible with the Hub's `Lead` model (`Projects/AgencyOS-Hub/app/prisma/schema.prisma`)
so a future Hub POST needs no re-shaping — see `stage` enum below, taken verbatim from the
Hub schema.

1. **Key:** surrogate `id`.
2. **Owner:** none, single-tenant (the Hub's `agencyId`/`clientOrgId` are added only inside
   the Hub adapter's outgoing payload, not stored here — CeyagMark itself is one agency's
   own site, not multi-tenant).
3. **Deletion story:** soft-delete only (`archived_at`), matching the Hub's own convention
   for `Lead` — a lead can be marked lost/archived but the row is never dropped, since it is
   the record of a real inbound contact.
4. **Migration path:** additive.
5. **Read/write matrix:** public write via `/api/leads` (contact, free-audit, growth-audit,
   built-by sources all funnel through one endpoint with a `source` field); admin read at
   `/admin/leads`; no public read.

| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| source | text | `contact` \| `free_audit` \| `growth_audit` \| `built_by` \| `quiz` |
| quiz_submission_id | uuid nullable fk → quiz_submissions | set when `source = 'quiz'` |
| stage | text default `'new'` | `new`\|`qualified`\|`call_booked`\|`proposal_sent`\|`won`\|`lost`\|`nurture` — Hub's exact enum |
| name | text | |
| email | text | |
| phone | text nullable | |
| company | text nullable | |
| fields | jsonb | source-specific extra fields (free-audit's platform/spend questions, contact's message) — capped at 20 keys, values length-capped, per C7 |
| archived_at | timestamptz nullable | |

## `quiz_definitions` / `quiz_questions` / `quiz_submissions`

The growth-audit quiz. Shape copied field-for-field from the Hub schema (same table names,
same columns) because this quiz **is** Hub Phase E's public quiz front end — the kickoff is
explicit that this must not become a parallel format. `agency_id`/`quiz_id` scoping from
the Hub schema is kept even though this app is single-tenant, specifically so a row can be
copied into the Hub verbatim later.

1. **Key:** surrogate `id` on all three, matching Hub.
2. **Owner:** none here (single-tenant); the Hub's `agencyId` column is kept as a nullable
   passthrough field, populated only by the Hub adapter at send time, never required locally.
3. **Deletion story:** definitions/questions are seed data, forbid delete once published
   (`archived_at` instead, matching Hub); submissions are soft-delete-only — a submission is
   a real visitor's answers.
4. **Migration path:** additive, versioned (`quiz_definitions.version`, matching Hub).
5. **Read/write matrix:** public read of the published definition + its questions; public
   write of one submission per visit (rate-limited, Slice 2); admin read of all submissions.

Columns match `Projects/AgencyOS-Hub/app/prisma/schema.prisma` `QuizDefinition` /
`QuizQuestion` / `QuizSubmission` exactly (see that file for the authoritative column list —
not duplicated here to avoid the two-copies-drift W8 warns about; this schema doc names the
source of truth instead of re-typing it).

## `notification_log`

Every email attempt, real or stubbed. The PPI lesson, verbatim: "a stub that returns
`ok: true` makes 'no credentials' and 'working provider' indistinguishable to every
caller."

1. **Key:** surrogate `id`.
2. **Owner:** none.
3. **Deletion story:** forbid — this is the audit trail that answers "did the customer get
   an email," which is exactly the question that must never become unanswerable.
4. **Migration path:** additive.
5. **Read/write matrix:** no public access at all; written only by the notification port;
   read by admin only (Slice 2+, optional — not blocking Slice 1).

| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| channel | text | `email` (only channel this build sends) |
| template | text | `booking_confirmation` \| `booking_owner_alert` \| `lead_received` |
| recipient | text | email address — never logged alongside the message body, no PII beyond the address itself |
| subject | text | |
| status | text | `sent` \| `skipped` \| `failed` — never silently `sent` for a stub |
| detail | text nullable | error message on `failed`; adapter name on `skipped` |
| related_booking_id | uuid nullable fk → bookings | |
| related_lead_id | uuid nullable fk → leads | |
| created_at | timestamptz | |

## `lead_sink_log`

Same pattern as `notification_log`, for the Hub and File adapters of the lead sink port —
"a skipped or stubbed send logs explicitly as skipped, never silently as sent."

1. **Key:** surrogate `id`.
2. **Owner:** none.
3. **Deletion story:** forbid, same audit-trail reasoning as `notification_log`.
4. **Migration path:** additive.
5. **Read/write matrix:** no public access; written by the lead sink port; read by admin
   only (optional, not blocking).

| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| lead_id | uuid nullable fk → leads | |
| booking_id | uuid nullable fk → bookings | discovery-call bookings are also leads in spirit; logged here if sent onward |
| sink | text | `db` \| `hub` \| `file` |
| status | text | `sent` \| `skipped` \| `failed` |
| detail | text nullable | |
| created_at | timestamptz | |

## `site_settings`

Singleton row. Explicit daily-window settings, deliberately not derived from
`availability_rules` alone (the rules give days + a slot interval; this gives the
lead-time and buffer defaults that apply across all session types).

1. **Key:** fixed single row, `id = 1` (checked constraint), not a surrogate-per-tenant key
   — there is exactly one site.
2. **Owner:** none.
3. **Deletion story:** forbid (checked constraint effectively prevents a second row; the
   one row is never deleted, only updated).
4. **Migration path:** additive columns with defaults.
5. **Read/write matrix:** public read of the subset the booking page needs (lead time);
   write only via migration/seed in Slice 1 (no admin settings UI yet — open item).

| Column | Type | Notes |
|---|---|---|
| id | int pk check (id = 1) | |
| min_lead_time_minutes | int | shortest notice before a slot can be booked |
| max_advance_days | int | how far into the future the calendar opens |
| owner_alert_email | text | where `booking_owner_alert` sends (Shashika's address, from env at seed time — never hardcoded in a migration file with a real address; seed reads `SEED_OWNER_EMAIL` env var) |
| owner_whatsapp_e164 | text | for admin-facing wa.me links, same env-seeded pattern |

---

## Two data sources, kept in lockstep (ADR-001 #4)

`data/local-source.ts` (PGlite) and `data/supabase-source.ts` (Supabase) both implement:

```ts
interface DataSource {
  getActiveSessionTypes(): Promise<SessionType[]>
  getAvailability(sessionTypeId: string, fromDate: string, toDate: string): Promise<Slot[]>
  createBooking(input: CreateBookingInput): Promise<CreateBookingResult>
  cancelBooking(manageToken: string): Promise<void>
  createLead(input: CreateLeadInput): Promise<Lead>
  createQuizSubmission(input: QuizSubmissionInput): Promise<QuizSubmission>
  logNotification(entry: NotificationLogEntry): Promise<void>
  logLeadSink(entry: LeadSinkLogEntry): Promise<void>
  adminListBookings(): Promise<Booking[]>
  adminListLeads(): Promise<Lead[]>
}
```

Both files apply the same numbered migrations from `supabase/migrations/`.
`scripts/check-migrations.mjs` (ported from PPI) asserts both sources are at the same
migration number before any commit that touches schema — the check PPI needed four times.
