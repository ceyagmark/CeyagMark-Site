# Deploying CeyagMark Next.js — to a Vercel preview, not production

This app was never deployed during the build session: the Vercel CLI was not
installed in that environment, and per the kickoff's own rail
("`Never vercel --prod`. Never run `vercel` with `--yes` while unlinked") a real
deploy needs a human at the keyboard anyway, logged into the real Vercel account.
This file is what that person needs — it is not a substitute for reading
`BUILD-NOTES.md`, which is the actual record of what shipped and what didn't.

**Do not point this deploy at ceyagmark.com.** The live domain stays on
HostArmada/cPanel until Shashika decides to cut over. This gets you a Vercel
preview URL to review the real thing, nothing more.

## 1. Create the Supabase project (production data source)

This app runs on PGlite in dev (`CEYAG_DEV_DB=1`) and Supabase in production. No
Supabase project exists yet.

1. Create a new Supabase project.
2. In the SQL editor, run every file in `supabase/migrations/` **in filename order**
   (`0001_init.sql`, `0002_create_booking.sql`, `0003_get_availability.sql`). There
   is no `supabase db push` set up — this is a manual paste-and-run, same as PPI's
   own first deploy. `scripts/check-migrations.mjs` confirms the filenames form a
   contiguous, gap-free sequence, so running them in order is safe.
3. Run `supabase/seed.sql` once the migrations are in. **Before running it**, open
   the file and check `availability_rules` — the hours in there (Mon-Fri, 09:00-
   18:00 Asia/Colombo) are an invented placeholder, flagged throughout
   `BUILD-NOTES.md`. Get Shashika's real consulting hours and edit the seed file
   before running it, or the booking page will offer slots nobody's actually free
   for.
4. Copy the project's URL and service-role key (Settings → API) for step 3 below.

## 2. Push the code

```bash
cd "Projects/CeyagMark/nextjs"
git remote add origin <a new, empty GitHub repo — do NOT reuse CeyagMark-2>
git push -u origin main
```

This repo's own git history matters — it's the record of every decision in
`BUILD-NOTES.md`. Don't squash it on the way out.

## 3. Connect Vercel and set environment variables

```bash
npm install -g vercel
vercel link
```

`vercel link` will ask which scope/project — create a new project, do not attach
this to any existing CeyagMark Vercel project if one exists from the old static
site (that one should keep serving ceyagmark.com from HostArmada regardless; this
is a separate, new Vercel project for the preview).

Set these in the Vercel dashboard (Project → Settings → Environment Variables), or
via `vercel env add <NAME>`:

| Variable | Value | Notes |
|---|---|---|
| `SUPABASE_URL` | from step 1.4 | required |
| `SUPABASE_SERVICE_ROLE_KEY` | from step 1.4 | required, keep secret |
| `ADMIN_PASSWORD` | a real password, not `dev-only-local-password` | required |
| `ADMIN_SESSION_SECRET` | a random 32+ char string, e.g. `openssl rand -hex 32` | required — the app throws on boot without it |
| `CEYAG_DEV_DB` | **do not set this at all** | `env.ts` throws if this is `1` in a production build — that's intentional, it's the guard against ever running the in-memory dev DB in prod |
| `NOTIFY_FROM_EMAIL` | leave unset for now, or a real address once Resend is ready | unset → emails log as "skipped", never silently as sent |
| `RESEND_API_KEY` | leave unset for now | see below |
| `HUB_INTAKE_URL` | leave unset | AgencyOS Hub has no live intake endpoint yet |
| `SEED_OWNER_EMAIL` | `growth@ceyagmark.com` (already the real, published address) | fallback only |
| `NEXT_PUBLIC_GTM_ID` | `GTM-T7ZVSV73` | the real container already live on ceyagmark.com — keep it |
| `NEXT_PUBLIC_GA4_ID` | leave unset until a real GA4 property exists | |
| `NEXT_PUBLIC_META_PIXEL_ID` | leave unset until a real Pixel exists | |
| `NEXT_PUBLIC_CLARITY_ID` | leave unset until a real Clarity project exists | |

Do **not** set `NOTIFY_FROM_EMAIL`/`RESEND_API_KEY` until Shashika has a real Resend
account and API key — until then every booking/lead notification logs to
`notification_log` as `skipped`, which is correct, safe behaviour, not a bug.

## 4. Deploy a preview

```bash
vercel
```

(no `--prod`, no `--yes` while unlinked — `vercel link` in step 3 already linked
the project, so a bare `vercel` is safe). This gives a `*.vercel.app` preview URL.

## 5. Smoke-test the preview before showing anyone

- `/book` — go through a real booking, confirm the email/SMS console-log (or real
  Resend send, if configured) and the row in Supabase's `bookings` table.
- `/admin/login` → `/admin/bookings`, `/admin/leads` — log in with the real
  `ADMIN_PASSWORD`, confirm the booking above appears.
- `/free-audit`, `/quiz`, `/contact` — submit each once, confirm a row lands in
  `leads` (and `quiz_submissions` for the quiz).
- `/sitemap.xml`, `/robots.txt`, `/llms.txt` — confirm they still serve the right
  content pointed at `ceyagmark.com` URLs, not the `*.vercel.app` preview domain
  (this app's `metadataBase` is hardcoded to the production domain on purpose, so
  URLs stay correct once this does go live on the real domain).
- **GTM container `GTM-T7ZVSV73`** — open Chrome DevTools → Network on the preview
  and confirm `gtm.js` loads. The code side is done (Slice 5). What is NOT done,
  and cannot be done from code: the container itself has no tags configured
  inside it (the original audit's finding #1 — "GTM loads, fires zero tags").
  That's a job in tagmanager.google.com, not a code change — Shashika (or
  whoever has access to that GTM account) needs to add and publish a GA4
  Configuration tag, a Meta Pixel tag, and whatever else, each triggered off
  the real `dataLayer` events this app now pushes (`whatsapp_click`,
  `founding_audit_application`, `growth_audit_completed`, `booking_completed`,
  `contact_submitted`, `portfolio_filter`, `case_opened`, `case_cta_click` — full
  list and payload shapes in `BUILD-NOTES.md`'s Slice 5 section).

## What's still not done, deploy or no deploy

Read `BUILD-NOTES.md` for the full list. The two that matter most before any real
launch: real consulting availability hours (currently invented, see step 1.3), and
the real LinkedIn testimonial text on `/about` (currently placeholder links,
blocked on Shashika). Neither blocks a preview deploy for review purposes — both
should block cutting the real domain over.
