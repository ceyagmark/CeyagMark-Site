import type { Metadata } from "next";
import Link from "next/link";
import { HeroRibbon } from "@/components/hero-ribbon";

// Meta, JSON-LD and copy ported verbatim from Projects/CeyagMark/CeyagMark/index.html
// per SLICE-0-CONTRACTS.md's per-page meta table. Nothing here is new copy.
export const metadata: Metadata = {
  title: "Web Development & Performance Marketing Agency in Sri Lanka | CeyagMark",
  description:
    "CeyagMark builds your website and runs the marketing on it, so the conversions are ours to prove. Web development, paid ads, SEO and CRO for Sri Lankan and international brands. Engagements from LKR 14,999.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Web Development & Performance Marketing Agency in Sri Lanka | CeyagMark",
    description:
      "We build the site and run the marketing on it. Case studies with real numbers, and every engagement scoped and priced in public.",
    url: "/",
  },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://ceyagmark.com/#organization",
  name: "CeyagMark",
  description:
    "A web development and performance marketing agency in Sri Lanka. CeyagMark builds websites and runs the marketing on them, growing revenue, lifetime value and conversion rate while reducing cost per acquisition.",
  url: "https://ceyagmark.com/",
  logo: "https://ceyagmark.com/img/logo.png",
  image: "https://ceyagmark.com/img/og-cover.png",
  email: "growth@ceyagmark.com",
  telephone: "+94703727895",
  priceRange: "LKR 3,000 - LKR 39,900+",
  address: { "@type": "PostalAddress", addressLocality: "Nittambuwa", addressRegion: "Western Province", addressCountry: "LK" },
  areaServed: [
    { "@type": "Country", name: "Sri Lanka" },
    { "@type": "Country", name: "Australia" },
    { "@type": "Country", name: "New Zealand" },
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "United States" },
  ],
  knowsAbout: [
    "Web Development",
    "WooCommerce",
    "Performance Marketing",
    "Conversion Rate Optimization",
    "Search Engine Optimization",
    "Paid Advertising",
    "Customer Lifetime Value",
    "Retention Marketing",
    "Marketing Analytics",
    "Conversion Tracking",
  ],
  serviceType: "Web Development and Performance Marketing Agency",
  slogan: "We build the site and run the marketing on it.",
  founder: { "@type": "Person", name: "Shashika Tharinda", jobTitle: "Founder" },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: "+94703727895",
    email: "growth@ceyagmark.com",
    availableLanguage: ["English", "Sinhala"],
  },
  sameAs: ["https://www.linkedin.com/company/ceyagmark"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "CeyagMark engagements",
    itemListElement: [
      {
        "@type": "Offer",
        name: "The Leak Report",
        description: "A scored audit of your site and funnel against a fixed rubric, with a three-fix shortlist.",
        price: "14999",
        priceCurrency: "LKR",
        url: "https://ceyagmark.com/services#leak-report",
      },
      {
        "@type": "Offer",
        name: "The Fix Sprint",
        description: "Ships the three fixes named in your Leak Report, then re-scores on the same rubric.",
        price: "30000",
        priceCurrency: "LKR",
        url: "https://ceyagmark.com/services#fix-sprint",
      },
      {
        "@type": "Offer",
        name: "Build and Run",
        description: "The website and the marketing on it as one engagement, instrumented from day one.",
        price: "39900",
        priceCurrency: "LKR",
        url: "https://ceyagmark.com/services#build-and-run",
      },
      {
        "@type": "Offer",
        name: "Consulting",
        description: "One to one strategy or technical sessions, paid upfront with a money-back guarantee.",
        price: "3000",
        priceCurrency: "LKR",
        url: "https://ceyagmark.com/consulting",
      },
    ],
  },
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: "https://ceyagmark.com/",
  name: "CeyagMark",
  publisher: { "@id": "https://ceyagmark.com/#organization" },
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does CeyagMark do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We build websites and run the marketing on them as one engagement. That covers web development, paid advertising, SEO, conversion rate optimization and retention marketing. Because one team owns both the site and the traffic, we can find a problem and fix it without waiting on anyone else.",
      },
    },
    {
      "@type": "Question",
      name: "How is an AI-powered agency different?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI agents do the heavy, repetitive work such as creative iteration, audience analysis, reporting and testing, at a scale a traditional team cannot match. That removes overhead, so you get the output of a large agency with the focus of a senior specialist, and you pay for performance rather than headcount.",
      },
    },
    {
      "@type": "Question",
      name: "Who is CeyagMark for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ecommerce brands, product sellers, course creators and education brands, and service businesses, particularly capacity-constrained operations such as inspections, clinics, trades and accounting firms. We work with Sri Lankan businesses and with clients in Australia, New Zealand and the UK.",
      },
    },
    {
      "@type": "Question",
      name: "How do you measure success?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In money. We report on revenue, return on ad spend, customer lifetime value, conversion rate and cost per acquisition, not impressions or reach.",
      },
    },
    {
      "@type": "Question",
      name: "How much does it cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every engagement is scoped and priced in public. A Leak Report audit starts at LKR 14,999 or 99 USD, a Fix Sprint at LKR 30,000 or 199 USD, and Build and Run at LKR 39,900 or 249 USD a month. Consulting is LKR 3,000 or 20 USD per 30 minutes with a money-back guarantee.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />

      <section className="hero">
        <HeroRibbon />
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow reveal">Performance marketing powered by AI</span>
            <h1 className="reveal">
              We don&apos;t sell marketing.
              <br />
              <span className="display-grad">We sell growth you can bank.</span>
            </h1>
            <p className="lede reveal">
              CeyagMark is a web development and performance marketing agency in Sri Lanka, working with local and
              international brands. We build the site and run the marketing on it, which means when your numbers
              move we know exactly what moved them, and when they do not, we can go and fix the actual cause.
            </p>
            <div className="hero-actions reveal">
              <Link className="btn btn-primary btn-lg btn-arrow" href="/growth-audit" data-magnetic="0.3">
                Get your free Growth Audit
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/portfolio">
                See the case studies
              </Link>
            </div>
            <div className="hero-trust reveal">
              <span>
                <i className="dot" /> Based in Sri Lanka, working worldwide
              </span>
              <span>
                <i className="dot" /> Websites and marketing under one roof
              </span>
              <span>
                <i className="dot" /> Every engagement scoped and priced in public
              </span>
            </div>
          </div>

          <div className="reveal" style={{ position: "relative" }}>
            <div className="growth-orb-anchor" aria-hidden="true">
              <div className="growth-orb" data-growth-orb>
                <svg viewBox="0 0 100 100" width="30" height="30">
                  <defs>
                    <linearGradient id="orb-grad" x1="20" y1="70" x2="80" y2="25" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="var(--brand-glow)" />
                      <stop offset="1" stopColor="var(--good)" />
                    </linearGradient>
                  </defs>
                  <path d="M30 64 L45 52 L55 58 L74 33" fill="none" stroke="url(#orb-grad)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M60 30 L78 28 L74 46 Z" fill="url(#orb-grad)" />
                </svg>
              </div>
            </div>
            <div className="glass metric-panel glow-hover tilt" data-tilt="6">
              <div className="mp-head">
                <span>Real client outcomes</span>
              </div>
              <div className="mp-rows">
                <div className="mp-row">
                  <span className="k">
                    Booking page to confirmed booking
                    <small>Vehicle inspection, first 3 days</small>
                  </span>
                  <span className="v up tnum">17%</span>
                </div>
                <div className="mp-row">
                  <span className="k">
                    Return on ad spend
                    <small>Sportswear brand, 2.5 months</small>
                  </span>
                  <span className="v up tnum">2 &rarr; 9</span>
                </div>
                <div className="mp-row">
                  <span className="k">
                    Conversion rate
                    <small>Footwear brand, one month</small>
                  </span>
                  <span className="v up tnum">0.7% &rarr; 2.8%</span>
                </div>
                <div className="mp-row">
                  <span className="k">
                    Cost per purchase
                    <small>E-commerce, two months</small>
                  </span>
                  <span className="v up tnum">$28 &rarr; $4</span>
                </div>
              </div>
            </div>
            <p className="center dim" style={{ fontSize: ".82rem", margin: "16px auto 0" }}>
              Every figure states how it was measured on the{" "}
              <Link href="/portfolio" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
                portfolio
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="toprule" style={{ paddingBlock: 52 }}>
        <div className="wrap center reveal">
          <p className="dim" style={{ fontSize: ".74rem", letterSpacing: ".24em", textTransform: "uppercase", marginBottom: 28 }}>
            Built for businesses with revenue to protect and scale
          </p>
          <div className="marquee">
            <div className="marquee-track">
              <span>Ecommerce</span>
              <span>Product sellers</span>
              <span>Course creators</span>
              <span>Education brands</span>
              <span>Service businesses</span>
              <span>DTC brands</span>
              <span aria-hidden="true">Ecommerce</span>
              <span aria-hidden="true">Product sellers</span>
              <span aria-hidden="true">Course creators</span>
              <span aria-hidden="true">Education brands</span>
              <span aria-hidden="true">Service businesses</span>
              <span aria-hidden="true">DTC brands</span>
            </div>
          </div>
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
              <div className="num tnum">6</div>
              <div className="lbl">Disciplines under one roof</div>
            </div>
            <div className="stat reveal">
              <div className="num tnum">20+</div>
              <div className="lbl">Brands run agency-side</div>
            </div>
            <div className="stat reveal">
              <div className="num tnum">5</div>
              <div className="lbl">Years in performance marketing</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="problem-grid">
            <div className="section-head reveal" style={{ maxWidth: "none", marginBottom: 0 }}>
              <span className="eyebrow">The real problem</span>
              <h2>
                Your ad costs keep rising. Your margins keep shrinking. And the report is full of numbers that never
                pay rent.
              </h2>
              <p>
                Most agencies optimise for what looks good in a deck. Reach, impressions, engagement. Meanwhile your
                acquisition gets more expensive, repeat purchases stall, and growth turns into a guess. We built
                CeyagMark to fix the economics, not the slide.
              </p>
            </div>
            <div className="reveal" data-delay="1">
              <div className="glass leak-panel glow-hover tilt" data-tilt="5">
                <div className="leak-head">The squeeze on your unit economics</div>
                <div className="leak-meter">
                  <div className="leak-row">
                    <div className="leak-label">
                      <span>Cost to acquire</span>
                      <span className="leak-tag up">Rising</span>
                    </div>
                    <div className="bar">
                      <i style={{ "--w": "88%", "--c": "var(--bad)" } as React.CSSProperties} />
                    </div>
                  </div>
                  <div className="leak-row">
                    <div className="leak-label">
                      <span>Profit margin</span>
                      <span className="leak-tag down">Shrinking</span>
                    </div>
                    <div className="bar">
                      <i style={{ "--w": "36%", "--c": "var(--warn)" } as React.CSSProperties} />
                    </div>
                  </div>
                  <div className="leak-row">
                    <div className="leak-label">
                      <span>Repeat revenue</span>
                      <span className="leak-tag down">Stalling</span>
                    </div>
                    <div className="bar">
                      <i style={{ "--w": "29%", "--c": "var(--warn)" } as React.CSSProperties} />
                    </div>
                  </div>
                </div>
                <p className="leak-foot">
                  This is the gap most dashboards hide. We fix the economics underneath, then the numbers take care
                  of themselves.
                </p>
              </div>
            </div>
          </div>
          <div className="grid cols-3" style={{ marginTop: 64 }}>
            <article className="card glow-hover reveal">
              <div className="ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3 17l6-6 4 4 8-8M21 7v6M21 7h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Acquisition keeps bleeding</h3>
              <p>
                Winning a customer costs more every quarter while your offer and funnel stay the same. The leak is
                rarely the platform. It is the unit economics underneath.
              </p>
            </article>
            <article className="card glow-hover reveal" data-delay="1">
              <div className="ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v18M7 8h7a3 3 0 010 6H7m0 0h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Customers buy once and vanish</h3>
              <p>
                You pay full price to win a buyer, then never bring them back. Low lifetime value quietly caps how
                much you can ever afford to spend.
              </p>
            </article>
            <article className="card glow-hover reveal" data-delay="2">
              <div className="ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M4 19V5m16 14V9M9 19v-7m6 7v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Revenue feels like a coin toss</h3>
              <p>
                Good months and bad months with no clear cause. Without a system, scaling is a gamble, and you
                cannot plan, hire or invest with any confidence.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head center reveal">
            <span className="eyebrow center">What we actually move</span>
            <h2>Four levers. One profit and loss statement.</h2>
            <p>
              We do not sell channels. We engineer outcomes. Every engagement is built around the four numbers that
              decide whether your business compounds or stalls.
            </p>
          </div>
          <div className="grid cols-4">
            <article className="card glow-hover reveal tilt" data-tilt="5">
              <div className="ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0zM12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Revenue</h3>
              <p>Profitable demand from paid search, paid social and marketplaces, built to scale without breaking your return.</p>
              <div className="meta">Paid acquisition</div>
            </article>
            <article className="card glow-hover reveal tilt" data-delay="1" data-tilt="5">
              <div className="ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16v12H4zM8 20h8M12 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Conversion rate</h3>
              <p>Turn the traffic you already pay for into more customers, with pages, offers and checkout tested every week.</p>
              <div className="meta">CRO and funnels</div>
            </article>
            <article className="card glow-hover reveal tilt" data-delay="2" data-tilt="5">
              <div className="ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6l-9 9-4-4M4 14v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Lifetime value</h3>
              <p>Email, SMS and lifecycle automation that turns one purchase into many, so you can outbid everyone on the way in.</p>
              <div className="meta">Retention and LTV</div>
            </article>
            <article className="card glow-hover reveal tilt" data-delay="3" data-tilt="5">
              <div className="ico" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3 7l9-4 9 4-9 4-9-4zm0 5l9 4 9-4M3 17l9 4 9-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Lower CPA</h3>
              <p>Sharper targeting, constant creative testing and clean measurement that pushes acquisition cost down as you grow.</p>
              <div className="meta">Efficiency</div>
            </article>
          </div>
          <div className="center reveal" style={{ marginTop: 48 }}>
            <Link className="link-arrow" href="/services">
              Explore all services{" "}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head center reveal">
            <span className="eyebrow center">How we work</span>
            <h2>A lean machine that works like a forty person agency</h2>
            <p>
              AI agents do the testing, analysis and reporting that used to need a department. Senior strategists
              hold the wheel. You get scale and speed without the bloat, the retainer waste, or the layers between
              you and the work.
            </p>
          </div>
          <div className="grid cols-4">
            <div className="step reveal">
              <div className="n tnum">01</div>
              <h3>Diagnose</h3>
              <p>We audit your full funnel across acquisition, conversion and retention, and find exactly where money leaks before we spend a cent.</p>
            </div>
            <div className="step reveal">
              <div className="n tnum">02</div>
              <h3>Model</h3>
              <p>We build the unit economics. Target CPA, payback window, and the lifetime value you need to scale profitably.</p>
            </div>
            <div className="step reveal">
              <div className="n tnum">03</div>
              <h3>Deploy</h3>
              <p>AI agents launch and iterate creative, audiences and tests at high velocity, supervised by a strategist who owns the result.</p>
            </div>
            <div className="step reveal">
              <div className="n tnum">04</div>
              <h3>Compound</h3>
              <p>Winners scale, losers die fast, and retention recaptures spend. Every cycle lowers CPA and lifts lifetime value.</p>
            </div>
          </div>
          <div className="center reveal" style={{ marginTop: 48 }}>
            <Link className="link-arrow" href="/approach">
              See how the method works{" "}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div className="reveal">
            <span className="eyebrow">Why the model matters to you</span>
            <h2 style={{ marginTop: 18 }}>High margins for us means honest pricing for you.</h2>
            <p className="mt-s">
              Traditional agencies bill you for headcount. Account managers, junior buyers, designers, and the
              overhead stacked on top. We replaced the busywork with AI, so the money goes into performance rather
              than payroll.
            </p>
            <ul className="feature-list">
              <li>
                <span className="ck" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>One senior point of contact, with no junior hand-offs and no telephone game.</span>
              </li>
              <li>
                <span className="ck" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>The output of a large team, because AI handles the volume work rather than a payroll.</span>
              </li>
              <li>
                <span className="ck" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>Engagements built around your numbers rather than our hours.</span>
              </li>
              <li>
                <span className="ck" aria-hidden="true">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>A live dashboard in money that you can open any day.</span>
              </li>
            </ul>
          </div>
          <div className="reveal">
            <div className="glass metric-panel glow-hover tilt" data-tilt="6">
              <div className="mp-head">
                <span>What you are actually paying for</span>
              </div>
              <div className="mp-rows">
                <div className="mp-row">
                  <span className="k">People between you and the work</span>
                  <span className="v up tnum">None</span>
                </div>
                <div className="mp-row">
                  <span className="k">Who runs your account</span>
                  <span className="v up tnum" style={{ fontSize: "1.2rem" }}>
                    The founder
                  </span>
                </div>
                <div className="mp-row">
                  <span className="k">Scope and price</span>
                  <span className="v up tnum" style={{ fontSize: "1.2rem" }}>
                    Stated upfront
                  </span>
                </div>
              </div>
              <p className="dim" style={{ fontSize: ".8rem", marginTop: 18 }}>
                No account managers, no junior hand-offs, no overhead priced into your retainer. Every engagement is{" "}
                <Link href="/services#engagements" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
                  scoped and priced in public
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap narrow center reveal">
          <span className="eyebrow center">A real result</span>
          <h2 style={{ marginTop: 16 }}>
            We built the booking system, ran the traffic into it, and 17 percent of everyone who opened the page
            booked an inspection.
          </h2>
          <p className="mt-s" style={{ marginInline: "auto" }}>
            Perth Pre-Purchase Inspection. Measured in the booking database we built, over the first three days
            after launch.
          </p>
          <div className="hero-actions" style={{ justifyContent: "center", marginTop: 28 }}>
            <Link className="btn btn-ghost btn-lg" href="/case-ppi">
              Read how it was measured
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head center reveal">
            <span className="eyebrow center">Straight answers</span>
            <h2>Questions founders ask us</h2>
          </div>
          <div className="faq reveal">
            <details open>
              <summary>
                What does CeyagMark do? <span className="pm" aria-hidden="true" />
              </summary>
              <p>
                We grow your revenue, customer lifetime value and conversion rate while reducing your cost per
                acquisition. Paid advertising, conversion rate optimization and retention marketing run as one
                accountable system. AI agents handle execution and senior strategists own the outcome.
              </p>
            </details>
            <details>
              <summary>
                How is an AI-powered agency different? <span className="pm" aria-hidden="true" />
              </summary>
              <p>
                AI agents do the heavy, repetitive work such as creative iteration, audience analysis, reporting and
                testing, at a scale a traditional team cannot match. You get the output of a large agency with the
                focus of a senior specialist, and you pay for performance rather than headcount.
              </p>
            </details>
            <details>
              <summary>
                Who is CeyagMark for? <span className="pm" aria-hidden="true" />
              </summary>
              <p>
                Ecommerce brands, physical and digital product sellers, course creators and education brands, and
                service businesses that already have revenue and want predictable, profitable scale.
              </p>
            </details>
            <details>
              <summary>
                How do you measure success? <span className="pm" aria-hidden="true" />
              </summary>
              <p>In money. We report on revenue, return on ad spend, customer lifetime value, conversion rate and cost per acquisition. Never impressions, likes or reach.</p>
            </details>
            <details>
              <summary>
                How do we start? <span className="pm" aria-hidden="true" />
              </summary>
              <p>
                Take the free Growth Audit. It scores your acquisition, conversion and retention in about three
                minutes, gives you a custom scorecard, and books a strategy call if we are a fit.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="cta-band reveal">
            <span className="eyebrow center">Start with the numbers</span>
            <h2 style={{ marginTop: 18 }}>Find out exactly where your revenue is leaking.</h2>
            <p>
              The free Growth Audit scores your acquisition, conversion and retention in about three minutes, then
              shows you the highest value fix first. No pitch until you have seen the diagnosis.
            </p>
            <div className="hero-actions" style={{ marginTop: 32 }}>
              <Link className="btn btn-primary btn-lg btn-arrow" href="/growth-audit" data-magnetic="0.3">
                Get your free Growth Audit{" "}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/contact">
                Talk to a strategist
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
