"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error?.message ?? "Sign in failed.");
      setSubmitting(false);
      return;
    }
    router.push("/admin/bookings");
  }

  return (
    <div className="admin-shell admin-login-wrap">
      <div className="admin-card admin-login-card">
        <h1>Admin sign in</h1>
        <p className="lede">Bookings and leads, CeyagMark&apos;s own dashboard.</p>
        <form onSubmit={onSubmit}>
          <div className="admin-field" style={{ marginBottom: 20 }}>
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
            />
          </div>
          {error && (
            <p role="alert" className="admin-error" style={{ marginBottom: 16, padding: 0, textAlign: "left" }}>
              {error}
            </p>
          )}
          <button type="submit" disabled={submitting} aria-busy={submitting} className="btn btn-primary" style={{ width: "100%" }}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
