// Integration harness against real SQL (PGlite), same pattern as PPI's
// db-check.mjs: mocks verify assumptions, this verifies the world (fable-web
// C10). Run with: npm run db:check

import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

let pass = 0;
let fail = 0;

function check(name, condition) {
  if (condition) {
    pass++;
    console.log(`  ok   ${name}`);
  } else {
    fail++;
    console.log(`  FAIL ${name}`);
  }
}

function token() {
  return randomBytes(12).toString("hex");
}

async function main() {
  const db = new PGlite();
  const migrationsDir = join(process.cwd(), "supabase", "migrations");
  for (const file of readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort()) {
    await db.exec(readFileSync(join(migrationsDir, file), "utf-8"));
  }
  await db.exec(readFileSync(join(process.cwd(), "supabase", "seed.sql"), "utf-8"));

  const { rows: types } = await db.query("select * from session_types where slug = 'consulting-30'");
  const sessionTypeId = types[0].id;

  // Pick a start time comfortably inside the seeded Mon-Fri 19:00-22:00
  // window (Shashika's real consulting hours, corrected 2026-08-25 — this
  // was 09:00-18:00 with a 10:00 test slot until then; changing the seeded
  // hours without updating this hardcoded slot broke every test past the
  // first, since 10:00 no longer falls inside availability_rules at all).
  // Starting at the window's open (19:00) leaves the most headroom for the
  // +35/+40/+100min offsets below to stay inside 22:00 regardless of
  // session length or buffer.
  const future = new Date();
  future.setDate(future.getDate() + ((1 + 7 - future.getDay()) % 7 || 7)); // next Monday
  future.setHours(19, 0, 0, 0);
  const startsAt = future.toISOString();

  // 1. A real booking succeeds.
  const first = await db.query("select create_booking($1,$2,$3,$4,$5,$6,$7,$8,$9) as r", [
    sessionTypeId,
    startsAt,
    "CYM-TEST01",
    token(),
    "check@example.com",
    "Check One",
    null,
    null,
    null,
  ]);
  check("a real booking succeeds", first.rows[0].r.ok === true);

  // 2. The exact same slot is rejected (overlap).
  const dupe = await db.query("select create_booking($1,$2,$3,$4,$5,$6,$7,$8,$9) as r", [
    sessionTypeId,
    startsAt,
    "CYM-TEST02",
    token(),
    "check2@example.com",
    "Check Two",
    null,
    null,
    null,
  ]);
  check(
    "an identical slot is rejected as SLOT_UNAVAILABLE",
    dupe.rows[0].r.ok === false && dupe.rows[0].r.error_code === "SLOT_UNAVAILABLE"
  );

  // 3. A slot inside the buffer window (10 min after a 30-min session ends)
  // is also rejected — proves the buffer is enforced, not just the raw
  // session duration.
  const bufferStart = new Date(new Date(startsAt).getTime() + 35 * 60 * 1000).toISOString();
  const bufferClash = await db.query("select create_booking($1,$2,$3,$4,$5,$6,$7,$8,$9) as r", [
    sessionTypeId,
    bufferStart,
    "CYM-TEST03",
    token(),
    "check3@example.com",
    "Check Three",
    null,
    null,
    null,
  ]);
  check(
    "a slot inside the post-session buffer is rejected",
    bufferClash.rows[0].r.ok === false && bufferClash.rows[0].r.error_code === "SLOT_UNAVAILABLE"
  );

  // 4. A slot right after the buffer clears succeeds.
  const clearStart = new Date(new Date(startsAt).getTime() + 40 * 60 * 1000).toISOString();
  const afterBuffer = await db.query("select create_booking($1,$2,$3,$4,$5,$6,$7,$8,$9) as r", [
    sessionTypeId,
    clearStart,
    "CYM-TEST04",
    token(),
    "check4@example.com",
    "Check Four",
    null,
    null,
    null,
  ]);
  check("a slot right after the buffer clears succeeds", afterBuffer.rows[0].r.ok === true);

  // 5. Too little notice is rejected.
  const soon = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  const tooSoon = await db.query("select create_booking($1,$2,$3,$4,$5,$6,$7,$8,$9) as r", [
    sessionTypeId,
    soon,
    "CYM-TEST05",
    token(),
    "check5@example.com",
    "Check Five",
    null,
    null,
    null,
  ]);
  check(
    "a booking inside min_lead_time_minutes is rejected",
    tooSoon.rows[0].r.ok === false && tooSoon.rows[0].r.error_code === "SLOT_UNAVAILABLE"
  );

  // 6. Cancelling releases the slot for a new booking at the same time.
  const manageToken = first.rows[0].r.manage_token;
  const cancelResult = await db.query("select cancel_booking($1) as r", [manageToken]);
  check("cancel_booking succeeds", cancelResult.rows[0].r.ok === true);
  const rebook = await db.query("select create_booking($1,$2,$3,$4,$5,$6,$7,$8,$9) as r", [
    sessionTypeId,
    startsAt,
    "CYM-TEST06",
    token(),
    "check6@example.com",
    "Check Six",
    null,
    null,
    null,
  ]);
  check("a cancelled slot can be rebooked", rebook.rows[0].r.ok === true);

  // 7. Two concurrent calls for the same free slot: exactly one wins.
  // (PGlite is single-connection, so this is serialised, not a true
  // concurrency proof — same limitation PPI documented. It proves the
  // constraint's *logic* is correct, not that it survives real concurrent
  // connections, which needs a real Postgres instance.)
  const raceStart = new Date(new Date(clearStart).getTime() + 60 * 60 * 1000).toISOString();
  const [a, b] = await Promise.all([
    db.query("select create_booking($1,$2,$3,$4,$5,$6,$7,$8,$9) as r", [
      sessionTypeId,
      raceStart,
      "CYM-TEST07",
      token(),
      "checka@example.com",
      "Check A",
      null,
      null,
      null,
    ]),
    db.query("select create_booking($1,$2,$3,$4,$5,$6,$7,$8,$9) as r", [
      sessionTypeId,
      raceStart,
      "CYM-TEST08",
      token(),
      "checkb@example.com",
      "Check B",
      null,
      null,
      null,
    ]),
  ]);
  const winners = [a.rows[0].r.ok, b.rows[0].r.ok].filter(Boolean).length;
  check("exactly one of two simultaneous calls for the same slot wins", winners === 1);

  console.log(`\n${pass} passed, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

main();
