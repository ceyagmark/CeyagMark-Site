"use client";

import { useCanvasScene } from "@/lib/use-canvas-scene";

const TOKENS = ["--brand", "--good", "--brand-glow"] as const;

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

const COUNT = 900;

// Deterministic scatter. Math.random() at module scope would differ between the
// server render and the client hydrate; this is stable and needs no seeding of
// React state.
const PARTICLES = Array.from({ length: COUNT }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  const c = Math.sin(i * 39.425) * 24634.6345;
  return {
    u: (a - Math.floor(a)),                    // position along the stream
    off: (b - Math.floor(b)) * 2 - 1,          // perpendicular scatter, -1..1
    jitter: (c - Math.floor(c)),               // per-particle drift phase
  };
});

/**
 * Scattered particles that a travelling band gathers into a rising stream:
 * the noise-to-signal read, which is what the agency actually sells.
 *
 * Each particle owns a fixed position along the stream plus a perpendicular
 * offset. A gather band sweeps along the stream; inside it the offset collapses
 * toward zero and the particle brightens and shifts green, then relaxes back
 * out once the band passes. That makes the whole thing cyclic, so it loops with
 * no seam, which is the exact property the generated video could not deliver.
 */
export function SceneSignal() {
  const ref = useCanvasScene((ctx, w, h, t, tok) => {
    const blue = rgb(tok["--brand"]);
    const green = rgb(tok["--good"]);
    const glow = rgb(tok["--brand-glow"]);

    // The stream: a rising curve from lower left to upper right.
    // Anchored to the open right-hand side. The copy occupies the left of every
    // .page-hero, and a stream running under it would fight the headline.
    const streamAt = (u: number) => ({
      x: w * (0.44 + u * 0.54),
      y: h * (0.9 - u * 0.76) + Math.sin(u * 3.2) * h * 0.05,
    });

    const band = ((t * 0.14) % 1.45) - 0.22;

    // Spine: the stream itself, faint, brightest inside the gather band. The
    // particles alone read as random noise without a line to gather onto.
    for (let i = 0; i < 60; i++) {
      const u0 = i / 60;
      const u1 = (i + 1) / 60;
      const a = streamAt(u0);
      const b = streamAt(u1);
      const bnd = Math.max(0, 1 - Math.abs(u0 - band) / 0.28);
      ctx.strokeStyle = mix(glow, green, bnd * u0, 0.05 + bnd * 0.42);
      ctx.lineWidth = 1 + bnd * 2.4;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    const count = w < 700 ? Math.round(COUNT * 0.45) : COUNT;

    for (let i = 0; i < count; i++) {
      const p = PARTICLES[i];
      if (!p) continue;

      // 1 inside the gather band, 0 well outside it.
      const bound = Math.max(0, 1 - Math.abs(p.u - band) / 0.28);

      const s = streamAt(p.u);
      // Perpendicular spread, collapsing as the band arrives.
      const spread = h * 0.24 * (1 - bound * 0.95);
      const drift = Math.sin(t * 0.35 + p.jitter * 6.28) * h * 0.02;

      const x = s.x + p.off * spread * 0.35;
      const y = s.y + p.off * spread + drift;

      const size = 1.2 + bound * 2.2;
      const alpha = 0.3 + bound * 0.65;

      ctx.fillStyle = mix(bound > 0.5 ? glow : blue, green, bound * p.u, alpha);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }, TOKENS);

  return (
    <div className="scene-layer" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
