import { describe, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { join } from "node:path";
import { runMigrations } from "../scripts/migrate-lib.mjs";

const dir = join(process.cwd(), "supabase", "migrations");
const seedPath = join(process.cwd(), "supabase", "seed.sql");
const quiet = () => {};

describe("runMigrations", () => {
  it("applies everything once, then skips on rerun", async () => {
    const db = new PGlite();
    const first = await runMigrations({ db, dir, seedPath, log: quiet });
    expect(first.applied.length).toBeGreaterThanOrEqual(4);
    expect(first.seeded).toBe(true);

    const second = await runMigrations({ db, dir, seedPath, log: quiet });
    expect(second.applied).toEqual([]);
    expect(second.seeded).toBe(false);

    const { rows } = await db.query("select count(*)::int as n from session_types");
    expect((rows[0] as { n: number }).n).toBe(6);
  }, 30_000);

  it("does not seed when not asked", async () => {
    const db = new PGlite();
    const r = await runMigrations({ db, dir, seedPath: null, log: quiet });
    expect(r.seeded).toBe(false);
    const { rows } = await db.query("select count(*)::int as n from session_types");
    expect((rows[0] as { n: number }).n).toBe(0);
  });
});
