// The hero's ambient growth line: a ribbon climbing the right side of the hero
// with a glow travelling along it.
//
// Drawn, not filmed. An earlier pass generated this same motion as video and
// measured the result: ~1.5MB, 720p upscaled into a 1440px hero, a 1.4% luma
// residual at the loop seam, and colours that could only be graded toward the
// brand tokens rather than hitting them. Two stacked strokes and a dash
// animation do the same job in about 2KB, stay sharp at any width, read the
// real tokens, and loop seamlessly by construction: the dash pattern is
// exactly one pathLength long, so offset 100 and offset 0 render identically.
//
// No "use client" — this is static markup plus CSS, so it ships zero JS.

// Enters bottom-left of the right-hand region, three shallow rises, then a
// long climb to the tip. pathLength normalises the geometry to 100 units so
// the dash maths in site.css stays independent of the actual path length.
const RIBBON_PATH =
  "M300 700C372 668 398 636 462 628C526 620 548 586 612 574C676 562 700 522 768 500C858 470 968 330 1096 150";

export function HeroRibbon() {
  return (
    <div className="hero-ribbon" aria-hidden="true">
      <svg viewBox="0 0 1200 700" preserveAspectRatio="xMaxYMid slice">
        <defs>
          <linearGradient id="hero-ribbon-base" x1="300" y1="700" x2="1096" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--brand-deep)" />
            <stop offset="0.5" stopColor="var(--brand)" />
            <stop offset="1" stopColor="var(--good)" />
          </linearGradient>
          <linearGradient id="hero-ribbon-pulse" x1="300" y1="700" x2="1096" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--brand)" />
            <stop offset="0.5" stopColor="var(--brand-glow)" />
            <stop offset="1" stopColor="var(--good)" />
          </linearGradient>
        </defs>
        <path className="hr-base" d={RIBBON_PATH} pathLength={100} />
        <path className="hr-pulse hr-pulse-glow" d={RIBBON_PATH} pathLength={100} />
        <path className="hr-pulse hr-pulse-mid" d={RIBBON_PATH} pathLength={100} />
        <path className="hr-pulse hr-pulse-core" d={RIBBON_PATH} pathLength={100} />
      </svg>
    </div>
  );
}
