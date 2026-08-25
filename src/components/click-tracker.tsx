"use client";

import { useEffect } from "react";
import { trackWhatsappClick, trackCaseOpened, trackCaseCtaClick } from "@/lib/analytics/events";

// One delegated listener on `document`, mirroring the live static site's own
// pattern (assets/js/main.js's whatsapp_click, assets/js/portfolio.js's
// case_opened/case_cta_click) — a single listener that survives client-side
// navigation, rather than wiring an onClick into every server-rendered link
// that happens to point at wa.me or a case study.
export function ClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link) return;

      if (link.href.includes("wa.me")) {
        trackWhatsappClick();
      }

      const caseLink = link.getAttribute("data-case-link");
      if (caseLink) {
        trackCaseOpened(caseLink, link.getAttribute("data-link-kind") ?? "detail");
      }

      const caseCta = link.getAttribute("data-case-cta");
      if (caseCta) {
        trackCaseCtaClick(caseCta);
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
