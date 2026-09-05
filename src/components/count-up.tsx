"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** The real figure. Rendered as-is on the server and whenever motion is off. */
  to: number;
  /** Trailing character, e.g. "+" where the figure is a floor rather than exact. */
  suffix?: string;
  durationMs?: number;
};

/**
 * Counts up to a figure when it scrolls into view.
 *
 * Fail-safe by construction: the true value is what renders on the server, what
 * a crawler sees, and what stays on screen if IntersectionObserver never fires,
 * if rAF never runs, or if the visitor prefers reduced motion. The animation
 * only ever replaces a correct number with the same correct number. A counter
 * that can get stuck showing 0 would be misreporting the business.
 */
export function CountUp({ to, suffix = "", durationMs = 1500 }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(to);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    let frame = 0;
    function run() {
      if (done.current) return;
      done.current = true;
      const start = performance.now();
      setValue(0);
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / durationMs);
        // Ease out cubic: fast first, settles onto the figure rather than
        // stopping dead on it.
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(to * eased));
        if (p < 1) frame = requestAnimationFrame(tick);
        else setValue(to);
      };
      frame = requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            run();
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    // Floor: if the observer never fires for any reason, the figure must still
    // be the real one rather than whatever the animation last set.
    const safety = window.setTimeout(() => {
      io.disconnect();
      if (!done.current) setValue(to);
    }, 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
      cancelAnimationFrame(frame);
      window.clearTimeout(safety);
    };
  }, [to, durationMs]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
