import type { DataSource } from "./types";
import { useDevDb } from "@/lib/env";

let cached: DataSource | null = null;

// The only place a data source is chosen. Route handlers call
// await getDataSource(), never import a source file directly, so env vars are
// the only thing that changes which database runs:
//   CEYAG_DEV_DB=1  -> PGlite (dev/test)
//   DATABASE_URL    -> Neon Postgres (production)
//   otherwise       -> Supabase (legacy fallback)
//
// Dynamic import keeps @electric-sql/pglite (a devDependency)
// out of any code path a production bundle can reach, env.ts already refuses
// CEYAG_DEV_DB=1 in a production build, so the local-source branch is
// unreachable there.
export async function getDataSource(): Promise<DataSource> {
  if (cached) return cached;
  if (useDevDb) {
    const { localSource } = await import("./local-source");
    cached = localSource;
  } else if (process.env.DATABASE_URL) {
    const { neonSource } = await import("./neon-source");
    cached = neonSource;
  } else {
    const { supabaseSource } = await import("./supabase-source");
    cached = supabaseSource;
  }
  return cached;
}
