import Link from "next/link";

const BACK_ARROW = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: "rotate(180deg)" }}>
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const FWD_ARROW = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function CaseDetailShell({
  breadcrumbLabel,
  eyebrow,
  h1,
  lede,
  facts,
  ctaText,
  children,
}: {
  breadcrumbLabel: string;
  eyebrow: string;
  h1: string;
  lede: string;
  facts: [string, React.ReactNode][];
  ctaText: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link> &nbsp;&rsaquo;&nbsp; <Link href="/portfolio">Portfolio</Link> &nbsp;&rsaquo;&nbsp; {breadcrumbLabel}
          </nav>
          <span className="eyebrow reveal">{eyebrow}</span>
          <h1 className="reveal">{h1}</h1>
          <p className="lede reveal">{lede}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="case-detail">
            <dl className="detail-facts reveal">
              {facts.map(([term, def]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{def}</dd>
                </div>
              ))}
            </dl>

            {children}

            <div className="case-nav">
              <Link className="link-arrow" href="/portfolio">
                {BACK_ARROW} All case studies
              </Link>
              <Link className="link-arrow" href="/growth-audit">
                {ctaText} {FWD_ARROW}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
