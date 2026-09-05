import type { Metadata } from "next";
import { FreeAuditForm } from "./free-audit-form";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Free E-commerce Performance Audit, 3 Founding Slots | CeyagMark",
  description:
    "A full-stack performance audit that maps every bottleneck in your store across ads, website, creatives and retention. 3 founding slots free, normally $99 / LKR 14,999. Apply in under 3 minutes.",
  alternates: { canonical: "/free-audit" },
  openGraph: {
    images: OG_IMAGE,
    title: "Free E-commerce Performance Audit, 3 Founding Slots | CeyagMark",
    description: "We map every bottleneck in your store and show you exactly where your ads are losing money. 3 founding slots free, normally $99 / LKR 14,999.",
    url: "/free-audit",
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ceyagmark.com/" },
    { "@type": "ListItem", position: 2, name: "Free Performance Audit", item: "https://ceyagmark.com/free-audit" },
  ],
};

const SERVICE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "E-commerce Performance Audit",
  serviceType: "Full-stack e-commerce performance audit",
  provider: { "@type": "ProfessionalService", name: "CeyagMark", url: "https://ceyagmark.com/", telephone: "+94703727895", email: "growth@ceyagmark.com" },
  areaServed: "Worldwide",
  description: "A full-stack performance audit covering paid ads, website CRO, ad creative, email and SMS retention. Delivered as a 30 minute strategy call plus a detailed bottleneck analysis report.",
  offers: {
    "@type": "Offer",
    price: "99",
    priceCurrency: "USD",
    availability: "https://schema.org/LimitedAvailability",
    description: "Free for the first 3 founding brands in exchange for a named case study. Normally 99 USD or 14999 LKR.",
  },
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the audit really free?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. The first 3 founding brands get the full audit at zero cost, normally 99 USD or 14999 LKR. In return you agree to be featured as a named case study and you approve all content before it goes live." },
    },
    {
      "@type": "Question",
      name: "What does the audit cover?",
      acceptedAnswer: { "@type": "Answer", text: "The full stack. Paid ads across Meta, Google and TikTok, website and checkout conversion, ad creative, AI SEO, and email and SMS retention. You get a bottleneck map, a funnel leak analysis, a full potential projection, and a prioritised plan to lower cost per acquisition." },
    },
    {
      "@type": "Question",
      name: "Who qualifies for the audit?",
      acceptedAnswer: { "@type": "Answer", text: "E-commerce brands with their own store on Shopify, WooCommerce or custom, spending at least 30 USD per day on paid ads, with at least 3 months of ad history, and willing to share read-only platform access." },
    },
    {
      "@type": "Question",
      name: "What do I need to provide?",
      acceptedAnswer: { "@type": "Answer", text: "Read-only access to the platforms you want audited. The more access you share, the more specific the findings. Gaps are flagged in the report where access is missing." },
    },
    {
      "@type": "Question",
      name: "What happens after I apply?",
      acceptedAnswer: { "@type": "Answer", text: "We review your answers and contact you on WhatsApp within 24 hours. If you are a fit we book a 30 minute strategy call, run the audit, and deliver your bottleneck analysis report." },
    },
  ],
};

const CHECK = (
  <span className="ck">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);
const YES_BADGE = (
  <span className="badgeico yes">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);
const NO_BADGE = (
  <span className="badgeico no">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </span>
);

export default function FreeAuditPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }} />

      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div>
            <span className="pill reveal">
              <i style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--warn)", display: "inline-block" }} /> 3 founding audit
              slots, normally <span className="strike">$99</span>
            </span>
            <h1 className="reveal">
              Where your e-commerce ads are <span className="display-grad">losing money.</span>
            </h1>
            <p className="lede reveal">
              A full-stack performance audit that maps every bottleneck in your store, across ads, website, creatives
              and retention. Delivered as a 30 minute strategy call plus a detailed PDF report.
            </p>

            <div className="slots reveal">
              <span className="dots" aria-hidden="true">
                <i /> <i /> <i />
              </span>
              <span>
                <b>3 founding slots only.</b> Free to apply now, normally $99.
              </span>
            </div>

            <div className="hero-actions reveal">
              <a className="btn btn-primary btn-lg btn-arrow" href="#apply">
                Claim your free audit{" "}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
            <div className="hero-trust reveal">
              <span>
                <i className="dot" /> Takes under 3 minutes
              </span>
              <span>
                <i className="dot" /> All multiple choice
              </span>
              <span>
                <i className="dot" /> Response within 24 hours
              </span>
            </div>
          </div>

          <div className="reveal">
            <div className="glass metric-panel glow-hover">
              <div className="mp-head">
                <span>Bottleneck analysis</span>
                <span className="mp-live">
                  <i /> Your data
                </span>
              </div>
              <div className="mp-rows" style={{ marginTop: 20 }}>
                <div className="mp-row">
                  <span className="k">Paid ads</span>
                  <span className="v" style={{ fontSize: "1.25rem", color: "var(--bad)" }}>
                    Wasting spend
                  </span>
                </div>
                <div className="mp-row">
                  <span className="k">Website conversion</span>
                  <span className="v" style={{ fontSize: "1.25rem", color: "var(--warn)" }}>
                    Leaking
                  </span>
                </div>
                <div className="mp-row">
                  <span className="k">Ad creative</span>
                  <span className="v" style={{ fontSize: "1.25rem", color: "var(--warn)" }}>
                    Inconsistent
                  </span>
                </div>
                <div className="mp-row">
                  <span className="k">Retention and LTV</span>
                  <span className="v" style={{ fontSize: "1.25rem", color: "var(--bad)" }}>
                    Untapped
                  </span>
                </div>
              </div>
              <p className="dim" style={{ fontSize: ".84rem", marginTop: 18 }}>
                Example map. Yours is built from your own numbers.
              </p>
            </div>
            <p className="dim reveal" style={{ fontSize: ".92rem", marginTop: 16, textAlign: "center" }}>
              This is not a Meta ads review. It is a complete diagnosis of every system bleeding revenue in your
              store.
            </p>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <div className="section-head center reveal">
            <span className="eyebrow center">The core idea</span>
            <h2>We don&apos;t chase KPIs. We follow the money.</h2>
            <p>
              ROAS, CPA and CTR are signals, not the goal. Every part of the audit answers one question. Where is
              the money going, and how do we get it back. Our job is to help you make more of it and spend less to
              get it.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="agentswrap">
            <div className="reveal">
              <span className="bignum display-grad">44</span>
              <p className="lede" style={{ marginTop: 18 }}>
                AI agents working 24/7. Actively planning, optimising and scaling your store while you sleep.
              </p>
            </div>
            <div className="reveal">
              <span className="eyebrow">How one person delivers agency-level work</span>
              <h2 style={{ marginTop: 16 }}>The output of a forty-person agency. The focus of one senior expert.</h2>
              <p style={{ marginTop: 18, color: "var(--text-soft)" }}>
                This is not a one-person freelance operation. It is an AI-driven performance agency built around a
                single senior expert, with 44 AI automations running across every layer of your store. You get the
                output of a full team with the accountability of one person who owns every decision.
              </p>
              <div className="chips">
                <span>Creative research</span>
                <span>Competitor monitoring</span>
                <span>Ad performance alerts</span>
                <span>Audience signals</span>
                <span>Funnel data processing</span>
                <span>Email and SMS workflows</span>
                <span>Reporting and insights</span>
                <span>CRO testing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <div className="section-head center reveal">
            <span className="eyebrow center">What the audit delivers</span>
            <h2>Eight findings that show you exactly where the money goes</h2>
            <p>A complete picture across your full stack, not one channel. Specific, visual and backed by your own data.</p>
          </div>
          <div className="grid cols-4">
            {[
              ["01", "Full bottleneck map", "Every revenue leak across ads, funnel, website, email and creatives in one view."],
              ["02", "Funnel leak analysis", "Exactly where visitors drop off at each stage, from first touch to checkout."],
              ["03", "Full potential projection", "What your revenue, CPA, LTV and ROAS could look like after each leak is fixed."],
              ["04", "Paid ads audit", "What is working, what is wasting budget, plus structure and audience gaps. Meta, Google, TikTok."],
              ["05", "Ad creative audit", "Which creatives work and why, and how to make winners repeatable instead of random."],
              ["06", "Website CRO audit", "Conversion friction, page speed, checkout drop-off and UX problems losing you sales."],
              ["07", "LTV improvement plan", "Email and SMS gaps, retention failures and repeat purchase opportunities you are leaving on the table."],
              ["08", "CPA reduction roadmap", "Specific actions ranked by impact that lower your cost per acquisition. Prioritised, not generic."],
            ].map(([n, title, body]) => (
              <div className="card del reveal" key={n}>
                <div className="ico">{n}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <p className="dim reveal" style={{ textAlign: "center", marginTop: 34, maxWidth: "60ch", marginInline: "auto" }}>
            Covers Meta, Google and TikTok ads, AI SEO, email and SMS, website and checkout, and ad creative. Share
            read-only access for the deepest audit. Gaps are flagged where access is missing.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head center reveal">
            <span className="eyebrow center">Who this is for</span>
            <h2>The audit only works with real ad data behind it</h2>
            <p>These criteria exist so the findings are specific, not speculative. If you do not qualify yet, come back when you do.</p>
          </div>
          <div className="elig">
            <div className="glass elig-col reveal">
              <h3>{YES_BADGE} You qualify if</h3>
              <ul>
                <li>
                  {YES_BADGE}
                  <span>You have an active e-commerce store on Shopify, WooCommerce or custom built.</span>
                </li>
                <li>
                  {YES_BADGE}
                  <span>You spend at least $30 a day on paid ads on any platform.</span>
                </li>
                <li>
                  {YES_BADGE}
                  <span>You have at least 3 months of paid ad history.</span>
                </li>
                <li>
                  {YES_BADGE}
                  <span>You can share read-only access to the platforms you want audited.</span>
                </li>
                <li>
                  {YES_BADGE}
                  <span>You are open to being a named case study. This is the trade for the free slot.</span>
                </li>
              </ul>
            </div>
            <div className="glass elig-col reveal">
              <h3>{NO_BADGE} This is not for you if</h3>
              <ul>
                <li>
                  {NO_BADGE}
                  <span>You only sell on marketplaces like Daraz or Amazon with no store of your own.</span>
                </li>
                <li>
                  {NO_BADGE}
                  <span>You spend below $30 a day on ads. There is not enough data for a meaningful audit.</span>
                </li>
                <li>
                  {NO_BADGE}
                  <span>You have less than 3 months of ad history. There is no baseline to measure against.</span>
                </li>
                <li>
                  {NO_BADGE}
                  <span>You run a service business. This audit is for product stores only.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <div className="glass pricecard reveal">
            <span className="eyebrow center">The offer</span>
            <p className="dim" style={{ marginTop: 18, textTransform: "uppercase", letterSpacing: ".14em", fontSize: ".78rem" }}>
              Normal price
            </p>
            <div className="pricerow">
              <span className="was strike">$99 USD</span>
            </div>
            <ul className="feature-list">
              <li>
                {CHECK}
                <span>A 30 minute strategy call, one on one.</span>
              </li>
              <li>
                {CHECK}
                <span>A full-stack bottleneck analysis report in PDF.</span>
              </li>
              <li>
                {CHECK}
                <span>Covering paid ads, website CRO, creatives, email and retention.</span>
              </li>
              <li>
                {CHECK}
                <span>Delivered within 5 business days of access being granted.</span>
              </li>
            </ul>
            <div style={{ marginTop: 30, paddingTop: 28, borderTop: "1px solid var(--border)" }}>
              <p className="dim" style={{ textTransform: "uppercase", letterSpacing: ".14em", fontSize: ".78rem" }}>
                Founding offer
              </p>
              <div className="pricerow">
                <span className="now display-grad">Free</span>
                <span className="dim">for the first 3 brands</span>
              </div>
              <p style={{ color: "var(--text-soft)", marginTop: 14, maxWidth: "46ch", marginInline: "auto" }}>
                In exchange for a named case study. You approve all content before it goes live.
              </p>
              <div style={{ marginTop: 28 }}>
                <a className="btn btn-primary btn-lg btn-arrow" href="#apply">
                  Claim your free slot{" "}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div className="reveal">
            <span className="eyebrow">Who runs the audit</span>
            <h2 style={{ marginTop: 16 }}>One senior expert who owns every decision</h2>
            <p style={{ marginTop: 18, color: "var(--text-soft)" }}>
              CeyagMark is led by Shashika Tharinda, with 5 years building and scaling performance marketing for
              e-commerce and growing brands. Paid ads, conversion optimisation, retention and analytics, run as one
              accountable system rather than separate tactics.
            </p>
            <p style={{ marginTop: 16, color: "var(--text-soft)" }}>
              The AI stack does the heavy, repetitive work at a scale a traditional team cannot match, so you get
              agency-level output without agency overhead.
            </p>
            <div className="chips">
              <span>Foreplay</span>
              <span>Claude and Gemini</span>
              <span>Microsoft Clarity</span>
              <span>Madgicx</span>
              <span>Triple Whale</span>
              <span>Meta Advantage+</span>
              <span>Klaviyo and Omnisend</span>
              <span>AdCreative.ai</span>
            </div>
          </div>
          <div className="reveal">
            <div className="card" style={{ display: "flex", gap: 18, alignItems: "center" }}>
              <img
                src="/img/founder.webp"
                alt="Shashika Tharinda, founder of CeyagMark"
                width={74}
                height={74}
                loading="lazy"
                style={{ flex: "none", width: 74, height: 74, borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <p style={{ fontSize: ".98rem", color: "var(--text)", margin: 0 }}>
                  <strong>Shashika Tharinda, founder of CeyagMark.</strong> Performance marketing for brands that
                  measure growth in revenue, lifetime value and conversion rate.
                </p>
              </div>
            </div>
            <div className="glass" style={{ marginTop: 18, padding: 26 }}>
              <p style={{ color: "var(--text)", fontWeight: 600, margin: "0 0 14px" }}>After the audit, the close is simple.</p>
              <p style={{ color: "var(--text-soft)", margin: 0, fontStyle: "italic" }}>
                &quot;I&apos;ve mapped every bottleneck in your store. I know exactly what&apos;s costing you money
                and what fixing it is worth. Here&apos;s how we move forward.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section band" id="apply">
        <div className="wrap">
          <div className="section-head center reveal">
            <span className="eyebrow center">Apply for a founding slot</span>
            <h2>Six quick steps. All multiple choice.</h2>
            <p>Takes under 3 minutes. We review your answers and reply on WhatsApp within 24 hours. Only 3 slots.</p>
          </div>
          <div className="appwrap reveal">
            <div className="glass appform" aria-live="polite">
              <FreeAuditForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
