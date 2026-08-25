import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About CeyagMark, Web and Marketing Agency in Nittambuwa, Sri Lanka",
  description:
    "CeyagMark is a web development and performance marketing agency based in Nittambuwa, Sri Lanka, led by Shashika Tharinda. We reject vanity metrics and the bloated agency model.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About CeyagMark",
    description: "A lean performance marketing agency that sells growth, not marketing.",
    url: "/about",
  },
};

const ABOUT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About CeyagMark",
  url: "https://ceyagmark.com/about",
  about: { "@id": "https://ceyagmark.com/#organization" },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ceyagmark.com/" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://ceyagmark.com/about" },
  ],
};

const X_ICON = (
  <span className="ck" aria-hidden="true" style={{ background: "rgba(192,57,43,.14)", color: "var(--bad)" }}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </span>
);

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />

      <section className="page-hero">
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> &nbsp;&rsaquo;&nbsp; About
          </nav>
          <span className="eyebrow reveal">About</span>
          <h1 className="reveal">We built the agency we wished existed.</h1>
          <p className="lede reveal">
            CeyagMark exists because most marketing agencies are built for the wrong thing. Billable hours, big
            retainers, and reports that look impressive but never reach your bank account. We do the opposite.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap narrow">
          <div className="reveal">
            <h2>The belief that started it</h2>
            <p className="mt-s">
              Marketing should be an investment with a return you can measure, not a cost you tolerate and hope
              works. Yet most businesses are sold marketing as activity. Reach, impressions, engagement. Activity is
              not growth. Growth is more revenue, kept at a better margin, from customers who come back.
            </p>
            <p className="mt-s">
              So we stripped the agency down to what actually moves money, which is acquisition, conversion and
              retention, and rebuilt the engine around AI. The repetitive heavy lifting that used to need a
              department now runs on agents, supervised by senior strategists. That makes us fast, lean, and honest
              about price, because we are not billing you for overhead.
            </p>
          </div>
          <hr className="divider" style={{ margin: "48px 0" }} />
          <div className="reveal">
            <h2>What we refuse to do</h2>
            <ul className="feature-list mt-s">
              <li>
                {X_ICON}
                <span>The loud bro marketer aesthetic, with screenshots, hype, and pressure tactics.</span>
              </li>
              <li>
                {X_ICON}
                <span>Vanity reporting that celebrates reach while cost per acquisition quietly climbs.</span>
              </li>
              <li>
                {X_ICON}
                <span>Layers of account managers between you and the people doing the work.</span>
              </li>
              <li>
                {X_ICON}
                <span>Retainers priced to fund the agency headcount rather than your growth.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap split">
          <div className="reveal">
            <span className="eyebrow">The founder</span>
            <h2 style={{ marginTop: 16 }}>Built and run by Shashika Tharinda.</h2>
            <p className="mt-s">
              CeyagMark is led by Shashika Tharinda, who has spent 5 years in performance marketing across paid
              media, conversion and analytics. The work is senior from the first call. You talk to the person who
              runs your account, not a sales rep who hands you off.
            </p>
            <div className="hero-actions" style={{ marginTop: 28 }}>
              <Link className="btn btn-ghost btn-lg" href="/contact">
                Talk to Shashika
              </Link>
            </div>
          </div>
          <div className="reveal">
            <figure className="founder-card card glow-hover">
              <div className="founder-portrait">
                <img src="/img/founder.svg" alt="Shashika Tharinda, founder of CeyagMark" width={132} height={132} loading="lazy" />
              </div>
              <figcaption>
                <h3>Shashika Tharinda</h3>
                <p className="dim">Founder. 5 years in performance marketing.</p>
                <div className="founder-tags">
                  <span>Paid media</span>
                  <span>CRO</span>
                  <span>Analytics &amp; AI</span>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap narrow">
          <div className="reveal">
            <span className="eyebrow">Our engineering partner</span>
            <h2 style={{ marginTop: 16 }}>When a project outgrows a website, we do not subcontract it to a stranger.</h2>
            <p className="mt-s">
              Marketing work runs into engineering limits quickly. A client needs a booking system with capacity
              rules, a native app, or a data pipeline, and most agencies at that point either say no or quietly hand
              it to a supplier nobody has met.
            </p>
            <p className="mt-s">
              We work alongside{" "}
              <a href="https://www.axioncoretech.com/" target="_blank" rel="noopener" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
                AxionCore
              </a>
              , a software engineering company founded by a long-standing business partner of ours. Two companies,
              not one wearing two names, and we lead with that rather than let you find it out later. What it means
              in practice is that we plan and deliver as one team, with the same people accountable from the first
              strategy call through to the software in production.
            </p>
            <div className="glass" style={{ marginTop: 26, padding: 24 }}>
              <span className="pill">What they build</span>
              <div className="grid cols-3" style={{ marginTop: 16, gap: 10 }}>
                <span className="dim" style={{ fontSize: ".9rem" }}>Web &amp; mobile apps</span>
                <span className="dim" style={{ fontSize: ".9rem" }}>Data engineering</span>
                <span className="dim" style={{ fontSize: ".9rem" }}>AI/ML</span>
                <span className="dim" style={{ fontSize: ".9rem" }}>Cloud infrastructure</span>
                <span className="dim" style={{ fontSize: ".9rem" }}>DevOps &amp; automation</span>
                <span className="dim" style={{ fontSize: ".9rem" }}>Security &amp; compliance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <div className="section-head center reveal">
            <span className="eyebrow center">Who we serve</span>
            <h2>Built for businesses with something to scale</h2>
            <p>We work best with companies that already have revenue and a real offer, and want to grow it predictably and profitably.</p>
          </div>
          <div className="grid cols-4">
            <article className="card glow-hover reveal">
              <h3>Ecommerce</h3>
              <p>Stores ready to scale paid acquisition without wrecking their return.</p>
            </article>
            <article className="card glow-hover reveal">
              <h3>Product sellers</h3>
              <p>Physical and digital products that need lower CPA and higher lifetime value.</p>
            </article>
            <article className="card glow-hover reveal">
              <h3>Course and education</h3>
              <p>Creators and education brands turning audiences into enrolments.</p>
            </article>
            <article className="card glow-hover reveal">
              <h3>Service businesses</h3>
              <p>Teams that need a predictable, qualified lead pipeline.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap narrow center reveal">
          <span className="eyebrow center">The promise</span>
          <h2 style={{ marginTop: 16 }}>If we cannot move your numbers, we will tell you before you spend a cent.</h2>
          <p className="mt-s" style={{ marginInline: "auto" }}>
            That is what the free Growth Audit is for. We diagnose first. If the upside is real, we show you the
            model. If it is not, we say so. Either way you walk away knowing exactly where you stand.
          </p>
          <div className="hero-actions" style={{ justifyContent: "center", marginTop: 32 }}>
            <Link className="btn btn-primary btn-lg btn-arrow" href="/growth-audit">
              Get your free Growth Audit{" "}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link className="btn btn-ghost btn-lg" href="/contact">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
