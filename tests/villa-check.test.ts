import { describe, it, expect } from "vitest";
import { calculateVilla, isHotLead, pickFixes, formatLkr, LKR_PER_USD } from "@/lib/villa-check";

const BASE = { rooms: 4, nightlyRate: 50, currency: "USD" as const, occupancyPct: 65, otaSharePct: 80, commissionPct: 15 };

describe("calculateVilla", () => {
  it("matches the hand-worked 4-villa example", () => {
    // 4 x 50 x 300 x 365 x 0.65 = 14,235,000 revenue; x 0.8 x 0.15 = 1,708,200 commission
    expect(LKR_PER_USD).toBe(300);
    const r = calculateVilla(BASE);
    expect(r.yearlyRevenueLkr).toBe(14_240_000);
    expect(r.yearlyCommissionLkr).toBe(1_710_000);
    expect(r.keepAt10Lkr).toBe(210_000);
    expect(r.keepAt25Lkr).toBe(530_000);
  });

  it("treats an LKR rate the same as its USD equivalent", () => {
    expect(calculateVilla({ ...BASE, currency: "LKR", nightlyRate: 15_000 })).toEqual(calculateVilla(BASE));
  });

  it("never saves more than the OTA share", () => {
    const r = calculateVilla({ ...BASE, otaSharePct: 5 });
    expect(r.keepAt25Lkr).toBe(r.keepAt10Lkr);
    expect(r.keepAt10Lkr).toBe(r.yearlyCommissionLkr);
  });

  it("clamps garbage input instead of returning NaN", () => {
    const r = calculateVilla({ ...BASE, rooms: Number.NaN, occupancyPct: 400, commissionPct: -3 });
    expect(Number.isFinite(r.yearlyRevenueLkr)).toBe(true);
    expect(r.yearlyCommissionLkr).toBe(0);
  });
});

describe("isHotLead", () => {
  it("needs 4+ rooms and USD 40+ a night", () => {
    expect(isHotLead(BASE)).toBe(true);
    expect(isHotLead({ ...BASE, rooms: 3 })).toBe(false);
    expect(isHotLead({ ...BASE, nightlyRate: 35 })).toBe(false);
    expect(isHotLead({ ...BASE, currency: "LKR", nightlyRate: 12_000 })).toBe(true);
  });
});

describe("pickFixes", () => {
  it("always returns exactly three fixes", () => {
    for (const w of ["none", "old", "good"] as const)
      for (const g of ["yes", "no", "unsure"] as const) expect(pickFixes(w, g)).toHaveLength(3);
  });
});

describe("formatLkr", () => {
  it("groups thousands", () => {
    expect(formatLkr(1_710_000)).toBe("LKR 1,710,000");
  });
});
