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
    <main id="main" className="mx-auto max-w-sm px-6 py-24">
      <h1 className="text-2xl mb-6">Admin sign in</h1>
      <form onSubmit={onSubmit}>
        <label className="block mb-4">
          <span className="block text-sm mb-1">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full min-h-[44px] rounded-lg border border-[var(--border)] bg-transparent px-3 py-2"
          />
        </label>
        {error && (
          <p role="alert" className="text-[var(--bad)] mb-4">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="min-h-[44px] rounded-lg px-6 py-2 font-semibold text-[var(--on-brand)] bg-[var(--brand)] disabled:opacity-60"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
