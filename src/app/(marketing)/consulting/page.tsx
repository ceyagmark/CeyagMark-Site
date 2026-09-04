import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Marketing Consulting Sri Lanka, LKR 3,000 per 30 Minutes | CeyagMark",
  description:
    "Book a one to one strategy or technical consulting session with CeyagMark. For in-house marketing teams and marketing professionals who want senior guidance on paid, CRO, retention, tracking, GTM and AI workflows.",
  alternates: { canonical: "/consulting" },
  openGraph: {
    title: "Strategy and Technical Consulting | CeyagMark",
    description: "Book a one to one consulting session for in-house teams and marketing professionals.",
    url: "/consulting",
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ceyagmark.com/" },
    { "@type": "ListItem", position: 2, name: "Consulting", item: "https://ceyagmark.com/consulting" },
  ],
};

const SERVICE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Strategy and Technical Marketing Consulting",
  serviceType: "Marketing Consulting",
  description:
    "One to one performance marketing strategy and technical consulting for in-house teams and marketing professionals, covering paid acquisition, CRO, retention, analytics, tracking, GTM and AI workflows.",
  provider: { "@id": "https://ceyagmark.com/#organization" },
  areaServed: "Worldwide",
  audience: { "@type": "Audience", audienceType: "In-house marketing teams and marketing professionals" },
};

export default function ConsultingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSON_LD) }} />

      <section className="page-hero">
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> &nbsp;&rsaquo;&nbsp; Consulting
          </nav>
          <span className="eyebrow reveal">Strategy and technical consulting</span>
          <h1 className="reveal">Borrow a senior performance brain by the session.</h1>
          <p className="lede reveal">
            Not everyone needs an agency. If you run marketing in-house, or you are a marketing professional who
            wants a sharper second opinion, book a focused one to one session. You bring the situation. You leave
            with a clear plan backed by data and the exact technical steps to run it.
          </p>
          <div className="hero-actions reveal">
            <a className="btn btn-primary btn-lg btn-arrow" href="#book">
              Book a session{" "}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a className="btn btn-ghost btn-lg" href="#how">
              How it works
            </a>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <div className="section-head center reveal">
            <span className="eyebrow center">Who books these</span>
            <h2>Two kinds of people get the most from this</h2>
          </div>
          <div className="grid cols-2">
            <article className="card glow-hover reveal">
              <div className="ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Brands running marketing in-house</h3>
              <p>
                You have a team, or you are the team, and you do not want to outsource. You need senior direction.
                Get an expert review of your strategy, funnel and numbers, and a prioritised plan your people can
                run.
              </p>
            </article>
            <article className="card glow-hover reveal">
              <div className="ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 14a4 4 0 100-8 4 4 0 000 8zM6 21v-1a4 4 0 014-4h4a4 4 0 014 4v1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Marketers whose job is on the line</h3>
              <p>
                You are the one explaining the ROAS drop to an employer or a client, and you need a second, expert
                opinion before that conversation, not after. Consultants, freelancers, in-house marketers and small
                agencies bring us the tracking that will not reconcile, the account that will not scale, or the
                client call they are dreading. Confidential, peer to peer, no judgement.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">What we cover</span>
            <h2>Strategy, or deep technical. Your call.</h2>
            <p>Bring any problem from across your marketing. Most sessions focus on one of these.</p>
          </div>
          <div className="grid cols-3">
            <article className="card glow-hover reveal">
              <h3>Growth strategy</h3>
              <p>Acquisition, conversion and retention strategy, offer design, budget allocation, target CPA and LTV modelling, and a 90 day roadmap.</p>
            </article>
            <article className="card glow-hover reveal">
              <h3>Paid media review</h3>
              <p>An account audit across Meta, Google and TikTok. Structure, creative testing, bidding and scaling decisions.</p>
            </article>
            <article className="card glow-hover reveal">
              <h3>Tracking and analytics</h3>
              <p>GA4, Google Tag Manager, server side tracking, conversion attribution, pixel setup and data you can trust.</p>
            </article>
            <article className="card glow-hover reveal">
              <h3>CRO and funnels</h3>
              <p>Landing pages, checkout, quiz funnels and experiment roadmaps. Where to test and what to change first.</p>
            </article>
            <article className="card glow-hover reveal">
              <h3>Retention and lifecycle</h3>
              <p>Email and SMS flow architecture, segmentation and lifetime value strategy across Klaviyo, Omnisend, Mailchimp and more.</p>
            </article>
            <article className="card glow-hover reveal">
              <h3>AI and automation</h3>
              <p>How to put AI to work in your marketing. Creative, reporting, analysis and automation that actually saves time.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">Session formats</span>
            <h2>Pick the depth you need</h2>
            <p>Every session ends with written next steps, so you are never left with notes you cannot act on.</p>
          </div>
          <div className="grid cols-3">
            <article className="card glow-hover reveal">
              <div className="meta" style={{ margin: "0 0 14px", border: "none", padding: 0 }}>
                Most popular
              </div>
              <h3>Strategy Session</h3>
              <p>A focused sixty minute call on one priority, with a clear action plan to follow.</p>
              <p className="dim mt-s" style={{ fontSize: ".9rem" }}>
                <strong>60 minutes</strong> live plus written recap
              </p>
              <p className="mt-s" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "1.1rem" }}>
                LKR 6,000 <span className="dim" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: ".85rem" }}>/ $40</span>
              </p>
              <p className="mt-s">
                <Link href="/book?session=consulting-60" style={{ color: "var(--brand-glow)", fontWeight: 600, fontSize: ".9rem" }}>
                  Check times and book &rarr;
                </Link>
              </p>
            </article>
            <article className="card glow-hover reveal">
              <div className="meta" style={{ margin: "0 0 14px", border: "none", padding: 0 }}>
                Deep dive
              </div>
              <h3>Technical Deep Dive</h3>
              <p>A ninety minute working session for tracking, GTM, attribution or automation. We get into the actual setup, not theory.</p>
              <p className="dim mt-s" style={{ fontSize: ".9rem" }}>
                <strong>90 minutes</strong> screen share plus recap
              </p>
              <p className="mt-s" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "1.1rem" }}>
                LKR 9,000 <span className="dim" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: ".85rem" }}>/ $60</span>
              </p>
              <p className="mt-s">
                <Link href="/book?session=consulting-90" style={{ color: "var(--brand-glow)", fontWeight: 600, fontSize: ".9rem" }}>
                  Check times and book &rarr;
                </Link>
              </p>
            </article>
            <article className="card glow-hover reveal">
              <div className="meta" style={{ margin: "0 0 14px", border: "none", padding: 0 }}>
                Ongoing
              </div>
              <h3>Advisory Retainer</h3>
              <p>A standing slot each month plus async access, for teams and pros who want a senior advisor on call.</p>
              <p className="dim mt-s" style={{ fontSize: ".9rem" }}>
                <strong>Monthly</strong> call plus async support
              </p>
              <p className="mt-s" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "1.1rem" }}>
                Custom, on enquiry
              </p>
              <p className="mt-s">
                <a
                  href="https://wa.me/94703727895?text=Hi%20CeyagMark%2C%20I%20would%20like%20to%20talk%20about%20the%20Advisory%20Retainer."
                  target="_blank"
                  rel="noopener"
                  style={{ color: "var(--brand-glow)", fontWeight: 600, fontSize: ".9rem" }}
                >
                  Ask about this via WhatsApp &rarr;
                </a>
              </p>
            </article>
          </div>
          <p className="dim center" style={{ marginTop: 32, fontSize: ".92rem" }}>
            Session rate is LKR 3,000 / $20 per 30 minutes, billed at that rate for the length booked. Payment is
            upfront; if the session was not worth it, tell us and we refund it, no argument.
          </p>
          <p className="center" style={{ marginTop: 14, fontSize: ".92rem" }}>
            Also available: <strong>team training and workshops</strong> for marketing teams who want the whole
            group up to speed at once. Scope and pricing depend on team size and topic.{" "}
            <Link href="/contact?intent=team-training" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
              Ask us about a session for your team
            </Link>
            .
          </p>
          <p className="center dim" style={{ marginTop: 14, fontSize: ".92rem" }}>
            Looking for done-for-you work instead of advice? The{" "}
            <Link href="/services#engagements" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
              engagement ladder
            </Link>{" "}
            is scoped and priced.
          </p>
        </div>
      </section>

      <section className="section" id="book">
        <div className="wrap narrow">
          <div className="section-head center reveal">
            <span className="eyebrow center">Book your session</span>
            <h2>Pick a time yourself, or message us</h2>
            <p>Book straight into the calendar below, or WhatsApp us if you would rather talk it through first. We reply on WhatsApp, usually within a few hours.</p>
          </div>
          <div className="glass reveal" style={{ padding: "48px 20px" }}>
            <div className="center">
              <div className="hero-actions" style={{ justifyContent: "center" }}>
                <Link className="btn btn-primary btn-lg" href="/book">
                  Book a session now
                </Link>
                <a
                  className="btn btn-ghost btn-lg"
                  href="https://wa.me/94703727895?text=Hi%20CeyagMark%2C%20I%20would%20like%20to%20book%20a%20consulting%20session."
                  target="_blank"
                  rel="noopener"
                >
                  Ask on WhatsApp first
                </a>
              </div>
            </div>
          </div>
          <p className="center dim" style={{ fontSize: ".9rem", marginTop: 22 }}>
            Questions before booking?{" "}
            <a href="https://wa.me/94703727895" target="_blank" rel="noopener" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
              WhatsApp +94 70 372 7895
            </a>{" "}
            or email{" "}
            <a href="mailto:growth@ceyagmark.com" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
              growth@ceyagmark.com
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
