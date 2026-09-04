"use client";

import { CONSTELLATIONS } from "@/lib/constellations";
import { useCanvasScene } from "@/lib/use-canvas-scene";

const TOKENS = ["--text", "--brand-glow", "--good"] as const;

function rgb(hex: string | undefined): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex ?? "").trim());
  const group = m?.[1];
  if (!group) return [238, 243, 252];
  const n = parseInt(group, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: [number, number, number], b: [number, number, number], t: number, alpha: number) {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgba(${r},${g},${bl},${alpha})`;
}

const FIELD_COUNT = 190;

// Deterministic scatter. Math.random() at module scope would differ between the
// server render and the client hydrate.
const FIELD = Array.from({ length: FIELD_COUNT }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  const c = Math.sin(i * 39.425) * 24634.6345;
  const d = Math.sin(i * 51.317) * 9182.3371;
  const frac = (n: number) => n - Math.floor(n);
  return {
    x: frac(a),
    y: frac(b),
    // Three parallax planes. Nearer stars are brighter and move further, which
    // is what sells depth when the cursor moves.
    depth: 0.35 + frac(c) * 0.65,
    twinkle: frac(d) * Math.PI * 2,
  };
});

const MAG_SIZE: Record<number, number> = { 1: 1.9, 2: 1.5, 3: 1.15, 4: 0.9 };
const MAG_ALPHA: Record<number, number> = { 1: 0.95, 2: 0.78, 3: 0.6, 4: 0.45 };

const CURSOR_REACH = 260;

/**
 * The dark theme's night sky: a parallax star field with real constellation
 * figures drawn over it. Fixed to the viewport and shared by every page, so it
 * is the theme's identity rather than a per-page flourish.
 *
 * Cursor behaviour is the same idea people liked on the hero scenes: the field
 * shifts against the pointer by depth plane, and a constellation the cursor
 * approaches draws its figure lines in and warms toward green. Constellations
 * are otherwise unlit, so the sky reads as stars until you go looking.
 *
 * Never renders in the light theme (site.css hides it, which collapses the
 * canvas to 1px and makes the draw a no-op) and never animates below 1000px,
 * where a permanently on-screen rAF loop is a battery cost rather than a touch.
 */
export function SceneStars() {
  const ref = useCanvasScene(
    (ctx, w, h, t, tok, pointer) => {
      // Light theme collapses this canvas via CSS; bail rather than paint into a
      // 1px buffer every frame.
      if (w < 2 || h < 2) return;

      const star = rgb(tok["--text"]);
      const line = rgb(tok["--brand-glow"]);
      const lit = rgb(tok["--good"]);

      // Pointer offset from centre, normalised. Falls back to zero before the
      // pointer has ever moved, so the resting sky is not skewed.
      const px = pointer.active ? (pointer.x / w - 0.5) : 0;
      const py = pointer.active ? (pointer.y / h - 0.5) : 0;

      // ---- Background field ----
      const count = w < 900 ? Math.round(FIELD_COUNT * 0.55) : FIELD_COUNT;
      for (let i = 0; i < count; i++) {
        const s = FIELD[i];
        if (!s) continue;
        const shift = s.depth * 26;
        const x = s.x * w - px * shift;
        const y = s.y * h - py * shift;
        // Slow, shallow twinkle. Deep enough to feel alive, not enough to flicker.
        const tw = 0.72 + Math.sin(t * 0.7 + s.twinkle) * 0.28;
        ctx.fillStyle = mix(star, line, 0.25, s.depth * 0.55 * tw);
        ctx.beginPath();
        ctx.arc(x, y, s.depth * 1.25, 0, Math.PI * 2);
        ctx.fill();
      }

      // ---- Constellation figures ----
      for (const c of CONSTELLATIONS) {
        const size = Math.min(w, h) * c.at.scale;
        const originX = c.at.x * w - px * 34;
        const originY = c.at.y * h - py * 34;

        // Resolve the figure's stars once, then measure the cursor against the
        // whole figure so a constellation lights as one object.
        const pts = c.stars.map((s) => ({
          x: originX + (s.x - 0.5) * size,
          y: originY + (s.y - 0.5) * size,
          mag: s.mag,
        }));

        let near = 0;
        if (pointer.active) {
          let best = Infinity;
          for (const p of pts) best = Math.min(best, Math.hypot(pointer.x - p.x, pointer.y - p.y));
          if (best < CURSOR_REACH) near = 1 - best / CURSOR_REACH;
        }

        if (near > 0.01) {
          ctx.lineWidth = 1;
          for (const [i, j] of c.links) {
            const a = pts[i];
            const b = pts[j];
            if (!a || !b) continue;
            ctx.strokeStyle = mix(line, lit, near * 0.7, near * 0.42);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        for (const p of pts) {
          const base = MAG_ALPHA[p.mag] ?? 0.5;
          const size2 = MAG_SIZE[p.mag] ?? 1;
          const tw = 0.8 + Math.sin(t * 0.9 + p.x * 0.05) * 0.2;
          ctx.fillStyle = mix(star, lit, near * 0.6, base * (0.5 + near * 0.5) * tw);
          ctx.beginPath();
          ctx.arc(p.x, p.y, size2 * (1 + near * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    TOKENS,
    { animateFromWidth: 1000 },
  );

  return (
    <div className="star-field" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
