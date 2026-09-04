import { CASES, DISCIPLINES } from "./cases-data";

// Rows and the heading count are computed from CASES, not hand-typed. The
// original build session found its hand-maintained matrix heading drifting
// from the actual card count after an edit. Deriving both from one source
// makes that defect class structurally impossible here.
export function CapabilityMatrix() {
  const rows = CASES.map((c) => ({ client: c.client, tags: c.tags }));
  const multiDiscipline = rows.filter((r) => r.tags.length >= 2).length;
  const threeOrMore = rows.filter((r) => r.tags.length >= 3).length;

  return (
    <>
      <div className="section-head reveal">
        <span className="eyebrow">What we actually did</span>
        <h2>
          {multiDiscipline} of these {rows.length} projects needed more than one discipline
        </h2>
        <p>
          This is the differentiator, laid out rather than claimed. {threeOrMore} of them needed three or more. Read
          down a column to see depth in one discipline. Read across a row to see why a project needed one team
          instead of three suppliers who each own a piece of the answer.
        </p>
      </div>
      <div className="matrix-scroll reveal">
        <table className="matrix">
          <caption>Every project on this page and the disciplines it required.</caption>
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: "left" }}>
                Project
              </th>
              {DISCIPLINES.map((d) => (
                <th scope="col" key={d}>
                  {d === "Web Build" ? "Web build" : d}
                </th>
              ))}
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.client}>
                <th scope="row">{r.client}</th>
                {DISCIPLINES.map((d) => (
                  <td key={d} className={r.tags.includes(d) ? "tick" : "no"}>
                    {r.tags.includes(d) ? "●" : "·"}
                  </td>
                ))}
                <td className="count">{r.tags.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
