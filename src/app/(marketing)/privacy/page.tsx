import type { Metadata } from "next";
import Link from "next/link";

// New page — does not exist on the live site (audit finding: /privacy,
// /terms and /privacy-policy all 404). Written per the privacy-policy skill,
// covering the Pixel, GA4, Clarity and form data this app actually collects.
export const metadata: Metadata = {
  title: "Privacy Policy | CeyagMark",
  description: "How CeyagMark collects, uses and protects the information you share through this site, including forms, the growth audit quiz, and analytics.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> &nbsp;&rsaquo;&nbsp; Privacy Policy
          </nav>
          <span className="eyebrow reveal">Legal</span>
          <h1 className="reveal">Privacy Policy</h1>
          <p className="lede reveal">Last updated 25 August 2026. Plain language, no legalese we would not use ourselves.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="case-detail">
            <h2>Who this covers</h2>
            <p>
              This policy covers ceyagmark.com and its booking, contact, free-audit and growth-audit quiz forms,
              operated by CeyagMark, a web development and performance marketing business based in Nittambuwa, Sri
              Lanka. Contact us at{" "}
              <a href="mailto:growth@ceyagmark.com" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
                growth@ceyagmark.com
              </a>{" "}
              for anything on this page.
            </p>

            <h2>What we collect, and why</h2>
            <p>We collect only what a form or booking asks you to provide, and only for the reason stated next to it.</p>
            <ul className="feature-list">
              <li>
                <span className="ck">•</span>
                <span>
                  <strong>Contact form:</strong> name, email, business or website, approximate revenue, and your
                  message. Used to reply to your enquiry.
                </span>
              </li>
              <li>
                <span className="ck">•</span>
                <span>
                  <strong>Free performance audit application:</strong> the answers above plus store platform, ad
                  budget, ad history and goals. Used to assess whether the free audit is a fit and to run it if so.
                </span>
              </li>
              <li>
                <span className="ck">•</span>
                <span>
                  <strong>Growth Audit quiz:</strong> your name, email, phone (optional) and your answers about
                  acquisition, conversion and retention. Used to generate your scorecard and to follow up with the
                  recommended next step.
                </span>
              </li>
              <li>
                <span className="ck">•</span>
                <span>
                  <strong>Booking a consulting session:</strong> name, email, phone (optional) and any notes you add.
                  Used to confirm and run the session, and to send a reminder or manage-booking link.
                </span>
              </li>
            </ul>
            <p className="mt-s">We never ask for payment card details, passwords, or government ID through any form on this site.</p>

            <h2>Cookies and analytics</h2>
            <p>
              This site uses Google Tag Manager to load, when configured, the Meta Pixel, Google Analytics 4 and
              Microsoft Clarity. These tools may set cookies or use local storage to recognise your browser across
              visits and to record how you use the site (pages viewed, clicks, session recordings in Clarity&apos;s
              case), so we can see which pages and campaigns actually work.
            </p>
            <p className="mt-s">
              Where your region requires it, these tools load only after you accept analytics cookies via the
              consent banner. Declining analytics cookies does not block any form, booking, or the quiz, all of
              which work without them.
            </p>
            <p className="mt-s">
              Booking flow state (your progress through the calendar) is held in the browser&apos;s memory for the
              current visit only and is not written to a cookie.
            </p>

            <h2>How your data is stored</h2>
            <p>
              Form submissions, bookings and quiz answers are stored in our own database. We do not sell your data,
              and we do not share it with anyone outside CeyagMark except the infrastructure providers that host our
              database and send our email (currently Supabase and Resend), who process it only on our instruction.
            </p>

            <h2>How long we keep it</h2>
            <p>
              Booking records are kept as a business and, where applicable, tax record. Contact, audit and quiz
              submissions are kept while they are an active or recent enquiry, and are archived (not shown in our
              active pipeline) once a lead is closed or goes cold. You can ask us to delete your information at any
              time by emailing the address above; we will confirm once it is done.
            </p>

            <h2>Your choices</h2>
            <p>You can ask us, at any time, to tell you what we hold about you, correct it, or delete it. You can also unsubscribe from any email we send using the link in that email, or by replying and asking.</p>

            <h2>Changes to this policy</h2>
            <p>If this policy changes in a way that matters, we will update the date at the top of this page. Continuing to use the site after a change means you accept the update.</p>

            <div className="case-nav">
              <Link className="link-arrow" href="/terms">
                Terms of Service{" "}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link className="link-arrow" href="/contact">
                Contact us about your data
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
