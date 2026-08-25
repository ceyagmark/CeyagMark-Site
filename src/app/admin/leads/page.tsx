"use client";

// Same architecture note as admin/bookings/page.tsx: client-rendered via the
// API route, not a server component calling getDataSource() directly.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Lead = {
  id: string;
  source: string;
  name: string;
  email: string;
  stage: string;
  createdAt: string;
};

const DATE_FMT = new Intl.DateTimeFormat("en-LK", {
  timeZone: "Asia/Colombo",
  dateStyle: "medium",
  timeStyle: "short",
});

export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          if (data.error?.code === "UNAUTHORIZED") router.push("/admin/login");
          else setError(data.error?.message ?? "Could not load leads.");
          return;
        }
        setLeads(data.leads);
      })
      .catch(() => setError("Could not reach the server."));
  }, [router]);

  return (
    <main id="main" className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-2xl mb-6">Leads</h1>
      <nav className="mb-6 text-sm">
        <a className="text-[var(--brand-glow)]" href="/admin/bookings">
          ← Bookings
        </a>
      </nav>
      {error && (
        <p role="alert" className="text-[var(--bad)]">
          {error}
        </p>
      )}
      {!leads && !error && (
        <p aria-busy="true" aria-live="polite" className="text-[var(--text-mute)]">
          Loading…
        </p>
      )}
      {leads && leads.length === 0 && <p className="text-[var(--text-soft)]">No leads yet.</p>}
      {leads && leads.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-[var(--border)]">
                <th className="py-2 pr-4">When</th>
                <th className="py-2 pr-4">Source</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Stage</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-[var(--border)]">
                  <td className="py-2 pr-4">{DATE_FMT.format(new Date(l.createdAt))}</td>
                  <td className="py-2 pr-4">{l.source}</td>
                  <td className="py-2 pr-4">{l.name}</td>
                  <td className="py-2 pr-4">{l.email}</td>
                  <td className="py-2 pr-4">{l.stage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
