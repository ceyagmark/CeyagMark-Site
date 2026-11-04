import { describe, it, expect, beforeAll } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createSqlSource, type SqlExecutor } from "@/lib/data/sql-source";

// Runs the shared SQL source through the same SqlExecutor seam Neon uses, so
// the SQL and row mapping Neon runs in production are exercised here.
const dir = join(process.cwd(), "supabase", "migrations");

let source: ReturnType<typeof createSqlSource>;

beforeAll(async () => {
  const db = new PGlite();
  for (const f of readdirSync(dir).filter((x) => x.endsWith(".sql")).sort()) {
    await db.exec(readFileSync(join(dir, f), "utf-8"));
  }
  await db.exec(readFileSync(join(process.cwd(), "supabase", "seed.sql"), "utf-8"));
  const exec: SqlExecutor = {
    async query<T>(text: string, params?: unknown[]) {
      return (await db.query<T>(text, params)).rows;
    },
  };
  source = createSqlSource(exec);
});

function nextWeekday(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 3);
  while ([0, 6].includes(d.getUTCDay())) d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

describe("createSqlSource on PGlite", () => {
  it("lists seeded session types as numbers", async () => {
    const types = await source.getActiveSessionTypes();
    expect(types.length).toBe(6);
    expect(typeof types[0]?.priceLkr).toBe("number");
  });

  it("returns availability as plain date and HH:MM strings", async () => {
    const st = (await source.getActiveSessionTypes())[0]!;
    const from = nextWeekday();
    const days = await source.getAvailability(st.id, from, from);
    expect(days.length).toBe(1);
    expect(days[0]?.date).toBe(from);
    expect(days[0]?.times[0]).toMatch(/^\d{2}:\d{2}$/);
  });

  it("books, reads back, lists and cancels", async () => {
    const st = (await source.getActiveSessionTypes())[0]!;
    const from = nextWeekday();
    const day = (await source.getAvailability(st.id, from, from))[0]!;
    // Slot times are Asia/Colombo (+05:30).
    const startsAt = new Date(`${day.date}T${day.times[0]}:00+05:30`).toISOString();
    const res = await source.createBooking({
      sessionTypeId: st.id,
      startsAt,
      email: "sql@example.com",
      name: "Sql Test",
    });
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.startsAt).toBe(startsAt);
    const rec = await source.getBookingByToken(res.manageToken);
    expect(rec?.customerEmail).toBe("sql@example.com");
    expect((await source.adminListBookings()).length).toBe(1);
    const clash = await source.createBooking({ sessionTypeId: st.id, startsAt, email: "b@example.com", name: "B" });
    expect(clash.ok).toBe(false);
    expect(await source.cancelBooking(res.manageToken)).toEqual({ ok: true });
    expect(await source.cancelBooking("nope")).toEqual({ ok: false, errorCode: "NOT_FOUND" });
  });

  it("stores a villa_check lead with no email and keeps fields as an object", async () => {
    const lead = await source.createLead({
      source: "villa_check",
      name: "Villa Owner",
      phone: "+94771234567",
      fields: { rooms: "4" },
    });
    expect(lead.email).toBeNull();
    expect(lead.fields).toEqual({ rooms: "4" });
    expect(typeof lead.createdAt).toBe("string");
    expect((await source.adminListLeads()).some((l) => l.id === lead.id)).toBe(true);
  });

  it("writes the log tables", async () => {
    await source.logNotification({ channel: "email", template: "t", recipient: "r", subject: "s", status: "skipped" });
    await source.logLeadSink({ sink: "db", status: "sent" });
  });
});
