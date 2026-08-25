import type { NextConfig } from "next";

// Ported verbatim from the live .htaccess (SLICE-0-CONTRACTS.md "Redirects to
// port"). Retired-page redirects are listed before any generic rule would
// exist, matching the .htaccess comment's own reasoning — there is no
// generic .html-stripping rule needed here since Next.js already serves
// clean, extensionless URLs by route folder name.
const nextConfig: NextConfig = {
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
