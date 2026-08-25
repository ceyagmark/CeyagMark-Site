import type { DataSource } from "./types";
import { useDevDb } from "@/lib/env";

let cached: DataSource | null = null;

// The only place either data source is chosen. Route handlers call
// await getDataSource(), never import local-source.ts or supabase-source.ts
// directly, so switching the flag is the only thing that changes which
// database runs. Dynamic import keeps @electric-sql/pglite (a devDependency)
// out of any code path a production bundle can reach — env.ts already refuses
// CEYAG_DEV_DB=1 in a production build, so the local-source branch is
// unreachable there.
export async function getDataSource(): Promise<DataSource> {
  if (cached) return cached;
  if (useDevDb) {
    const { localSource } = await import("./local-source");
    cached = localSource;
  } else {
    const { supabaseSource } = await import("./supabase-source");
    cached = supabaseSource;
  }
  return cached;
}
