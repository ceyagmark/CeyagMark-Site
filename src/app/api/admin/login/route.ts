import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-error";
import { checkPassword, setAdminCookie } from "@/lib/admin-auth";
import { isRateLimited, clientKey } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (isRateLimited(`admin-login:${clientKey(request)}`, 8, 10 * 60 * 1000)) {
    return apiError("RATE_LIMITED", "Too many attempts. Try again in a few minutes.");
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("VALIDATION_ERROR", "Invalid request body.");
  }
  const password = typeof (body as { password?: unknown })?.password === "string" ? (body as { password: string }).password : "";
  if (!password || !checkPassword(password)) {
    // Same message whether the password is wrong or unset, never reveals
    // which, matching PPI's rule for its dev sign-in.
    return apiError("UNAUTHORIZED", "Incorrect password.");
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
