import { randomBytes } from "node:crypto";

// Generated in application code, not in SQL, so no crypto extension
// (pgcrypto) is required on either database, see 0001_init.sql header.
export function generateConfirmationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity
  let code = "";
  const bytes = randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[(bytes[i] ?? 0) % chars.length];
  }
  return `CYM-${code}`;
}

export function generateManageToken(): string {
  return randomBytes(24).toString("base64url");
}
