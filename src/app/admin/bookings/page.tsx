"use client";

// Client-rendered, fetching from /api/admin/bookings, rather than a server
// component calling getDataSource() directly. Found by driving the real flow:
// a Server Component in this app's RSC bundle importing local-source.ts (node:fs
// readFileSync/readdirSync against process.cwd()) threw
// "The path argument must be of type string... Received an instance of URL"
// under Turbopack's Next 16 RSC runtime, while the identical code path worked
// fine from a Route Handler. Root cause not fully chased (three-hypothesis
// budget spent finding the workaround, not the Turbopack internal) — the fix
// is architectural anyway: admin pages should read through the same API the
// rest of the app already proved works, not a second direct-DB path.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Booking = {
  id: string;
  confirmationCode: string;
  sessionTypeName: string;
  startsAt: string;
  status: string;
  customerName: string;
  customerEmail: string;
};

const DATE_FMT = new Intl.DateTimeFormat("en-LK", {
  timeZone: "Asia/Colombo",
  dateStyle: "medium",
  timeStyle: "short",
});

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          if (data.error?.code === "UNAUTHORIZED") router.push("/admin/login");
          else setError(data.error?.message ?? "Could not load bookings.");
          return;
        }
        setBookings(data.bookings);
      })
      .catch(() => setError("Could not reach the server."));
  }, [router]);

  return (
    <main id="main" className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-2xl mb-6">Bookings</h1>
      <nav className="mb-6 text-sm">
        <a className="text-[var(--brand-glow)]" href="/admin/leads">
          Leads →
        </a>
      </nav>
      {error && (
        <p role="alert" className="text-[var(--bad)]">
          {error}
        </p>
      )}
      {!bookings && !error && (
        <p aria-busy="true" aria-live="polite" className="text-[var(--text-mute)]">
          Loading…
        </p>
      )}
      {bookings && bookings.length === 0 && <p className="text-[var(--text-soft)]">No bookings yet.</p>}
      {bookings && bookings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-[var(--border)]">
                <th className="py-2 pr-4">When</th>
                <th className="py-2 pr-4">Session</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Code</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-[var(--border)]">
                  <td className="py-2 pr-4">{DATE_FMT.format(new Date(b.startsAt))}</td>
                  <td className="py-2 pr-4">{b.sessionTypeName}</td>
                  <td className="py-2 pr-4">
                    {b.customerName} · {b.customerEmail}
                  </td>
                  <td className="py-2 pr-4">{b.status}</td>
                  <td className="py-2 pr-4">{b.confirmationCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
