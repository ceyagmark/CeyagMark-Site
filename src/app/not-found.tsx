import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { BgAura } from "@/components/bg-aura";

// Next.js's global not-found page. robots noindex,follow is the framework
// default for this route already (no <meta> needed), carried over from the
// live site's explicit tag for documentation parity only.
export default function NotFound() {
  return (
    <>
      <BgAura />
      <SiteNav />
      <main id="main">
        <section className="hero" style={{ textAlign: "center", paddingBlock: "clamp(56px, 9vw, 110px)" }}>
          <div className="wrap narrow">
            <div
              aria-hidden="true"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontWeight: 700,
                fontSize: "clamp(6rem, 22vw, 13rem)",
                lineHeight: 0.82,
                letterSpacing: "-.06em",
                background: "linear-gradient(160deg, var(--text) 8%, var(--brand-glow) 55%, var(--brand-2))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              404
            </div>
            <h1 style={{ marginTop: 26 }}>We find leaks for a living. Looks like we left one.</h1>
            <p className="lede" style={{ margin: "22px auto 0" }}>
              This page is not here. Either the address has a typo, or we moved something and did not redirect it
              properly, which is exactly the kind of thing we get paid to catch.
            </p>

            <div
              style={{
                maxWidth: 460,
                margin: "34px auto 0",
                padding: "20px 22px",
                border: "1px solid var(--border)",
                borderRadius: 14,
                background: "var(--surface)",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: ".84rem", color: "var(--text-soft)", marginBottom: 9 }}>
                <span>This page</span>
                <b style={{ color: "var(--bad)", fontWeight: 700, fontSize: ".74rem", letterSpacing: ".06em", textTransform: "uppercase" }}>Leaking</b>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: "var(--surface-2)", border: "1px solid var(--border)", overflow: "hidden" }}>
                <i style={{ display: "block", height: "100%", width: "100%", background: "linear-gradient(90deg, var(--brand-deep), var(--bad))" }} />
              </div>
              <p style={{ fontSize: ".82rem", color: "var(--text-mute)", marginTop: 14, maxWidth: "none" }}>
                Every page that 404s is a visitor who came looking for you and left with nothing. On your own site,
                that is worth finding. Our audits check for exactly this.
              </p>
            </div>

            <div className="hero-actions" style={{ justifyContent: "center", marginTop: 34 }}>
              <Link className="btn btn-primary btn-lg btn-arrow" href="/">
                Back to home{" "}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link className="btn btn-ghost btn-lg" href="/portfolio">
                See the work
              </Link>
            </div>

            <div style={{ display: "grid", gap: 16, marginTop: 52, textAlign: "left" }} className="grid cols-2">
              <Link
                href="/portfolio"
                style={{ display: "block", padding: "22px 24px", border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-space-grotesk)", fontWeight: 600, fontSize: "1.04rem", color: "var(--text)" }}>
                  The work
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ color: "var(--brand-glow)" }}>
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p style={{ fontSize: ".88rem", color: "var(--text-mute)", marginTop: 7, maxWidth: "none" }}>
                  Case studies with real numbers, and how each one was measured.
                </p>
              </Link>
              <Link
                href="/services"
                style={{ display: "block", padding: "22px 24px", border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-space-grotesk)", fontWeight: 600, fontSize: "1.04rem", color: "var(--text)" }}>
                  Services and pricing
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ color: "var(--brand-glow)" }}>
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p style={{ fontSize: ".88rem", color: "var(--text-mute)", marginTop: 7, maxWidth: "none" }}>
                  Every engagement scoped and priced in public, from LKR 14,999.
                </p>
              </Link>
              <Link
                href="/growth-audit"
                style={{ display: "block", padding: "22px 24px", border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-space-grotesk)", fontWeight: 600, fontSize: "1.04rem", color: "var(--text)" }}>
                  Free Growth Audit
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ color: "var(--brand-glow)" }}>
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p style={{ fontSize: ".88rem", color: "var(--text-mute)", marginTop: 7, maxWidth: "none" }}>
                  About three minutes. Tells you where your own funnel is leaking.
                </p>
              </Link>
              <Link
                href="/contact"
                style={{ display: "block", padding: "22px 24px", border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)" }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-space-grotesk)", fontWeight: 600, fontSize: "1.04rem", color: "var(--text)" }}>
                  Talk to us
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ color: "var(--brand-glow)" }}>
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p style={{ fontSize: ".88rem", color: "var(--text-mute)", marginTop: 7, maxWidth: "none" }}>
                  WhatsApp or email. You reach the person who would run your account.
                </p>
              </Link>
            </div>

            <p className="dim" style={{ fontSize: ".88rem", marginTop: 38 }}>
              Followed a link that should work?{" "}
              <a
                href="https://wa.me/94703727895?text=Hi%20CeyagMark%2C%20I%20hit%20a%20broken%20link%20on%20your%20site."
                target="_blank"
                rel="noopener"
                style={{ color: "var(--brand-glow)", fontWeight: 600 }}
              >
                Tell us on WhatsApp
              </a>{" "}
              and we will fix it.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
      <ThemeToggle />
      <WhatsAppFab />
    </>
  );
}
