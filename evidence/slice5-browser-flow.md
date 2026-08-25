# Slice 5 — browser-driven verification, 2026-08-25

Driven live against `npm run dev` (port 3200, production-mode build already
confirmed clean beforehand — see `slice5-build.txt`).

## GTM loads with the real container ID, in the right order

- `window.dataLayer` inspected right after first paint: index 0 is the
  Consent Mode `default` call (`ad_storage`/`ad_user_data`/
  `ad_personalization`/`analytics_storage`, all `denied`), index 1 is GTM's own
  `gtm.js` event — confirming the consent defaults really do run before GTM,
  which is Google's hard requirement, not just a suggestion.
- `gtm.dom` and `gtm.load` both appear in `dataLayer` shortly after — the real
  `GTM-T7ZVSV73` container (the one already live on ceyagmark.com) loaded and
  initialised correctly from this codebase.
- `<script id="gtm">` confirmed present in the DOM.

## Security headers, fetched directly (not just read from next.config.ts)

`curl -sD - http://localhost:3200/` on the running server showed all six
headers present exactly as configured: `Content-Security-Policy`,
`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy: camera=(), microphone=(), geolocation=()`,
`Strict-Transport-Security`. No CSP-violation console errors anywhere in this
session's browsing — the allowlist doesn't block GTM in practice, not just in
theory.

## Real dataLayer events, fired live

Five of the eight new/ported events were triggered by a real click and
confirmed in `window.dataLayer` immediately after:

1. **`whatsapp_click`** — clicked the WhatsApp FAB on `/portfolio`.
2. **`portfolio_filter`** — clicked the "SEO" filter chip on `/portfolio`;
   payload `{filter: "SEO"}`.
3. **`case_opened`** — clicked a case card's live-site link; payload
   `{case_slug: "case-ppi", link_kind: "live"}`.
4. **`case_cta_click`** — clicked the "Get your free Growth Audit" CTA at the
   bottom of `/case-ppi`; payload `{case_slug: "case-ppi"}`.
5. **`contact_submitted`** — filled name/email on `/contact`, submitted,
   confirmed `POST /api/leads` returned `200` and `contact_submitted` (with
   `has_company: false`, matching the blank company field) landed in
   `dataLayer` afterward.

**Not re-driven live this pass, verified by code review + a clean TypeScript
build instead:** `founding_audit_application` and `growth_audit_completed`
use the exact same `push()` helper as the five events above, already proven
live, from call sites placed immediately after the exact success points that
were click-driven and confirmed working in Slice 3's own evidence
(`slice3-browser-flow.md`). `booking_completed` is likewise the same
mechanism, placed right after `setConfirmation(data.booking)` in
`booking-flow.tsx` — its field names (`confirmationCode`, `sessionTypeName`)
were checked directly against `/api/bookings/route.ts`'s actual response
shape, and `selected.slug`/`selected.priceUsdCents` against the `SessionType`
type already in scope. Re-driving the full multi-step booking wizard live
again here would have re-proven a flow Slice 1 already fully verified
end-to-end; the new, previously-unverified part — that the tracking call
itself fires with the right shape — is covered by the strict TypeScript
compiler, which would fail the build on a wrong field name or type, and did
not.

## What Slice 5 does NOT and cannot fix

`GTM-T7ZVSV73` now loads correctly and receives real, rich events for every
meaningful interaction on the site. It still fires zero *tags* — that was
never a code problem. The container itself (in tagmanager.google.com) has no
GA4 Configuration tag, no Meta Pixel tag, and nothing else configured inside
it. That's Shashika's job in the GTM dashboard, using the real event names
above as triggers — see `DEPLOY.md`'s new GTM section.
