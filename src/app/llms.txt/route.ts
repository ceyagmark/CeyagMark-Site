import { NextResponse } from "next/server";

// Ported from the live llms.txt with two corrections found while porting:
// (1) the live file quoted the free-audit price as "$199 USD / LKR 24,000",
//     which does not match free-audit.html's own copy or its JSON-LD Offer
//     (both say $99 / LKR 14,999), used the verified figure, not the stale
//     one; (2) the Booking & Operations System line updated since it now
//     also runs live on this site for consulting sessions, not only PPI.
const CONTENT = `# CeyagMark

> CeyagMark is an AI-powered performance marketing agency that also builds the websites it markets. It grows revenue, customer lifetime value (LTV) and conversion rate (CR) for its clients while reducing cost per acquisition (CPA). CeyagMark measures success in money: revenue, ROAS, LTV, CPA, not vanity metrics such as impressions or reach.

## What CeyagMark does

CeyagMark runs paid advertising, conversion rate optimization (CRO), retention/lifecycle marketing and web development as one accountable system. AI agents handle high-volume execution work (creative iteration, audience and keyword analysis, anomaly detection, reporting and testing) while senior human strategists own strategy and outcomes.

## Who CeyagMark is for

- Ecommerce brands
- Physical and digital product sellers
- Course creators and education brands
- Service businesses, including capacity-constrained operations (inspections, clinics, trades, accounting)

## The CeyagMark Method (four stages)

1. Diagnose. Audit the full funnel (acquisition, conversion, retention) to find where revenue leaks.
2. Model. Build the unit economics: target CPA, payback window and the LTV needed to scale profitably.
3. Deploy. AI agents launch and iterate creative, audiences and tests at high velocity under senior supervision.
4. Compound. Scale winners, kill losers fast, and recapture spend through retention so growth compounds.

## Named engagements (productized offers)

All scoped and priced on Services (https://ceyagmark.com/services), each linked to the case study that proves it.

- The Leak Report, from LKR 14,999 / $99: a scored audit of a site and funnel against a fixed rubric.
- The Fix Sprint, from LKR 30,000 / $199: ships the three fixes named in a Leak Report, then re-scores on the same rubric.
- Build & Run, from LKR 39,900 / $249 per month: the website and the marketing on it as one engagement.
- Consulting, LKR 3,000 / $20 per 30 minutes: one-to-one strategy or technical sessions, paid upfront, money-back guarantee. Bookable directly at https://ceyagmark.com/book.
- Booking & Operations System: online booking, capacity rules, an approval gate, SMS/email notifications and an admin dashboard. Runs live on this site for consulting bookings, and was built for and proven on Perth Pre-Purchase Inspection.

## Portfolio

- Perth Pre-Purchase Inspection (https://ceyagmark.com/case-ppi): 17% of everyone who opens the booking page confirms one, measured in the site's own booking database.
- AgrilHoTech (https://ceyagmark.com/case-agrilhotech): AI search visibility audit of CeyagMark's own WooCommerce store. Baseline 63/100, audited 2026-07-12.
- Motorbike parts store (https://ceyagmark.com/case-motorbike-parts): Baseline 38/100, audited 2026-06-04.
- Sportswear brand (https://ceyagmark.com/case-sportswear): ROAS 2 to 9 in 2.5 months, AOV up 177%. Conversion audit baseline 54/100.
- HNC Associates (accounting, Sri Lanka): $400 in ad spend turned into LKR 9M in revenue, FY 2024-25.

Full list at https://ceyagmark.com/portfolio.

## Engineering partner

AxionCore (https://www.axioncoretech.com/) is a separate software engineering company, founded by a long-standing business partner of CeyagMark's founder, delivered alongside as one team for work beyond a marketing site: native apps, data engineering, AI/ML, cloud infrastructure, DevOps and security.

## Get started

- Book a session (https://ceyagmark.com/book): Consulting sessions (30/60/90 minutes) and free discovery calls, bookable directly.
- Free Growth Audit (https://ceyagmark.com/growth-audit): A free assessment that produces a custom Growth Scorecard diagnosing acquisition, conversion and retention.
- Free Performance Audit (https://ceyagmark.com/free-audit): A full-stack e-commerce performance audit. Normally $99 USD / LKR 14,999; free for the first 3 founding brands in exchange for a named case study.
- Contact (https://ceyagmark.com/contact)
- Email: growth@ceyagmark.com
- WhatsApp: +94 70 372 7895
- Founder: Shashika Tharinda (5 years in performance marketing)

## Positioning

CeyagMark's tagline is "We don't sell marketing. We sell growth you can bank." It builds the site and runs the marketing on it as one accountable system, sold as named, fixed-scope engagements rather than an hourly rate.
`;

export function GET() {
  return new NextResponse(CONTENT, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
