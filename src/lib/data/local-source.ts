import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { DataSource } from "./types";
import { createSqlSource } from "./sql-source";

// PGlite is dev/test only, see ADR-001 #4. Required dynamically so a
// production bundle never needs the package resolvable (it is a
// devDependency; PPI's BUILD-NOTES flags the same external-module stub issue
// if this import is reachable from a production build path, which it is not:
// getDataSource() in index.ts only imports this file when CEYAG_DEV_DB=1).
type PGliteInstance = {
  query: <T = Record<string, unknown>>(sql: string, params?: unknown[]) => Promise<{ rows: T[] }>;
  exec: (sql: string) => Promise<unknown>;
};

declare global {
  var __ceyagmarkPglite: PGliteInstance | undefined;
}

async function getDb(): Promise<PGliteInstance> {
  if (globalThis.__ceyagmarkPglite) return globalThis.__ceyagmarkPglite;

  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite() as unknown as PGliteInstance;

  const migrationsDir = join(process.cwd(), "supabase", "migrations");
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf-8");
    await db.exec(sql);
  }
  const seed = readFileSync(join(process.cwd(), "supabase", "seed.sql"), "utf-8");
  await db.exec(seed);

  globalThis.__ceyagmarkPglite = db;
  return db;
}

export const localSource: DataSource = createSqlSource({
  async query<T>(text: string, params?: unknown[]) {
    const db = await getDb();
    const { rows } = await db.query<T>(text, params);
    return rows;
  },
});
