"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/consulting", label: "Consulting" },
  { href: "/approach", label: "Approach" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`} data-open={open}>
      <div className="wrap nav-inner">
        <Link className="brand" href="/" aria-label="CeyagMark home">
          <img className="brand-mark mark-light" src="/img/logo-mark-light.svg" alt="" width={34} height={34} />
          <img className="brand-mark mark-dark" src="/img/logo-mark.svg" alt="" width={34} height={34} />
          <span>
            Ceyag<b>mark</b>
          </span>
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>
        <nav className="nav-menu" id="menu" aria-label="Primary">
          <div className="nav-links">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="nav-cta">
            <Link className="muted-link" href="/contact" onClick={() => setOpen(false)}>
              Contact
            </Link>
            <Link className="btn btn-primary" href="/growth-audit" data-magnetic="0.25" onClick={() => setOpen(false)}>
              Free Growth Audit
            </Link>
            {/* Only one of these two is ever displayed (see .theme-dock /
                .nav-theme in site.css), so the hidden one leaves the
                accessibility tree rather than duplicating the control. */}
            <div className="nav-theme">
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
