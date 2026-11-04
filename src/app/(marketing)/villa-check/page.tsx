import type { Metadata } from "next";
import { VillaCheckForm } from "./villa-check-form";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Free Direct Booking Check for Sri Lankan Villas | CeyagMark",
  description:
    "See what Booking.com and Airbnb take from your villa each year, in one minute. Get 3 fixes to win more direct bookings, and a free website preview if your villa qualifies.",
  alternates: { canonical: "/villa-check" },
  openGraph: {
    images: OG_IMAGE,
    title: "What did booking sites take from your villa last year?",
    description: "Free 1-minute Direct Booking Check for villa and boutique hotel owners in Sri Lanka.",
    url: "/villa-check",
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ceyagmark.com/" },
    { "@type": "ListItem", position: 2, name: "Direct Booking Check", item: "https://ceyagmark.com/villa-check" },
  ],
};

const STEPS = [
  { n: "1", title: "Enter your numbers", body: "Rooms, nightly rate, occupancy. No sign-up, the result shows instantly." },
  { n: "2", title: "Get 3 fixes", body: "Picked from your answers: where you're losing direct bookings, and what to do first." },
  { n: "3", title: "See your villa as a website", body: "Villas with 4+ rooms get a free 15-second preview of their own direct-booking site within 48 hours." },
];

export default function VillaCheckPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />

      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div>
            <span className="pill reveal">
              <i style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--good)", display: "inline-block" }} /> For villa and
              boutique hotel owners in Sri Lanka
            </span>
            <h1 className="reveal">
              What did booking sites <span className="display-grad">take from you</span> last year?
            </h1>
            <p className="lede reveal">
              Booking.com and Airbnb charge a cut of every booking, including guests who already know you. Check
              yours in one minute, then see how to keep more of it.
            </p>
            <div className="hero-actions reveal">
              <a className="btn btn-primary btn-lg btn-arrow" href="#check">
                Check mine free{" "}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
            <div className="hero-trust reveal">
              <span>
                <i className="dot" /> Free, about 1 minute
              </span>
              <span>
                <i className="dot" /> Result shows instantly
              </span>
              <span>
                <i className="dot" /> Reply on WhatsApp
              </span>
            </div>
          </div>

          <div className="reveal" id="check">
            <VillaCheckForm />
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="wrap">
          <div className="section-head center reveal">
            <span className="eyebrow center">How it works</span>
            <h2>Your numbers first. A pitch only if you ask.</h2>
          </div>
          <div className="vc-steps">
            {STEPS.map((s) => (
              <div key={s.n} className="glass vc-step reveal">
                <span className="vc-stepno">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
          <p className="dim note reveal" style={{ textAlign: "center", marginTop: 28, fontSize: ".92rem" }}>
            Booking sites often don&apos;t allow a cheaper public price on your own site. Our fixes use perks for direct
            guests instead, so you stay inside their rules.
          </p>
        </div>
      </section>
    </>
  );
}
