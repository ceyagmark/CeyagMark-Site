# Slice 4 — browser-driven verification, 2026-08-25

Driven live against `npm run dev` (port 3200). Every visual, animated
behaviour below could only be checked structurally — this session's Browser
pane does not composite frames (confirmed originally 2026-08-07, re-confirmed
and extended in this session, see "The stuck-opacity investigation" below).
**None of this motion layer has been watched on a real screen.** State that
plainly rather than implying otherwise.

## The stuck-opacity investigation

`.reveal` elements correctly received the `.in` class (confirmed via
`classList`/`el.matches('.reveal.in')`), but `getComputedStyle(el).opacity`
kept reading `"0"` indefinitely — which looks exactly like a broken CSS
cascade. Investigated properly rather than assumed:

1. An isolated `<div class="reveal in">`, created fresh with both classes
   already present, computed `opacity:"1"` correctly.
2. A clone of the REAL failing element (`<span class="eyebrow reveal in">`),
   appended into the exact same parent, also computed `opacity:"1"`
   correctly.
3. A trivial, unrelated probe — a throwaway `.probe{opacity:0;transition:
   opacity .3s}` toggled to `.probe.on{opacity:1}` — reproduced the identical
   symptom: stuck at `0` well past the 0.3s transition duration.

Conclusion: this pane cannot render **any** CSS transition to completion,
regardless of what triggers it — a broader version of the already-documented
"no compositing" limitation (previously known for rAF/scroll/
IntersectionObserver/screenshots; now confirmed to include `transition`
too). The reveal implementation itself is correct: the class-toggle logic
(IntersectionObserver + the `setTimeout` safety net) demonstrably worked —
`.in` was present on all 18–34 elements checked across pages, well within
the 1500ms safety-net window. What's unverifiable here is only the *visual*
0→1 fade, which depends on the browser's compositor actually advancing
frames. Memory updated (`browser-pane-no-compositing.md`) with this finding
so a future session doesn't re-diagnose it as a real bug.

## Structural checks that don't depend on a transition completing

These are synchronous inline-style/DOM writes, not CSS-transition-driven —
verifiable in this pane, and all confirmed working via dispatched
`PointerEvent`s:

- **3D tilt** (`about` page founder card, `data-tilt="6"`): pointermove near
  the card's edge produced `transform: perspective(900px) rotateY(1.8deg)
  rotateX(1.8deg)` — proportional to the 6° max exactly as coded.
- **Glow-follow** (`.glow-hover` cards): pointermove at `(40px, 10px)` inside
  a card set `--mx:"40px"` / `--my:"10px"` on the element, driving the
  `radial-gradient(... at var(--mx) var(--my) ...)` highlight.
- **Magnetic button** (homepage hero CTA, `data-magnetic="0.3"`): pointermove
  90% across the button's width produced `translate(26.34px, 0px)`
  (distance-from-center × 0.3, matching the coded strength); `pointerout`
  correctly cleared the inline transform back to `""`.
- **Custom cursor**: `.cursor-dot`/`.cursor-ring` present in the DOM on every
  page (mounted once in the root layout); `body.cursor-on` present,
  confirming the `!reduce && finePointer` gate evaluated true in this
  desktop-viewport pane, exactly as it would for a real desktop visitor.
- **Parallax**: confirmed gated correctly on `requestAnimationFrame` — the
  orbs received one synchronous initial frame at mount
  (`translate3d(0px,0px,0px)`, matching the original's own `frame()` call at
  setup), then correctly stayed frozen after a dispatched `pointermove`
  because subsequent frames are scheduled via `requestAnimationFrame`, which
  (per the existing, now-reconfirmed memory) never fires in this pane. This
  is the expected, correct gating — not a defect — and matches the original
  vanilla implementation's own architecture exactly.

## A real bug found and fixed during this verification pass

React's dev-mode console showed a repeating `eval() is not supported in this
environment` error on every page. Traced to Slice 5's CSP: `script-src` had
no `'unsafe-eval'`, which Next.js's own CSP docs say to add in development
only (React's dev tooling wants `eval()` for stack-trace reconstruction;
"React will never use eval() in production mode," per its own message).
Fixed in `next.config.ts` with the exact `isDev` conditional Next's docs
show. Confirmed via `curl` that the served header now includes
`'unsafe-eval'` in dev and omits it in a production build. **The console
error persisted after the fix** — the header is provably correct, so this
looks like a separate limitation of this specific sandboxed preview pane
(it also shows unrelated `WebSocket .../  _next/hmr` connection failures),
not something further fixable from application config. Zero functional
impact either way: `preview_logs` showed no server errors, and every
structural check above passed normally.

## What shipped, source-checked against the live static site

Every effect below is a real, already-shipped, already prefers-reduced-
motion-safe pattern from `assets/js/main.js` on the live static site — not
new ideas invented for this rebuild:

- Scroll reveal (`.reveal`/`.reveal.in`, IntersectionObserver + a 1500ms/
  200ms setTimeout safety net — never rAF, per the kickoff's own hard floor)
- Custom cursor (dot + lerped ring)
- Magnetic buttons (`data-magnetic`)
- 3D tilt (`data-tilt`)
- Glow-follow (`.glow-hover`, CSS custom properties)
- Parallax (background orbs + `data-parallax`)

`data-magnetic`/`data-tilt` were applied selectively — the homepage hero
CTA, the free-audit success screen's WhatsApp CTA (restoring the exact
attribute the original `free-audit.js` had), and the about page's founder
card — not blanketed across every button and card on the site. Tasteful and
limited, matching the kickoff's own framing.

**Deliberately not built this slice:** native browser View Transitions.
Next 16 supports React's `<ViewTransition>` component, but it needs
per-page wrapping across every route, has real Safari/Firefox behavioural
gaps per Next's own docs, and delivers the least load-bearing value of
everything the kickoff listed as motion inspiration. Logged as a scope cut,
not a silent omission — a real two-way door, cheap to add later.
