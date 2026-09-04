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

const COUNT = 46;

// Deterministic layout. Math.random() would differ between the server render
// and the client hydrate; this is stable without seeding React state.
const NODES = Array.from({ length: COUNT }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  const c = Math.sin(i * 39.425) * 24634.6345;
  const d = Math.sin(i * 51.317) * 9182.3371;
  return {
    x: a - Math.floor(a),
    y: b - Math.floor(b),
    phase: (c - Math.floor(c)) * Math.PI * 2,
    speed: 0.4 + (d - Math.floor(d)) * 0.6,
  };
});

const LINK_DIST = 168;
const CURSOR_REACH = 190;

/**
 * A drifting node network that reacts to the cursor: nodes near the pointer
 * lean toward it, brighten, and shift green, and the links between them light
 * up. Connections and attribution are what the agency actually sells, so this
 * is the one ambient motif that fits every remaining page rather than being
 * specific to one section's argument.
 *
 * Cheap by construction: 46 nodes is about 1,000 pair checks a frame, no
 * filters, no shadows, and the shared hook pauses it entirely off-screen.
 */
export function SceneNetwork() {
  const ref = useCanvasScene((ctx, w, h, t, tok, pointer) => {
    const blue = rgb(tok["--brand"]);
    const green = rgb(tok["--good"]);
    const glow = rgb(tok["--brand-glow"]);

    const count = w < 700 ? Math.round(COUNT * 0.55) : COUNT;

    // Resolve every node once per frame, including its cursor lean, so the
    // link pass and the node pass agree on where things are.
    const pts: { x: number; y: number; near: number }[] = [];
    for (let i = 0; i < count; i++) {
      const n = NODES[i];
      if (!n) continue;
      // Nodes live in the right-hand 62% of the box; the copy owns the left.
      let x = w * (0.38 + n.x * 0.6) + Math.sin(t * 0.24 * n.speed + n.phase) * w * 0.022;
      let y = h * (0.06 + n.y * 0.88) + Math.cos(t * 0.2 * n.speed + n.phase) * h * 0.05;

      let near = 0;
      if (pointer.active) {
        const dx = pointer.x - x;
        const dy = pointer.y - y;
        const dist = Math.hypot(dx, dy);
        if (dist < CURSOR_REACH) {
          near = 1 - dist / CURSOR_REACH;
          // Lean toward the cursor, never reach it: the network should feel
          // aware of the pointer, not stuck to it.
          x += dx * near * 0.22;
          y += dy * near * 0.22;
        }
      }
      pts.push({ x, y, near });
    }

    // Links first, so nodes sit on top of them.
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      if (!a) continue;
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j];
        if (!b) continue;
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist > LINK_DIST) continue;
        const closeness = 1 - dist / LINK_DIST;
        const lit = Math.max(a.near, b.near);
        ctx.strokeStyle = mix(blue, green, lit * 0.8, closeness * (0.24 + lit * 0.6));
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    for (const p of pts) {
      const r = 1.7 + p.near * 2.4;
      ctx.fillStyle = mix(glow, green, p.near * 0.85, 0.5 + p.near * 0.45);
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }, TOKENS);

  return (
    <div className="scene-layer" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
