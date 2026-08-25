# Slice 0 — endpoint contracts + per-page meta table

Per fable-web W8 (contract before implementation) and F6 (SEO meta floor). Written before
any route handler exists.

## Error envelope (W9)

Every `/api/*` route returns, on failure:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Tell us your name.", "details": { "field": "name" } } }
```

`code` is a stable machine-readable string from a fixed set (`VALIDATION_ERROR`,
`SLOT_UNAVAILABLE`, `RATE_LIMITED`, `NOT_FOUND`, `INTERNAL_ERROR`). `message` is the
user-facing sentence. `details` is optional and never contains a stack trace. HTTP status
matches the code: 400 for validation, 409 for slot conflicts, 429 for rate limits, 404, 500.

## Endpoints

| Method | Path | Purpose | Request body | Success response | Error codes |
|---|---|---|---|---|---|
| GET | `/api/session-types` | List bookable session types | — | `{ sessionTypes: SessionType[] }` | `INTERNAL_ERROR` |
| GET | `/api/availability?sessionTypeId=&from=&to=` | Available start times in a date range | — | `{ slots: { date: string, times: string[] }[] }` | `VALIDATION_ERROR`, `INTERNAL_ERROR` |
| POST | `/api/bookings` | Create a booking (acts; GET never does — PPI trap) | `{ sessionTypeId, startsAt, name, email, phone?, notes? }` | `{ booking: { confirmationCode, manageToken, startsAt, endsAt, sessionTypeName } }` | `VALIDATION_ERROR`, `SLOT_UNAVAILABLE`, `RATE_LIMITED`, `INTERNAL_ERROR` |
| POST | `/api/bookings/[token]/cancel` | Cancel a booking via its manage token | — | `{ ok: true }` | `NOT_FOUND`, `INTERNAL_ERROR` |
| GET | `/api/bookings/[token]` | Render-only lookup for the manage page | — | `{ booking: {...} }` | `NOT_FOUND` |
| POST | `/api/leads` | Contact / free-audit / growth-audit / built-by submission | `{ source, name, email, phone?, company?, fields? }` | `{ lead: { id } }` | `VALIDATION_ERROR`, `RATE_LIMITED`, `INTERNAL_ERROR` |
| POST | `/api/quiz/submit` | Growth-audit quiz submission | `{ quizSlug, answers, complete, source? }` | `{ submission: { id, dqResult } }` | `VALIDATION_ERROR`, `RATE_LIMITED`, `INTERNAL_ERROR` |
| GET | `/api/admin/bookings` | Admin: list bookings (auth required) | — | `{ bookings: Booking[] }` | `UNAUTHORIZED`, `INTERNAL_ERROR` |
| GET | `/api/admin/leads` | Admin: list leads (auth required) | — | `{ leads: Lead[] }` | `UNAUTHORIZED`, `INTERNAL_ERROR` |
| POST | `/api/admin/login` | Admin sign-in, dev-only password gate | `{ password }` | `{ ok: true }` sets signed cookie | `VALIDATION_ERROR`, `UNAUTHORIZED` |
| POST | `/api/admin/logout` | Admin sign-out | — | `{ ok: true }` | — |

Rate limiting: in-memory, per-IP, same shape as PPI (documented as per-instance, not
distributed — honest about the limit rather than dressed up).

## Trust boundary inventory (W2)

| Boundary | Parsing site | Notes |
|---|---|---|
| Booking form input | `lib/validation/booking.ts` (zod) | Single site; every caller (API route) imports this, no second ad-hoc check |
| Lead form input | `lib/validation/lead.ts` (zod) | `fields` jsonb capped to 20 keys, each value length-capped |
| Quiz answers | `lib/validation/quiz.ts` (zod) | Answer shape validated against the published `quiz_questions` set server-side, not trusted from the client's rendered form |
| Admin password | `lib/admin-auth.ts` | Constant-time compare against `ADMIN_PASSWORD` env var; signed cookie, `httpOnly`, `secure` in production, `sameSite: 'lax'` |
| Manage token in URL | route handler, looked up server-side | Token is opaque random text, never trusted as an id; a wrong token 404s rather than erroring |

No webhook receivers exist in this build (no payment gateway, no WhatsApp Business API — W2
webhook-signature rule is not applicable here, noted rather than skipped silently).

## Per-page meta table (F6)

Titles/descriptions/canonicals/H1s below are read verbatim from the live static site
(`Projects/CeyagMark/CeyagMark/*.html`) — ported unchanged per the no-invented-copy rule.
`og:image` is the same file on every page (`og-cover.png`, 1200×630 confirmed) unless noted.

| URL | Title | Meta description | Schema type | H1 |
|---|---|---|---|---|
| `/` | Web Development & Performance Marketing Agency in Sri Lanka \| CeyagMark | CeyagMark builds your website and runs the marketing on it, so the conversions are ours to prove. Web development, paid ads, SEO and CRO for Sri Lankan and international brands. Engagements from LKR 14,999. | ProfessionalService + WebSite + FAQPage | We don't sell marketing. We sell growth you can bank. |
| `/services` | Web Design & Digital Marketing Services and Pricing, Sri Lanka \| CeyagMark | Website and digital marketing services in Sri Lanka with scope and price stated upfront. Website audits from LKR 14,999, fix sprints from LKR 30,000, and full build plus marketing from LKR 39,900 a month. | Service (per offer) | Named engagements, not an hourly rate. |
| `/consulting` | Marketing Consulting Sri Lanka, LKR 3,000 per 30 Minutes \| CeyagMark | Book a one to one strategy or technical consulting session with CeyagMark. For in-house marketing teams and marketing professionals who want senior guidance on paid, CRO, retention, tracking, GTM and AI workflows. | Service | Borrow a senior performance brain by the session. |
| `/approach` | How We Work: The CeyagMark Method for Web and Marketing \| CeyagMark | The CeyagMark method. Diagnose, Model, Deploy, Compound. How AI agents and senior strategists combine to grow revenue, LTV and conversion rate while lowering CPA. | none (process page) | The output of a forty person agency. The focus of one senior expert. |
| `/portfolio` | Portfolio: Website and Digital Marketing Case Studies, Sri Lanka \| CeyagMark | Real case studies from a Sri Lankan web and marketing agency. Booking funnels, WooCommerce stores, AI search visibility and paid acquisition, every number stating how it was measured. | CollectionPage | We build the thing, then we fill it. |
| `/case-ppi` | Case Study: A Booking Funnel That Converts 17 Percent \| CeyagMark | How a vehicle inspection business went from a contact form to a booking engine that converts 17 percent of everyone who opens it, and why fixing the analytics changed the recommendation. | Article | 17 percent of everyone who opened the booking page went on to book. |
| `/case-agrilhotech` | Case Study: Auditing Our Own Store for AI Search \| CeyagMark | We ran an AI search visibility audit on our own e-commerce store and published the score. 63 out of 100, and the homepage was introducing itself as Agril. | Article | We audited our own store for AI search and published the score. |
| `/case-sportswear` | Case Study: ROAS From 2 to 9 on a Sportswear Brand \| CeyagMark | Rebuilding paid acquisition for a Sri Lankan sportswear brand. Return on ad spend from 2 to 9 in 2.5 months, and why the average order value did most of the work. | Article | Return on ad spend from 2 to 9 in 2.5 months, and the order value did most of the work. |
| `/case-motorbike-parts` | Case Study: The Store Scored 38/100 and Needed a Phone Number \| CeyagMark | A conversion audit of a Sri Lankan motorbike parts store. Score 38 out of 100, no navigation menu, no meta descriptions, and the biggest single win was adding a phone number. | Article | It scored 38 out of 100, and the biggest single win was a phone number. |
| `/free-audit` | Free E-commerce Performance Audit, 3 Founding Slots \| CeyagMark | A full-stack performance audit that maps every bottleneck in your store across ads, website, creatives and retention. 3 founding slots free, normally $99 / LKR 14,999. Apply in under 3 minutes. | FAQPage | Where your e-commerce ads are losing money. |
| `/growth-audit` | Free Website & Marketing Audit, Sri Lanka \| CeyagMark Growth Audit | Take the free CeyagMark Growth Audit. Get a custom Growth Scorecard that diagnoses your acquisition, conversion and retention, and shows the highest value fix first. | none (funnel landing) | Your ad costs keep climbing even though you are doing everything right. |
| `/quiz` | Your Growth Audit \| CeyagMark | Answer fifteen quick questions and get your custom CeyagMark Growth Scorecard, a diagnosis of your acquisition, conversion and retention. | none | (visually-hidden) Growth Audit: score your acquisition, conversion and retention |
| `/built-by` | Get a Website Like That One: Free Website Plan \| CeyagMark | You clicked through from a site we built. Answer 15 questions and get a custom Website Plan: what your site is missing, what to fix first, and what it would cost. Free, about three minutes. | none | Your website looks fine. So why does nobody contact you through it? |
| `/about` | About CeyagMark, Web and Marketing Agency in Nittambuwa, Sri Lanka | CeyagMark is a web development and performance marketing agency based in Nittambuwa, Sri Lanka, led by Shashika Tharinda. We reject vanity metrics and the bloated agency model. | AboutPage | We built the agency we wished existed. |
| `/contact` | Contact CeyagMark, Web & Marketing Agency Sri Lanka \| WhatsApp or Email | Contact CeyagMark, a web development and performance marketing agency in Nittambuwa, Sri Lanka. WhatsApp +94 70 372 7895, email growth@ceyagmark.com, or send a message. We reply within one business day. | ContactPage + LocalBusiness | Let us talk about your numbers. |
| `/404` | Page not found \| CeyagMark | (no meta description on the source page — carried forward as-is) | none | We find leaks for a living. Looks like we left one. |
| `/privacy` | Privacy Policy \| CeyagMark | **New page — does not exist on the live site.** Title/description written fresh in Slice 5 per the `privacy-policy` skill, covering GTM/Pixel/GA4/Clarity/form data. | none | Privacy Policy |
| `/terms` | Terms of Service \| CeyagMark | **New page — does not exist on the live site.** Written fresh in Slice 5 per the `terms-of-service` skill. | none | Terms of Service |

Not in this table: `/book` (new booking flow, `noindex` — a transactional flow, not a
ranked page, same call PPI made for `/booking/*`) and `/admin/*` (`noindex, nofollow`,
auth-gated).

## Redirects to port from `.htaccess` (SEO parity, non-negotiable)

Read from the live `.htaccess` verbatim:

```
/results(.html)?  -> /portfolio                 (301, must resolve before .html stripping)
/case-streetwear(.html)? -> /case-sportswear     (301, must resolve before .html stripping)
/index(.html)?    -> /                           (301)
/*.html           -> /* (strip extension)        (301)
```

In `next.config.ts`, retired-page redirects (`/results`, `/case-streetwear`) are listed
**before** any generic rule, matching the `.htaccess` comment's own reasoning: order
matters, or the retired path 404s instead of redirecting. Next.js serves clean URLs by
route folder name by default, so the "serve .html internally" rule (3b) has no equivalent
need — there is no `.html` file to internally rewrite to.

## Sri Lanka structured-data signals to preserve (read from `index.html`)

- Address: locality-level only — `Nittambuwa`, `Western Province`, `LK` (no street address,
  home-based business, deliberate).
- `areaServed`: Sri Lanka, Australia, New Zealand, United Kingdom, United States (5
  countries, exact list from the live JSON-LD).
- `hasOfferCatalog`: 4 offers — The Leak Report (14999 LKR), The Fix Sprint (30000 LKR),
  Build and Run (39900 LKR), Consulting (3000 LKR) — prices exactly as currently published.
- `og:locale`: `en_LK`.
- `sameAs`: `https://www.linkedin.com/company/ceyagmark`.
- Phone: `+94703727895`. Email: `growth@ceyagmark.com`.
