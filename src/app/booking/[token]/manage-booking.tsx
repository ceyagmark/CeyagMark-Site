"use client";

import { useEffect, useState } from "react";

type Booking = {
  confirmationCode: string;
  sessionTypeName: string;
  startsAt: string;
  status: string;
  customerName: string;
};

const DATE_FMT = new Intl.DateTimeFormat("en-LK", {
  timeZone: "Asia/Colombo",
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function ManageBooking({ token }: { token: string }) {
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/bookings/${token}`)
      .then(async (res) => {
        const data = await res.json();
        setBooking(res.ok ? data.booking : null);
      })
      .catch(() => setBooking(null));
  }, [token]);

  async function cancel() {
    if (cancelling) return;
    setCancelling(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${token}/cancel`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message ?? "Could not cancel this booking.");
        setCancelling(false);
        return;
      }
      setCancelled(true);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setCancelling(false);
    }
  }

  if (booking === undefined) {
    return (
      <main id="main" className="mx-auto max-w-lg px-6 py-16">
        <p aria-busy="true" aria-live="polite" className="text-[var(--text-mute)]">
          Loading…
        </p>
      </main>
    );
  }

  if (booking === null) {
    return (
      <main id="main" className="mx-auto max-w-lg px-6 py-16">
        <h1 className="text-2xl mb-2">Booking not found</h1>
        <p className="text-[var(--text-soft)]">
          This link is not valid. WhatsApp us at{" "}
          <a className="text-[var(--brand-glow)]" href="https://wa.me/94703727895">
            +94 70 372 7895
          </a>{" "}
          if you need help.
        </p>
      </main>
    );
  }

  return (
    <main id="main" className="mx-auto max-w-lg px-6 py-16">
      <h1 className="text-2xl mb-2">Manage your booking</h1>
      <p className="text-[var(--text-soft)] mb-6">
        {booking.sessionTypeName} on {DATE_FMT.format(new Date(booking.startsAt))} (Asia/Colombo). Confirmation code{" "}
        {booking.confirmationCode}.
      </p>

      {cancelled || booking.status === "cancelled" ? (
        <p role="status" className="text-[var(--good)]">
          This booking is cancelled.
        </p>
      ) : (
        <>
          {error && (
            <p role="alert" className="text-[var(--bad)] mb-4">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={cancel}
            disabled={cancelling}
            aria-busy={cancelling}
            className="min-h-[44px] rounded-lg px-6 py-2 font-semibold border border-[var(--border-strong)] disabled:opacity-60"
          >
            {cancelling ? "Cancelling…" : "Cancel this booking"}
          </button>
        </>
      )}
    </main>
  );
}
