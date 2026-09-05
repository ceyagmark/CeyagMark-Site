import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioGrid } from "./portfolio-grid";
import { CapabilityMatrix } from "./capability-matrix";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Portfolio: Website and Digital Marketing Case Studies, Sri Lanka | CeyagMark",
  description:
    "Real case studies from a Sri Lankan web and marketing agency. Booking funnels, WooCommerce stores, AI search visibility and paid acquisition, every number stating how it was measured.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    images: OG_IMAGE,
    title: "CeyagMark Portfolio",
    description: "We build the thing and we fill it. Case studies with the numbers and the method behind them.",
    url: "/portfolio",
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ceyagmark.com/" },
    { "@type": "ListItem", position: 2, name: "Portfolio", item: "https://ceyagmark.com/portfolio" },
  ],
};

const COLLECTION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "CeyagMark Portfolio",
  description: "Case studies from an agency that builds websites and runs the marketing on them.",
  url: "https://ceyagmark.com/portfolio",
  hasPart: [
    { "@type": "CreativeWork", name: "Perth Pre-Purchase Inspection: booking funnel", url: "https://ceyagmark.com/case-ppi" },
    { "@type": "CreativeWork", name: "AgrilHoTech: AI search visibility", url: "https://ceyagmark.com/case-agrilhotech" },
    { "@type": "CreativeWork", name: "Motorbike parts store: conversion audit", url: "https://ceyagmark.com/case-motorbike-parts" },
    { "@type": "CreativeWork", name: "Sportswear brand: paid acquisition rebuild", url: "https://ceyagmark.com/case-sportswear" },
  ],
};

export default function PortfolioPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(COLLECTION_JSON_LD) }} />

      <section className="page-hero">
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> &nbsp;&rsaquo;&nbsp; Portfolio
          </nav>
          <span className="eyebrow reveal">Portfolio</span>
          <h1 className="reveal">We build the thing, then we fill it.</h1>
          <p className="lede reveal">
            Most agencies do one half. A development studio hands you a site and walks away from whether anyone
            converts on it. A marketing agency buys traffic and sends it into a page they are not allowed to change.
            We do both, which means when the numbers move we know exactly what moved them, and when they do not, we
            can go and fix the actual cause. Below is the work, with every number stating how it was measured.
          </p>
        </div>
      </section>

      <section className="stat-strip" style={{ paddingBlock: 0 }}>
        <div className="wrap">
          <div className="grid cols-4">
            <div className="stat reveal">
              <div className="num tnum">15</div>
              <div className="lbl">Projects across web and marketing</div>
            </div>
            <div className="stat reveal">
              <div className="num tnum">17%</div>
              <div className="lbl">Page-open to booking on a build we also market</div>
            </div>
            <div className="stat reveal">
              <div className="num tnum">6</div>
              <div className="lbl">Disciplines under one roof</div>
            </div>
            <div className="stat reveal">
              <div className="num tnum">5</div>
              <div className="lbl">Years running paid, SEO and CRO</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">Why this matters</span>
            <h2>The gap between the two agencies is where your money goes</h2>
            <p>Every business that has hired both separately knows this feeling. Something is not converting, and the two suppliers each explain why it is the other one&apos;s problem.</p>
          </div>
          <div className="thesis-grid">
            <article className="thesis-card reveal">
              <span className="t-tag">The development studio</span>
              <h3>Ships a site, then stops</h3>
              <p>
                The build is judged on whether it looks right and loads fast. Nobody on that team ever opens the ad
                account, so nobody notices that the highest-intent traffic is landing on a page that answers a
                different question. The site is finished. It is just not earning.
              </p>
            </article>
            <article className="thesis-card reveal">
              <span className="t-tag">The marketing agency</span>
              <h3>Buys traffic into a page it cannot touch</h3>
              <p>
                They can see the drop-off and they can write the recommendation. They cannot deploy it. So the fix
                waits in a ticket queue while the budget keeps running, and the monthly report explains the same leak
                it explained last month.
              </p>
            </article>
            <article className="thesis-card is-us reveal">
              <span className="t-tag">One team, both halves</span>
              <h3>The fix ships the same week it is found</h3>
              <p>
                We read the funnel, we change the page, and we watch what the change did. There is no handover, so
                there is nobody to blame, which is the point. Every case below has a section naming the exact moment
                the two halves met, because that moment is the whole argument.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section band toprule">
        <div className="wrap">
          <CapabilityMatrix />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">Case studies</span>
            <h2>The work, with the numbers and where they came from</h2>
            <p>
              Every figure here says how it was measured. Where a project has no number yet, it says that too, and
              shows the build instead. Filter by the discipline you care about.
            </p>
          </div>

          <PortfolioGrid />

          <div className="honesty reveal">
            <h3>How to read this page</h3>
            <p>
              Marketing results are shown by industry rather than by client name, because those numbers came out of
              accounts we do not own. Websites are named, because a live site you can open and inspect is a stronger
              proof than anything we could write about it.
            </p>
            <ul>
              <li>Every number says how it was measured. If a figure cannot state its basis, it is marked rather than dressed up.</li>
              <li>Projects without a result yet are shown as builds, not padded with estimates. There are no illustrative figures anywhere on this page.</li>
              <li>Starting scores are published alongside finishing ones. A baseline you can check is worth more than a result you cannot.</li>
              <li>Some results were delivered by our founder during agency roles before CeyagMark was founded.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="cta-band reveal">
            <h2>Find out which half is costing you</h2>
            <p>
              The Growth Audit takes about three minutes and tells you whether your problem is the traffic, the
              site, or the gap between them. No call required to get the answer. If you already know what you need,
              every engagement above is scoped and priced on the services page.
            </p>
            <div className="hero-actions" style={{ marginTop: 32 }}>
              <Link className="btn btn-primary btn-lg btn-arrow" href="/growth-audit">
                Get your free Growth Audit{" "}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/services">
                See what these engagements cost
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
