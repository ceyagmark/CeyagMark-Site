"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatLkr, formatUsdCents } from "@/lib/money";
import { trackBookingCompleted } from "@/lib/analytics/events";

type SessionType = {
  id: string;
  slug: string;
  kind: "consulting" | "discovery";
  name: string;
  durationMinutes: number;
  priceLkr: number;
  priceUsdCents: number;
};

type DaySlots = { date: string; times: string[] };

type Step = "session" | "time" | "details" | "success";

const TIME_FMT = new Intl.DateTimeFormat("en-LK", {
  timeZone: "Asia/Colombo",
  weekday: "short",
  day: "numeric",
  month: "short",
});

function toIsoInstant(date: string, time: string): string {
  // Interpret the picked date+time as Asia/Colombo wall-clock and produce a
  // real instant. Colombo has no DST, fixed UTC+5:30.
  return new Date(`${date}T${time}:00+05:30`).toISOString();
}

const STEP_ORDER: Step[] = ["session", "time", "details"];
const STEP_LABEL: Record<string, string> = { session: "Session", time: "Time", details: "Details" };

// Progress across the three input steps. Tells people how much is left before
// they commit, which is the cheapest drop-off reduction available on a flow
// that asks for a name and an email.
function StepBar({ step }: { step: Step }) {
  const current = STEP_ORDER.indexOf(step);
  if (current < 0) return null;
  return (
    <div className="bk-steps" aria-label={`Step ${current + 1} of 3`}>
      {STEP_ORDER.map((s, i) => (
        <div key={s} style={{ display: "contents" }}>
          {i > 0 && <span className="bk-step-sep" aria-hidden="true" />}
          <span className="bk-step" data-state={i === current ? "active" : i < current ? "done" : "todo"}>
            <i aria-hidden="true">{i < current ? "\u2713" : i + 1}</i>
            {STEP_LABEL[s]}
          </span>
        </div>
      ))}
    </div>
  );
}

export function BookingFlow() {
  const searchParams = useSearchParams();
  const preselectSlug = searchParams.get("session");
  const [step, setStep] = useState<Step>("session");
  const [sessionTypes, setSessionTypes] = useState<SessionType[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SessionType | null>(null);

  const [slots, setSlots] = useState<DaySlots[] | null>(null);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const [pickedTime, setPickedTime] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    confirmationCode: string;
    startsAt: string;
    sessionTypeName: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/session-types")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setLoadError(data.error.message);
          return;
        }
        setSessionTypes(data.sessionTypes);
        if (preselectSlug) {
          const match = (data.sessionTypes as SessionType[]).find((s) => s.slug === preselectSlug);
          if (match) chooseSession(match);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load sessions. Check your connection and reload.");
      });
    return () => {
      cancelled = true;
    };
    // preselectSlug is read once from the initial URL; re-running this on
    // every searchParams change would refetch mid-flow for no reason.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function chooseSession(sessionType: SessionType) {
    setSelected(sessionType);
    setStep("time");
    setSlots(null);
    setSlotsError(null);
    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + 21);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    fetch(`/api/availability?sessionTypeId=${sessionType.id}&from=${fmt(from)}&to=${fmt(to)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setSlotsError(data.error.message);
        else setSlots(data.slots);
      })
      .catch(() => setSlotsError("Could not load available times. Check your connection and reload."));
  }

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || !selected || !pickedDate || !pickedTime) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionTypeId: selected.id,
          startsAt: toIsoInstant(pickedDate, pickedTime),
          name,
          email,
          phone: phone || undefined,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error?.message ?? "Something went wrong. Try again.");
        setSubmitting(false);
        return;
      }
      setConfirmation(data.booking);
      setStep("success");
      trackBookingCompleted({
        confirmationCode: data.booking.confirmationCode,
        sessionTypeName: data.booking.sessionTypeName,
        sessionTypeSlug: selected.slug,
        valueUsdCents: selected.priceUsdCents,
      });
    } catch {
      setSubmitError("Could not reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  const whatsappHref = useMemo(() => {
    if (!confirmation) return "#";
    const text = encodeURIComponent(
      `Hi, I just booked ${confirmation.sessionTypeName} (${confirmation.confirmationCode}) on ceyagmark.com.`
    );
    return `https://wa.me/94703727895?text=${text}`;
  }, [confirmation]);

  if (loadError) {
    return (
      <div role="alert" className="bk-alert">
        <p>{loadError}</p>
        <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    );
  }

  if (!sessionTypes) {
    return (
      <div aria-busy="true" aria-live="polite" className="bk-loading">
        Loading sessions…
      </div>
    );
  }

  if (sessionTypes.length === 0) {
    return (
      <div className="bk-empty">
        No sessions are open for booking right now. WhatsApp us at{" "}
        <a className="muted-link" href="https://wa.me/94703727895">
          +94 70 372 7895
        </a>{" "}
        and we will find a time.
      </div>
    );
  }

  if (step === "session") {
    return (
      <div className="bk-step-panel">
        <StepBar step="session" />
        <ul className="bk-list">
        {sessionTypes.map((sessionType) => (
          <li key={sessionType.id}>
            <button
              type="button"
              onClick={() => chooseSession(sessionType)}
              className="bk-option"
            >
              <span>
                <span className="bk-option-name">{sessionType.name}</span>
                <span className="bk-option-price" data-free={sessionType.kind === "discovery" ? "1" : undefined}>
                  {sessionType.kind === "discovery"
                    ? "Free"
                    : `${formatLkr(sessionType.priceLkr)} / ${formatUsdCents(sessionType.priceUsdCents)}`}
                </span>
              </span>
              <span className="bk-option-side">
                <span className="bk-option-dur">{sessionType.durationMinutes} min</span>
                <svg className="bk-option-go" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </li>
        ))}
        </ul>
      </div>
    );
  }

  if (step === "time" && selected) {
    const altWhatsappHref =
      "https://wa.me/94703727895?text=" +
      encodeURIComponent(
        `Hi, I would like to book ${selected.name} but none of the times on the booking page work for me. Could we find another time?`,
      );
    return (
      <div className="bk-step-panel">
        <StepBar step="time" />
        <button type="button" className="bk-back" onClick={() => setStep("session")}>
          &larr; Change session
        </button>
        <h2 style={{ marginBottom: 20 }}>{selected.name}</h2>
        {slotsError && (
          <p role="alert" className="bk-alert">
            {slotsError}
          </p>
        )}
        {!slots && !slotsError && (
          <p aria-busy="true" aria-live="polite" className="bk-note">
            Loading available times…
          </p>
        )}
        {slots && slots.length === 0 && (
          <p className="bk-note">
            No times are open in the next three weeks. WhatsApp us at{" "}
            <a className="muted-link" href="https://wa.me/94703727895">
              +94 70 372 7895
            </a>
            .
          </p>
        )}
        {slots && slots.length > 0 && (
          <div>
            {slots.map((day) => (
              <div key={day.date} className="bk-day">
                <div className="bk-day-label">
                  {TIME_FMT.format(new Date(`${day.date}T12:00:00+05:30`))}
                </div>
                <div className="bk-times">
                  {day.times.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        setPickedDate(day.date);
                        setPickedTime(time);
                        setStep("details");
                      }}
                      className="bk-time"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Consulting hours are 19:00 to 22:00, which will not suit everyone,
            and a booking page that only offers slots quietly loses the people
            those slots do not fit. This gives them a way through that does not
            depend on the calendar. */}
        <div className="bk-alt">
          <p>None of these times work?</p>
          <a
            className="btn btn-ghost"
            href={altWhatsappHref}
            target="_blank"
            rel="noopener"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.13h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 01-1.25-4.36c0-4.54 3.7-8.24 8.24-8.24a8.18 8.18 0 015.82 2.42 8.18 8.18 0 012.41 5.83c0 4.54-3.69 8.23-8.23 8.23z" />
            </svg>
            Ask for another time on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  if (step === "details" && selected && pickedDate && pickedTime) {
    return (
      <form onSubmit={submitBooking} noValidate className="bk-step-panel">
        <StepBar step="details" />
        <button type="button" className="bk-back" onClick={() => setStep("time")}>
          &larr; Change time
        </button>
        <p className="bk-summary">
          <strong>{selected.name}</strong> on{" "}
          {TIME_FMT.format(new Date(`${pickedDate}T12:00:00+05:30`))} at {pickedTime} (Asia/Colombo)
        </p>

        <label className="bk-field">
          <span>Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bk-input"
          />
        </label>
        <label className="bk-field">
          <span>Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bk-input"
          />
        </label>
        <label className="bk-field">
          <span>Phone (optional)</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bk-input"
          />
        </label>
        <label className="bk-field">
          <span>What should we know before the call? (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={2000}
            rows={3}
            className="bk-input"
          />
        </label>

        {submitError && (
          <p role="alert" className="bk-alert">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="btn btn-primary btn-lg"
        >
          {submitting ? "Booking…" : "Confirm booking"}
        </button>
      </form>
    );
  }

  if (step === "success" && confirmation) {
    return (
      <div role="status" aria-live="polite" className="bk-step-panel">
        <div className="bk-success-mark" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M4 12.5l5.5 5.5L20 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{ marginBottom: 12 }}>Booked.</h2>
        <p className="lede" style={{ marginBottom: 28 }}>
          {confirmation.sessionTypeName} confirmed. Confirmation code{" "}
          <span className="bk-code">{confirmation.confirmationCode}</span>. We have emailed the details.
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener"
          className="btn btn-primary btn-lg"
        >
          Message us on WhatsApp
        </a>
      </div>
    );
  }

  return null;
}
