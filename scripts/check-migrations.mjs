// Unlike PPI, local-source.ts does not hand-list which migration files to
// apply — it reads every *.sql file in supabase/migrations/ (readdirSync,
// sorted) at startup, so a new migration cannot be forgotten from the dev
// path by construction. That eliminates the specific drift PPI hit four
// times. What THIS script checks instead: filenames are sequential with no
// gaps or duplicate numbers, so supabase-source.ts (applied manually via the
// Supabase SQL editor or `supabase db push` once a project exists — there is
// none yet, see ADR-001) is applying migrations in the same order local dev
// already proved works.

import { readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "supabase", "migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

let ok = true;
let expected = 1;
for (const file of files) {
  const match = file.match(/^(\d{4})_/);
  if (!match) {
    console.log(`FAIL  ${file}: does not start with a 4-digit sequence number`);
    ok = false;
    continue;
  }
  const n = Number(match[1]);
  if (n !== expected) {
    console.log(`FAIL  ${file}: expected sequence ${String(expected).padStart(4, "0")}, got ${match[1]}`);
    ok = false;
  }
  expected = n + 1;
}

console.log(`${files.length} migration file(s) checked.`);
if (!ok) process.exit(1);
console.log("Sequence is contiguous with no gaps or duplicates.");
