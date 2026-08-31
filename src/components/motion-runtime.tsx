"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Ported from the live static site's own assets/js/main.js — that file's
// custom cursor, magnetic buttons, 3D tilt, glow-follow and parallax are
// real, already-shipped, already prefers-reduced-motion-safe effects, not
// new ideas invented for this rebuild. The one real difference from a
// traditional multi-page site: Next.js App Router layouts persist across
// client-side navigation, so binding a `pointermove` listener directly to
// each `[data-magnetic]`/`[data-tilt]`/`.glow-hover` element (as the
// original does, once, at page load) would either miss elements added by a
// later navigation or double-bind elements a persisted layout keeps
// mounted. Event delegation on `document` sidesteps both failure modes —
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
    // Cheap position tracking for a CSS radial-gradient highlight — not
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
      cancelAnimationFrame(ringFrame);
      cancelAnimationFrame(parallaxFrame);
      document.body.classList.remove("cursor-on");
    };
    // Runs once — every listener above is delegated or re-queries the live
    // DOM, so nothing here needs rebinding when the route changes.
  }, []);

  // Reveal observer: genuinely needs re-init per navigation, since
  // IntersectionObserver must be told about each new page's elements —
  // delegation doesn't help an API that works by calling .observe() on
  // specific nodes.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .reveal-line"));
    if (reduce || !els.length) return;

    const revealAll = () => els.forEach((el) => el.classList.add("in"));

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
      els.forEach((el) => io?.observe(el));
    } else {
      revealAll();
    }

    // The floor: never let a missed intersection (or an observer that
    // fails for any reason) hide content longer than ~1.5s. setTimeout,
    // never requestAnimationFrame — rAF can silently never fire in a
    // background tab, which would mean content that never reveals itself.
    const safetyTimer = window.setTimeout(revealAll, 1500);
    function onLoad() {
      window.setTimeout(revealAll, 200);
    }
    window.addEventListener("load", onLoad);

    return () => {
      io?.disconnect();
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
