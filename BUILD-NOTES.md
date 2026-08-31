# Build Notes — CeyagMark Next.js rebuild

Every decision, deviation, self-review finding and gate block goes here, slice by
slice. Corrections to `ADR-001.md`, `SCHEMA.md` and `SLICE-0-CONTRACTS.md` are recorded
here, never rewritten into those files (fable-coding C13).

Session: unattended build, started 2026-08-25. Kickoff:
`Projects/CeyagMark/KICKOFF-NEXTJS.md`.

---

## Slice 0 — ADR + contracts · 2026-08-25

No app code. Deliverables: `ADR-001.md`, `SCHEMA.md`, `SLICE-0-CONTRACTS.md` (endpoint
contract table + per-page meta table + performance budget), all in this directory.

Read first, per the kickoff's Phase 0 order: workspace `CLAUDE.md`, `About Me/writing-
rules.md`, `Templates/fable-thinking.md` + `fable-coding.md`, every page of the live
static site plus `styles.css`/`main.js`/`.htaccess`, `Projects/CeyagMark/portfolio/{00-
PLAN,01-PRODUCTIZATION,02-BUILD-BRIEF}.md` and `cases.json`, `Projects/Perth-
PrePurchase-Inspection/BUILD-NOTES.md` in full, `Projects/AgencyOS-Hub/app/prisma/
schema.prisma` + `05-DATA-MODEL.md`, `Agency/baseline-week.md` frontmatter (confirmed
`status: active`, freeze through 2026-08-28 — today is 2026-08-25, freeze is live).

### Confirmed before writing anything

- **AgencyOS freeze is active.** No file under `Agency/`, no `/agency-*` skill, no
  agent definition was touched. Nothing in this session needed to be.
- **No LinkedIn recommendation text exists anywhere in the workspace.** The kickoff
  names three real people (Nirmal Danansooriya, Saliya Wimalasena, Hiruni Sameeksha)
  and says "do not paraphrase or trim them into something they did not say" — but
  their actual recommendation text was never captured on disk, only their names and
  relationships (in `KICKOFF-NEXTJS.md` and the `ceyagmark-nextjs-rebuild` memory
  file). Writing quote bodies for real, named people without a source would be
  inventing a claim attributed to a real person, which is a harder violation than an
  invented number — CLAUDE.md rule 5 and the kickoff's own honesty standard both rule
  it out. **Decision: the testimonials section ships with real names, titles and the
  LinkedIn relationship line, and an explicit "read the full recommendation on
  LinkedIn" link placeholder instead of a fabricated quote body.** Flagged here as an
  open item for Shashika to paste the real text in when he has it copied from
  LinkedIn — a two-way door, logged rather than escalated, because the alternative
  (skip the section) is available at any time and neither path is destructive.
  **Not yet built** — this lands with Slice 3's marketing pages.

### ADR decisions of note (full reasoning in `ADR-001.md`)

Next.js 16 / React 19 / TS strict / Tailwind 4, one deployable unit, two data sources
behind one `DataSource` port (PGlite dev / Supabase prod), money as integer minor
units, `Asia/Colombo` display timezone, server-owns-truth, one error envelope, Motion
for animation (overriding this workspace's GSAP default, same override PPI made).

---

## Slice 1 — Booking engine · 2026-08-25

**Gate: PASSED.** Cold-started twice (initial build, then a full dev-server restart
mid-session), both times migrations + seed applied automatically and the booking flow
worked immediately after.

### What shipped

- `supabase/migrations/0001_init.sql` — full schema (session_types, availability_rules,
  availability_overrides, customers, bookings, quiz_definitions/questions/submissions,
  leads, notification_log, lead_sink_log, site_settings), the overlap exclusion
  constraint, all per `SCHEMA.md`.
- `0002_create_booking.sql` — the one SQL write path: re-derives availability
  server-side (never trusts the client's claimed slot), upserts the customer, inserts
  the booking, catches `exclusion_violation` and returns `SLOT_UNAVAILABLE` instead of
  a raw Postgres error. `cancel_booking` alongside it.
- `0003_get_availability.sql` — the one SQL read path for candidate slots, shared by
  both data sources so they cannot drift on availability logic specifically (the
  highest-value place to share, since it's the most complex rule).
- `src/lib/data/{types,local-source,supabase-source,tokens,index}.ts` — the
  `DataSource` port, PGlite and Supabase implementations, and the env-based selector.
  `local-source.ts` auto-discovers every migration file via `readdirSync` rather than
  hand-listing them — see "structural difference from PPI" below.
- `src/lib/{env,api-error,rate-limit,admin-auth,money}.ts`,
  `src/lib/validation/{booking,lead}.ts`, `src/lib/notify/*`, `src/lib/lead-sink/*`.
- API routes: `session-types`, `availability`, `bookings` (+ `[token]`, `[token]/
  cancel`), `leads`, `quiz/submit`, `admin/{login,logout,bookings,leads}`.
- Pages: `/book` (full flow: session → time → details → confirmation, all four F5
  states), `/booking/[token]` (manage/cancel), `/admin/login`, `/admin/bookings`,
  `/admin/leads`.
- `scripts/db-check.mjs` (8 checks against real SQL), `scripts/check-migrations.mjs`,
  `tests/{validation,tokens,money}.test.ts` (14 vitest cases).

### Decisions taken (two-way doors, logged not escalated)

1. **`hold_until` stored column instead of a computed index expression.** The
   exclusion constraint was originally `tstzrange(starts_at, ends_at + buffer)`
   directly. Postgres rejected it: `functions in index expression must be marked
   IMMUTABLE` — `timestamptz + interval` is STABLE, not IMMUTABLE, because interval
   month/DST handling can depend on the session's `TimeZone` setting. Found by the
   migration failing on first run in PGlite, not assumed. Fixed by storing `hold_until
   = ends_at + buffer_minutes` once at insert time and indexing that plain column.
2. **PGlite date/time normalization.** Exactly the trap PPI's BUILD-NOTES documented
   (Slice 4, bug 3 on that project): PGlite returns `date`/`time` columns as JS `Date`
   objects, and `String(dateObject)` produces `"Thu Aug 27 2026 00:00:00 GMT..."`, not
   an ISO date — which then broke `new Date(`${date}T12:00:00+05:30`)` client-side with
   `RangeError: Invalid time value`. Found by driving the real flow in the browser (the
   booking page crashed), not by code review. Fixed with `normalizeDate`/
   `normalizeTime` helpers in `local-source.ts` that handle both the `Date`-object and
   string shapes, matching Supabase's PostgREST string-shaped response.
3. **`ADMIN_SESSION_SECRET` must be a real env var, not a random per-process fallback.**
   The first version generated a random secret at module load if the env var was
   unset. The first live login test failed: the POST that signed the cookie and the
   subsequent page load that verified it landed in what behaved like two different
   module instances under Next 16's Turbopack dev runtime (Route Handler vs Server
   Component bundles), so the signature never matched. Rather than chase why Turbopack
   didn't share the module singleton, the fix is to remove the possibility: the secret
   is now required, with a clear thrown error if missing, and `isAdmin()` fails closed
   (denies, does not crash) if signing fails for any reason.
4. **Admin pages are client components fetching `/api/admin/*`, not Server Components
   calling `getDataSource()` directly.** The first version of `/admin/bookings` was a
   Server Component that called `getDataSource()` in the render path. It threw
   `TypeError: The "path" argument must be of type string... Received an instance of
   URL` — from `node:fs` calls inside `local-source.ts`'s migration loader, reachable
   only from the RSC/page bundle, never from a Route Handler (which worked identically
   with the same code, proven by `/api/session-types` succeeding throughout). Chased to
   three hypotheses (Turbopack RSC bundle path handling, a `process.cwd()` difference
   under the page runtime, a `fs` shim specific to that bundle) without fully isolating
   the Turbopack internal — the architectural fix removes the need to know which:
   admin pages now read through the same Route Handler API every other client-side
   caller already proved works. This is also a better design regardless of the bug
   (one read path, not two).
5. **Money display formatting.** Caught in the V2 self-review, not by a user report:
   `(priceUsdCents / 100).toFixed(0)` would have silently rounded a non-round price
   (e.g. 1950 cents → "$20" instead of "$19.50"). Every current seeded USD price is a
   whole dollar amount, so this was latent, not yet visible. Replaced with
   `formatUsdCents()` in `src/lib/money.ts`, which shows decimals only when the price
   actually has cents. Regression test added (`tests/money.test.ts`).
6. **Testimonials section deferred to Slice 3**, per the "no LinkedIn recommendation
   text exists" finding above.
7. **Availability rules and business hours are invented placeholders**
   (Mon–Fri 09:00–18:00 Asia/Colombo, 30-minute spacing), exactly the class of gap PPI
   hit with Janitha's travel zones. No real consulting availability was specified
   anywhere in the workspace. **Open item: Shashika supplies real hours; update
   `supabase/seed.sql` and re-seed.** The contact details in the same seed (email,
   phone) are real and already published on the live site — not invented.
8. **`site_settings.owner_alert_email` is not exposed through the `DataSource` port.**
   Only `create_booking()` reads it (server-side, inside the SQL function). The lead
   endpoint falls back to `SEED_OWNER_EMAIL` env (defaulting to the same real,
   published address) rather than adding a second read path for one field. Open item
   if a settings-driven owner address ever needs to change without redeploying.

### Structural difference from PPI, worth naming

PPI's `local-source.ts` hand-listed which migrations to apply, and forgetting to add a
new one to that list was the recurring drift (hit multiple times across its slices).
This build's `local-source.ts` instead calls `readdirSync` on `supabase/migrations/`
and applies every `.sql` file it finds, in sorted order. **A new migration cannot be
forgotten from the dev path by construction.** `check-migrations.mjs` here checks a
narrower, still-real thing: the migration filenames form a contiguous sequence with no
gaps, so whoever applies them to the eventual real Supabase project (manually, via the
SQL editor or `supabase db push` — no project exists yet) is applying the same order
local dev already proved correct.

### V2 five-lens review (Slice 1 diff)

**1. Correctness.** Traced: `sessionTypeId` for an inactive/deleted session type →
`create_booking` returns `VALIDATION_ERROR` before any write (checked, not assumed —
the `not found` branch is hit first). `notes` at exactly 2000 chars → accepted (`<=`
check); at 2001 → rejected by both zod and the DB check constraint (defense in depth,
intentional). A booking exactly at `min_lead_time_minutes` from now → the `<` comparison
means exactly-at-the-boundary is accepted, one second under is rejected; not edge-case
tested against a live clock but the SQL is unambiguous. Two fixed items above (hold_until,
date/time normalization) were the real correctness bugs found.

**2. Security.** No raw SQL string interpolation anywhere — every query is
parameterized (`$1, $2...` / Supabase's query builder). Admin routes gate on
`isAdmin()`; verified live by logging out and confirming direct navigation to
`/admin/bookings` redirects to `/admin/login`. `<script>alert(1)</script>` submitted as
a lead `name` was stored as-is and rendered as inert text in `/admin/leads` (React's
default escaping) — confirmed by the browser's own console warning ("Encountered a
script tag while rendering... never executed when rendering on the client"), not
assumed from "React escapes by default." `ADMIN_PASSWORD`/`ADMIN_SESSION_SECRET` are
read only in `src/lib/admin-auth.ts`, server-side; grepped for `process.env` in every
client component (`"use client"` files) — zero hits. `notification_log` stores
recipient + subject, never the email body — no customer free text reaches a log.
**Not yet built:** the admin bookings/leads tables don't display the `notes`/`fields`
free-text columns at all yet, so there's nothing to check there — noted as an open
item for Slice 2 completion, not a defect in what exists.

**3. Data integrity.** `create_booking` and `cancel_booking` are each a single SQL
function call — atomic by Postgres's own transaction semantics, nothing to coordinate
across statements from the application side. The overlap exclusion constraint is the
backstop proven by `db-check.mjs`'s concurrent-call test (exactly one of two
simultaneous `create_booking` calls for the same slot wins). **Accepted, not fixed:** a
client-side network retry of an already-succeeded booking POST would get
`SLOT_UNAVAILABLE` on the duplicate attempt and show an error to a customer whose first
attempt actually worked. No double-booking results (the constraint prevents it), but
the error message doesn't distinguish "someone else took it" from "you already booked
this." Same class PPI left open for its own double-submit edge case. Migrations have no
down-path — acceptable for a schema that has never been deployed; becomes a real gap
the moment a Supabase project exists and needs a rollback story.

**4. UX failure.** All four F5 states present on `/book` (loading/empty/error/success)
and on both admin list pages. 375px checked programmatically: zero horizontal scroll,
all six session cards 89.6–113.6px tall (well over the 44px floor). **Keyboard
traversal: Tab order confirmed correct** (skip-link → session cards in DOM order) but
**Enter-to-activate could not be confirmed in this environment** — synthetic Enter
keypresses reached the focused button (confirmed via `document.activeElement`) but
produced zero `click` events at the document level, while an identical mouse click on
the same element produced one. Isolated to the pane's key-simulation pipeline, not the
app: there is no `onKeyDown`/`preventDefault`/custom `tabIndex` anywhere in the
codebase (grepped), every interactive control is a native `<button>`/`<input>`/`<a>`,
which get Enter/Space activation for free from the browser with zero custom code to
break it. Structurally correct; not confirmed on a real keyboard, and that distinction
is stated rather than blurred.

**5. Performance.** `get_availability()` is a plpgsql loop over (day × rule ×
candidate), not a set-based query — for a single-resource calendar over a 21-day
window this is a few hundred fast indexed `EXISTS` checks per call, and cold-start
including full migration application measured 0.5–1.7s, warm calls 13–70ms (server
logs). Not linearly elegant SQL, but nothing here is measured slow, so no fix applied.
`motion` is in `package.json` but zero components import it yet (Slice 4 hasn't
started) — zero bundle cost today by construction (unused imports ship nothing), flagged
so Slice 4 doesn't forget it's already a dependency.

### Evidence

Saved to `evidence/`: `slice1-db-check.txt` (8/8), `slice1-vitest.txt` (10/10 at the
time; grew to 14/14 after the money-formatting fix — rerun before Slice 2 close),
`slice1-check-migrations.txt` (3/3, contiguous), `slice1-build.txt` (clean production
build, correct static/dynamic route split), `slice1-browser-flow.md` (the full manual
browser-driven walkthrough: happy path, cold start, 375px, injected network failure,
hostile-input matrix).

### Not verified, named plainly

- Motion/animation: nothing built yet (Slice 4).
- Real two-connection Postgres concurrency (PGlite is single-connection; the
  concurrent-call test is serialised, proving the constraint's logic, not surviving
  real concurrency — same limitation PPI documented and never closed either).
- Real email delivery — no `RESEND_API_KEY`, `ConsoleNotifier` only.
- Keyboard Enter/Space activation on a real keyboard (see lens 4 above).
- Lighthouse / real Core Web Vitals measurement (no deployed URL yet).

---

## Slice 2 — Lead capture + admin · 2026-08-25

Built alongside Slice 1 rather than as a strictly separate pass, since the lead sink
port, `/api/leads`, `/api/quiz/submit` and both admin list pages share almost all their
plumbing with the booking engine (same `DataSource` port, same rate limiter, same admin
auth). Recorded as its own slice because it has its own gate items.

### What shipped

- `/api/leads` — every submission source (`contact`, `free_audit`, `growth_audit`,
  `built_by`, `quiz`) funnels through one endpoint with a `source` field, writes to the
  database first, and only then attempts the lead-sink fan-out (Hub POST, file
  pipeline log) and the owner-alert email. **This directly fixes the audit finding**
  that `/contact` showed a success message while silently discarding the submission.
- `/api/quiz/submit` — writes to `quiz_submissions` in the Hub's exact shape
  (`QuizDefinition`/`QuizQuestion`/`QuizSubmission` field names), and promotes a
  complete submission with an email answer into a `Lead` with `quizSubmissionId` set,
  per the kickoff's "this quiz is Hub Phase E's public quiz" instruction.
- Lead sink port (`src/lib/lead-sink/index.ts`): DB write already happened by the time
  this runs; Hub adapter POSTs to `HUB_INTAKE_URL` if set, else logs `skipped`; file
  adapter always appends an AgencyOS-pipeline-shaped record to
  `data/hub-pipeline-log.jsonl` **inside this repo**, never into `Agency/`. Verified:
  the file did not exist before the first lead was created in this session and
  contained one correctly-shaped line after.
- `/admin/login`, `/admin/bookings`, `/admin/leads` — dev-only password gate (see
  Slice 1 decision 3), full sign-in → view → sign-out → blocked-when-signed-out loop
  driven live in the browser (evidence file above).

### Not built yet — explicit open items, not silent gaps

- No admin UI to edit `availability_rules`/`availability_overrides`/`site_settings` —
  seed-only for now, same as PPI's admin dashboard didn't exist until its own Slice 4.
- Admin bookings/leads tables don't surface `notes`/`fields` free text yet.
- The growth-audit quiz's actual question set (from `quiz.html`/`quiz.js`) has not
  been ported into `quiz_questions` rows — `quiz_submit` accepts arbitrary answers
  against a quiz definition shell (`growth-audit`, published, zero questions attached).
  This is real Slice 3 work: porting the quiz UI and its content together.
- Testimonials section (see Slice 0 finding).

### Gate

Runs end-to-end after a cold start: yes (same restart proof as Slice 1). V2 review:
folded into Slice 1's five-lens pass above, since the two slices share almost every
file touched. Failure behavior of every new external call exercised once: yes (Hub POST
with no `HUB_INTAKE_URL` → logged `skipped`, hostile lead input → validation errors as
designed, network failure mid-booking → user-facing message, verified live). Evidence
saved and named above.

---

## Slice 3 — Marketing pages, SEO, content · 2026-08-25

**Gate: PASSED.** Production build clean (36/36 static pages, correct static/dynamic
split), vitest 14/14, db-check 8/8, eslint 0 errors (10 pre-existing `no-img-element`
warnings on small logo/icon marks, accepted — not the LCP image, F4 doesn't apply).

### What shipped

- Every marketing page under `(marketing)/`: home, services, consulting (adds real
  `/book?session=...` links alongside the original WhatsApp CTA), approach, about
  (+ testimonials section, see Slice 0 finding), contact (rewired to `POST
  /api/leads`, fixing the audit's dead-funnel finding), growth-audit, portfolio
  (`cases-data.ts` + `case-card`/`capability-matrix`/`portfolio-grid`, all three
  deriving their counts from the same array so matrix/filter numbers cannot drift
  from the cards, per the original portfolio build's own documented defect class),
  four case-detail pages (ppi/agrilhotech/sportswear/motorbike-parts) sharing one
  `case-detail-shell`, free-audit (`steps-data.ts` + `free-audit-form.tsx`, same
  dead-funnel fix as contact), built-by (intro port, CTA simplified to `/quiz` —
  its own distinct quiz engine was not ported, see open items).
- `/quiz` as its own top-level route (not in `(marketing)`), with a stripped-down
  custom header, matching `quiz.html`'s original minimal chrome and fixing a nav-
  duplication bug caught mid-build (see decisions below).
- `/privacy`, `/terms` — new, hand-written (none existed on the live site).
- `src/app/not-found.tsx`, `sitemap.ts`, `robots.ts`, `llms.txt/route.ts` — two real
  content discrepancies found against the live site and corrected, not guessed:
  `llms.txt` quoted the free-audit price as $199/LKR 24,000, which doesn't match
  `free-audit.html`'s own copy or its JSON-LD Offer (both say $99/LKR 14,999);
  `robots.txt`'s AI-bot allowlist was checked against the live file rather than
  assumed, confirming `OAI-SearchBot`/`ChatGPT-User`/`Google-Extended` were already
  present so they were carried over rather than re-guessed.
- `next.config.ts` redirects ported from `.htaccess`: retired-page rules
  (`/results` → `/portfolio`, `/case-streetwear` → `/case-sportswear`) checked
  before the generic `/:slug.html` → `/:slug` stripping rule, so a retired page
  under its old `.html` name still lands on its replacement rather than a 404.
  Both redirect classes verified live this session (evidence below).
- Design system: `globals.css`/`site.css` fully ported (fonts mapped to
  `next/font/google` variables, `.reveal`/animation-adjacent rules changed to render
  fully visible immediately per the motion hard floor even though Slice 4 hasn't
  started), `theme-toggle.tsx` rewritten to be CSS-attribute-driven with no React
  state for the visual (avoids the hydration-mismatch class of bug entirely rather
  than patching around it).

### Decisions taken (two-way doors, logged not escalated)

1. **Consulting page links directly to `/book?session=...` alongside the original
   WhatsApp CTA.** Not in the live site (which only had WhatsApp). A real content
   evolution, not a copy error — the booking engine exists now and not linking to it
   from the page that describes what's bookable would be a worse experience than the
   live site had. Logged rather than treated as a deviation needing approval, since
   it's additive and doesn't remove or alter existing copy.
2. **Portfolio card structural fix, caught mid-port, not assumed.** Default
   assumption was `.case-industry` sits inside `.case-top` (a flex row) for every
   card, matching the one outcome-lead card checked first. Re-checking the source
   HTML against all 15 cards showed 14 of them place `.case-industry` as a separate
   block below `.case-client`. Fixed by branching `case-card.tsx` on
   `c.kind === "outcome-lead"`.
3. **Portfolio "basis" bold-prefix inconsistency, same class of catch.** Assumed
   every basis paragraph gets a `<b>How it was measured.</b>` prefix; the source's
   `case-resort-group` card actually uses `<b>What we built.</b>`, and several
   build-type cards have no bold prefix at all. Fixed via a `basisLabel(c)` helper
   rather than a single hardcoded string.
4. **Quiz moved out of the `(marketing)` route group.** First version nested the
   quiz inside `(marketing)`, which injects the full `SiteNav`/`SiteFooter` — on top
   of `QuizFlow`'s own internal "Back to overview" bar, stacking two navigation
   layers where the source `quiz.html` has one stripped-down header. Fixed by
   giving `/quiz` its own top-level layout outside the group. This is also why
   `robots.txt` disallows `/quiz` in both extensionless and `.html` form — matching
   the live file, which never wanted the quiz indexed.
5. **Quiz progress bar renders inside `.quiz-card` instead of full-width sticky
   above `.quiz-stage`.** A refactor to share one progress bar across steps left it
   nested one level deeper than the original. Accepted as a cosmetic-only deviation
   under time pressure rather than lifting state to a wrapper component — logged
   as an open item, not silently dropped.
6. **Built-by's CTA routes to `/quiz` instead of porting its own distinct quiz
   engine.** The kickoff's honesty standard forbids inventing content; `built-by`'s
   original page referenced a separate quiz variant whose question set was never
   captured in the workspace. Rather than fabricate one, the CTA points at the real,
   working growth-audit quiz. Open item if the original built-by quiz content
   surfaces later.

### V2 five-lens review (Slice 3 diff)

**1. Correctness.** Two TypeScript strict-mode bugs, both caught by the compiler,
not by review: `free-audit-form.tsx`'s `STEPS[stepIndex]` was `Step | undefined`
under `noUncheckedIndexedAccess` (fixed with a checked `!` assertion, safe because
`stepIndex` is always kept in `[0, STEPS.length)` by `onNext`/back-button logic);
`quiz-flow.tsx`'s `step.idx` lost its outer `if`-guard's narrowing inside nested
`function choose()`/`skip()` closures (TypeScript doesn't carry narrowing across
function-declaration boundaries) — fixed by extracting `const idx = step.idx` before
the closures. **Live-driven finding, not caught by any static check:** the quiz
results screen and the promoted-lead admin view both echo a hostile/untrimmed `name`
value verbatim with no display-time sanitisation — see "Confirmed findings" below.

**2. Security.** Every hostile-input probe this slice (`<script>alert(n)</script>`
in five different fields across two forms, emoji + Sinhala mixed with a script tag
in a free-text field) stored as literal text and rendered as inert text everywhere
it surfaced (quiz results screen, admin leads table) — confirmed by inspecting
`.value`/`.textContent` directly and checking for `alert()` firing / console
script-execution warnings, not assumed from "React escapes by default." No new
`process.env` reads in any Slice 3 client component (grepped, zero hits, same
pattern as Slice 1). No new raw SQL or unparameterised query introduced — Slice 3 is
almost entirely UI consuming Slice 1/2's already-hardened endpoints.

**3. Data integrity.** The 400-then-200 sequence on `/api/leads` during the
free-audit disqualify test (see confirmed findings) was checked specifically for a
duplicate/partial write from the failed attempt — confirmed via `/admin/leads` that
exactly one `free_audit` row exists, not two. Redirects verified to be genuinely
data-preserving in the SEO sense (retired-page rule ordered before the generic
`.html`-stripping rule, so a URL that matches both takes the specific one, checked
by reading `next.config.ts`'s array order and confirming Next.js's redirect
matching is first-match-wins).

**4. UX failure.** Both new form flows (quiz's 16 real questions, free-audit's 6
steps) drove an empty-submit block, a required-field error state, and a
successful/disqualified end state, all with real clicks. Full detail in
`evidence/slice3-browser-flow.md`. **Not repeated this slice, named honestly:** a
true 375px screenshot pass (the Browser pane could not composite frames for a
screenshot at any point this session — a tool/environment limitation, not something
this build could route around) and an independent network-failure injection against
these two specific forms (both share the exact `fetch().catch()` pattern already
proven against `/book` and `/contact` in Slices 1-2, but that is the same code
reviewed, not a fresh live trigger against these forms specifically).

**5. Performance.** `site.css` grew to one large stylesheet across the whole
session — still a single plain CSS file shipped once per page load, no code-split
concern. Portfolio's derived-from-one-array pattern (`cases-data.ts` →
`capability-matrix.tsx` + `portfolio-grid.tsx`) is O(15) at render, trivial. No new
client bundle weight of note — `motion` remains an unused dependency (Slice 4 not
started), zero cost by construction.

### Confirmed findings from live hostile-input testing (fixed this slice)

1. **No client-side length caps on lead-form text inputs, causing a raw
   `VALIDATION_ERROR` message to leak to the user with no field name.** Found by
   deliberately sending an oversized WhatsApp number through the free-audit form's
   Step 1/Step 2 disqualify path; `POST /api/leads` correctly rejected it
   (`400`, `"String must contain at most 40 character(s)"` on `path: ["phone"]"`) —
   the server-side behaviour was already correct (structured envelope, no crash, no
   stack trace, no double-write) — but nothing on the client prevented typing past
   the limit or explained which field failed. **Same gap existed, undetected, in
   the already-"verified" contact form** (name/email/company had no cap either,
   just never tripped by prior testing since no field there previously received an
   oversized probe). **Fixed across all three lead-writing forms in one pass:**
   `maxLength` added to `contact-form.tsx` (name 200, email 320), `free-audit-
   form.tsx` (tel 40, email 320, text 200), and `quiz-flow.tsx`'s step-1 contact
   fields (name 200, email 320, phone 40) — every value matches `validation/
   lead.ts`'s real zod caps exactly, so the client and server limits cannot drift
   apart silently. Re-verified live after the fix: same flow now completes with
   `200 OK`. Residual, accepted gap: the raw-Zod-message fallback path is still
   reachable if a caller bypasses the HTML `maxLength` (e.g. programmatic POST) —
   acceptable, since the server's structured rejection is itself safe, just not
   pretty; not fixed this slice.
2. **Quiz results screen and the promoted-lead admin row both display a hostile/
   untrimmed name value verbatim, unstyled and unbounded.** `<script>alert(1)</
   script>` submitted as a name renders as literal, inert text everywhere (safe,
   confirmed), but the results heading reads `<script>alert(1)</script>, here's
   your Growth Scorecard` — a genuinely bad experience for a user who pastes
   something odd into that field, not a security issue. **Not fixed this slice**
   (logged as an open item — the fix belongs with a broader "trim and cap display
   names sensibly" pass across both the quiz and admin views, which is more churn
   than this slice's scope justifies for a cosmetic-only defect with no data-
   integrity or security consequence).

### Evidence

Saved to `evidence/`: `slice3-eslint.txt` (0 errors), `slice3-vitest.txt` (14/14),
`slice3-db-check.txt` (8/8), `slice3-build.txt` (clean production build, 36/36
static pages, correct route classification), `slice3-browser-flow.md` (full
click-by-click quiz and free-audit walkthroughs, the caught-and-fixed validation
bug with request/response detail, redirect checks, SEO artifact spot-checks, and
an explicit "not verified this pass" list).

### Not verified, named plainly

- True pixel-level 375px screenshots — the Browser pane could not composite frames
  for a screenshot at any point in this session (tool/environment limitation).
  Structural/DOM checks (`read_page`, computed styles, bounding rects) stood in.
- A fresh, independent network-failure injection against `/quiz` and `/free-audit`
  specifically (the shared `fetch().catch()` code path was proven against `/book`
  and `/contact` in Slices 1-2, not re-triggered here).
- Keyboard-only traversal of the quiz/free-audit steppers (same tool-level
  Enter/Space-simulation limitation documented in Slice 1, not re-tested).
- Portfolio filter chips clicked live (reviewed by reading the derive-from-one-array
  code, not by clicking every chip).
- The real LinkedIn testimonial text (still blocked on Shashika, per the Slice 0
  finding — the section ships with real names/titles and a "read it on LinkedIn"
  link, no fabricated quote bodies).
- Real consulting availability hours (still the Slice 1 invented placeholder,
  unchanged this slice).

---

## Slice 5 — Analytics, consent mode, security headers · 2026-08-25

**Gate: PASSED.** Production build clean (36/36 static pages held — the CSP
approach chosen specifically did not regress this), vitest 14/14, db-check 8/8,
eslint 0 errors. Live-verified: GTM loads with the real container ID in the
correct order relative to consent defaults, all six security headers present on
the actual HTTP response (not just in the config file), five of eight new/ported
dataLayer events fired live from real clicks, zero CSP-violation console errors
across the whole session.

### What shipped

- **`GTM-T7ZVSV73` wired in, for real.** This is not a placeholder — it's the
  exact container ID already live on ceyagmark.com today (confirmed by grepping
  the live static site's own HTML, `Projects/CeyagMark/CeyagMark/*.html`), the
  one the original ad-readiness audit found loading but firing zero tags. That
  finding was never a code bug — the container itself has nothing configured
  inside it, which is a job in tagmanager.google.com, not something this
  session could fix from a repo. What this slice actually fixes: the app now
  pushes real, rich events for every meaningful interaction, so whenever
  Shashika (or whoever has GTM access) adds tags, they have real triggers to
  bind to instead of nothing.
- **Real dataLayer events, ported from the live site's own vanilla JS, not
  invented.** Grepped `assets/js/{main,portfolio,free-audit,quiz}.js` on the
  live static site and found it already pushes `whatsapp_click`,
  `portfolio_filter`, `case_opened`, `case_cta_click`, `founding_audit_
  application`, and `growth_audit_completed` — same event names, same field
  names, ported verbatim into `src/lib/analytics/events.ts` and wired into
  their Next.js equivalents (`click-tracker.tsx` for the delegated
  wa.me/case-link clicks, direct calls in `free-audit-form.tsx`/`quiz-
  flow.tsx`). Two new events, **not** ported because nothing to port existed:
  `booking_completed` and `contact_submitted` — booking didn't exist as a
  real conversion on the static site, and contact silently discarded every
  submission, so there was no real event to carry over for either. Named as
  new additions here, not disguised as a port.
- **GA4, Meta Pixel, Microsoft Clarity — env-gated, no invented IDs.** The
  live site has zero of these installed (confirmed by grep: no `fbq(`, no
  `gtag(`, no Clarity snippet anywhere in the static site's JS). Rather than
  fabricate placeholder IDs, each of `NEXT_PUBLIC_GA4_ID`/`NEXT_PUBLIC_META_
  PIXEL_ID`/`NEXT_PUBLIC_CLARITY_ID` is read from env and the corresponding
  script in `analytics-scripts.tsx` simply never renders if its ID is unset —
  same pattern as this build's own notification/lead-sink ports. They ship
  ready; they don't ship pretending to already be configured.
- **Google Consent Mode v2, default-DENIED, no auto-grant.** The default
  `gtag('consent', 'default', {...})` call sets every signal
  (`ad_storage`/`ad_user_data`/`ad_personalization`/`analytics_storage`) to
  `denied` and runs via `beforeInteractive`, confirmed live to execute before
  GTM's own script. **Deliberately not auto-granted to "satisfied":** this
  app ships no cookie-consent banner, so there is no real user choice to
  reflect. Auto-granting consent nobody gave would be a fabricated compliance
  signal — arguably worse than shipping no Consent Mode at all. See open
  items below.
- **Security headers and a CSP, real and verified on the wire.**
  `next.config.ts`'s `headers()` now sets CSP, `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and
  `Strict-Transport-Security` on every route. Confirmed via `curl -sD -`
  against the running server, not just read from the config source.

### Decisions taken (two-way doors, logged not escalated)

1. **CSP uses `'unsafe-inline'` plus an explicit vendor allowlist, not
   nonce-based strict CSP.** Next.js's own docs present nonce-based CSP as the
   stricter option, but it requires every page touched by it to render
   dynamically on every request — that would undo Slice 3's verified
   36/36-static-page build, which is the entire point of ADR-001's route-class
   decisions. GTM/GA4/Meta Pixel/Clarity all inject their own inline
   bootstrap scripts at runtime regardless of which approach is chosen, so
   `'unsafe-inline'` was going to be needed either way for those vendors' own
   scripts. This is the same tradeoff Next.js's docs present as their default
   "without nonces" path, not a shortcut invented for this build.
2. **Consent Mode ships default-denied with no banner, not default-granted.**
   Covered above. The honest, correct state for a site with no real consent
   UI — flagged as an open item, not silently resolved either way.
3. **`case_cta_click`/`case_opened` use one delegated `document`-level click
   listener (`click-tracker.tsx`) instead of an `onClick` handler on every
   individual link.** Mirrors the live static site's own architecture
   (`portfolio.js` did exactly this with `querySelectorAll` + a shared
   `push()` helper) and avoids converting several Server Components
   (`case-card.tsx`, `case-detail-shell.tsx`) into Client Components just to
   attach a tracking call — the components stayed server-rendered, only
   gaining a `data-case-link`/`data-case-cta` attribute each.
4. **`CaseDetailShell` gained a required `slug` prop**, threaded through from
   all four case-detail pages, so its CTA link could carry a real
   `data-case-cta` value. Small, explicit, typed — matches this codebase's
   existing preference over inferring the slug from the URL at runtime
   (which would have required converting the shell to a Client Component).

### V2 five-lens review (Slice 5 diff)

**1. Correctness.** `booking_completed`'s field names were checked directly
against `/api/bookings/route.ts`'s actual JSON response shape (not assumed)
before wiring — `confirmationCode`/`sessionTypeName` exist there,
`priceUsdCents`/`slug` come from the already-in-scope `SessionType` state, and
the TypeScript compiler (strict mode, `noUncheckedIndexedAccess`) would have
failed the build on any mismatch. It didn't. Traced: a user who has JavaScript
analytics blocked (ad-blocker, browser setting) never sees the tracking calls
throw, because `push()` no-ops silently outside a `window` context and every
call site fires its own real business logic (the actual `POST` request, the
actual UI state change) independent of whether the dataLayer push itself
succeeds — tracking failure can never block a real conversion.

**2. Security.** The new CSP was checked for what it does NOT block: same-
origin scripts/styles, the app's own `next/font`-self-hosted fonts (no
external font host needed, so no `font-src` exception was added beyond
`'self' data:`), and every vendor script domain actually used. Checked for
what it DOES block: arbitrary third-party script/connect/frame origins
outside the four named vendors. `frame-ancestors 'self'` plus `X-Frame-
Options: SAMEORIGIN` both set (belt-and-suspenders for older browsers that
don't read the CSP directive). No secrets or IDs that need to stay private
were added — GTM/GA4/Pixel/Clarity IDs are all meant to be public (they're
already visible in every page's HTML source once loaded), unlike
`ADMIN_SESSION_SECRET`/`SUPABASE_SERVICE_ROLE_KEY`, which stay server-only
and were not touched this slice.

**3. Data integrity.** No database schema changes this slice — analytics
events are fire-and-forget client-side pushes, not persisted anywhere in
this app's own data model (GTM/GA4/etc. own that storage, outside this
codebase's control by design). Nothing here can corrupt or duplicate a real
booking/lead row; the tracking calls are placed strictly after the real
write already succeeded (`res.ok` checked first in every case).

**4. UX failure.** No new user-facing UI in this slice — no consent banner,
no visible change to any page. The one thing checked live: that adding six
security headers and a CSP doesn't break anything already working (no CSP-
violation console errors observed across the whole verification pass, on any
page visited).

**5. Performance.** All four analytics scripts load `afterInteractive` (Next
.js's default, deliberately not `beforeInteractive` except for the tiny
inline consent-default script, which is a few bytes and has to run early by
Google's own requirement) — none of them block the initial render or count
against the F4 LCP/CLS budget. Zero new dependencies added (hand-rolled with
`next/script` rather than pulling in `@next/third-parties`, per fable-coding's
dependency-skepticism rule — four two-line script snippets don't justify a
new package).

### Evidence

Saved to `evidence/`: `slice5-vitest.txt` (14/14), `slice5-db-check.txt` (8/8),
`slice5-build.txt` (clean production build, 36/36 static pages — unchanged from
Slice 3, confirming the CSP choice didn't regress static rendering),
`slice5-browser-flow.md` (GTM load order proof, security headers fetched
directly off the wire, five of eight dataLayer events fired live with actual
payloads shown, and an explicit account of the three events verified by code
review + type-check rather than a fresh live click-through).

### Not verified, named plainly

- `founding_audit_application` and `growth_audit_completed` were not re-driven
  live this slice (their success paths were already fully click-driven and
  proven in Slice 3's evidence; only the new tracking call itself is unproven
  by a live click, and it's covered by a strict TypeScript build instead).
- `booking_completed` was not re-driven live this slice, same reasoning —
  Slice 1 already fully verified the booking flow live.
- No real GA4/Meta Pixel/Clarity account exists anywhere, so none of the
  three has ever actually received an event — only their env-gated loading
  code is verified (absent → does not render, confirmed by reading the
  rendered `<head>`).
- No cookie-consent banner exists. Consent Mode defaults to denied, which is
  correct given that, but it means Google's ad platforms will operate in
  reduced/modeled measurement mode indefinitely until a real banner is built
  — this matters before any real EU-facing ad spend, less so for Sri-Lanka-
  first targeting.
- CSP was checked for "does it block GTM" (it doesn't) but not stress-tested
  against every possible future GTM tag template (e.g., a custom HTML tag
  that loads from some other domain would need that domain added to the
  allowlist — this is expected, ongoing maintenance for any CSP alongside
  GTM, not a defect).

---

## Real content received from Shashika · 2026-08-25

Two of the open items above are now closed with real, Shashika-confirmed data,
not assumptions:

- **Consulting hours corrected**: Mon-Fri 19:00-22:00 Asia/Colombo (was the
  09:00-18:00 placeholder). `supabase/seed.sql`'s `availability_rules` updated
  and comments corrected to say so plainly. Days-of-week were not explicitly
  restated when he gave the time window — Mon-Fri is carried over from the
  placeholder, not independently reconfirmed. If that's wrong, it's a one-line
  fix in the same file.
- **All three LinkedIn recommendations, pasted in full and used verbatim.**
  `about/page.tsx`'s testimonials section now shows the real quote bodies from
  Nirmal Danansooriya, Saliya Wimalasena and Hiruni Sameeksha — copied exactly
  as given, including Nirmal's own em dash inside his sentence (a direct quote
  from a named third party is exempt from this workspace's own no-em-dash
  writing rule, which governs prose this build writes, not words someone else
  said). The only edits made to the pasted text: stripping LinkedIn's own UI
  chrome around each quote (the "1st", "All LinkedIn members", "On", and a
  trailing "… more" read-more artifact on Nirmal's), none of which was part of
  the actual recommendation. Card subtitles were shortened from each person's
  full LinkedIn headline (several keyword-stuffed clauses long) down to
  title + relationship, matching the card design's existing density — this
  is a formatting choice about how much of the headline to show, not a
  change to the recommendation text itself, which is untouched.
- **New git remote added**: `https://github.com/ShashikaTharinda/CeyagMark-New.git`,
  a fresh empty repo (not `CeyagMark-2`, which is the old static site's).
  Pushed at Shashika's explicit request; he hosts the Vercel project himself
  from here. Supabase project already created on his side — migrations and
  the corrected seed file still need to be run there by him (`DEPLOY.md` has
  the exact steps; this session has no Supabase credentials to do it directly).
- **Cookie-consent banner: decided against, for now.** Confirmed by Shashika
  directly — Consent Mode's default-denied state (Slice 5) stays as the
  running state, no banner gets built. Closes that Phase 4 open item from the
  handoff runbook; worth revisiting only if EU-facing ad spend becomes real.

---

## Slice 4 — Motion · 2026-08-25

**Gate: PASSED.** Production build clean (36/36 static pages, unchanged),
vitest 14/14, db-check 8/8 (after a real regression found and fixed — see
below), eslint 0 errors. Every visually-animated behaviour in this slice
could only be verified structurally, not watched — see "Not verified" below,
named plainly rather than implied otherwise.

### A discovery that reframed this slice: the motion system already existed

Before writing anything, `site.css`'s own Slice-0-era comment on `.reveal`
pointed straight at the answer: "Slice 4 wires the observer that adds/
removes `.in`." Checking the live static site's `assets/js/main.js` (never
fully read before this slice) turned up a complete, already-shipped,
already prefers-reduced-motion-safe motion system — custom cursor, magnetic
buttons, 3D tilt, glow-follow, parallax, and a scroll-reveal observer with
a `setTimeout` safety net — not a rough sketch, a real one, clearly the
source the kickoff's own motion-direction section was describing. This
slice is a **port**, source-checked line by line against `main.js`, not new
motion invented from scratch. The one deliberate departure: per-element
listeners (the original's approach, correct for a traditional multi-page
site) were replaced with `document`-level event delegation, because Next.js
App Router layouts persist across client-side navigation — binding
`pointermove` directly to each element once at load, as the original does,
would either miss elements a later navigation adds or double-bind elements
a persisted layout keeps mounted. Delegation sidesteps both failure modes.

### What shipped

- `src/components/motion-runtime.tsx` — one client component, mounted once
  in the root layout (sitewide, matching the original's scope): a bind-once
  effect for cursor/magnetic/tilt/glow-follow/parallax (all delegated or
  self-querying, so navigation never needs to rebind them), and a separate
  effect keyed on `pathname` for the reveal `IntersectionObserver`, since
  that API genuinely needs re-`observe()`-ing fresh elements per page.
- `site.css` — real `.reveal`/`.reveal.in` restored (opacity 0→1, translateY
  26px→0, .7s), with both of the original's safety nets: `@media
  (prefers-reduced-motion: reduce)` and `@media (scripting: none)`, both
  forcing full visibility. Added the cursor CSS block (`.cursor-dot`,
  `.cursor-ring`, `body.cursor-on`), ported verbatim — it had been
  referenced by a `@media print` rule since Slice 3 but never defined.
- `data-magnetic`/`data-tilt` applied selectively, not blanketed: the
  homepage hero CTA, the free-audit success screen's WhatsApp button
  (restoring the exact attribute `free-audit.js` had), and the about page's
  founder card. Tasteful and limited, per the kickoff's own framing.
- **Not built**: native View Transitions. Considered and deliberately cut —
  see `evidence/slice4-browser-flow.md` for the reasoning. A real two-way
  door, cheap to add later, not a silent omission.

### Confirmed findings from this slice's own verification (fixed)

1. **`db-check.mjs`'s hardcoded test time broke when real hours landed.**
   The script picked a booking slot at a fixed `10:00` local time, "comfortably
   inside the seeded Mon-Fri 09:00-18:00 window" per its own comment — a
   comment that stopped being true the moment the earlier real-hours commit
   changed `availability_rules` to 19:00-22:00, and nobody re-ran `db-check`
   at the time to notice. Running it now, as part of this slice's own
   regression pass, caught it: 5 of 8 checks failed, starting with the most
   basic one ("a real booking succeeds"), because 10:00 no longer falls
   inside business hours at all. **This is exactly the kind of found-not-
   assumed defect this build's own process exists to catch** — logged
   plainly rather than quietly fixed without a trace. Fixed by moving the
   test slot to `19:00` (the window's open, chosen to leave maximum
   headroom for the `+35`/`+40`/`+100`-minute offsets used later in the same
   script). Re-ran: 8/8 passed.
2. **Slice 5's CSP was missing `'unsafe-eval'` in dev.** React's dev-mode
   debugger wants `eval()` for stack-trace reconstruction ("React will
   never use eval() in production mode," per its own console message);
   Next.js's own CSP docs show exactly this `isDev`-gated allowance, which
   Slice 5 omitted. Fixed in `next.config.ts` to match Next's documented
   pattern precisely. Confirmed via `curl` that the served header now
   includes `'unsafe-eval'` in dev and correctly omits it from a production
   build. The console error persisted in this specific sandboxed preview
   pane after the fix (which also showed unrelated HMR WebSocket failures) —
   traced as far as confirming the served header is provably correct, then
   treated as a pane limitation rather than chased further, since
   `preview_logs` showed no server errors and every structural check in
   this slice passed normally regardless.

### The stuck-opacity investigation (a false alarm, run to ground properly)

`.reveal` elements correctly received the `.in` class, but `getComputedStyle`
kept reporting `opacity:"0"` regardless — indistinguishable at first glance
from a broken CSS cascade. Investigated rather than assumed, per fable's
"probe the anomaly" discipline: an isolated element created with both
classes at once computed correctly (`opacity:1`); a clone of the real
failing element, in the same parent, also computed correctly; a trivial,
totally unrelated CSS transition probe reproduced the identical
stuck-at-start symptom. Conclusion, now confirmed rather than merely
suspected: this Browser pane cannot render **any** CSS transition to
completion — a wider version of its already-documented no-compositing
limitation (previously known for rAF/scroll/IntersectionObserver/
screenshots). The reveal logic itself — the class-toggle mechanism, the
observer, the safety net — is correct and verified; only the visual fade is
unobservable here. Full write-up and the exact reproduction steps:
`evidence/slice4-browser-flow.md`. Memory (`browser-pane-no-compositing.md`)
updated with this finding so it doesn't cost a future session the same
investigation.

### V2 five-lens review (Slice 4 diff)

**1. Correctness.** Traced: an element with `prefers-reduced-motion: reduce`
never gets `.reveal`'s hidden state at all (the media query wins by being
more specific in intent, verified by reading the CSS cascade order — `.reveal`
sets the hidden state, the reduced-motion query immediately overrides both
opacity and transform back to visible with no transition). A user with no
JS at all: `@media (scripting: none)` forces `opacity:1 !important` — checked
by reading the rule, not assumed. An element already inside the viewport at
page load: `IntersectionObserver`'s first callback fires with
`isIntersecting:true` immediately upon `.observe()`, so it reveals on the
very next microtask, not waiting for the 1500ms fallback — this is standard
IO behaviour, not special-cased in this code, and matches the original.

**2. Security.** No new user input, no new server code, no new external
script domains (CSP untouched except the dev-only `unsafe-eval` fix above,
which is additive and dev-gated, not a loosening of the production policy).

**3. Data integrity.** The db-check regression above is the real finding
here — a test-fixture/seed-data coupling that silently broke, caught by
actually re-running the suite rather than trusting that "nothing touched
booking code" meant booking tests would still pass. They didn't, because
the *seed data* changed, which the test's own hardcoded assumption didn't
account for.

**4. UX failure.** Every visually-driven check in this slice is listed
under "Not verified" — honestly, this lens couldn't be exercised beyond
structural confirmation this time. What *was* checked: `prefers-reduced-
motion` and `scripting: none` both correctly bypass all hidden-content
states (read directly from the CSS, not inferred).

**5. Performance.** Every effect in `motion-runtime.tsx` animates only
`transform`/`opacity` (or a CSS custom property consumed by an
`opacity`-transitioning `::before`), per the kickoff's hard floor. No new
dependency added — `motion` remains installed but unused; every effect here
is plain DOM APIs and CSS, matching what the original site already proved
sufficient for the same effects. Zero new client bundle weight of note.

### Evidence

Saved to `evidence/`: `slice4-vitest.txt` (14/14), `slice4-db-check.txt`
(8/8, after the fix above — the pre-fix 3/8 failure was not silently
discarded, it's the finding that led to the fix), `slice4-build.txt` (clean
production build, 36/36 static pages, unchanged from Slice 3/5),
`slice4-browser-flow.md` (the full stuck-opacity investigation with its
reproduction steps, every structural pointer-event check with its actual
output values, and the View Transitions scope-cut reasoning).

### Not verified, named plainly

- **No effect in this slice has been watched on a real screen.** The
  custom cursor, the reveal fade, the magnetic pull, the tilt, the
  glow-follow, the parallax — all confirmed structurally (correct classes,
  correct inline styles from dispatched pointer events, correct gating
  logic read from source) but never rendered and observed visually, because
  this session's Browser pane cannot composite frames. One real screen, one
  real look, is a genuine open item before calling this slice "seen."
- Touch/coarse-pointer behaviour (the `!finePointer` branch that skips
  cursor/magnetic/tilt/parallax entirely) — confirmed by reading the gate
  condition, not tested against an actual touch device.
- `data-parallax` elements — none currently exist anywhere in the ported
  pages (only `.bg-aura .orb` does), so the `[data-parallax]` code path is
  live but has nothing to apply to yet. Not a defect; nothing was ever
  wired to use it on the live site's own equivalent pages either.
