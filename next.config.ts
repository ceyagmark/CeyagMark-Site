import type { NextConfig } from "next";

// Deliberately NOT nonce-based (Next.js's own docs' recommended strict
// option). A nonce requires every page touched by it to render dynamically
// on every request — that would undo Slice 3's verified 36/36-static-page
// build, the whole point of the route-class decisions in ADR-001. GTM/GA4/
// Meta Pixel/Clarity all inject their own inline scripts at runtime anyway,
// so 'unsafe-inline' plus an explicit vendor allowlist is the same tradeoff
// Next.js's docs present as the default "without nonces" path — logged here,
// not hidden, per BUILD-NOTES Slice 5.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://www.clarity.ms https://*.clarity.ms",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://connect.facebook.net https://www.facebook.com https://www.clarity.ms https://*.clarity.ms",
  "frame-src https://www.googletagmanager.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
  // Ported verbatim from the live .htaccess (SLICE-0-CONTRACTS.md "Redirects to
  // port"). Retired-page redirects are listed before any generic rule would
  // exist, matching the .htaccess comment's own reasoning — there is no
  // generic .html-stripping rule needed here since Next.js already serves
  // clean, extensionless URLs by route folder name.
  async redirects() {
    return [
      { source: "/results", destination: "/portfolio", permanent: true },
      { source: "/results.html", destination: "/portfolio", permanent: true },
      { source: "/case-streetwear", destination: "/case-sportswear", permanent: true },
      { source: "/case-streetwear.html", destination: "/case-sportswear", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      // Any other stray .html URL from the old static site collapses to its
      // clean equivalent, mirroring .htaccess rule 3a.
      { source: "/:slug.html", destination: "/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
