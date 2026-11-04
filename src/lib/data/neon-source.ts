import { neon } from "@neondatabase/serverless";
import { createSqlSource, type SqlExecutor } from "./sql-source";

// Production source: Neon Postgres over its HTTP driver (one stateless fetch
// per query, fine for serverless route handlers). It runs the exact SQL in
// sql-source.ts that the PGlite dev source runs; only the executor differs.
// Schema and seed are applied separately with `npm run db:migrate`.
let run: ReturnType<typeof neon> | null = null;

function getRunner() {
  if (run) return run;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL must be set to use the Neon data source.");
  run = neon(url);
  return run;
}

const executor: SqlExecutor = {
  async query<T>(text: string, params?: unknown[]) {
    return (await getRunner().query(text, params ?? [])) as T[];
  },
};

export const neonSource = createSqlSource(executor);
