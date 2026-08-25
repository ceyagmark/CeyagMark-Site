"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const TIER_COPY: Record<string, [string, string]> = {
  high: [
    "You are ready to scale. Let us map the plan.",
    "Your Growth Audit shows strong fit for a full growth engagement. Book a strategy call and we will turn your scorecard into a 90 day plan.",
  ],
  mid: [
    "Let us fix your biggest leak first.",
    "Your Growth Audit pointed to one high value fix. Tell us a little more and we will scope a focused sprint.",
  ],
  low: [
    "Let us get your foundation right.",
    "Send us your details and we will point you to the right starting resources, and check in when you are ready to scale.",
  ],
};

// Fixes the audit finding: window.CEYAG_LEAD_ENDPOINT was undefined, the
// fetch was silently skipped, and the form showed success anyway. This posts
// to /api/leads (writes to the database first) and only renders success
// after a confirmed 200.
export function ContactForm() {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier");
  const intent = searchParams.get("intent");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [revenue, setRevenue] = useState("");
  const [message, setMessage] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validName = name.trim().length > 0;
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setNameError(!validName);
    setEmailError(!validEmail);
    if (!validName || !validEmail || submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "contact",
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || undefined,
          fields: {
            revenue: revenue.trim(),
            message: message.trim(),
            tier: tier ?? "",
            intent: intent ?? "",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error?.message ?? "Something went wrong. Try again.");
        setSubmitting(false);
        return;
      }
      setSuccess(true);
    } catch {
      setSubmitError("Could not reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="split" style={{ alignItems: "start", gap: 48 }}>
      <div className="reveal">
        <div className="glass" style={{ padding: 32 }}>
          {!success ? (
            <form onSubmit={onSubmit} noValidate>
              <label className="block mb-4" style={{ display: "block", marginBottom: 16 }}>
                <span style={{ display: "block", marginBottom: 6 }}>Your name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  maxLength={200}
                  className="w-full"
                  style={{ width: "100%", minHeight: 44, borderRadius: 10, border: "1px solid var(--border)", background: "transparent", padding: "0 14px", color: "var(--text)" }}
                />
                {nameError && (
                  <span role="alert" style={{ color: "var(--bad)", fontSize: ".82rem" }}>
                    Please enter your name.
                  </span>
                )}
              </label>
              <label style={{ display: "block", marginBottom: 16 }}>
                <span style={{ display: "block", marginBottom: 6 }}>Work email</span>
                <input
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  maxLength={320}
                  style={{ width: "100%", minHeight: 44, borderRadius: 10, border: "1px solid var(--border)", background: "transparent", padding: "0 14px", color: "var(--text)" }}
                />
                {emailError && (
                  <span role="alert" style={{ color: "var(--bad)", fontSize: ".82rem" }}>
                    Please enter a valid email.
                  </span>
                )}
              </label>
              <label style={{ display: "block", marginBottom: 16 }}>
                <span style={{ display: "block", marginBottom: 6 }}>Business or website</span>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  autoComplete="organization"
                  maxLength={200}
                  style={{ width: "100%", minHeight: 44, borderRadius: 10, border: "1px solid var(--border)", background: "transparent", padding: "0 14px", color: "var(--text)" }}
                />
              </label>
              <label style={{ display: "block", marginBottom: 16 }}>
                <span style={{ display: "block", marginBottom: 6 }}>
                  Approximate monthly revenue <span className="dim">(optional)</span>
                </span>
                <input
                  list="rev-options"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="Select or type"
                  style={{ width: "100%", minHeight: 44, borderRadius: 10, border: "1px solid var(--border)", background: "transparent", padding: "0 14px", color: "var(--text)" }}
                />
                <datalist id="rev-options">
                  <option value="Pre revenue or just starting" />
                  <option value="Up to 10k a month" />
                  <option value="10k to 100k a month" />
                  <option value="100k or more a month" />
                </datalist>
              </label>
              <label style={{ display: "block", marginBottom: 20 }}>
                <span style={{ display: "block", marginBottom: 6 }}>What do you want to grow?</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
                  maxLength={2000}
                  rows={4}
                  placeholder="For example, cut our CPA, scale paid social profitably, build a retention engine"
                  style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", background: "transparent", padding: 14, color: "var(--text)" }}
                />
              </label>
              {submitError && (
                <p role="alert" style={{ color: "var(--bad)", marginBottom: 16 }}>
                  {submitError}
                </p>
              )}
              <button
                className="btn btn-primary btn-lg btn-arrow"
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                style={{ width: "100%" }}
              >
                {submitting ? "Sending…" : "Request my strategy call"}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <p className="dim center" style={{ marginTop: 16, fontSize: ".85rem" }}>
                We reply within one business day. No spam, ever.
              </p>
            </form>
          ) : (
            <div role="status" style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(46,134,255,.16)",
                  color: "var(--brand-glow)",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 18px",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 style={{ fontSize: "1.6rem" }}>Got it. Thank you.</h2>
              <p className="dim mt-s">
                A CeyagMark strategist will be in touch within one business day. In the meantime, if you have not
                taken the{" "}
                <Link href="/growth-audit" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
                  free Growth Audit
                </Link>
                , it will make our call far more useful.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="reveal">
        <div className="card glow-hover">
          <h3>What happens next</h3>
          <ul className="feature-list mt-s">
            <li>
              <span className="ck" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>A senior strategist reviews your details before the call.</span>
            </li>
            <li>
              <span className="ck" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>We tell you honestly whether we can move your numbers.</span>
            </li>
            <li>
              <span className="ck" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>No pressure, no jargon, and no twelve month lock in to start.</span>
            </li>
          </ul>
          <hr className="divider" style={{ margin: "26px 0" }} />
          <h4 style={{ fontSize: ".76rem", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--text-mute)", marginBottom: 12 }}>
            Prefer to message us?
          </h4>
          <p style={{ fontSize: ".95rem", marginBottom: 8 }}>
            <a
              href="https://wa.me/94703727895?text=Hi%20CeyagMark%2C%20I%20would%20like%20to%20talk."
              target="_blank"
              rel="noopener"
              style={{ color: "var(--brand-glow)", fontWeight: 600 }}
            >
              WhatsApp +94 70 372 7895
            </a>
          </p>
          <p style={{ fontSize: ".95rem" }}>
            <a href="mailto:growth@ceyagmark.com" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
              growth@ceyagmark.com
            </a>
          </p>
        </div>
        <div className="card glow-hover mt-m">
          <h3>Not ready to talk?</h3>
          <p className="mt-s" style={{ fontSize: ".95rem" }}>
            Start with the free Growth Audit. About three minutes, a custom scorecard, zero obligation.
          </p>
          <Link className="btn btn-ghost mt-m" href="/growth-audit">
            Take the Growth Audit
          </Link>
        </div>
      </div>
    </div>
  );
}
