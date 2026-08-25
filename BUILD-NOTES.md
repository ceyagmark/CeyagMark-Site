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

## Slices 4–5 — not started

Motion layer (`motion/react`, scroll reveals, shine-sweep buttons, liquid-glass
borders, magnetic buttons, one cursor-spotlight hero — applied over the now-verified
structure, never before it) and analytics/legal/hardening (GTM, Meta Pixel, GA4,
Clarity, consent mode, CSP, security headers) remain fully unbuilt. The booking
engine (Slice 1, the kickoff's own named highest-risk module) and the full marketing
surface (Slice 3, every SEO-critical page) are both built and verified; motion and
analytics are lower-risk, additive layers over an already-correct foundation, and
stopping here — rather than partially through either — keeps every shipped slice at
a clean, gated stopping point.
