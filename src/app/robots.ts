import type { MetadataRoute } from "next";

// Ported verbatim from the live .htaccess-adjacent robots.txt, plus new
// disallows for routes that did not exist on the static site (/book,
// /booking, /admin).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/quiz", "/quiz.html", "/book", "/book/", "/booking/", "/admin", "/admin/"],
      },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
    ],
    sitemap: "https://ceyagmark.com/sitemap.xml",
  };
}
