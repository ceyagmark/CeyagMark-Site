"use client";

import { useState } from "react";
import Link from "next/link";
import { STEPS, type Field, type Option } from "./steps-data";
import { trackFoundingAuditApplication } from "@/lib/analytics/events";

type Answer = { text?: string; values?: string[] };

const CHECK = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ARROW = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function optionLabel(o: Option, currency: "USD" | "LKR"): string {
  return typeof o.label === "string" ? o.label : currency === "LKR" ? o.label.lkr : o.label.usd;
}

// Ported from free-audit.js's state machine into React state. The one real
// behaviour change: postLead() used to fire-and-forget to a Google Apps
// Script URL (window.CEYAG_LEAD_ENDPOINT). It now awaits a POST to
// /api/leads (source: "free_audit") and the success/disqualified screens
// only render after that write is confirmed — same fix as the contact form.
export function FreeAuditForm() {
  const [currency, setCurrency] = useState<"USD" | "LKR">("USD");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ended, setEnded] = useState<null | "success" | { dqReason: string }>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const step = STEPS[stepIndex]!;

  function setAnswer(fieldId: string, answer: Answer) {
    setAnswers((prev) => ({ ...prev, [fieldId]: answer }));
    setErrors((prev) => {
      if (!(fieldId in prev)) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }

  function toggleOption(field: Field, value: string) {
    const cur = answers[field.id]?.values ?? [];
    const multi = field.type === "multi";
    if (multi) {
      const idx = cur.indexOf(value);
      if (idx === -1) {
        if (field.max && cur.length >= field.max) {
          setErrors((prev) => ({ ...prev, [field.id]: `You can pick up to ${field.max}. Deselect one to change.` }));
          return;
        }
        setAnswer(field.id, { values: [...cur, value] });
      } else {
        setAnswer(field.id, { values: cur.filter((v) => v !== value) });
      }
    } else {
      setAnswer(field.id, { values: [value] });
    }
  }

  function readable(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const s of STEPS) {
      for (const f of s.fields) {
        const ans = answers[f.id];
        if (!ans) continue;
        if (f.type === "text" || f.type === "tel" || f.type === "email") {
          out[f.id] = ans.text ?? "";
          continue;
        }
        const labels = (ans.values ?? []).map((v) => {
          const o = f.options?.find((x) => x.v === v);
          return o ? optionLabel(o, currency) : v;
        });
        out[f.id] = labels.join(", ");
      }
    }
    return out;
  }

  async function postLead(qualified: boolean, dqReason?: string) {
    const r = readable();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "free_audit",
          name: r.name || "Unknown",
          email: r.email || "unknown@example.com",
          phone: r.whatsapp,
          company: r.store,
          fields: {
            currency,
            qualified: String(qualified),
            dqReason: dqReason ?? "",
            country: r.country ?? "",
            role: r.role ?? "",
            platform: r.platform ?? "",
            budget: r.budget ?? "",
            history: r.history ?? "",
            roas: r.roas ?? "",
            priority: r.priority ?? "",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error?.message ?? "Something went wrong. Try again.");
        setSubmitting(false);
        return;
      }
      trackFoundingAuditApplication({
        qualified,
        dqReason,
        name: r.name,
        email: r.email,
        phone: r.whatsapp,
        store: r.store,
        country: r.country,
        budget: r.budget,
        roas: r.roas,
      });
      setEnded(qualified ? "success" : { dqReason: dqReason ?? "" });
    } catch {
      setSubmitError("Could not reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  function onNext() {
    let ok = true;
    let dqReason: string | null = null;
    const newErrors: Record<string, string> = {};

    for (const f of step.fields) {
      const ans = answers[f.id];
      if (f.type === "text" || f.type === "tel" || f.type === "email") {
        const txt = ans?.text?.trim() ?? "";
        if (f.required && !txt) {
          ok = false;
          newErrors[f.id] = "This field is required.";
        } else if (f.type === "email" && txt && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(txt)) {
          ok = false;
          newErrors[f.id] = "Please enter a valid email, or leave it blank.";
        }
      } else {
        const vals = ans?.values ?? [];
        if (f.required && vals.length === 0) {
          ok = false;
          newErrors[f.id] = "Please choose an option.";
        } else {
          for (const o of f.options ?? []) {
            if (o.dq && vals.includes(o.v) && !dqReason) dqReason = o.dq;
          }
        }
      }
    }

    setErrors(newErrors);
    if (!ok) return;
    if (dqReason) {
      postLead(false, dqReason);
      return;
    }
    if (stepIndex < STEPS.length - 1) setStepIndex((i) => i + 1);
    else postLead(true);
  }

  if (ended === "success") {
    const r = readable();
    const msg = `Hi CeyagMark, I just applied for a founding audit slot.\n\nName: ${r.name ?? ""}\nStore: ${r.store ?? ""}\nCountry: ${r.country ?? ""}\nDaily budget: ${r.budget ?? ""}\nAd history: ${r.history ?? ""}\n\nLooking forward to my audit.`;
    return (
      <div className="fscreen">
        <div className="em ok">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3>Application received.</h3>
        <p>We will review your answers and contact you on WhatsApp within 24 hours. Only 3 founding slots are available, so we will confirm your spot shortly.</p>
        <div className="actions">
          <a className="btn btn-primary btn-lg btn-arrow" data-magnetic="0.25" href={`https://wa.me/94703727895?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener">
            Confirm on WhatsApp {ARROW}
          </a>
          <Link className="btn btn-ghost" href="/">
            Back to site
          </Link>
        </div>
        <p className="dim" style={{ fontSize: ".86rem", marginTop: 22 }}>
          Tip. Sending the WhatsApp message now puts your application straight in front of us.
        </p>
      </div>
    );
  }

  if (ended && typeof ended === "object") {
    const msg = `Hi CeyagMark, I looked at the founding audit. ${ended.dqReason} I would like to talk about when I might qualify.`;
    return (
      <div className="fscreen">
        <div className="em no">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M12 8v5M12 16.5v.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <h3>Not a fit just yet.</h3>
        <p>{ended.dqReason}</p>
        <p>
          To qualify we need a branded e-commerce store, at least $30 a day in active paid ads, a minimum of 3
          months of ad history, and willingness to share platform access. Reach out on WhatsApp when your situation
          changes.
        </p>
        <div className="actions">
          <a className="btn btn-primary btn-lg btn-arrow" href={`https://wa.me/94703727895?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener">
            Message us on WhatsApp {ARROW}
          </a>
          <Link className="btn btn-ghost" href="/growth-audit">
            Try the free Growth Audit
          </Link>
        </div>
      </div>
    );
  }

  const pct = Math.round((stepIndex / STEPS.length) * 100);

  return (
    <>
      <div className="ccy" role="group" aria-label="Currency" style={{ marginBottom: 20 }}>
        <button type="button" className={currency === "USD" ? "on" : ""} onClick={() => setCurrency("USD")}>
          USD
        </button>
        <button type="button" className={currency === "LKR" ? "on" : ""} onClick={() => setCurrency("LKR")}>
          LKR
        </button>
      </div>

      <div className="fprogress">
        <div className="fbar">
          <i style={{ width: `${pct}%` }} />
        </div>
        <span className="fstepno">
          Step {stepIndex + 1} of {STEPS.length}
        </span>
      </div>
      <h3 className="fsteptitle">{step.title}</h3>
      <p className="fsteplead">{step.lead}</p>

      {step.fields.map((f) => (
        <div className="ffield" key={f.id}>
          <label className="flabel" htmlFor={`fi-${f.id}`}>
            {f.q} {f.required && <span className="req">*</span>}
            {f.hint && <span className="fmeta">{f.hint}</span>}
          </label>

          {f.type === "text" || f.type === "tel" || f.type === "email" ? (
            <input
              className="ftext"
              id={`fi-${f.id}`}
              type={f.type}
              placeholder={f.placeholder}
              maxLength={f.type === "tel" ? 40 : f.type === "email" ? 320 : 200}
              value={answers[f.id]?.text ?? ""}
              onChange={(e) => setAnswer(f.id, { text: e.target.value })}
              autoComplete={f.id === "name" ? "name" : f.type === "tel" ? "tel" : f.type === "email" ? "email" : "off"}
            />
          ) : (
            <div className={`opts${(f.options?.length ?? 0) > 4 ? " two" : ""}`} role={f.type === "multi" ? "group" : "radiogroup"}>
              {f.options?.map((o) => {
                const sel = answers[f.id]?.values ?? [];
                const on = sel.includes(o.v);
                const locked = f.type === "multi" && f.max ? sel.length >= f.max && !on : false;
                return (
                  <label key={o.v} className={`opt${on ? " sel" : ""}${locked ? " lock" : ""}`}>
                    <input
                      type={f.type === "multi" ? "checkbox" : "radio"}
                      name={f.id}
                      value={o.v}
                      checked={on}
                      readOnly
                      onClick={(e) => {
                        e.preventDefault();
                        if (!locked) toggleOption(f, o.v);
                      }}
                    />
                    <span className={`mark${f.type === "multi" ? " sq" : ""}`}>{CHECK}</span>
                    <span className="txt">{optionLabel(o, currency)}</span>
                  </label>
                );
              })}
            </div>
          )}
          {errors[f.id] && (
            <p className="ferror show" role="alert">
              {errors[f.id]}
            </p>
          )}
        </div>
      ))}

      {submitError && (
        <p role="alert" style={{ color: "var(--bad)", marginTop: 12 }}>
          {submitError}
        </p>
      )}

      <div className="fnav">
        <button type="button" className="fback" hidden={stepIndex === 0} onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>
          Back
        </button>
        <button type="button" className="btn btn-primary btn-arrow" onClick={onNext} disabled={submitting} aria-busy={submitting}>
          {submitting ? "Submitting…" : stepIndex === STEPS.length - 1 ? "Submit application" : "Continue"} {ARROW}
        </button>
      </div>
    </>
  );
}
