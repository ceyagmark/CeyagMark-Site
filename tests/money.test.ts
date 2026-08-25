import { describe, it, expect } from "vitest";
import { formatLkr, formatUsdCents } from "@/lib/money";

describe("formatUsdCents", () => {
  it("shows whole dollars with no decimals", () => {
    expect(formatUsdCents(2000)).toBe("$20");
  });

  it("does not silently truncate a non-round price (regression: naive toFixed(0) rounded $19.50 to $20)", () => {
    expect(formatUsdCents(1950)).toBe("$19.50");
  });

  it("handles a single-cent amount", () => {
    expect(formatUsdCents(1)).toBe("$0.01");
  });
});

describe("formatLkr", () => {
  it("adds thousands separators", () => {
    expect(formatLkr(39900)).toBe("LKR 39,900");
  });
});
