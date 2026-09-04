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
import { AdminHeader } from "@/components/admin-header";

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

const STATUS_TONE: Record<string, string> = {
  confirmed: "good",
  completed: "brand",
  cancelled: "bad",
  no_show: "warn",
};

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
    <div className="admin-shell">
      <div className="admin-wrap">
        <AdminHeader />
        <h1 className="admin-title">Bookings</h1>

        {error && (
          <div className="admin-card">
            <p role="alert" className="admin-error">
              {error}
            </p>
          </div>
        )}
        {!bookings && !error && (
          <div className="admin-card">
            <p aria-busy="true" aria-live="polite" className="admin-loading">
              Loading…
            </p>
          </div>
        )}
        {bookings && bookings.length === 0 && (
          <div className="admin-card">
            <p className="admin-empty">No bookings yet.</p>
          </div>
        )}
        {bookings && bookings.length > 0 && (
          <div className="admin-card">
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Session</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Code</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="primary">{DATE_FMT.format(new Date(b.startsAt))}</td>
                      <td>{b.sessionTypeName}</td>
                      <td>
                        <span className="primary">{b.customerName}</span>
                        <br />
                        {b.customerEmail}
                      </td>
                      <td>
                        <span className="admin-pill" data-tone={STATUS_TONE[b.status] ?? "mute"}>
                          {b.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="mono">{b.confirmationCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
