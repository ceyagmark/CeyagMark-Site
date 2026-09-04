// Builds the compact star catalogue the night sky renders from.
//
// Source: d3-celestial by Olaf Frohn (https://github.com/ofrohn/d3-celestial),
// BSD licensed, whose data derives from public astronomical catalogues. The
// upstream files are 657KB of stars plus 27KB of figure lines, which is far too
// much to ship to a browser for a background. This filters to naked-eye stars
// and rounds coordinates to two decimals, which is well under a pixel at the
// scale this renders.
//
// Run: node scripts/build-sky-data.mjs
// Output: src/lib/sky-data.json  (committed, the build must not need network)

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const BASE = "https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data";
// Naked-eye limit is about magnitude 6. Cutting at 5.0 keeps the sky dense
// enough to read as a real star field while dropping two thirds of the rows.
const MAG_LIMIT = 5.0;

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "src", "lib", "sky-data.json");

async function getJson(name) {
  const res = await fetch(`${BASE}/${name}`, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  return res.json();
}

const round = (n) => Math.round(n * 100) / 100;

const stars = await getJson("stars.6.json");
const lines = await getJson("constellations.lines.json");
const names = await getJson("constellations.json");

// Validate the coordinate convention rather than assuming it. If RA turns out
// to be 0..360 when the renderer assumes -180..180 (or the reverse) the whole
// sky is silently rotated, which is exactly the class of bug that looks like a
// design problem and wastes hours.
let raMin = Infinity, raMax = -Infinity, decMin = Infinity, decMax = -Infinity;
for (const f of stars.features) {
  const [ra, dec] = f.geometry.coordinates;
  if (ra < raMin) raMin = ra;
  if (ra > raMax) raMax = ra;
  if (dec < decMin) decMin = dec;
  if (dec > decMax) decMax = dec;
}
console.log(`RA range  : ${raMin.toFixed(2)} .. ${raMax.toFixed(2)}`);
console.log(`Dec range : ${decMin.toFixed(2)} .. ${decMax.toFixed(2)}`);
if (raMin < -180.01 || raMax > 360.01 || decMin < -90.01 || decMax > 90.01) {
  throw new Error("Coordinates outside any expected convention, inspect before trusting this data.");
}
const raConvention = raMin < -0.01 ? "-180..180" : "0..360";
console.log(`RA convention detected: ${raConvention}`);

const keptStars = stars.features
  .filter((f) => typeof f.properties.mag === "number" && f.properties.mag <= MAG_LIMIT)
  .map((f) => {
    const [ra, dec] = f.geometry.coordinates;
    return [round(ra), round(dec), round(f.properties.mag)];
  });

const nameById = new Map();
for (const f of names.features) {
  const p = f.properties ?? {};
  if (p.name) nameById.set(f.id, p.name);
}

const figures = lines.features.map((f) => ({
  id: f.id,
  name: nameById.get(f.id) ?? f.id,
  // MultiLineString: an array of polylines, each a list of [ra, dec] vertices.
  lines: f.geometry.coordinates.map((seg) => seg.map(([ra, dec]) => [round(ra), round(dec)])),
}));

const out = {
  _source: "d3-celestial by Olaf Frohn (BSD), from public astronomical catalogues",
  _generatedBy: "scripts/build-sky-data.mjs",
  _magLimit: MAG_LIMIT,
  _raConvention: raConvention,
  stars: keptStars,
  figures,
};

writeFileSync(OUT, JSON.stringify(out));
const kb = (JSON.stringify(out).length / 1024).toFixed(0);
console.log(`\nstars kept : ${keptStars.length} of ${stars.features.length} (mag <= ${MAG_LIMIT})`);
console.log(`figures    : ${figures.length}`);
console.log(`written    : src/lib/sky-data.json  (${kb} KB raw)`);
