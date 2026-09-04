"use client";

// Same architecture note as admin/bookings/page.tsx: client-rendered via the
// API route, not a server component calling getDataSource() directly.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";

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

const STAGE_TONE: Record<string, string> = {
  new: "brand",
  qualified: "good",
  call_booked: "good",
  proposal_sent: "warn",
  won: "good",
  lost: "bad",
  nurture: "mute",
};

const SOURCE_LABEL: Record<string, string> = {
  contact: "Contact form",
  free_audit: "Free audit",
  growth_audit: "Growth audit",
  built_by: "Built by",
  quiz: "Quiz",
};

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
    <div className="admin-shell">
      <div className="admin-wrap">
        <AdminHeader />
        <h1 className="admin-title">Leads</h1>

        {error && (
          <div className="admin-card">
            <p role="alert" className="admin-error">
              {error}
            </p>
          </div>
        )}
        {!leads && !error && (
          <div className="admin-card">
            <p aria-busy="true" aria-live="polite" className="admin-loading">
              Loading…
            </p>
          </div>
        )}
        {leads && leads.length === 0 && (
          <div className="admin-card">
            <p className="admin-empty">No leads yet.</p>
          </div>
        )}
        {leads && leads.length > 0 && (
          <div className="admin-card">
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Source</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id}>
                      <td className="primary">{DATE_FMT.format(new Date(l.createdAt))}</td>
                      <td>{SOURCE_LABEL[l.source] ?? l.source}</td>
                      <td className="primary">{l.name}</td>
                      <td>{l.email}</td>
                      <td>
                        <span className="admin-pill" data-tone={STAGE_TONE[l.stage] ?? "mute"}>
                          {l.stage.replace("_", " ")}
                        </span>
                      </td>
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
