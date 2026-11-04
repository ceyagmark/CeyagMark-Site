// Migration runner, split from migrate.mjs so tests can drive it with PGlite.
// `db` needs exec(sql) for multi-statement text and query(sql, params) -> { rows }.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export async function runMigrations({ db, dir, seedPath, log = console.log }) {
  await db.exec(
    "create table if not exists schema_migrations (filename text primary key, applied_at timestamptz not null default now())"
  );
  const done = new Set((await db.query("select filename from schema_migrations")).rows.map((r) => r.filename));
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  const applied = [];

  for (const file of files) {
    if (done.has(file)) {
      log(`skip   ${file} (already applied)`);
      continue;
    }
    await db.exec("begin");
    try {
      await db.exec(readFileSync(join(dir, file), "utf-8"));
      await db.query("insert into schema_migrations (filename) values ($1)", [file]);
      await db.exec("commit");
    } catch (err) {
      await db.exec("rollback");
      throw new Error(`${file} failed and was rolled back: ${err.message}`);
    }
    log(`apply  ${file}`);
    applied.push(file);
  }

  let seeded = false;
  if (seedPath) {
    // The seed is not idempotent (plain inserts), so only run it into an empty
    // database: both of its anchor tables must have no rows.
    const { rows } = await db.query(
      "select (select count(*) from session_types)::int as st, (select count(*) from site_settings)::int as ss"
    );
    if (rows[0].st === 0 && rows[0].ss === 0) {
      await db.exec("begin");
      try {
        await db.exec(readFileSync(seedPath, "utf-8"));
        await db.exec("commit");
      } catch (err) {
        await db.exec("rollback");
        throw new Error(`seed failed and was rolled back: ${err.message}`);
      }
      seeded = true;
      log("seed   supabase/seed.sql");
    } else {
      log("skip   seed (tables already have rows)");
    }
  }

  log(applied.length ? `${applied.length} migration(s) applied.` : "Nothing to apply, database is up to date.");
  return { applied, seeded };
}
