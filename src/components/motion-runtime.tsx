"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Ported from the live static site's own assets/js/main.js, that file's
// custom cursor, magnetic buttons, 3D tilt, glow-follow and parallax are
// real, already-shipped, already prefers-reduced-motion-safe effects, not
// new ideas invented for this rebuild. The one real difference from a
// traditional multi-page site: Next.js App Router layouts persist across
// client-side navigation, so binding a `pointermove` listener directly to
// each `[data-magnetic]`/`[data-tilt]`/`.glow-hover` element (as the
// original does, once, at page load) would either miss elements added by a
// later navigation or double-bind elements a persisted layout keeps
// mounted. Event delegation on `document` sidesteps both failure modes , 
// one listener, `e.target.closest(...)`, works the same regardless of
// whether the underlying elements are fresh or persisted.
export function MotionRuntime() {
  const pathname = usePathname();

  // Global, bind-once effects: cursor, magnetic, tilt, glow-follow,
  // parallax. All delegated or self-querying, so none of them need to know
  // about navigation.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // ---------- Glow-follow (.glow-hover cards) ----------
    // Cheap position tracking for a CSS radial-gradient highlight, not
    // object movement, so this runs regardless of reduced-motion, matching
    // the original.
    function onGlowMove(e: PointerEvent) {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>(".glow-hover");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    }
    document.addEventListener("pointermove", onGlowMove);

    if (reduce || !finePointer) {
      return () => document.removeEventListener("pointermove", onGlowMove);
    }

    // ---------- Custom cursor ----------
    document.body.classList.add("cursor-on");
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    const ring = document.querySelector<HTMLElement>(".cursor-ring");

    function onPointerMove(e: PointerEvent) {
      mx = e.clientX;
      my = e.clientY;
      if (dot) dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    }
    document.addEventListener("pointermove", onPointerMove, { passive: true });

    let ringFrame = 0;
    function ringLoop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring) ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      ringFrame = requestAnimationFrame(ringLoop);
    }
    ringLoop();

    const hotSel = "a, button, summary, .q-option, label, input, textarea, [data-tilt]";
    function onPointerOver(e: PointerEvent) {
      if (e.target instanceof Element && e.target.closest(hotSel)) ring?.classList.add("is-hot");
    }
    function onPointerOut(e: PointerEvent) {
      if (e.target instanceof Element && e.target.closest(hotSel)) ring?.classList.remove("is-hot");
    }
    function onPointerDown() {
      ring?.classList.add("is-hot");
    }
    function onPointerUp() {
      ring?.classList.remove("is-hot");
    }
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);

    // ---------- Magnetic buttons ----------
    function onMagneticMove(e: PointerEvent) {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>("[data-magnetic]");
      if (!el) return;
      const strength = parseFloat(el.getAttribute("data-magnetic") || "0.3") || 0.3;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x}px,${y}px)`;
    }
    function onMagneticLeave(e: PointerEvent) {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>("[data-magnetic]");
      if (el) el.style.transform = "";
    }
    document.addEventListener("pointermove", onMagneticMove);
    document.addEventListener("pointerout", onMagneticLeave);

    // ---------- 3D tilt ----------
    function onTiltMove(e: PointerEvent) {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>("[data-tilt]");
      if (!el) return;
      const max = parseFloat(el.getAttribute("data-tilt") || "7") || 7;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
    }
    function onTiltLeave(e: PointerEvent) {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>("[data-tilt]");
      if (el) el.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
    }
    document.addEventListener("pointermove", onTiltMove);
    document.addEventListener("pointerout", onTiltLeave);

    // ---------- Parallax (orbs + [data-parallax]) ----------
    // Re-queries the live DOM every frame instead of caching a node list at
    // bind time, so it self-corrects across navigations without needing to
    // know when the marketing layout's orbs are (or aren't) mounted.
    let pmx = 0;
    let pmy = 0;
    let ticking = false;
    let parallaxFrame = 0;
    function onParallaxPointerMove(e: PointerEvent) {
      pmx = e.clientX / window.innerWidth - 0.5;
      pmy = e.clientY / window.innerHeight - 0.5;
    }
    function parallaxFrameFn() {
      const sy = window.scrollY;
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const sp = parseFloat(el.getAttribute("data-parallax") || "0.15") || 0.15;
        el.style.transform = `translate3d(0,${-sy * sp}px,0)`;
      });
      document.querySelectorAll<HTMLElement>(".bg-aura .orb").forEach((orb, i) => {
        const depth = (i + 1) * 14;
        orb.style.transform = `translate3d(${pmx * depth}px,${pmy * depth - sy * 0.04}px,0)`;
      });
      ticking = false;
    }
    function requestParallax() {
      if (!ticking) {
        ticking = true;
        parallaxFrame = requestAnimationFrame(parallaxFrameFn);
      }
    }
    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("pointermove", onParallaxPointerMove, { passive: true });
    window.addEventListener("pointermove", requestParallax, { passive: true });
    parallaxFrameFn();

    // ---------- Growth orb ----------
    // A floating chip carrying the real logo's growth-line mark (not a new
    // character invented for this) that drifts toward the cursor within its
    // own container and gently rotates with scroll. Contained, not
    // full-viewport, it moves within a max radius of its resting position,
    // same "tasteful and limited" bar as everything else in this file.
    let ox = 0;
    let oy = 0;
    let otx = 0;
    let oty = 0;
    let orbFrame = 0;
    const ORB_RADIUS = 22;
    function orbLoop() {
      const wrap = document.querySelector<HTMLElement>("[data-growth-orb]");
      if (wrap) {
        ox += (otx - ox) * 0.08;
        oy += (oty - oy) * 0.08;
        const sy = window.scrollY;
        const spin = (sy * 0.05) % 360;
        wrap.style.transform = `translate3d(${ox}px, ${oy}px, 0) rotate(${spin}deg)`;
      }
      orbFrame = requestAnimationFrame(orbLoop);
    }
    function onOrbPointerMove(e: PointerEvent) {
      const wrap = document.querySelector<HTMLElement>("[data-growth-orb]");
      if (!wrap) return;
      const parent = wrap.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const pull = Math.min(dist, 260) / 260;
      otx = (dx / (dist || 1)) * ORB_RADIUS * pull;
      oty = (dy / (dist || 1)) * ORB_RADIUS * pull;
    }
    document.addEventListener("pointermove", onOrbPointerMove, { passive: true });
    orbLoop();

    return () => {
      document.removeEventListener("pointermove", onGlowMove);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointermove", onMagneticMove);
      document.removeEventListener("pointerout", onMagneticLeave);
      document.removeEventListener("pointermove", onTiltMove);
      document.removeEventListener("pointerout", onTiltLeave);
      window.removeEventListener("scroll", requestParallax);
      window.removeEventListener("pointermove", onParallaxPointerMove);
      window.removeEventListener("pointermove", requestParallax);
      document.removeEventListener("pointermove", onOrbPointerMove);
      cancelAnimationFrame(ringFrame);
      cancelAnimationFrame(parallaxFrame);
      cancelAnimationFrame(orbFrame);
      document.body.classList.remove("cursor-on");
    };
    // Runs once, every listener above is delegated or re-queries the live
    // DOM, so nothing here needs rebinding when the route changes.
  }, []);

  // Reveal observer: genuinely needs re-init per navigation, since
  // IntersectionObserver must be told about each new page's elements , 
  // delegation doesn't help an API that works by calling .observe() on
  // specific nodes.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const SEL = ".reveal, .reveal-line";
    // Re-queries rather than closing over a snapshot: content that mounts later
    // (a Suspense boundary resolving, say) must be reachable by the safety net
    // too, or it stays at opacity 0 forever.
    const revealAll = () =>
      document.querySelectorAll<HTMLElement>(SEL).forEach((el) => el.classList.add("in"));

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
      );
      document.querySelectorAll<HTMLElement>(SEL).forEach((el) => io?.observe(el));
    } else {
      revealAll();
    }

    // Elements that arrive after this effect ran would otherwise never be
    // observed and never reveal. That is not hypothetical: /contact renders its
    // h1 and lede from a client component inside a Suspense boundary, so both
    // mounted after the query above and stayed invisible in production.
    function track(el: Element) {
      if (io) io.observe(el);
      else el.classList.add("in");
    }
    const added = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(SEL)) track(node);
          node.querySelectorAll<HTMLElement>(SEL).forEach(track);
        }
      }
    });
    added.observe(document.body, { childList: true, subtree: true });

    // The floor: never let a missed intersection (or an observer that
    // fails for any reason) hide content longer than ~1.5s. setTimeout,
    // never requestAnimationFrame, rAF can silently never fire in a
    // background tab, which would mean content that never reveals itself.
    const safetyTimer = window.setTimeout(revealAll, 1500);
    function onLoad() {
      window.setTimeout(revealAll, 200);
    }
    window.addEventListener("load", onLoad);

    return () => {
      io?.disconnect();
      added.disconnect();
      window.clearTimeout(safetyTimer);
      window.removeEventListener("load", onLoad);
    };
  }, [pathname]);

  return (
    <>
      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />
    </>
  );
}
