"use client";

import { useState } from "react";
import Link from "next/link";
import {
  INDUSTRIES,
  BEST_PRACTICE,
  PROFILE,
  STRATEGIC,
  OPEN_QUESTION,
  BAND_REACTION,
  CTA,
  computeResult,
  fillTokens,
  type Contact,
} from "./quiz-data";
import { trackGrowthAuditCompleted } from "@/lib/analytics/events";

type Step = { kind: "contact" } | { kind: "profile"; idx: number } | { kind: "bp"; idx: number } | { kind: "strategic"; idx: number } | { kind: "open" } | { kind: "loading" } | { kind: "result" };

function buildSteps(): Step[] {
  const steps: Step[] = [{ kind: "contact" }];
  PROFILE.forEach((_, i) => steps.push({ kind: "profile", idx: i }));
  BEST_PRACTICE.forEach((_, i) => steps.push({ kind: "bp", idx: i }));
  STRATEGIC.forEach((_, i) => steps.push({ kind: "strategic", idx: i }));
  steps.push({ kind: "open" });
  return steps;
}
const STEPS = buildSteps();

const CHECK = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ARROW = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const BACK_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function QuizFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const [contact, setContact] = useState<Contact>({ name: "", email: "", phone: "" });
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [profile, setProfile] = useState<Record<string, number>>({});
  const [bp, setBp] = useState<number[]>([]);
  const [unknown, setUnknown] = useState<Record<number, boolean>>({});
  const [big, setBig] = useState<Record<string, number>>({});
  const [openText, setOpenText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null);

  const industry = INDUSTRIES[profile.industry ?? INDUSTRIES.length - 1] ?? INDUSTRIES[INDUSTRIES.length - 1]!;
  const progressPct = Math.round((Math.min(stepIndex, STEPS.length) / STEPS.length) * 100);
  const progressBar = <i style={{ width: `${progressPct}%` }} />;

  function goNext() {
    if (stepIndex < STEPS.length - 1) setStepIndex((i) => i + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function goPrev() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submitContact() {
    const validName = contact.name.trim().length > 0;
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim());
    setNameError(!validName);
    setEmailError(!validEmail);
    if (!validName || !validEmail) return;
    goNext();
  }

  async function finish(finalOpenText: string) {
    const r = computeResult(bp, unknown, profile, big, industry);
    setResult(r);
    setStepIndex(STEPS.length); // past the last real step -> "loading" render below
    setSubmitting(true);
    setSubmitError(null);
    trackGrowthAuditCompleted({
      tier: r.tier,
      score: r.pct,
      grade: r.grade,
      industry: industry.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          quizSlug: "growth-audit",
          complete: true,
          answers: {
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            industry: industry.id,
            industryLabel: industry.label,
            profile,
            bestPractice: bp,
            unknown,
            strategic: big,
            notes: finalOpenText,
            score: r.pct,
            grade: r.grade,
            tier: r.tier,
          },
          source: { utm: "" },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error?.message ?? "Something went wrong, but your scorecard is ready below.");
      }
    } catch {
      setSubmitError("Could not reach the server, but your scorecard is ready below.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="quiz-progress-bar" aria-hidden="true">
        {progressBar}
      </div>
      {renderBody()}
    </>
  );

  function renderBody(): React.ReactNode {
  if (result) {
    const first = contact.name.split(" ")[0] || "there";
    const cta = CTA[result.tier];
    return (
      <div className="quiz-step active">
        <div className="result-head">
          <span className="q-count">{first}, here&apos;s your Growth Scorecard</span>
          <div className="gauge" role="img" aria-label={`Overall growth score ${result.pct} out of 100, grade ${result.grade}`}>
            <svg viewBox="0 0 200 110">
              <path className="track" d="M16 100 A 84 84 0 0 1 184 100" />
              <path className="fill" d="M16 100 A 84 84 0 0 1 184 100" style={{ strokeDasharray: 263.9, strokeDashoffset: 263.9 - 263.9 * (result.pct / 100) }} />
            </svg>
            <div className="gauge-grade">
              <div className="g">{result.grade}</div>
              <div className="s">{result.pct} / 100</div>
            </div>
          </div>
          <div className={`result-band band-${result.band}`}>{BAND_REACTION[result.band]}</div>
          <p className="result-context">Benchmarked for a {result.industryLabel.toLowerCase()}.</p>
        </div>

        {result.unknownCount > 0 && (
          <div className="q-unknown-banner">
            <div>
              <strong>
                {result.unknownCount} answer{result.unknownCount > 1 ? "s" : ""} marked not sure.
              </strong>{" "}
              Confirm these with whoever owns the data for a sharper, more accurate score.
            </div>
          </div>
        )}

        <div className="mp-rows" style={{ marginTop: 28, border: "1px solid var(--border)", borderRadius: 14, padding: "6px 20px" }}>
          {(["Acquisition", "Conversion", "Retention"] as const).map((name) => {
            const standing = result.leverStanding[name === "Retention" ? "Retention" : name];
            const color = standing === "Strong" ? "var(--good)" : standing === "Needs work" ? "var(--warn)" : "var(--bad)";
            return (
              <div className="mp-row" key={name}>
                <span className="k">{name === "Retention" ? "Retention and LTV" : name}</span>
                <span className="v tnum" style={{ fontSize: "1.3rem", color }}>
                  {standing}
                </span>
              </div>
            );
          })}
        </div>

        <h3 style={{ marginTop: 36 }}>Your 3 biggest opportunities</h3>
        <div className="insights">
          {result.insights.map((ins, i) => (
            <div className="insight" key={i}>
              <span className="ico" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <h3>{ins.unknown ? `${ins.tag} gap, to confirm` : `${ins.tag} leak`}</h3>
                <p>{ins.unknown ? "You marked this as not sure. It's worth confirming with whoever owns the data, it's often where the fastest win hides." : ins.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="result-cta">
          <span className="pill">{cta.eyebrow}</span>
          <h3 style={{ marginTop: 16 }}>{cta.h}</h3>
          <p>{cta.p}</p>
          <ul className="stack">
            {cta.stack.map((s) => (
              <li key={s}>
                <span className="ck">{CHECK}</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <Link className="btn btn-primary btn-lg btn-arrow" href={cta.href}>
            {cta.btn} {ARROW}
          </Link>
        </div>
        {submitError && (
          <p role="alert" style={{ color: "var(--warn)", fontSize: ".85rem", marginTop: 16, textAlign: "center" }}>
            {submitError}
          </p>
        )}
        <p style={{ textAlign: "center", fontSize: ".78rem", color: "var(--text-mute)", marginTop: 22 }}>
          A copy of your scorecard is on its way to {contact.email || "your inbox"}.
        </p>
      </div>
    );
  }

  if (stepIndex >= STEPS.length) {
    return (
      <div className="quiz-step active q-loading">
        <div className="q-spinner" role="status" aria-label="Building your scorecard" />
        <h2>Building your Growth Scorecard…</h2>
        <p className="q-help">Analysing your acquisition, conversion and retention.</p>
      </div>
    );
  }

  const step = STEPS[stepIndex]!;

  if (step.kind === "contact") {
    return (
      <div className="quiz-step active">
        <div className="q-meta">
          <span className="q-count">First, where should we send it?</span>
          <span className="q-tag">Step 1 of {STEPS.length}</span>
        </div>
        <h2>Your custom Growth Scorecard is ready to build.</h2>
        <p className="q-help">Tell us where to deliver your results. Takes about 3 minutes from here.</p>

        <div className={`q-field${nameError ? " invalid" : ""}`}>
          <label htmlFor="f-name">Your name</label>
          <input id="f-name" type="text" autoComplete="name" maxLength={200} value={contact.name} onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} />
          <span className="err">Please enter your name.</span>
        </div>
        <div className={`q-field${emailError ? " invalid" : ""}`}>
          <label htmlFor="f-email">Work email</label>
          <input
            id="f-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={320}
            value={contact.email}
            onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitContact();
            }}
          />
          <span className="err">Please enter a valid email.</span>
        </div>
        <div className="q-field">
          <label htmlFor="f-phone">
            Phone <span className="opt">(optional, for faster follow-up)</span>
          </label>
          <input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} />
        </div>
        <div className="q-privacy">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flex: "none", marginTop: 1, color: "var(--brand-glow)" }}>
            <path d="M12 3l7 4v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V7l7-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <span>Your results are private. No credit card. Unsubscribe anytime.</span>
        </div>
        <div className="q-nav">
          <button className="q-back" type="button" hidden>
            {BACK_ICON} Back
          </button>
          <button className="btn btn-primary btn-arrow" type="button" onClick={submitContact}>
            Start the audit {ARROW}
          </button>
        </div>
      </div>
    );
  }

  if (step.kind === "profile" || step.kind === "bp" || step.kind === "strategic") {
    const idx = step.idx;
    const q = step.kind === "profile" ? PROFILE[idx]! : step.kind === "bp" ? BEST_PRACTICE[idx]! : STRATEGIC[idx]!;
    const bucket = step.kind;
    const canSkip = bucket === "bp";
    const currentValue = bucket === "profile" ? profile[(q as (typeof PROFILE)[number]).id] : bucket === "bp" ? bp[idx] : big[(q as (typeof STRATEGIC)[number]).id];
    const isUnknown = bucket === "bp" && !!unknown[idx];
    const help = "help" in q && q.help ? <p className="q-help">{fillTokens(q.help, industry)}</p> : null;

    function choose(optionIndex: number) {
      if (bucket === "profile") setProfile((p) => ({ ...p, [(q as (typeof PROFILE)[number]).id]: optionIndex }));
      else if (bucket === "bp") {
        setBp((arr) => {
          const next = [...arr];
          next[idx] = optionIndex;
          return next;
        });
        setUnknown((u) => {
          if (!(idx in u)) return u;
          const next = { ...u };
          delete next[idx];
          return next;
        });
      } else setBig((b) => ({ ...b, [(q as (typeof STRATEGIC)[number]).id]: optionIndex }));
      setTimeout(goNext, 240);
    }

    function skip() {
      setUnknown((u) => ({ ...u, [idx]: true }));
      if (bp[idx] === undefined)
        setBp((arr) => {
          const next = [...arr];
          next[idx] = 0;
          return next;
        });
      goNext();
    }

    return (
      <div className="quiz-step active">
        <div className="q-meta">
          <span className="q-count">
            Question {stepIndex} of {STEPS.length - 1}
          </span>
          <span className="q-tag">{q.tag}</span>
        </div>
        <h2>{fillTokens(q.q, industry)}</h2>
        {help}
        <div className="q-options">
          {q.options.map((o, i) => (
            <button key={o} className="q-option" type="button" aria-pressed={currentValue === i && !isUnknown} onClick={() => choose(i)}>
              <span className="mark" aria-hidden="true">
                {CHECK}
              </span>
              <span>{fillTokens(o, industry)}</span>
            </button>
          ))}
        </div>
        {isUnknown && <p className="q-unknown-note">Marked as not sure. You can answer it now if you change your mind.</p>}
        <div className="q-nav">
          <button className="q-back" type="button" onClick={goPrev}>
            {BACK_ICON} Back
          </button>
          <button className="btn btn-primary btn-arrow" type="button" disabled={currentValue === undefined && !isUnknown} style={currentValue === undefined && !isUnknown ? { opacity: 0.5, pointerEvents: "none" } : undefined} onClick={goNext}>
            Continue {ARROW}
          </button>
        </div>
        {canSkip && (
          <div className="q-assist">
            <button className="q-skip" type="button" onClick={skip}>
              I&apos;m not sure yet, skip
            </button>
          </div>
        )}
      </div>
    );
  }

  // open text step
  return (
    <div className="quiz-step active">
      <div className="q-meta">
        <span className="q-count">Last one</span>
        <span className="q-tag">{OPEN_QUESTION.tag}</span>
      </div>
      <h2>{fillTokens(OPEN_QUESTION.q, industry)}</h2>
      <div className="q-field">
        <textarea value={openText} onChange={(e) => setOpenText(e.target.value)} placeholder={fillTokens(OPEN_QUESTION.placeholder, industry)} />
      </div>
      <div className="q-nav">
        <button className="q-back" type="button" onClick={goPrev}>
          {BACK_ICON} Back
        </button>
        <button className="btn btn-primary btn-arrow" type="button" disabled={submitting} aria-busy={submitting} onClick={() => finish(openText)}>
          {submitting ? "Building…" : "See my Scorecard"} {ARROW}
        </button>
      </div>
    </div>
  );
  }
}
