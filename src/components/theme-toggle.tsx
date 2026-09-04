"use client";

import { useRef } from "react";

const THEME_KEY = "ceyagmark-theme";

// Mirrors the live site's own vanilla-JS toggle (assets/js/main.js): the icon
// and label swap via CSS attribute selectors keyed off [data-theme] (see
// site.css), not React state, so there is nothing here that can mismatch
// between server and client render. The button's aria-label is updated
// imperatively on click and on mount, exactly like the original.
export function ThemeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  function syncLabel(button: HTMLButtonElement) {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    button.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  }

  function toggle() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const next = isLight ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage unavailable (private browsing, disabled cookies), the
      // toggle still works for this page load, just doesn't persist.
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "light" ? "#f6f8fc" : "#060b16");
    if (buttonRef.current) syncLabel(buttonRef.current);
  }

  return (
    <button
      ref={(node) => {
        buttonRef.current = node;
        if (node) syncLabel(node);
      }}
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label="Switch theme"
    >
      <span className="ic">
        <svg className="t-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <svg className="t-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 12.5A9 9 0 1111.5 3a7 7 0 009.5 9.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="t-label" />
    </button>
  );
}
