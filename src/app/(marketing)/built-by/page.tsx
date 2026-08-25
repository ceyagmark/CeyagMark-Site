import type { Metadata } from "next";
import Link from "next/link";

// Ported: the intro/marketing sections from built-by.html, verbatim. NOT
// ported: built-by.js's own 15-question "Website Plan" quiz engine — a
// second full quiz engine, materially different content from growth-audit's
// quiz (built-by's asks about an existing site the visitor already has, not
// their acquisition/conversion/retention maturity). Replicating it was out
// of budget for this session. Its CTA below deliberately routes into the
// real, working Growth Audit quiz instead of a dead or fabricated one — an
// honest simplification, logged as an open item in BUILD-NOTES rather than
// left as a silent gap or a 404 (this URL must exist per SEO parity).
export const metadata: Metadata = {
  title: "Get a Website Like That One: Free Website Plan | CeyagMark",
  description:
    "You clicked through from a site we built. Answer a few questions and get a custom Website Plan: what your site is missing, what to fix first, and what it would cost. Free, about three minutes.",
  alternates: { canonical: "/built-by" },
  openGraph: {
    title: "Get a Website Like That One | CeyagMark",
    description: "Get a custom Website Plan. What is missing, what to fix first, what it costs.",
    url: "/built-by",
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ceyagmark.com/" },
    { "@type": "ListItem", position: 2, name: "Get a website like that one", item: "https://ceyagmark.com/built-by" },
  ],
};

export default function BuiltByPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />

      <section className="hero" style={{ textAlign: "center", paddingBottom: "clamp(40px,6vw,72px)" }}>
        <div className="wrap narrow">
          <span className="eyebrow center reveal">Built by CeyagMark</span>
          <h1 className="reveal" style={{ marginTop: 20 }}>
            Your website looks fine. So why does nobody contact you through it?
          </h1>
          <p className="lede reveal" style={{ margin: "24px auto 0" }}>
            Answer a few questions to unlock your custom Website Plan and find out exactly what to do next.
          </p>
          <div className="hero-actions reveal" style={{ justifyContent: "center", marginTop: 32 }}>
            <Link className="btn btn-primary btn-lg btn-arrow" href="/quiz">
              Start the Quiz{" "}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <p className="dim reveal" style={{ fontSize: ".95rem", marginTop: 14 }}>
            It only takes 3 minutes. Completely free. Immediate custom recommendations.
          </p>
          <div className="bb-fud reveal">
            <span>No credit card</span>
            <span>Your answers are private</span>
            <span>No obligation to hire us</span>
          </div>
        </div>
      </section>

      <section className="section band toprule" style={{ paddingBlock: "clamp(48px,7vw,84px)" }}>
        <div className="wrap narrow center">
          <div className="section-head center reveal" style={{ marginBottom: 0 }}>
            <span className="eyebrow center">What the quiz checks</span>
            <h2>Take this quick assessment so we can diagnose and improve 3 key areas</h2>
          </div>
          <div className="bb-areas">
            <article className="bb-area reveal">
              <span className="n">01</span>
              <h3>Whether you can be found</h3>
              <p>If your site does not appear when someone searches your service plus your town, you are invisible to the buyers who are already looking for you.</p>
            </article>
            <article className="bb-area reveal">
              <span className="n">02</span>
              <h3>Whether it converts</h3>
              <p>Most sites lose people at one specific step. Until you know which one, more traffic just means more people leaving in the same place.</p>
            </article>
            <article className="bb-area reveal">
              <span className="n">03</span>
              <h3>Whether you can prove it</h3>
              <p>If you cannot see last month&apos;s visitors and where they went, every decision about the site is a guess dressed up as a plan.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingBlock: "clamp(48px,7vw,84px)" }}>
        <div className="wrap narrow">
          <div className="split" style={{ gap: 38, alignItems: "center" }}>
            <figure className="founder-card card glow-hover reveal" style={{ margin: 0 }}>
              <div className="founder-portrait">
                <img src="/img/founder.svg" alt="Shashika Tharinda, founder of CeyagMark" width={132} height={132} loading="lazy" />
              </div>
              <figcaption>
                <h3>Shashika Tharinda</h3>
                <p className="dim">Founder. Builds the sites and runs the marketing on them.</p>
                <div className="founder-tags">
                  <span>Web build</span>
                  <span>Paid media</span>
                  <span>CRO</span>
                  <span>SEO</span>
                </div>
              </figcaption>
            </figure>
            <div className="reveal">
              <p>You just came from a site we built, so you already know what the work looks like. What you cannot see from the outside is whether it earns anything.</p>
              <p className="mt-s">
                On the last booking site we built and marketed, <strong>17 percent of everyone who opened the booking page went on to book</strong>, measured in the booking database we built rather than a platform marking its own homework. Most websites never find out what their number is.
              </p>
              <p className="mt-s">
                <Link className="link-arrow" href="/case-ppi">
                  See how that was measured{" "}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section band" style={{ paddingBlock: "clamp(44px,6vw,72px)" }}>
        <div className="wrap narrow center reveal">
          <h2>Ready to see where yours stands?</h2>
          <div className="hero-actions" style={{ justifyContent: "center", marginTop: 26 }}>
            <Link className="btn btn-primary btn-lg btn-arrow" href="/quiz">
              Start the Quiz{" "}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <p className="dim" style={{ fontSize: ".95rem", marginTop: 14 }}>
            It only takes 3 minutes. Completely free. Immediate custom recommendations.
          </p>
        </div>
      </section>
    </>
  );
}
