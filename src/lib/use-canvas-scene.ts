"use client";

import { useEffect, useRef } from "react";

/** Cursor position in canvas CSS pixels, eased. `active` is false until the
 *  pointer has actually been over the page, so scenes can rest until then. */
export type ScenePointer = { x: number; y: number; active: boolean };

export type SceneDraw = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  seconds: number,
  tokens: Record<string, string>,
  pointer: ScenePointer,
) => void;

/**
 * Canvas lifecycle shared by the ambient scenes (terrain, signal).
 *
 * Handles the five things every one of them would otherwise duplicate:
 * device-pixel-ratio sizing, resize, pausing while off-screen, honouring
 * prefers-reduced-motion, and reading brand colours from the CSS custom
 * properties so the tokens in globals.css stay the single source (F1) and the
 * scene follows the theme toggle.
 *
 * One frame is always drawn synchronously on mount, before the rAF loop
 * starts. rAF can legitimately never fire (a background tab, a paused
 * compositor), and a decorative canvas that renders nothing at all in that
 * case reads as a broken element rather than a still one.
 */
/** `animateFromWidth`: below this viewport width the scene paints one static
 *  frame and never starts a rAF loop. For a fixed, always-on-screen background
 *  that is the difference between a decorative touch and a battery cost on the
 *  low-end mobile hardware this site is built for. */
export type SceneOptions = { animateFromWidth?: number };

export function useCanvasScene(
  draw: SceneDraw,
  tokenNames: readonly string[],
  opts?: SceneOptions,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // Keep the latest draw without restarting the loop when a parent re-renders.
  // Assigned in an effect, not during render: mutating a ref while rendering is
  // not safe under concurrent React.
  const drawRef = useRef(draw);
  useEffect(() => {
    drawRef.current = draw;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minWidth = opts?.animateFromWidth ?? 0;
    const mayAnimate = !reduce && window.innerWidth >= minWidth;

    let tokens: Record<string, string> = {};
    function readTokens() {
      const cs = getComputedStyle(document.documentElement);
      const next: Record<string, string> = {};
      for (const name of tokenNames) next[name] = cs.getPropertyValue(name).trim();
      tokens = next;
    }

    let width = 0;
    let height = 0;
    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      // Draw in CSS pixels; the transform absorbs the DPR scaling.
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Pointer, eased toward the raw position so scenes glide rather than snap.
    const pointer: ScenePointer = { x: 0, y: 0, active: false };
    let rawX = 0;
    let rawY = 0;
    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      rawX = e.clientX - rect.left;
      rawY = e.clientY - rect.top;
      if (!pointer.active) {
        pointer.x = rawX;
        pointer.y = rawY;
        pointer.active = true;
      }
    }
    // Bound to the window, not the canvas: the canvas is pointer-events:none and
    // sits behind the copy, so it would never receive events of its own.
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const start = performance.now();
    function render(now: number) {
      pointer.x += (rawX - pointer.x) * 0.07;
      pointer.y += (rawY - pointer.y) * 0.07;
      ctx!.clearRect(0, 0, width, height);
      drawRef.current(ctx!, width, height, (now - start) / 1000, tokens, pointer);
    }

    readTokens();
    resize();
    render(start);

    let frame = 0;
    let running = false;
    function loop(now: number) {
      render(now);
      frame = requestAnimationFrame(loop);
    }
    function play() {
      if (running || !mayAnimate) return;
      running = true;
      frame = requestAnimationFrame(loop);
    }
    function pause() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frame);
    }

    // Only animate while actually on screen. A case-study header scrolls out of
    // view early and there is no reason to keep painting it.
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => (e.isIntersecting ? play() : pause())),
        { rootMargin: "120px" },
      );
      io.observe(canvas);
    } else {
      play();
    }

    const ro = new ResizeObserver(() => {
      resize();
      render(performance.now());
    });
    ro.observe(canvas);

    // The theme toggle swaps data-theme on <html>, which changes every token
    // this scene painted with, so re-read and repaint on that attribute alone.
    const mo = new MutationObserver(() => {
      readTokens();
      render(performance.now());
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    function onVisibility() {
      if (document.hidden) pause();
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      pause();
      io?.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [tokenNames, opts?.animateFromWidth]);

  return canvasRef;
}
