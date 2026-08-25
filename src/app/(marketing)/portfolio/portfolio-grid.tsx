"use client";

import { useMemo, useState } from "react";
import { CASES, DISCIPLINES, type Discipline } from "./cases-data";
import { CaseCard } from "./case-card";
import { trackPortfolioFilter } from "@/lib/analytics/events";

type Filter = "all" | Discipline;

export function PortfolioGrid() {
  const [filter, setFilter] = useState<Filter>("all");

  // Counts derived from the same data the cards render from — cannot drift
  // from the actual card tags the way two hand-maintained lists could (the
  // original build session's own finding).
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: CASES.length } as Record<Filter, number>;
    for (const d of DISCIPLINES) c[d] = CASES.filter((item) => item.tags.includes(d)).length;
    return c;
  }, []);

  const visible = filter === "all" ? CASES : CASES.filter((c) => c.tags.includes(filter));

  function selectFilter(f: Filter) {
    setFilter(f);
    trackPortfolioFilter(f);
  }

  return (
    <>
      <div className="filters reveal" role="group" aria-label="Filter case studies by discipline">
        <button className="chip" type="button" aria-pressed={filter === "all"} onClick={() => selectFilter("all")}>
          All <span className="cn">{counts.all}</span>
        </button>
        {DISCIPLINES.map((d) => (
          <button key={d} className="chip" type="button" aria-pressed={filter === d} onClick={() => selectFilter(d)}>
            {d === "Web Build" ? "Web build" : d} <span className="cn">{counts[d]}</span>
          </button>
        ))}
      </div>
      <p className="filter-status" role="status">
        Showing {visible.length === CASES.length ? `all ${CASES.length}` : visible.length} project
        {visible.length === 1 ? "" : "s"}.
      </p>

      <div className="case-grid">
        {visible.map((c) => (
          <CaseCard key={c.slug} c={c} />
        ))}
      </div>

      {visible.length === 0 && <p className="case-empty show">No projects match that filter yet.</p>}
    </>
  );
}
