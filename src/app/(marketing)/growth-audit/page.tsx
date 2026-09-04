import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Website & Marketing Audit, Sri Lanka | CeyagMark Growth Audit",
  description:
    "Take the free CeyagMark Growth Audit. Get a custom Growth Scorecard that diagnoses your acquisition, conversion and retention, and shows the highest value fix first.",
  alternates: { canonical: "/growth-audit" },
  openGraph: {
    title: "Free Growth Audit | CeyagMark",
    description: "About three minutes, a custom Growth Scorecard, and the one fix that moves your numbers most.",
    url: "/growth-audit",
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ceyagmark.com/" },
    { "@type": "ListItem", position: 2, name: "Growth Audit", item: "https://ceyagmark.com/growth-audit" },
  ],
};

const CHECK = (
  <span className="ck" aria-hidden="true">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

export default function GrowthAuditPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />

      <section className="hero" id="start">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow reveal">Free Growth Scorecard, about three minutes</span>
            <h1 className="reveal">
              Your ad costs keep climbing even though you are doing everything <span className="display-grad">right.</span>
            </h1>
            <p className="lede reveal">
              Answer fifteen quick questions to unlock your custom Growth Scorecard and find out exactly where your
              revenue is leaking, and what to do about it next.
            </p>

            <div className="glass reveal" style={{ marginTop: 30, padding: 26 }}>
              <p style={{ color: "var(--text)", fontWeight: 600, margin: "0 0 16px" }}>
                Take this quick assessment so we can diagnose and improve three key areas.
              </p>
              <ul className="feature-list" style={{ marginTop: 0 }}>
                <li>
                  {CHECK}
                  <span>
                    <strong>Acquisition efficiency.</strong> Is your CPA and ROAS where it should be, or quietly
                    eating your margin?
                  </span>
                </li>
                <li>
                  {CHECK}
                  <span>
                    <strong>Conversion.</strong> How much of the traffic you pay for actually becomes a customer?
                  </span>
                </li>
                <li>
                  {CHECK}
                  <span>
                    <strong>Retention and lifetime value.</strong> Are buyers coming back, or are you renting
                    customers once and losing them?
                  </span>
                </li>
              </ul>
            </div>

            <div className="hero-actions reveal" style={{ marginTop: 30 }}>
              <Link className="btn btn-primary btn-lg btn-arrow" href="/quiz">
                Start the quiz{" "}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <p className="reveal" style={{ fontSize: ".95rem", color: "var(--text-soft)", marginTop: 14 }}>
              It takes about three minutes. Completely free. Immediate custom recommendations.
            </p>
            <div className="hero-trust reveal" style={{ marginTop: 14 }}>
              <span>
                <i className="dot" /> No credit card
              </span>
              <span>
                <i className="dot" /> Your results are private
              </span>
              <span>
                <i className="dot" /> No obligation
              </span>
            </div>
          </div>

          <div className="reveal">
            <div className="glass metric-panel glow-hover">
              <div className="mp-head">
                <span>The Growth Scorecard</span>
                <span className="mp-live">
                  <i /> Custom
                </span>
              </div>
              <div style={{ marginTop: 24, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "3.4rem", lineHeight: 1 }} className="display-grad">
                  B+
                </div>
                <div className="dim" style={{ fontSize: ".76rem", letterSpacing: ".12em", textTransform: "uppercase", marginTop: 8 }}>
                  Example grade
                </div>
              </div>
              <div className="mp-rows" style={{ marginTop: 22 }}>
                <div className="mp-row">
                  <span className="k">Acquisition</span>
                  <span className="v tnum" style={{ fontSize: "1.3rem", color: "var(--good)" }}>
                    Strong
                  </span>
                </div>
                <div className="mp-row">
                  <span className="k">Conversion</span>
                  <span className="v tnum" style={{ fontSize: "1.3rem", color: "var(--warn)" }}>
                    Needs work
                  </span>
                </div>
                <div className="mp-row">
                  <span className="k">Retention and LTV</span>
                  <span className="v tnum" style={{ fontSize: "1.3rem", color: "var(--bad)" }}>
                    Leaking
                  </span>
                </div>
              </div>
            </div>
            <div className="card reveal" style={{ marginTop: 18, display: "flex", gap: 16, alignItems: "center" }}>
              <img
                src="/img/founder.svg"
                alt="Shashika Tharinda, founder of CeyagMark"
                width={60}
                height={60}
                loading="lazy"
                style={{ flex: "none", width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <p style={{ fontSize: ".92rem", color: "var(--text)", margin: 0 }}>
                  <strong>Shashika Tharinda, founder of CeyagMark.</strong> 5 years building and scaling performance
                  marketing for ecommerce and growing brands.
                </p>
              </div>
            </div>
            <p className="dim reveal" style={{ fontSize: ".92rem", marginTop: 14, textAlign: "center" }}>
              <strong style={{ color: "var(--brand-glow)" }}>73 percent of growing businesses</strong> lose money to
              at least one hidden funnel leak. Here is where you stand.
            </p>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <div className="section-head center reveal">
            <span className="eyebrow center">What you get</span>
            <h2>A diagnosis, not a sales pitch</h2>
            <p>We show you exactly where you stand before we ever talk about working together.</p>
          </div>
          <div className="grid cols-3">
            <div className="step reveal">
              <div className="n tnum">01</div>
              <h3>Answer fifteen questions</h3>
              <p>Sharp, specific questions about how you acquire, convert and keep customers. About three minutes, no fluff.</p>
            </div>
            <div className="step reveal">
              <div className="n tnum">02</div>
              <h3>Get your scorecard</h3>
              <p>An instant grade across all three growth levers, with your single biggest leak named.</p>
            </div>
            <div className="step reveal">
              <div className="n tnum">03</div>
              <h3>See your next move</h3>
              <p>Specific recommendations backed by your answers, and the option to book a strategy call if you want help.</p>
            </div>
          </div>
          <div className="center reveal" style={{ marginTop: 44 }}>
            <Link className="btn btn-primary btn-lg btn-arrow" href="/quiz">
              Start the quiz{" "}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <p style={{ fontSize: ".95rem", color: "var(--text-soft)", marginTop: 12 }}>
              It takes about three minutes. Completely free. Immediate custom recommendations.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
