# Slice 3 — browser-driven verification, 2026-08-25

Driven live against `npm run dev` (port 3200, `CEYAG_DEV_DB=1`, PGlite). Viewport
1280x720 throughout (this tool's Browser pane does not composite off-screen, so
screenshots at 375px could not be captured this session — see "Not verified" below;
structural/DOM checks were used in place of visual screenshots throughout, per this
session's established workaround).

## Growth-audit quiz (`/quiz`) — full 16-question flow, real clicks

1. Loaded `/quiz` directly. Confirmed it renders its own minimal header (logo + "Back
   to overview" only) with no full site nav/footer/WhatsApp FAB — the fix for the
   nav-duplication bug logged in the Slice 0 finding.
2. Step 1 (contact details): typed `<script>alert(1)</script>` into the name field,
   left email empty, clicked "Start the audit". Blocked correctly — `.q-field.invalid`
   class applied only to the email field, "Please enter a valid email." shown, name
   field's error stayed hidden (non-empty value passed its own check). No script
   execution; input `.value` held the literal string.
3. Filled a valid email, advanced through all 16 questions with real clicks (one
   option per question, "Continue" per step). Verified an empty-submit is blocked on
   Question 1 (clicked Continue with nothing selected — stayed on Question 1, no
   silent advance).
4. Final free-text step: typed `🚀 මගේ ව්‍යාපාරය ගැන 😀 <script>alert(2)</script>`
   (emoji + Sinhala + a script tag together) into the optional "anything else" field,
   confirmed the raw string round-tripped into `.value` unchanged, then submitted.
5. `POST /api/quiz/submit` → `200 OK`. Results screen rendered with a real computed
   score (0/100, grade E — correct given every answer picked was the worst option),
   correct benchmark copy, and the three worst-scoring leaks. The results heading
   read `<script>alert(1)</script>, here's your Growth Scorecard` — the hostile name
   from step 1 rendered as literal, inert text (confirmed safe: no `alert()` fired,
   no console warning about executing an injected script). **This is a real, logged
   defect** (not a security hole): the results screen and the promoted lead's `name`
   field both echo the raw, untrimmed, unvalidated name value with no display-time
   safety or sanity formatting. See BUILD-NOTES Slice 3 finding 1.
6. Confirmed in `/admin/leads` (logged in as admin): a `quiz`-source lead was created
   with `name = <script>alert(1)</script>`, `email = tester@example.com`, stage `new`
   — same literal string, rendered as inert text in the admin table too (React
   escaping holds server-side and client-side). One row only, matching one submit.

## Free-audit application (`/free-audit`) — disqualify path, real clicks + a caught bug

1. Loaded `/free-audit`, scrolled to `#apply`, tested an all-empty submit on Step 1:
   correctly blocked with 5 "required" errors (4 text fields + the role radio group).
2. Filled Step 1 with hostile input: `<script>alert(3)</script>` (name), an emoji +
   Sinhala business name, `Sri Lanka` (country), and — deliberately, as the oversized-
   input probe — a 37-character WhatsApp number. Selected a role radio, clicked
   Continue. Advanced to Step 2 correctly.
3. Step 2, selected "Marketplace only, no own store" (the option flagged `dq` in
   `steps-data.ts`) plus one answer per remaining required radio group, clicked
   Continue.
4. **Found a real bug**: `POST /api/leads` returned `400 VALIDATION_ERROR` —
   `"String must contain at most 40 character(s)"` on `path: ["phone"]`. The
   96-character WhatsApp string I'd used to probe long-input handling exceeded
   `validation/lead.ts`'s `phone: z.string().max(40)`, and the UI had no client-side
   cap to prevent it or explain which field failed — the raw Zod message was shown to
   the user verbatim, with no field name. Confirmed via
   `read_network_requests` on the actual `400` response body. The server behaved
   correctly (rejected safely, structured envelope, no crash, no double-write); the
   gap was purely client-side UX.
5. **Fixed live**: added `maxLength` to the `free-audit-form.tsx` text/tel/email
   input (40/320/200 matching `validation/lead.ts` exactly), and, since the same
   gap existed with no test having caught it yet, to `contact-form.tsx`'s
   name/email/company fields and `quiz-flow.tsx`'s step-1 name/email/phone fields too
   — same root cause, same fix, all three lead-writing forms now cap client input to
   the server's real limits.
6. Re-ran the same flow (this time scripted via `element.value` + a dispatched
   `input` event rather than literal keystrokes, to save time on the re-verification
   pass — the original bug was found and reproduced via genuine clicks and typing,
   only the confirmation re-run used scripted filling) with a 37-char phone number.
   `POST /api/leads` → `200 OK`. Disqualify screen rendered: "Not a fit just yet." +
   the exact `dq` reason string from `steps-data.ts`'s `marketplace` option + the
   WhatsApp fallback CTA.
7. Confirmed in `/admin/leads`: exactly one `free_audit`-source row exists (the
   earlier `400` did **not** write a partial/duplicate row — data integrity held),
   `email = unknown@example.com` (the form's own documented fallback for the
   optional email field left blank), name again showing the literal script string
   safely as text.

## Redirects (`next.config.ts`, ported from `.htaccess`)

- `/results.html` → `/portfolio` (retired-page rule, checked before the generic
  `.html`-stripping rule): confirmed, landed on the Portfolio page.
- `/case-streetwear` → `/case-sportswear` (renamed-case rule): confirmed, landed on
  the sportswear case study.

## SEO artifacts, spot-checked live

- `/sitemap.xml`: valid XML, absolute `https://ceyagmark.com/...` URLs (correct even
  though served from `localhost:3200` in dev — `metadataBase`-driven), correct
  priority/changefreq tiers for home vs. case pages.
- `/llms.txt`, `/robots.txt`: served with `200 OK` (checked in an earlier pass this
  session, unchanged since).

## Not verified this pass — named plainly

- **375px viewport.** The Browser pane's `screenshot` action failed
  (`"the Browser pane is not displayed, so the page is not compositing frames"`) for
  the entire session, so no true visual screenshot exists at any viewport this
  session, at 1280px or 375px. All verification above is DOM/structural
  (`read_page`, `getComputedStyle`, `getBoundingClientRect`, network/console
  inspection) rather than pixel-level. `resize_window` to a mobile preset was not
  exercised against `/quiz` or `/free-audit` specifically this pass (it was used
  earlier, in Slice 1, against `/book`).
- **A real injected network failure** (devtools-offline or a killed API) specifically
  against `/quiz` or `/free-audit` — done for `/book` and `/contact` in Slices 1-2,
  not repeated here. Both forms share the exact same `fetch(...).catch(() =>
  setSubmitError(...))` pattern already proven in those slices, so the code path is
  the same, but it was not independently re-triggered against these two forms.
- **Keyboard-only traversal** of the quiz/free-audit stepper controls — not repeated
  this pass; Slice 1 already isolated the Enter/Space-simulation limitation to this
  tool's key-dispatch pipeline, not the app (every control here is likewise a native
  `<button>`/`<input>`, same reasoning applies).
- **Portfolio filter-chip interaction** — not click-tested this pass (the underlying
  data-driven pattern was reviewed by reading `capability-matrix.tsx` and
  `portfolio-grid.tsx` against `cases-data.ts`, not by clicking every chip live).
