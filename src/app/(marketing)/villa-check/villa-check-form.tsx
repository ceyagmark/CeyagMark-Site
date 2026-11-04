"use client";

import { useMemo, useState } from "react";
import {
  calculateVilla,
  formatLkr,
  isHotLead,
  pickFixes,
  LKR_PER_USD,
  type GoogleProfile,
  type VillaInputs,
  type WebsiteState,
} from "@/lib/villa-check";
import { trackVillaCheckLead } from "@/lib/analytics/events";

const ARROW = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WEBSITE_OPTS: { v: WebsiteState; label: string }[] = [
  { v: "none", label: "No website" },
  { v: "old", label: "Yes, but it's old or slow" },
  { v: "good", label: "Yes, a good one" },
];
const GOOGLE_OPTS: { v: GoogleProfile; label: string }[] = [
  { v: "yes", label: "Yes" },
  { v: "no", label: "No" },
  { v: "unsure", label: "Not sure" },
];

// Sri Lankan owners type local numbers (077...); the API wants +94 format.
function toE164(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("0")) return `+94${digits.slice(1)}`;
  return `+${digits}`;
}

function Slider(props: { id: string; label: string; value: number; min: number; max: number; suffix: string; onChange: (n: number) => void }) {
  return (
    <div className="ffield">
      <label className="flabel" htmlFor={props.id}>
        {props.label} <span className="vc-val">{props.value}{props.suffix}</span>
      </label>
      <input
        id={props.id}
        className="vc-range"
        type="range"
        min={props.min}
        max={props.max}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
    </div>
  );
}

function Choice<T extends string>(props: { name: string; label: string; opts: { v: T; label: string }[]; value: T | null; onChange: (v: T) => void }) {
  return (
    <fieldset className="ffield">
      <legend className="flabel">{props.label}</legend>
      <div className="vc-chips">
        {props.opts.map((o) => (
          <label key={o.v} className={`opt vc-chip${props.value === o.v ? " sel" : ""}`}>
            <input type="radio" name={props.name} value={o.v} checked={props.value === o.v} onChange={() => props.onChange(o.v)} />
            <span className="txt">{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function VillaCheckForm() {
  const [inputs, setInputs] = useState<VillaInputs>({
    rooms: 4,
    nightlyRate: 50,
    currency: "USD",
    occupancyPct: 60,
    otaSharePct: 80,
    commissionPct: 15,
  });
  const [stage, setStage] = useState<"calc" | "unlock" | "done">("calc");
  const [listing, setListing] = useState("");
  const [villaName, setVillaName] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState<WebsiteState | null>(null);
  const [google, setGoogle] = useState<GoogleProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hot, setHot] = useState(false);

  const result = useMemo(() => calculateVilla(inputs), [inputs]);
  const set = <K extends keyof VillaInputs>(k: K, v: VillaInputs[K]) => setInputs((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !villaName.trim() || !whatsapp.trim() || !website || !google) {
      setError("Fill in every field marked *, then try again.");
      return;
    }
    const isHot = isHotLead(inputs);
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "villa_check",
          name: name.trim(),
          email: email.trim(),
          phone: toE164(whatsapp),
          company: villaName.trim(),
          fields: {
            tier: isHot ? "hot" : "other",
            listing: listing.trim().slice(0, 500),
            rooms: String(inputs.rooms),
            nightlyRate: `${inputs.nightlyRate} ${inputs.currency}`,
            occupancyPct: String(inputs.occupancyPct),
            otaSharePct: String(inputs.otaSharePct),
            commissionPct: String(inputs.commissionPct),
            yearlyCommissionLkr: String(result.yearlyCommissionLkr),
            website,
            googleProfile: google,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error?.message ?? "Something went wrong. Try again.");
        setSubmitting(false);
        return;
      }
      trackVillaCheckLead({ hot: isHot, rooms: inputs.rooms });
      setHot(isHot);
      setStage("done");
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (stage === "done" && website && google) {
    return (
      <div className="glass appform">
        <span className="eyebrow">Your 3 fixes</span>
        <h3 className="fsteptitle">Here&apos;s where {villaName || "your villa"} can win direct bookings</h3>
        <ol className="vc-fixes">
          {pickFixes(website, google).map((f) => (
            <li key={f.title}>
              <b>{f.title}</b>
              <p>{f.body}</p>
            </li>
          ))}
        </ol>
        <p className="vc-next">
          {hot
            ? "Your villa qualifies for a free homepage preview. We'll message you on WhatsApp within a few hours, and send the preview within 48 hours."
            : "We'll send these fixes to your WhatsApp too, so you have them handy."}
        </p>
      </div>
    );
  }

  return (
    <div className="glass appform">
      <div className="vc-result" aria-live="polite">
        <span className="k">Booking sites likely took from you last year</span>
        <span className="vc-big">{formatLkr(result.yearlyCommissionLkr)}</span>
        <span className="k">
          Move 10% of bookings direct and keep <b>{formatLkr(result.keepAt10Lkr)}</b> a year. Move 25% and keep{" "}
          <b>{formatLkr(result.keepAt25Lkr)}</b>.
        </span>
      </div>

      {stage === "calc" && (
        <>
          <div className="ffield">
            <label className="flabel" htmlFor="vc-rooms">Rooms or villas</label>
            <input id="vc-rooms" className="ftext" type="number" inputMode="numeric" min={1} max={60} value={inputs.rooms} onChange={(e) => set("rooms", Number(e.target.value))} />
          </div>
          <div className="ffield">
            <label className="flabel" htmlFor="vc-rate">Average nightly rate</label>
            <div className="vc-rate">
              <input id="vc-rate" className="ftext" type="number" inputMode="decimal" min={0} value={inputs.nightlyRate} onChange={(e) => set("nightlyRate", Number(e.target.value))} />
              <div className="ccy" role="group" aria-label="Currency">
                {(["USD", "LKR"] as const).map((c) => (
                  <button key={c} type="button" className={inputs.currency === c ? "on" : ""} onClick={() => set("currency", c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Slider id="vc-occ" label="Average occupancy" value={inputs.occupancyPct} min={10} max={100} suffix="%" onChange={(n) => set("occupancyPct", n)} />
          <Slider id="vc-ota" label="Bookings that come through Booking.com, Airbnb and others" value={inputs.otaSharePct} min={0} max={100} suffix="%" onChange={(n) => set("otaSharePct", n)} />
          <Slider id="vc-com" label="Their commission" value={inputs.commissionPct} min={5} max={30} suffix="%" onChange={(n) => set("commissionPct", n)} />
          <p className="dim note vc-assume">
            Estimate: rooms x rate x 365 days x occupancy x booking-site share x commission, at LKR {LKR_PER_USD} per USD, rounded.
          </p>
          <button type="button" className="btn btn-primary btn-lg btn-arrow vc-cta" onClick={() => setStage("unlock")}>
            Get my 3 fixes {ARROW}
          </button>
        </>
      )}

      {stage === "unlock" && (
        <form onSubmit={submit} noValidate>
          <div className="ffield">
            <label className="flabel" htmlFor="vc-villa">Villa name <span className="req">*</span></label>
            <input id="vc-villa" className="ftext" value={villaName} onChange={(e) => setVillaName(e.target.value)} maxLength={200} autoComplete="organization" />
          </div>
          <div className="ffield">
            <label className="flabel" htmlFor="vc-listing">Booking.com or Airbnb link <span className="fmeta">optional, helps us build your preview</span></label>
            <input id="vc-listing" className="ftext" type="url" inputMode="url" value={listing} onChange={(e) => setListing(e.target.value)} placeholder="https://www.booking.com/hotel/lk/..." />
          </div>
          <Choice name="vc-web" label="Do you have your own website? *" opts={WEBSITE_OPTS} value={website} onChange={setWebsite} />
          <Choice name="vc-google" label="Do you have a Google Business Profile? *" opts={GOOGLE_OPTS} value={google} onChange={setGoogle} />
          <div className="ffield">
            <label className="flabel" htmlFor="vc-name">Your name <span className="req">*</span></label>
            <input id="vc-name" className="ftext" value={name} onChange={(e) => setName(e.target.value)} maxLength={200} autoComplete="name" />
          </div>
          <div className="ffield">
            <label className="flabel" htmlFor="vc-wa">WhatsApp number <span className="req">*</span></label>
            <input id="vc-wa" className="ftext" type="tel" inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="077 123 4567" autoComplete="tel" />
          </div>
          <div className="ffield">
            <label className="flabel" htmlFor="vc-email">Email <span className="fmeta">optional</span></label>
            <input id="vc-email" className="ftext" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          {error && <p className="vc-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary btn-lg btn-arrow vc-cta" disabled={submitting}>
            {submitting ? "Sending..." : <>Show my 3 fixes {ARROW}</>}
          </button>
          <p className="dim note vc-assume">We only use your number to send your check and preview. No spam, no sharing.</p>
          <button type="button" className="vc-back" onClick={() => setStage("calc")}>Back to the numbers</button>
        </form>
      )}
    </div>
  );
}
