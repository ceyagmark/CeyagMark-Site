import type { Metadata } from "next";
import Link from "next/link";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "How We Work: The CeyagMark Method for Web and Marketing | CeyagMark",
  description:
    "The CeyagMark method. Diagnose, Model, Deploy, Compound. How AI agents and senior strategists combine to grow revenue, LTV and conversion rate while lowering CPA.",
  alternates: { canonical: "/approach" },
  openGraph: {
    images: OG_IMAGE,
    title: "The CeyagMark Method",
    description: "A lean machine that works like a forty person agency. Diagnose, Model, Deploy, Compound.",
    url: "/approach",
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ceyagmark.com/" },
    { "@type": "ListItem", position: 2, name: "Approach", item: "https://ceyagmark.com/approach" },
  ],
};

const HOWTO_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "The CeyagMark Method",
  description: "How CeyagMark grows revenue, LTV and conversion rate while lowering CPA.",
  step: [
    { "@type": "HowToStep", position: 1, name: "Diagnose", text: "Audit the full funnel across acquisition, conversion and retention to locate where revenue leaks." },
    { "@type": "HowToStep", position: 2, name: "Model", text: "Build the unit economics. Target CPA, payback window and the lifetime value required to scale profitably." },
    { "@type": "HowToStep", position: 3, name: "Deploy", text: "AI agents launch and iterate creative, audiences and tests at high velocity under senior supervision." },
    { "@type": "HowToStep", position: 4, name: "Compound", text: "Scale winners, kill losers fast, and recapture spend through retention so growth compounds." },
  ],
};

const CHECK = (
  <span className="ck" aria-hidden="true">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

export default function ApproachPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_JSON_LD) }} />

      <section className="page-hero">
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> &nbsp;&rsaquo;&nbsp; Approach
          </nav>
          <span className="eyebrow reveal">The CeyagMark method</span>
          <h1 className="reveal">The output of a forty person agency. The focus of one senior expert.</h1>
          <p className="lede reveal">
            We rebuilt the agency around one idea. Let AI do the heavy lifting, and let senior judgement own the
            outcome. Here is exactly how that works, and why it makes us faster, leaner and more accountable than a
            traditional team.
          </p>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">The operating system</span>
            <h2>Four stages. Every engagement. Every dollar accounted for.</h2>
          </div>
          <div className="grid cols-2" style={{ gap: 24 }}>
            <div className="step reveal">
              <div className="n tnum">01</div>
              <h3>Diagnose</h3>
              <p>Before a dollar moves, we audit the whole funnel: acquisition, conversion and retention. Then we show you where the revenue leaks out. Most businesses lose it somewhere they never thought to look.</p>
            </div>
            <div className="step reveal">
              <div className="n tnum">02</div>
              <h3>Model</h3>
              <p>We work out the numbers first. Target CPA, how long until you make the money back, and the lifetime value you need to grow profitably. We know what good looks like in money before we start.</p>
            </div>
            <div className="step reveal">
              <div className="n tnum">03</div>
              <h3>Deploy</h3>
              <p>AI agents build, launch and refine creative, audiences and tests far faster than a manual team can. A strategist watches every move and owns the result.</p>
            </div>
            <div className="step reveal">
              <div className="n tnum">04</div>
              <h3>Compound</h3>
              <p>Winners get more budget. Losers get cut early. Retention wins back spend. Each round pushes CPA down and lifetime value up, so growth stops being a gamble.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div className="reveal">
            <span className="eyebrow">Where AI ends and judgement begins</span>
            <h2 style={{ marginTop: 16 }}>AI does the volume. Humans make the call.</h2>
            <p className="mt-s">
              The mistake most AI agencies make is letting the machine decide. We do not. AI compresses a month of
              grunt work into days. Strategy, taste and the decision on where your money goes stays with a senior
              human.
            </p>
            <ul className="feature-list">
              <li>
                {CHECK}
                <span>AI handles creative iteration, audience and keyword analysis, anomaly detection, reporting and test setup.</span>
              </li>
              <li>
                {CHECK}
                <span>Humans own strategy, offer design, budget decisions, brand judgement, and the relationship.</span>
              </li>
            </ul>
          </div>
          <div className="reveal">
            <div className="card glow-hover" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <div style={{ padding: 30, borderRight: "1px solid var(--border)" }}>
                  <div className="pill" style={{ marginBottom: 16 }}>
                    AI agents
                  </div>
                  <ul style={{ display: "grid", gap: 12, fontSize: ".92rem", color: "var(--text-soft)" }}>
                    <li>High volume creative testing</li>
                    <li>Continuous spend monitoring</li>
                    <li>Daily anomaly flags</li>
                    <li>Real time reporting</li>
                  </ul>
                </div>
                <div style={{ padding: 30, background: "var(--surface-2)" }}>
                  <div className="pill" style={{ marginBottom: 16 }}>
                    Senior strategist
                  </div>
                  <ul style={{ display: "grid", gap: 12, fontSize: ".92rem", color: "var(--text-soft)" }}>
                    <li>Growth strategy and offers</li>
                    <li>Budget and channel calls</li>
                    <li>Brand and creative direction</li>
                    <li>You, one point of contact</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <div className="section-head center reveal">
            <span className="eyebrow center">What we believe</span>
            <h2>Principles we will not bend on</h2>
          </div>
          <div className="grid cols-3">
            <article className="card glow-hover reveal">
              <h3>Money over metrics</h3>
              <p>If a number does not connect to revenue, profit or lifetime value, it stays out of the report. No dashboards built to look busy.</p>
            </article>
            <article className="card glow-hover reveal">
              <h3>Proof over promises</h3>
              <p>We diagnose before we pitch. You see where you stand and what it is worth before any commitment.</p>
            </article>
            <article className="card glow-hover reveal">
              <h3>Speed over ceremony</h3>
              <p>No status theatre. AI removes the busywork so the team spends time on decisions, not decks.</p>
            </article>
            <article className="card glow-hover reveal">
              <h3>Focus over sprawl</h3>
              <p>We take on fewer clients and go deeper. Lean by design means your account never gets buried.</p>
            </article>
            <article className="card glow-hover reveal">
              <h3>Transparency by default</h3>
              <p>A live dashboard you can open any day. No black boxes, no trust us, no surprises.</p>
            </article>
            <article className="card glow-hover reveal">
              <h3>Aligned, not billable</h3>
              <p>Engagements are built around your outcomes, not how many hours we can log against you.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="cta-band reveal">
            <h2>See the method applied to your business.</h2>
            <p>The Growth Audit is stage one of the method, free. We diagnose your funnel and show you the model before you commit to anything.</p>
            <div className="hero-actions" style={{ marginTop: 32 }}>
              <Link className="btn btn-primary btn-lg btn-arrow" href="/growth-audit">
                Start the Growth Audit{" "}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/portfolio">
                See the case studies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
