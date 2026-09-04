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
            <figure className="founder-card card glow-hover tilt" data-tilt="6">
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

      <section className="section">
        <div className="wrap">
          <div className="section-head center reveal">
            <span className="eyebrow">Endorsements</span>
            <h2>People who have worked with Shashika, on the record</h2>
            <p>
              Real, named recommendations from LinkedIn. We would rather show three real ones than invent a page
              full of quotes nobody said.
            </p>
          </div>
          <div className="grid cols-3">
            <article className="card glow-hover reveal">
              <h3>Nirmal Danansooriya</h3>
              <p className="dim" style={{ fontSize: ".85rem", marginTop: 4 }}>
                CEO, Platform Daddy &middot; managed Shashika directly
              </p>
              <p className="mt-s" style={{ fontSize: ".9rem" }}>
                &ldquo;I had the pleasure of working with Shashika at Platform Daddy, where he served as a Senior
                Digital Marketing Specialist on my team. He has a real strength in performance marketing —
                consistently building data-driven campaigns that delivered strong ROI, with a sharp instinct for
                optimizing spend across channels to get the most out of every budget. He played a key role in
                marketing Sri Lanka&apos;s biggest agri-food and tech event, and led massive campaigns for
                large-scale corporate brands, handling that scale with a level of precision and confidence that
                stood out. He&apos;s efficient and gets things done quickly without compromising on quality, and he
                brought sharp strategic thinking to everything he owned, always trusted to take a project end to end
                without needing to be micromanaged. Beyond his skills, he&apos;s a genuinely kind person and a great
                collaborator, someone who lifted the people around him and made the team better simply by being
                part of it. Any organization would be fortunate to have Shashika on their marketing team,
                particularly for performance-driven growth roles at scale. I recommend him without
                hesitation.&rdquo;
              </p>
            </article>
            <article className="card glow-hover reveal">
              <h3>Saliya Wimalasena</h3>
              <p className="dim" style={{ fontSize: ".85rem", marginTop: 4 }}>
                Digital Marketer &middot; client
              </p>
              <p className="mt-s" style={{ fontSize: ".9rem" }}>
                &ldquo;I have had the pleasure of working with Shashika Tharinda on a variety of digital marketing
                projects, including Meta Ads, Google Ads, e-commerce and conversion tracking. Throughout our
                collaboration, I have been consistently impressed by his expertise, professionalism and results
                driven approach. Shashika is one of the most talented performance marketing professionals I have
                worked with. His knowledge of paid media, conversion optimization, analytics and AI-powered
                marketing strategies is exceptional. What truly sets him apart is his ability to turn data into
                measurable business growth and consistently deliver outstanding results. Beyond his technical
                expertise, Shashika is an excellent mentor who is always willing to share his knowledge. I have
                learned a great deal from him throughout my digital marketing and e commerce journey and I continue
                to work with him and benefit from his guidance. I highly recommend Shashika to any business or
                organization looking for an expert in advanced Meta Ads, Google Ads, performance marketing, AI
                workflows or e-commerce growth. He is a dedicated professional who consistently exceeds
                expectations and delivers real business impact.&rdquo;
              </p>
            </article>
            <article className="card glow-hover reveal">
              <h3>Hiruni Sameeksha</h3>
              <p className="dim" style={{ fontSize: ".85rem", marginTop: 4 }}>
                Digital Marketing Specialist &middot; teammate
              </p>
              <p className="mt-s" style={{ fontSize: ".9rem" }}>
                &ldquo;I had the pleasure of working with Shashika, and he is a dedicated and reliable digital
                marketing professional. He is always willing to learn, takes ownership of his work, and
                consistently delivers high-quality results. His creativity, attention to detail, and collaborative
                approach make him a great team member. I truly enjoyed working alongside him and would confidently
                recommend him to any team looking for a passionate digital marketer. Wishing him continued success
                in his career.&rdquo;
              </p>
            </article>
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
