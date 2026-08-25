import { describe, it, expect } from "vitest";
import { generateConfirmationCode, generateManageToken } from "@/lib/data/tokens";

describe("generateConfirmationCode", () => {
  it("matches the CYM-XXXXXX shape with no ambiguous characters", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateConfirmationCode();
      expect(code).toMatch(/^CYM-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/);
    }
  });

  it("is not obviously predictable across calls", () => {
    const codes = new Set(Array.from({ length: 100 }, () => generateConfirmationCode()));
    expect(codes.size).toBe(100);
  });
});

describe("generateManageToken", () => {
  it("is a URL-safe opaque token, not a sequential id", () => {
    const token = generateManageToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(token.length).toBeGreaterThan(20);
  });
});
