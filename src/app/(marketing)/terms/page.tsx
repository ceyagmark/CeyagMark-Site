import type { Metadata } from "next";
import Link from "next/link";

// New page — see privacy/page.tsx for the same audit finding this fixes.
export const metadata: Metadata = {
  title: "Terms of Service | CeyagMark",
  description: "The terms that apply to using ceyagmark.com, booking a consulting session, or applying for an audit.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> &nbsp;&rsaquo;&nbsp; Terms of Service
          </nav>
          <span className="eyebrow reveal">Legal</span>
          <h1 className="reveal">Terms of Service</h1>
          <p className="lede reveal">Last updated 25 August 2026.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="case-detail">
            <h2>What these terms cover</h2>
            <p>
              These terms cover your use of ceyagmark.com, including the contact form, the free performance audit
              application, the Growth Audit quiz, and booking a consulting session. They do not cover a paid
              engagement (a Leak Report, a Fix Sprint, Build &amp; Run, or a project with our engineering partner
              AxionCore), which is agreed separately in writing before any such work starts.
            </p>

            <h2>The quiz and audit are diagnostic, not professional advice</h2>
            <p>
              The Growth Audit quiz and the free performance audit produce a score and recommendations based on the
              answers you give us. They are a starting diagnosis, not financial, legal, or guaranteed marketing
              advice, and we do not warrant a specific business outcome from acting on them.
            </p>

            <h2>Booking a consulting session</h2>
            <p>
              Consulting sessions are priced and described on the{" "}
              <Link href="/consulting" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
                consulting page
              </Link>{" "}
              at the time you book. Payment is arranged directly with us (currently by bank transfer or the method we
              confirm with you), not through this website. If a paid session genuinely was not worth it to you, tell
              us and we refund it, no argument, as stated on the consulting page.
            </p>
            <p className="mt-s">
              You can cancel a booking yourself at any time before the session using the manage link sent in your
              confirmation email. We ask for reasonable notice so the slot can be offered to someone else.
            </p>

            <h2>The free audit&apos;s founding-slot offer</h2>
            <p>
              The free performance audit is offered to a limited number of qualifying applicants in exchange for
              being featured as a named case study. You approve all content, including any figures, before it is
              published. Applying does not guarantee a slot; we assess fit against the criteria stated on the
              free-audit page.
            </p>

            <h2>Acceptable use</h2>
            <p>Do not use this site to submit false information, attempt to access another visitor&apos;s booking or data, or interfere with the site&apos;s normal operation.</p>

            <h2>No warranty on the site itself</h2>
            <p>The site is provided as is. We work to keep it available and accurate, but we do not guarantee it will be uninterrupted or error-free.</p>

            <h2>Limitation of liability</h2>
            <p>
              To the extent permitted by law, CeyagMark is not liable for indirect or consequential loss arising
              from your use of this site. Nothing here limits liability that cannot lawfully be limited.
            </p>

            <h2>Governing law</h2>
            <p>These terms are governed by the laws of Sri Lanka.</p>

            <h2>Contact</h2>
            <p>
              Questions about these terms:{" "}
              <a href="mailto:growth@ceyagmark.com" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
                growth@ceyagmark.com
              </a>
              .
            </p>

            <div className="case-nav">
              <Link className="link-arrow" href="/privacy">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: "rotate(180deg)" }}>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>{" "}
                Privacy Policy
              </Link>
              <Link className="link-arrow" href="/contact">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
