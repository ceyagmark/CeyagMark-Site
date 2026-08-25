import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// No Supabase project exists yet (no credentials — see ADR-001), so this is a
// dev-only password gate, same shape as PPI's dev sign-in: a signed cookie
// with a constant-time compare. Reversible two-way-door decision, logged in
// BUILD-NOTES rather than escalated — the real auth path (Supabase Auth +
// RLS) is a Slice 2+ open item once a project exists.
const COOKIE_NAME = "ceyag_admin";

// ADMIN_SESSION_SECRET must be a real env var, not generated in-process: a
// per-module-load random fallback broke the very first login test in this
// build (Next.js dev/Turbopack does not guarantee the route-handler module
// and the page-server-component module share one instance, so the signing
// secret differed between the POST that signed the cookie and the GET that
// verified it — found by driving the real flow, not assumed). Fail loudly
// instead of failing every login unpredictably.
function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET must be set to use admin sign-in.");
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function constantTimeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return constantTimeEqual(candidate, expected);
}

export async function setAdminCookie() {
  const store = await cookies();
  const value = "admin";
  store.set(COOKIE_NAME, `${value}.${sign(value)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return false;
  const [value, signature] = raw.split(".");
  if (!value || !signature) return false;
  try {
    return constantTimeEqual(signature, sign(value));
  } catch {
    // Misconfigured (ADMIN_SESSION_SECRET unset) fails closed, not with a
    // crashed page.
    return false;
  }
}
