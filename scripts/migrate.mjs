// Applies supabase/migrations/*.sql to DATABASE_URL (Neon), in filename order,
// one transaction per file, recording each in schema_migrations so reruns skip
// them. Usage: DATABASE_URL=... npm run db:migrate [-- --seed]
// Uses the Pool (websocket) driver because migrations are multi-statement
// text, which Neon's HTTP driver does not accept.

import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { join } from "node:path";
import { runMigrations } from "./migrate-lib.mjs";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: url });
// One checked-out client so begin/commit share a single connection.
const client = await pool.connect();
const db = {
  exec: (sql) => client.query(sql),
  query: (sql, params) => client.query(sql, params),
};

try {
  await runMigrations({
    db,
    dir: join(process.cwd(), "supabase", "migrations"),
    seedPath: process.argv.includes("--seed") ? join(process.cwd(), "supabase", "seed.sql") : null,
  });
} catch (err) {
  console.error(err.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
