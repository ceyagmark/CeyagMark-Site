"use client";

import { useCanvasScene } from "@/lib/use-canvas-scene";

const TOKENS = ["--brand", "--good"] as const;

// #rrggbb -> [r,g,b]. The tokens in globals.css are all plain 6-digit hex, and
// a bad parse falls back to a mid blue rather than painting NaN.
function rgb(hex: string | undefined): [number, number, number] {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex ?? "").trim());
  const group = m?.[1];
  if (!group) return [46, 134, 255];
  const n = parseInt(group, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: [number, number, number], b: [number, number, number], t: number, alpha: number) {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgba(${r},${g},${bl},${alpha})`;
}

/**
 * A wireframe surface receding to a horizon, with a crest of light travelling
 * across it that shifts the lines from brand blue to green as it passes.
 *
 * Replaces a generated video of the same idea. The video was 5.1MB at 720p and
 * could not loop; this is a parametric surface, so it is seamless by nature,
 * sharp at any size, and reads the real colour tokens.
 */
export function SceneTerrain() {
  const ref = useCanvasScene((ctx, w, h, t, tok) => {
    const blue = rgb(tok["--brand"]);
    const green = rgb(tok["--good"]);

    // Fewer lines on narrow viewports: same composition, less per-frame work.
    const ROWS = w < 700 ? 20 : 32;
    const COLS = w < 700 ? 34 : 54;

    const horizon = h * 0.3;
    // Pushed right of centre: the copy occupies the left of every .page-hero.
    const cx = w * 0.72;

    // The crest sweeps left to right, then spends part of the cycle off-frame
    // so the surface gets to rest at plain blue between passes.
    const crest = ((t * 0.1) % 1.5) - 0.25;

    const pointAt = (xr: number, zr: number) => {
      const depth = Math.pow(zr, 1.9);
      const baseY = horizon + depth * (h - horizon) * 1.06;
      const spread = 0.24 + depth * 1.55;
      const wave =
        Math.sin(xr * 7 + t * 0.6) * 0.5 + Math.sin(xr * 3.1 - zr * 4 + t * 0.42) * 0.5;
      return {
        x: cx + (xr - 0.5) * w * spread,
        y: baseY - wave * 42 * depth,
        depth,
      };
    };

    // Greenness and opacity for a given column/row. The base colour is the
    // bright brand blue rather than --brand-deep: deep is #103a8e, which at
    // these alphas over a near-black page renders as nothing at all.
    const shade = (xr: number, depth: number) => {
      const g = Math.max(0, 1 - Math.abs(xr - crest) / 0.17);
      const alpha = (0.1 + depth * 0.66) * (0.62 + g * 0.85);
      return { g, alpha };
    };

    ctx.lineWidth = 1;

    // Rows: the flowing horizontal contours that carry most of the read.
    for (let i = 1; i < ROWS; i++) {
      const zr = i / (ROWS - 1);
      ctx.beginPath();
      let prev = pointAt(0, zr);
      ctx.moveTo(prev.x, prev.y);
      for (let j = 1; j < COLS; j++) {
        const xr = j / (COLS - 1);
        const p = pointAt(xr, zr);
        // Stroke per segment so the crest can colour part of a row.
        const { g, alpha } = shade(xr, p.depth);
        ctx.strokeStyle = mix(blue, green, g, alpha);
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        prev = p;
      }
    }

    // Sparse verticals for mesh structure, kept faint so they read as weave
    // rather than as a second grid competing with the contours.
    for (let j = 0; j < COLS; j += 5) {
      const xr = j / (COLS - 1);
      ctx.beginPath();
      for (let i = 1; i < ROWS; i++) {
        const p = pointAt(xr, i / (ROWS - 1));
        if (i === 1) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      const { g } = shade(xr, 0.5);
      ctx.strokeStyle = mix(blue, green, g, 0.14 + g * 0.2);
      ctx.stroke();
    }
  }, TOKENS);

  return (
    <div className="scene-layer" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
