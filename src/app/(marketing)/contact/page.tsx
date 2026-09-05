import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ContactHero } from "./contact-hero";
import { ContactForm } from "./contact-form";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Contact CeyagMark, Web & Marketing Agency Sri Lanka | WhatsApp or Email",
  description:
    "Contact CeyagMark, a web development and performance marketing agency in Nittambuwa, Sri Lanka. WhatsApp +94 70 372 7895, email growth@ceyagmark.com, or send a message. We reply within one business day.",
  alternates: { canonical: "/contact" },
  openGraph: {
    images: OG_IMAGE,
    title: "Contact CeyagMark, Web & Marketing Agency Sri Lanka",
    description: "WhatsApp us, or send a message. You talk to the person who would run your account.",
    url: "/contact",
  },
};

const CONTACT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact CeyagMark",
  url: "https://ceyagmark.com/contact",
  about: { "@id": "https://ceyagmark.com/#organization" },
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_JSON_LD) }} />

      <section className="page-hero">
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> &nbsp;&rsaquo;&nbsp; Contact
          </nav>
          <span className="eyebrow reveal">Book a strategy call</span>
          <Suspense fallback={<h1>Let us talk about your numbers.</h1>}>
            <ContactHero />
          </Suspense>
          <div className="hero-actions reveal">
            <a
              className="btn btn-primary btn-lg"
              href="https://wa.me/94703727895?text=Hi%20CeyagMark%2C%20I%20would%20like%20to%20talk%20about%20a%20project."
              target="_blank"
              rel="noopener"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.13h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 01-1.25-4.36c0-4.54 3.7-8.24 8.24-8.24a8.18 8.18 0 015.82 2.42 8.18 8.18 0 012.41 5.83c0 4.54-3.69 8.23-8.23 8.23z" />
              </svg>
              WhatsApp us now
            </a>
            <a className="btn btn-ghost btn-lg" href="#contactForm">
              Send a message instead
            </a>
          </div>
          <p className="dim reveal" style={{ fontSize: ".9rem", marginTop: 20 }}>
            Based in Nittambuwa, Sri Lanka. We work with Sri Lankan businesses and with clients in Australia, New
            Zealand and the UK.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }} id="contactForm">
        <div className="wrap">
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
