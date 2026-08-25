import { describe, it, expect } from "vitest";
import { createBookingSchema } from "@/lib/validation/booking";
import { createLeadSchema } from "@/lib/validation/lead";

describe("createBookingSchema", () => {
  it("accepts a valid booking", () => {
    const result = createBookingSchema.safeParse({
      sessionTypeId: "34e151a1-d503-48b7-8449-8b5fd98fc3fc",
      startsAt: "2026-09-01T10:00:00+05:30",
      name: "Jane Doe",
      email: "jane@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty name with the user-facing message", () => {
    const result = createBookingSchema.safeParse({
      sessionTypeId: "34e151a1-d503-48b7-8449-8b5fd98fc3fc",
      startsAt: "2026-09-01T10:00:00+05:30",
      name: "",
      email: "jane@example.com",
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.message).toBe("Tell us your name.");
  });

  it("rejects a 10,000-character notes field", () => {
    const result = createBookingSchema.safeParse({
      sessionTypeId: "34e151a1-d503-48b7-8449-8b5fd98fc3fc",
      startsAt: "2026-09-01T10:00:00+05:30",
      name: "Jane Doe",
      email: "jane@example.com",
      notes: "x".repeat(10000),
    });
    expect(result.success).toBe(false);
  });

  it("accepts Sinhala and emoji in notes", () => {
    const result = createBookingSchema.safeParse({
      sessionTypeId: "34e151a1-d503-48b7-8449-8b5fd98fc3fc",
      startsAt: "2026-09-01T10:00:00+05:30",
      name: "Jane Doe",
      email: "jane@example.com",
      notes: "මම ලංකාවෙන් 🔥🎯🚀",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed whatsapp number", () => {
    const result = createBookingSchema.safeParse({
      sessionTypeId: "34e151a1-d503-48b7-8449-8b5fd98fc3fc",
      startsAt: "2026-09-01T10:00:00+05:30",
      name: "Jane Doe",
      email: "jane@example.com",
      whatsappE164: "0701234567",
    });
    expect(result.success).toBe(false);
  });
});

describe("createLeadSchema", () => {
  it("rejects too many fields keys (unbounded input cap, C7)", () => {
    const fields: Record<string, string> = {};
    for (let i = 0; i < 25; i++) fields[`f${i}`] = "v";
    const result = createLeadSchema.safeParse({
      source: "contact",
      name: "Jane",
      email: "jane@example.com",
      fields,
    });
    expect(result.success).toBe(false);
  });

  it("accepts a script tag as a plain string (React escapes on render, not here)", () => {
    const result = createLeadSchema.safeParse({
      source: "contact",
      name: "<script>alert(1)</script>",
      email: "jane@example.com",
    });
    expect(result.success).toBe(true);
  });
});
