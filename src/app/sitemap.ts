import type { MetadataRoute } from "next";

const BASE = "https://ceyagmark.com";

// Every public, indexable page from SLICE-0-CONTRACTS.md's meta table, plus
// privacy/terms (new). /book, /booking/*, /quiz and /admin/* are excluded —
// transactional or noindex per that same table.
const PATHS = [
  "/",
  "/services",
  "/consulting",
  "/approach",
  "/portfolio",
  "/case-ppi",
  "/case-agrilhotech",
  "/case-sportswear",
  "/case-motorbike-parts",
  "/free-audit",
  "/growth-audit",
  "/built-by",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date("2026-08-25"),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/case-") ? 0.6 : 0.8,
  }));
}
