"use client";

import { useEffect, useMemo, useState } from "react";
import { formatLkr, formatUsdCents } from "@/lib/money";

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

export function BookingFlow() {
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
        if (data.error) setLoadError(data.error.message);
        else setSessionTypes(data.sessionTypes);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load sessions. Check your connection and reload.");
      });
    return () => {
      cancelled = true;
    };
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
      <div role="alert" className="rounded-xl border border-[var(--bad)] p-6 text-[var(--text)]">
        <p>{loadError}</p>
        <button className="btn-ghost mt-4 rounded-lg border px-4 py-2" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    );
  }

  if (!sessionTypes) {
    return (
      <div aria-busy="true" aria-live="polite" className="py-16 text-center text-[var(--text-mute)]">
        Loading sessions…
      </div>
    );
  }

  if (sessionTypes.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] p-6 text-[var(--text-soft)]">
        No sessions are open for booking right now. WhatsApp us at{" "}
        <a className="text-[var(--brand-glow)]" href="https://wa.me/94703727895">
          +94 70 372 7895
        </a>{" "}
        and we will find a time.
      </div>
    );
  }

  if (step === "session") {
    return (
      <ul className="grid gap-4">
        {sessionTypes.map((sessionType) => (
          <li key={sessionType.id}>
            <button
              type="button"
              onClick={() => chooseSession(sessionType)}
              className="w-full text-left rounded-xl border border-[var(--border)] p-5 min-h-[44px] hover:border-[var(--brand)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-[var(--text)]">{sessionType.name}</span>
                <span className="text-[var(--text-mute)] text-sm">{sessionType.durationMinutes} min</span>
              </div>
              <div className="mt-1 text-sm text-[var(--text-soft)]">
                {sessionType.kind === "discovery"
                  ? "Free"
                  : `${formatLkr(sessionType.priceLkr)} / ${formatUsdCents(sessionType.priceUsdCents)}`}
              </div>
            </button>
          </li>
        ))}
      </ul>
    );
  }

  if (step === "time" && selected) {
    return (
      <div>
        <button type="button" className="text-sm text-[var(--brand-glow)] mb-6" onClick={() => setStep("session")}>
          ← Change session
        </button>
        <h2 className="text-xl mb-4">{selected.name}</h2>
        {slotsError && (
          <p role="alert" className="text-[var(--bad)] mb-4">
            {slotsError}
          </p>
        )}
        {!slots && !slotsError && (
          <p aria-busy="true" aria-live="polite" className="text-[var(--text-mute)]">
            Loading available times…
          </p>
        )}
        {slots && slots.length === 0 && (
          <p className="text-[var(--text-soft)]">
            No times are open in the next three weeks. WhatsApp us at{" "}
            <a className="text-[var(--brand-glow)]" href="https://wa.me/94703727895">
              +94 70 372 7895
            </a>
            .
          </p>
        )}
        {slots && slots.length > 0 && (
          <div className="grid gap-4">
            {slots.map((day) => (
              <div key={day.date}>
                <div className="text-sm font-semibold text-[var(--text)] mb-2">
                  {TIME_FMT.format(new Date(`${day.date}T12:00:00+05:30`))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {day.times.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        setPickedDate(day.date);
                        setPickedTime(time);
                        setStep("details");
                      }}
                      className="min-h-[44px] min-w-[44px] px-3 rounded-lg border border-[var(--border)] hover:border-[var(--brand)] text-sm focus-visible:outline-2 focus-visible:outline-[var(--brand)]"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (step === "details" && selected && pickedDate && pickedTime) {
    return (
      <form onSubmit={submitBooking} noValidate>
        <button type="button" className="text-sm text-[var(--brand-glow)] mb-6" onClick={() => setStep("time")}>
          ← Change time
        </button>
        <p className="mb-6 text-[var(--text-soft)]">
          {selected.name} on{" "}
          {TIME_FMT.format(new Date(`${pickedDate}T12:00:00+05:30`))} at {pickedTime} (Asia/Colombo)
        </p>

        <label className="block mb-4">
          <span className="block text-sm mb-1">Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full min-h-[44px] rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
          />
        </label>
        <label className="block mb-4">
          <span className="block text-sm mb-1">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full min-h-[44px] rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
          />
        </label>
        <label className="block mb-4">
          <span className="block text-sm mb-1">Phone (optional)</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full min-h-[44px] rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
          />
        </label>
        <label className="block mb-6">
          <span className="block text-sm mb-1">What should we know before the call? (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={2000}
            rows={3}
            className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
          />
        </label>

        {submitError && (
          <p role="alert" className="text-[var(--bad)] mb-4">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="min-h-[44px] rounded-lg px-6 py-2 font-semibold text-[var(--on-brand)] bg-[var(--brand)] disabled:opacity-60"
        >
          {submitting ? "Booking…" : "Confirm booking"}
        </button>
      </form>
    );
  }

  if (step === "success" && confirmation) {
    return (
      <div role="status" aria-live="polite">
        <h2 className="text-2xl mb-2">Booked.</h2>
        <p className="text-[var(--text-soft)] mb-6">
          {confirmation.sessionTypeName} confirmed. Confirmation code{" "}
          <strong className="text-[var(--text)]">{confirmation.confirmationCode}</strong>. We have emailed the
          details.
        </p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener"
          className="inline-block min-h-[44px] rounded-lg px-6 py-2 font-semibold text-[var(--on-brand)] bg-[var(--brand)]"
        >
          Message us on WhatsApp
        </a>
      </div>
    );
  }

  return null;
}
