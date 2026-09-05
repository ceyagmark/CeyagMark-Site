import type { Metadata } from "next";
import Link from "next/link";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Web Design & Digital Marketing Services and Pricing, Sri Lanka | CeyagMark",
  description:
    "Website and digital marketing services in Sri Lanka with scope and price stated upfront. Website audits from LKR 14,999, fix sprints from LKR 30,000, and full build plus marketing from LKR 39,900 a month.",
  alternates: { canonical: "/services" },
  openGraph: {
    images: OG_IMAGE,
    title: "CeyagMark Services and Pricing",
    description: "Named engagements with a defined scope and a stated price, each linked to the case study that proves it.",
    url: "/services",
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ceyagmark.com/" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://ceyagmark.com/services" },
  ],
};

const SERVICES_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "CeyagMark Engagements",
  itemListElement: [
    {
      "@type": "Service",
      position: 1,
      name: "The Leak Report",
      serviceType: "Website and Funnel Audit",
      description:
        "A scored audit of a site and funnel against the same checklist every time, delivered as a score out of 100, a score for each area, marked-up screenshots and the three fixes that would lift it fastest.",
      provider: { "@id": "https://ceyagmark.com/#organization" },
      offers: { "@type": "Offer", price: "14999", priceCurrency: "LKR" },
    },
    {
      "@type": "Service",
      position: 2,
      name: "The Fix Sprint",
      serviceType: "Conversion Rate Optimization",
      description: "Builds the three fixes named in a Leak Report on a fixed price and fixed dates, then scores the site again on the same checklist.",
      provider: { "@id": "https://ceyagmark.com/#organization" },
      offers: { "@type": "Offer", price: "30000", priceCurrency: "LKR" },
    },
    {
      "@type": "Service",
      position: 3,
      name: "Build and Run",
      serviceType: "Web Development and Performance Marketing",
      description: "The website and the marketing on it as one engagement, instrumented from day one.",
      provider: { "@id": "https://ceyagmark.com/#organization" },
      offers: { "@type": "Offer", price: "39900", priceCurrency: "LKR" },
    },
    {
      "@type": "Service",
      position: 4,
      name: "Consulting",
      serviceType: "Marketing Consulting",
      description: "One to one strategy or technical sessions, paid upfront with a money-back guarantee.",
      provider: { "@id": "https://ceyagmark.com/#organization" },
      offers: { "@type": "Offer", price: "3000", priceCurrency: "LKR" },
    },
    {
      "@type": "Service",
      position: 5,
      name: "Booking and Operations System",
      serviceType: "Custom Software",
      description: "Online booking, capacity rules, an approval gate, SMS and email notifications with delivery logging, an admin dashboard and funnel reporting.",
      provider: { "@id": "https://ceyagmark.com/#organization" },
    },
  ],
};

const CHECK = (
  <span className="ck" aria-hidden="true">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_JSON_LD) }} />

      <section className="page-hero">
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> &nbsp;&rsaquo;&nbsp; Services
          </nav>
          <span className="eyebrow reveal">Services and pricing</span>
          <h1 className="reveal">Named engagements, not an hourly rate.</h1>
          <p className="lede reveal">
            Every engagement below has a defined scope, a stated price, and a link to the case study that proves we
            have done it before. You can check the claim before you book anything, which is the whole point of
            publishing them this way.
          </p>
          <div className="hero-actions reveal">
            <Link className="btn btn-primary btn-lg btn-arrow" href="/growth-audit">
              Not sure where to start? Take the free audit{" "}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="section band toprule" id="engagements">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">The ladder</span>
            <h2>Diagnose, fix, then run it</h2>
            <p>Most clients start at the top and move down as the numbers justify it. You are not obliged to. Each step stands on its own.</p>
          </div>
          <div className="grid cols-4 ladder-grid">
            <article className="card glow-hover reveal" id="leak-report">
              <span className="ladder-step"><b>01</b> Diagnose</span>
              <h3>The Leak Report</h3>
              <p>
                We score your site and funnel out of 100, using the same checklist every time. You get the
                score, a score for each area, marked-up screenshots of what we found, and the three fixes that
                would lift it fastest. Run it again later and you see what moved, not a new opinion.
              </p>
              <p className="mt-s" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "1.1rem" }}>
                from LKR 14,999 <span className="dim" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: ".85rem" }}>from $99</span>
              </p>
              <p className="dim" style={{ fontSize: ".85rem", marginTop: 10 }}>
                Proof: <Link href="/case-motorbike-parts">a store scored 38/100</Link> &middot;{" "}
                <Link href="/case-agrilhotech">our own store scored 63/100</Link>
              </p>
            </article>
            <article className="card glow-hover reveal" id="fix-sprint">
              <span className="ladder-step"><b>02</b> Fix</span>
              <h3>The Fix Sprint</h3>
              <p>
                We build the three fixes your Leak Report named. Fixed price, fixed dates. Then we score the
                site again on the same checklist, so the before and after are measured the same way. The
                shortlist sets the work, so it cannot quietly grow.
              </p>
              <p className="mt-s" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "1.1rem" }}>
                from LKR 30,000 <span className="dim" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: ".85rem" }}>from $199</span>
              </p>
              <p className="dim" style={{ fontSize: ".85rem", marginTop: 10 }}>Scoped from your Leak Report, so you know what you are buying before you buy it.</p>
            </article>
            <article className="card glow-hover reveal" id="build-and-run">
              <span className="ladder-step"><b>03</b> Build &amp; run</span>
              <h3>Build &amp; Run</h3>
              <p>
                The site and the marketing on it, as one job. We set up the tracking on day one, so your numbers
                come straight from the system we built. Nothing is guessed from a tag bolted on later. This one
                only works because both halves are ours.
              </p>
              <p className="mt-s" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "1.1rem" }}>
                from LKR 39,900 /mo <span className="dim" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: ".85rem" }}>from $249 /mo</span>
              </p>
              <p className="dim" style={{ fontSize: ".85rem", marginTop: 10 }}>
                Proof: <Link href="/case-ppi">a booking funnel converting 17%</Link> &middot;{" "}
                <Link href="/case-agrilhotech">AgrilHoTech</Link>
              </p>
            </article>
            <article className="card glow-hover reveal" id="consulting-offer">
              <span className="ladder-step" data-step="any"><b>·</b> Any time</span>
              <h3>Consulting</h3>
              <p>
                A one to one session, strategy or technical. For brands running marketing in-house, and for
                marketers who want a sharper second opinion before a hard conversation with a client or a boss,
                not after it.
              </p>
              <p className="mt-s" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "1.1rem" }}>
                LKR 3,000 <span className="dim" style={{ fontFamily: "var(--font-inter)", fontWeight: 500, fontSize: ".85rem" }}>$20 per 30 min</span>
              </p>
              <p className="dim" style={{ fontSize: ".85rem", marginTop: 10 }}>
                Paid upfront, money-back if it was not worth it. <Link href="/consulting">Book a session</Link>
              </p>
            </article>
          </div>

          <div className="glass reveal" style={{ marginTop: 24, padding: 30 }} id="booking-system">
            <span className="pill">Booking &amp; Operations System</span>
            <div className="grid cols-3" style={{ marginTop: 18, gap: 12 }}>
              <span className="dim" style={{ fontSize: ".9rem" }}>Online booking</span>
              <span className="dim" style={{ fontSize: ".9rem" }}>Capacity rules</span>
              <span className="dim" style={{ fontSize: ".9rem" }}>Approval gate</span>
              <span className="dim" style={{ fontSize: ".9rem" }}>SMS &amp; email with delivery logging</span>
              <span className="dim" style={{ fontSize: ".9rem" }}>Admin dashboard</span>
              <span className="dim" style={{ fontSize: ".9rem" }}>Funnel reporting</span>
            </div>
            <p className="mt-s" style={{ fontSize: ".9rem" }}>
              Built for a vehicle inspection business and proven on{" "}
              <Link href="/case-ppi" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
                their real numbers
              </Link>
              . Deployed once so far, for one client, in one country, so we are not putting a shelf price on it until
              a second deployment shows what is genuinely reusable. If you run a capacity-constrained service
              business (inspections, clinics, trades, salons, tutoring, equipment hire),{" "}
              <Link href="/contact?intent=booking-system" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
                talk to us about scope
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">What is inside them</span>
            <h2>What the work is made of</h2>
            <p>
              These are not separate products with separate bills. They are the parts a Fix Sprint or a Build &amp;
              Run is built from, mixed to match where your money is leaking.
            </p>
          </div>
        </div>
      </section>

      <section className="section band" id="acquisition">
        <div className="wrap split">
          <div className="reveal">
            <span className="pill">Paid acquisition</span>
            <h2 style={{ marginTop: 18 }}>Paid Acquisition</h2>
            <p className="mt-s">
              Profitable demand from Meta, Google, TikTok and marketplaces, built around a target cost per
              acquisition rather than a spend target. We scale what pays back and kill what does not, fast.
            </p>
            <ul className="feature-list">
              <li>
                {CHECK}
                <span>Full funnel paid search, paid social and marketplace campaigns</span>
              </li>
              <li>
                {CHECK}
                <span>High velocity creative testing, hundreds of variants a month</span>
              </li>
              <li>
                {CHECK}
                <span>Profit based bidding and budget allocation across channels</span>
              </li>
            </ul>
          </div>
          <div className="reveal">
            <div className="glass metric-panel glow-hover">
              <div className="mp-head">
                <span>Measured on real accounts</span>
              </div>
              <div className="mp-rows">
                <div className="mp-row">
                  <span className="k">Sportswear brand, return on ad spend</span>
                  <span className="v up tnum">2 &rarr; 9</span>
                </div>
                <div className="mp-row">
                  <span className="k">E-commerce, cost per purchase</span>
                  <span className="v up tnum">$28 &rarr; $4</span>
                </div>
                <div className="mp-row">
                  <span className="k">Event ticketing, spend to bookings</span>
                  <span className="v up tnum">LKR 1M &rarr; 18M</span>
                </div>
              </div>
              <p className="dim" style={{ fontSize: ".78rem", marginTop: 16 }}>
                Real client results with their windows and sources stated on the{" "}
                <Link href="/portfolio" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
                  portfolio
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="cro">
        <div className="wrap split reverse">
          <div className="reveal">
            <span className="pill">Conversion</span>
            <h2 style={{ marginTop: 18 }}>Conversion Rate Optimization</h2>
            <p className="mt-s">
              The cheapest growth is the traffic you already pay for. We test landing pages, offers, pricing and
              checkout until more of those visitors buy. Revenue goes up, ad spend does not.
            </p>
            <ul className="feature-list">
              <li>
                {CHECK}
                <span>Landing page and offer design built to convert</span>
              </li>
              <li>
                {CHECK}
                <span>Structured testing and a clear experiment roadmap</span>
              </li>
              <li>
                {CHECK}
                <span>Heatmap and session analysis to find friction fast</span>
              </li>
            </ul>
          </div>
          <div className="reveal">
            <div className="card glow-hover" style={{ padding: 38 }}>
              <h3>Same traffic, more customers</h3>
              <p className="mt-s">
                Conversion work compounds against spend you are already committed to. Every extra point of
                conversion rate is revenue you do not have to buy twice, which is why we look here before
                recommending a bigger budget.
              </p>
              <div className="grid cols-2" style={{ marginTop: 24, gap: 16 }}>
                <div className="stat" style={{ border: "1px solid var(--border)", borderRadius: 14 }}>
                  <div className="num tnum" style={{ fontSize: "1.6rem" }}>
                    <span className="accent">0.7% &rarr; 2.8%</span>
                  </div>
                  <div className="lbl">Footwear brand, one month</div>
                </div>
                <div className="stat" style={{ border: "1px solid var(--border)", borderRadius: 14 }}>
                  <div className="num tnum" style={{ fontSize: "1.6rem" }}>
                    <span className="accent">17%</span>
                  </div>
                  <div className="lbl">Booking page to confirmed booking</div>
                </div>
              </div>
              <p className="dim" style={{ fontSize: ".78rem", marginTop: 18 }}>
                Both measured, with windows and sources stated on the{" "}
                <Link href="/portfolio" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
                  portfolio
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section band" id="retention">
        <div className="wrap split">
          <div className="reveal">
            <span className="pill">Lifetime value</span>
            <h2 style={{ marginTop: 18 }}>Retention and Lifetime Value</h2>
            <p className="mt-s">
              Acquisition is only half the equation. Email, SMS and lifecycle automation turn one purchase into
              many, raising lifetime value until you can profitably outbid every competitor on the way in.
            </p>
            <ul className="feature-list">
              <li>
                {CHECK}
                <span>Email and SMS flows for welcome, abandonment, post purchase and win back</span>
              </li>
              <li>
                {CHECK}
                <span>Segmentation, offers and loyalty that drive repeat purchase</span>
              </li>
              <li>
                {CHECK}
                <span>Lifetime value and payback modelling that sets your acquisition ceiling</span>
              </li>
            </ul>
          </div>
          <div className="reveal">
            <div className="glass metric-panel glow-hover">
              <div className="mp-head">
                <span>Where order value moves</span>
              </div>
              <div className="mp-rows">
                <div className="mp-row">
                  <span className="k">Sportswear brand, average order value</span>
                  <span className="v up tnum">+177%</span>
                </div>
                <div className="mp-row">
                  <span className="k">From</span>
                  <span className="v tnum" style={{ fontSize: "1.15rem" }}>
                    LKR 2,472 &rarr; 6,841
                  </span>
                </div>
              </div>
              <p className="dim" style={{ fontSize: ".78rem", marginTop: 16 }}>
                Order value is won on the site, not in the ad account, and it is what raises the ceiling on what you
                can afford to pay for a customer. Basis stated on the{" "}
                <Link href="/portfolio" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
                  portfolio
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="ai-systems">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="pill">The engine</span>
            <h2 style={{ marginTop: 18 }}>AI Growth Systems</h2>
            <p>
              This is why we move faster and cost less. AI handles the repetitive work. Your strategist handles
              the judgement calls. You get the output of a whole department, with one person answerable for it.
            </p>
          </div>
          <div className="grid cols-3">
            <article className="card glow-hover reveal">
              <h3>Creative at scale</h3>
              <p>AI generates and iterates ad creative and copy continuously, so testing never stalls and winners surface faster.</p>
            </article>
            <article className="card glow-hover reveal">
              <h3>Always on analysis</h3>
              <p>Agents watch every campaign for anomalies, wasted spend and openings, and flag them before they cost you.</p>
            </article>
            <article className="card glow-hover reveal">
              <h3>Live financial reporting</h3>
              <p>One dashboard in money. Revenue, ROAS, lifetime value and CPA. No waiting for a monthly deck to know where you stand.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section band" id="software">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">Beyond a marketing site</span>
            <h2>When the thing you need is software, not a website</h2>
            <p>
              A booking engine with capacity rules. A native app. A data pipeline or a model in production. That
              work is real engineering, and pretending otherwise is how projects fail.
            </p>
          </div>

          <div className="split" style={{ gap: 44, alignItems: "center" }}>
            <div className="reveal">
              <p>
                We work alongside <strong>AxionCore</strong>, a software engineering company founded by a
                long-standing business partner of ours. It is a separate company, not a department of this one. We
                plan and deliver together, so a project can start as a marketing problem and become a software one
                without being handed to a stranger halfway through.
              </p>
              <p className="mt-s">
                They work the way we do, which is why the partnership holds:{" "}
                <strong>nobody quotes you a build before the idea has been assessed.</strong> We run a Leak Report
                before touching your funnel. They run a Project Fit Assessment before touching your product. Same
                principle, applied to different problems.
              </p>
              <ul className="feature-list">
                <li>
                  {CHECK}
                  <span>You own the code outright, with no vendor lock-in.</span>
                </li>
                <li>
                  {CHECK}
                  <span>Decisions are documented, so the next developer is not guessing.</span>
                </li>
                <li>
                  {CHECK}
                  <span>Estimates come after requirements analysis, not before it.</span>
                </li>
              </ul>
            </div>

            <div className="reveal">
              <div className="card" style={{ padding: 34 }}>
                <div className="meta" style={{ margin: "0 0 14px", border: "none", padding: 0 }}>
                  Free, about 3 minutes
                </div>
                <h3 style={{ fontSize: "1.34rem" }}>Project Fit Assessment</h3>
                <p>
                  Fifteen questions that score whether your software idea is actually ready to build, what still
                  needs definition, and what the sensible next step is. Run by AxionCore, free, and useful even if
                  nobody builds anything.
                </p>
                <p className="mt-s" style={{ borderTop: "1px solid var(--border)", paddingTop: 16, fontSize: ".9rem" }}>
                  Typical builds: $5,000 to $15,000 for an MVP
                  <br />
                  <span className="dim">$20,000 and up for a full product, quoted only after requirements analysis</span>
                </p>
                <div style={{ marginTop: 22 }}>
                  <a
                    className="btn btn-primary btn-arrow"
                    href="https://www.axioncoretech.com/landing-page/software-projects"
                    target="_blank"
                    rel="noopener"
                  >
                    Check your project fit
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
                <p className="dim" style={{ marginTop: 16, fontSize: ".85rem" }}>
                  Opens axioncoretech.com. Or{" "}
                  <Link href="/contact?intent=software" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
                    talk to us first
                  </Link>{" "}
                  if you are not sure which side of the line your project sits on.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="cta-band reveal">
            <h2>Start with the fix that matters most</h2>
            <p>The Growth Audit finds it. About three minutes, your own scorecard, and the single change that would move your numbers most.</p>
            <div className="hero-actions" style={{ marginTop: 32 }}>
              <Link className="btn btn-primary btn-lg btn-arrow" href="/growth-audit">
                Get your free Growth Audit{" "}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
