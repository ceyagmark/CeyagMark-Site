import Link from "next/link";
import type { CaseCardData } from "./cases-data";

const ARROW = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function basisLabel(c: CaseCardData): string | undefined {
  if (c.basisLabel) return c.basisLabel;
  if (c.slug === "case-resort-group") return "What we built.";
  if (c.metrics) return "How it was measured.";
  return undefined;
}

export function CaseCard({ c }: { c: CaseCardData }) {
  const isOutcome = c.kind === "outcome" || c.kind === "outcome-lead";
  const label = basisLabel(c);
  const isProgress = c.kind === "progress";
  const kindLabel =
    c.kind === "outcome-lead"
      ? "Outcome · Built and marketed by us"
      : c.kind === "outcome"
        ? c.slug === "case-agrilhotech"
          ? "Outcome · Our own store"
          : "Outcome"
        : c.kind === "progress"
          ? "In build"
          : "Build";

  return (
    <article
      className={`case-card glow-hover reveal${isOutcome ? " is-outcome" : ""}${isProgress ? " is-progress" : ""}${c.kind === "outcome-lead" ? " span-2" : ""}`}
      data-tags={c.tags.join("|")}
    >
      <div className="case-top">
        <span className="case-kind">{kindLabel}</span>
        {c.kind === "outcome-lead" && c.industry && <span className="case-industry">{c.industry}</span>}
      </div>
      <div className="case-client">{c.client}</div>
      {c.kind !== "outcome-lead" && c.industry && <div className="case-industry">{c.industry}</div>}
      <h3 className="case-head">{c.headline}</h3>

      {c.funnel ? (
        <div className="case-body">
          <div>
            {c.metrics && (
              <div className="case-metric">
                {c.metrics.map((m) => (
                  <div className="m-row" key={m.k}>
                    <span className="m-k">{m.k}</span>
                    <span className={`m-v${m.neutral ? " neutral" : ""}`}>{m.v}</span>
                  </div>
                ))}
              </div>
            )}
            {c.basis && (
              <p className="case-basis">
                {label && <b>{label}</b>} {c.basis}
              </p>
            )}
            {c.connect && (
              <div className="case-connect">
                <span className="cc-label">Where the two connected</span>
                <p>{c.connect}</p>
              </div>
            )}
            {c.engagement && (
              <div className="case-engagement">
                Engagement: {c.engagement.href ? <Link href={c.engagement.href}>{c.engagement.label}</Link> : c.engagement.label}
              </div>
            )}
          </div>
          <div>
            <div className="mini-funnel" aria-label="Booking funnel, five steps, shown as a percentage of the step before">
              {c.funnel.map((step) => (
                <div key={step.label}>
                  <div className="mf-row">
                    <span className="mf-label">
                      {step.label} {step.note && <span className="mf-note">{step.note}</span>}
                    </span>
                    <span className="mf-n">{step.pct}%</span>
                  </div>
                  <div className="mf-bar">
                    <i style={{ "--w": `${step.pct}%` } as React.CSSProperties} />
                  </div>
                </div>
              ))}
            </div>
            {c.funnelNote && (
              <p className="case-basis" style={{ marginTop: 16 }}>
                {c.funnelNote}
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          {c.metrics && (
            <div className="case-metric">
              {c.metrics.map((m) => (
                <div className="m-row" key={m.k}>
                  <span className="m-k">{m.k}</span>
                  <span className={`m-v${m.neutral ? " neutral" : ""}`}>{m.v}</span>
                </div>
              ))}
            </div>
          )}
          {c.basis && (
            <p className="case-basis" style={c.metrics ? undefined : { marginTop: 18 }}>
              {label && <b>{label} </b>}
              {c.basis}
            </p>
          )}
          {c.connect && (
            <div className="case-connect">
              <span className="cc-label">Where the two connected</span>
              <p>{c.connect}</p>
            </div>
          )}
          {c.engagement && (
            <div className="case-engagement">
              Engagement: {c.engagement.href ? <Link href={c.engagement.href}>{c.engagement.label}</Link> : c.engagement.label}
            </div>
          )}
        </>
      )}

      <div className="case-tags">
        {c.cardTags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="case-foot">
        {c.liveUrl && (
          <span className="case-live">
            Live at{" "}
            <a href={c.liveUrl} target="_blank" rel="noopener" data-case-link={c.slug} data-link-kind="live">
              {c.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          </span>
        )}
        {c.detailHref && (
          <Link className="link-arrow" href={c.detailHref} data-case-link={c.slug} data-link-kind="detail">
            Read the full case study {ARROW}
          </Link>
        )}
      </div>
    </article>
  );
}
