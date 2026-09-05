"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import SKY from "@/lib/sky-data.json";
import {
  OBSERVER,
  facingForPath,
  localSiderealDegrees,
  project,
  timeForScroll,
  toHorizontal,
  type Camera,
} from "@/lib/sky";
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

type Star = [number, number, number]; // ra, dec, magnitude
type Figure = { id: string; name: string; lines: [number, number][][] };

const STARS = SKY.stars as Star[];
const FIGURES = SKY.figures as Figure[];

/** Scroll is quantised into this many steps; geometry recomputes once per step. */
const TIME_STEPS = 140;
const FOV = 105;
const TILT = 42;
const CURSOR_REACH = 200;

type PlacedStar = { x: number; y: number; mag: number; twinkle: number };
type PlacedFigure = { name: string; segs: [number, number, number, number][]; cx: number; cy: number };
type Frame = { key: string; stars: PlacedStar[]; figures: PlacedFigure[] };

/** Projects the whole sky for one moment and one facing. */
function buildFrame(key: string, cam: Camera, lst: number): Frame {
  const stars: PlacedStar[] = [];
  for (let i = 0; i < STARS.length; i++) {
    const s = STARS[i];
    if (!s) continue;
    const p = project(toHorizontal(s[0], s[1], OBSERVER.latitude, lst), cam);
    if (!p) continue;
    if (p.x < -60 || p.x > cam.width + 60 || p.y < -60 || p.y > cam.height + 60) continue;
    stars.push({ x: p.x, y: p.y, mag: s[2], twinkle: (i % 97) / 97 * Math.PI * 2 });
  }

  const figures: PlacedFigure[] = [];
  for (const f of FIGURES) {
    const segs: [number, number, number, number][] = [];
    let sx = 0;
    let sy = 0;
    let n = 0;
    for (const poly of f.lines) {
      for (let i = 0; i < poly.length - 1; i++) {
        const a = poly[i];
        const b = poly[i + 1];
        if (!a || !b) continue;
        const pa = project(toHorizontal(a[0], a[1], OBSERVER.latitude, lst), cam);
        const pb = project(toHorizontal(b[0], b[1], OBSERVER.latitude, lst), cam);
        // Both ends must be above the horizon and in front of the camera, or the
        // segment would draw a straight line across a constellation that is
        // half-risen, visibly wrong to anyone who knows the sky.
        if (!pa || !pb) continue;
        segs.push([pa.x, pa.y, pb.x, pb.y]);
        sx += pa.x;
        sy += pa.y;
        n++;
      }
    }
    if (segs.length) figures.push({ name: f.name, segs, cx: sx / n, cy: sy / n });
  }

  return { key, stars, figures };
}

type Shooting = { x: number; y: number; vx: number; vy: number; life: number; max: number };
type Signal = { x: number; y: number; life: number };

/**
 * The night sky over Nittambuwa, rendered from real star positions.
 *
 * Every star is a real catalogue entry projected through the actual
 * equatorial-to-horizontal transform for 7.14 degrees north, so the sky is
 * genuinely the sky: the constellations sit where they belong relative to one
 * another, they rise and set in the right order, and the half below the horizon
 * is not drawn. Scrolling a page advances the clock from 18:00 to 06:00, which
 * rotates the sky exactly as one night's rotation does. Each route faces a
 * different compass direction.
 *
 * The rare pulse is a signal, not a saucer. Literal alien iconography on a site
 * whose entire job is to look like a company you would hand money to is a brand
 * risk with no upside; a faint transmission pulsing out of the noise is the same
 * idea and happens to be the exact metaphor the agency already sells.
 */
export function SceneStars() {
  const pathname = usePathname();
  const facingRef = useRef(0);
  const scrollRef = useRef(0);
  const frameRef = useRef<Frame | null>(null);
  const shootingRef = useRef<Shooting[]>([]);
  const signalRef = useRef<Signal | null>(null);
  const nextShootRef = useRef(3);
  const nextSignalRef = useRef(22);

  useEffect(() => {
    facingRef.current = facingForPath(pathname);
    // Facing changed, so the cached projection is stale.
    frameRef.current = null;
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const ref = useCanvasScene(
    (ctx, w, h, t, tok, pointer) => {
      // Light theme collapses this canvas via CSS.
      if (w < 2 || h < 2) return;

      const starCol = rgb(tok["--text"]);
      const lineCol = rgb(tok["--brand-glow"]);
      const litCol = rgb(tok["--good"]);

      // ---- Geometry cache ----
      // Projecting 1,600 stars is far too expensive per frame, and it only
      // changes when the clock or the facing changes. Quantising scroll into
      // steps bounds the recomputation to once per step rather than once per
      // scroll event.
      const step = Math.round(scrollRef.current * TIME_STEPS);
      const facing = facingRef.current;
      const key = `${facing}|${step}|${Math.round(w)}x${Math.round(h)}`;
      if (!frameRef.current || frameRef.current.key !== key) {
        const when = timeForScroll(step / TIME_STEPS);
        const lst = localSiderealDegrees(when, OBSERVER.longitude);
        const cam: Camera = { facing, tilt: TILT, fov: FOV, width: w, height: h };
        frameRef.current = buildFrame(key, cam, lst);
      }
      const frame = frameRef.current;

      // Small parallax so the sky answers the pointer without leaving its place.
      const px = pointer.active ? (pointer.x / w - 0.5) * 14 : 0;
      const py = pointer.active ? (pointer.y / h - 0.5) * 14 : 0;

      // ---- Stars ----
      for (const s of frame.stars) {
        // Magnitude runs backwards: smaller is brighter. Mag 0 is brilliant,
        // mag 5 is at the edge of naked-eye visibility. The floor matters more
        // than it looks: two thirds of what is on screen at any moment is
        // magnitude 4, and a linear curve renders all of it at an alpha the
        // aura glow simply erases, leaving a handful of bright dots where a
        // sky should be.
        const b = Math.max(0.3, Math.min(1, (5.6 - s.mag) / 4.2));
        const tw = 0.76 + Math.sin(t * 0.8 + s.twinkle) * 0.24;
        ctx.fillStyle = mix(starCol, lineCol, 0.2, b * 0.85 * tw);
        ctx.beginPath();
        ctx.arc(s.x + px * b, s.y + py * b, 0.5 + b * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // ---- Constellation figures, lit by proximity ----
      ctx.lineWidth = 1;
      for (const f of frame.figures) {
        let near = 0;
        if (pointer.active) {
          const d = Math.hypot(pointer.x - (f.cx + px), pointer.y - (f.cy + py));
          if (d < CURSOR_REACH) near = 1 - d / CURSOR_REACH;
        }
        if (near <= 0.02) continue;
        ctx.strokeStyle = mix(lineCol, litCol, near * 0.65, near * 0.4);
        ctx.beginPath();
        for (const [x1, y1, x2, y2] of f.segs) {
          ctx.moveTo(x1 + px, y1 + py);
          ctx.lineTo(x2 + px, y2 + py);
        }
        ctx.stroke();
      }

      // ---- Shooting stars ----
      if (t > nextShootRef.current) {
        // Real meteors radiate from a point and are brief. Random spawn is fine
        // here: nothing about this is a claim of accuracy.
        const fromLeft = Math.random() < 0.5;
        const speed = 380 + Math.random() * 260;
        const angle = (fromLeft ? 0.35 : 0.65) * Math.PI + (Math.random() - 0.5) * 0.4;
        shootingRef.current.push({
          x: fromLeft ? Math.random() * w * 0.4 : w * (0.6 + Math.random() * 0.4),
          y: Math.random() * h * 0.45,
          vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
          vy: Math.sin(angle) * speed * 0.5,
          life: 0,
          max: 0.9 + Math.random() * 0.5,
        });
        nextShootRef.current = t + 5 + Math.random() * 11;
        // Cap the list: an unbounded particle array is how a decorative effect
        // turns into a memory leak on a page left open all day.
        if (shootingRef.current.length > 6) shootingRef.current.shift();
      }
      const dt = 1 / 60;
      shootingRef.current = shootingRef.current.filter((m) => {
        m.life += dt;
        if (m.life > m.max) return false;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        const fade = 1 - m.life / m.max;
        const tailX = m.x - m.vx * 0.055;
        const tailY = m.y - m.vy * 0.055;
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, mix(starCol, lineCol, 0.1, fade * 0.9));
        grad.addColorStop(1, mix(starCol, lineCol, 0.6, 0));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        return true;
      });

      // ---- The signal ----
      if (!signalRef.current && t > nextSignalRef.current && frame.stars.length) {
        const pick = frame.stars[Math.floor(Math.random() * frame.stars.length)];
        if (pick) signalRef.current = { x: pick.x, y: pick.y, life: 0 };
      }
      const sig = signalRef.current;
      if (sig) {
        sig.life += dt;
        const cycle = 2.8;
        if (sig.life > cycle) {
          signalRef.current = null;
          nextSignalRef.current = t + 26 + Math.random() * 34;
        } else {
          // Three expanding rings, offset in phase, like something answering.
          for (let k = 0; k < 3; k++) {
            const p = (sig.life / cycle) * 3 - k * 0.34;
            if (p <= 0 || p >= 1) continue;
            ctx.strokeStyle = mix(litCol, lineCol, 0.3, (1 - p) * 0.5);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(sig.x + px, sig.y + py, p * 34, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.fillStyle = mix(litCol, starCol, 0.3, 0.85);
          ctx.beginPath();
          ctx.arc(sig.x + px, sig.y + py, 2.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    TOKENS,
    { throttleBelowWidth: 1000, throttledFps: 30 },
  );

  return (
    <div className="star-field" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
