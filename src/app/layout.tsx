import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { ClickTracker } from "@/components/click-tracker";
import { MotionRuntime } from "@/components/motion-runtime";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = "https://ceyagmark.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // No template: every ported page already carries its own full, exact title
  // from the live site (which brand-suffixes inconsistently — e.g.
  // "... | CeyagMark Growth Audit" vs "... | CeyagMark") — appending a
  // template here would double the suffix on some pages.
  title: "Web Development & Performance Marketing Agency in Sri Lanka | CeyagMark",
  description:
    "CeyagMark builds your website and runs the marketing on it, so the conversions are ours to prove. Web development, paid ads, SEO and CRO for Sri Lankan and international brands. Engagements from LKR 14,999.",
  openGraph: {
    type: "website",
    siteName: "CeyagMark",
    locale: "en_LK",
    url: SITE_URL,
    images: [{ url: "/og-cover.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

// Theme is read from localStorage before paint, matching the live site's own
// pattern (assets/js/main.js), so there is no flash of the wrong theme.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('ceyagmark-theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <AnalyticsScripts />
      </head>
      <body className="min-h-full flex flex-col">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ClickTracker />
        <MotionRuntime />
        {children}
      </body>
    </html>
  );
}
