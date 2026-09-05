import type { Metadata } from "next";
import { CaseDetailShell } from "../case-detail-shell";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Case Study: Auditing Our Own Store for AI Search | CeyagMark",
  description:
    "We ran an AI search visibility audit on our own e-commerce store and published the score. 63 out of 100, and the homepage was introducing itself as Agril.",
  alternates: { canonical: "/case-agrilhotech" },
  openGraph: {
    images: OG_IMAGE,
    type: "article",
    title: "Case Study: Auditing Our Own Store for AI Search",
    description: "63 out of 100 on our own store, published rather than hidden. Here is what the audit found.",
    url: "/case-agrilhotech",
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ceyagmark.com/" },
    { "@type": "ListItem", position: 2, name: "Portfolio", item: "https://ceyagmark.com/portfolio" },
    { "@type": "ListItem", position: 3, name: "AgrilHoTech", item: "https://ceyagmark.com/case-agrilhotech" },
  ],
};

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Auditing our own store for AI search visibility",
  about: "AI search visibility, technical SEO and conversion work on a WooCommerce store",
  publisher: { "@type": "Organization", name: "CeyagMark" },
  mainEntityOfPage: "https://ceyagmark.com/case-agrilhotech",
};

export default function CaseAgrilhotechPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }} />
      <CaseDetailShell
        slug="case-agrilhotech"
        breadcrumbLabel="AgrilHoTech"
        eyebrow="Case study · Web build, marketing, SEO, CRO"
        h1="We audited our own store for AI search and published the score."
        lede={'63 out of 100. The store had a thorough llms.txt file and a homepage that introduced itself as "Agril". Both things were true at the same time, one file apart.'}
        facts={[
          ["Business", "AgrilHoTech, our own e-commerce store"],
          ["Sector", "Premium houseplants and tropicals, shipping island-wide in Sri Lanka"],
          ["Stack", "WooCommerce on WordPress, LiteSpeed hosting"],
          ["What we did", "Built the store, run the marketing, and ran a scored AI search visibility audit against it"],
          [
            "Live at",
            <a key="url" href="https://agrilhotech.com" target="_blank" rel="noopener" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
              agrilhotech.com
            </a>,
          ],
          ["Baseline", "63/100 (Discovery 82, Data quality 48, Actionability 60)"],
        ]}
        ctaText="Get the same audit on your store"
      >
        <h2>Why our own store is on this page</h2>
        <p>
          Every agency has a client list. Very few have a business of their own that has to survive the advice they
          sell. AgrilHoTech is ours. It carries real stock, real shipping, real customers and real consequences,
          which makes it the only place we can test something properly before charging anyone for it.
        </p>
        <p>
          Publishing a starting score of 63 out of 100 on our own property is deliberate. A baseline you can go and
          check is worth more than a result you cannot.
        </p>

        <h2>The problem worth solving</h2>
        <p>
          Search is no longer only a page of ten blue links. A meaningful share of buying questions now get answered
          by an assistant that reads the web and replies in a sentence. &quot;Where can I buy an anthurium in Sri
          Lanka&quot; is exactly that kind of question. If a store is not legible to those systems, it does not
          appear in the answer, and there is no ranking report to tell you it happened.
        </p>
        <p>So we built a scored rubric: how discoverable the site is, how good its structured data is, and how actionable the information is once found. Then we ran it against our own store.</p>

        <h2>What the audit found</h2>
        <p>
          The good half was genuinely good. robots.txt explicitly welcomes GPTBot, PerplexityBot and ClaudeBot while
          blocking the scrapers that take without returning anything. The llms.txt file was thorough. Product
          pages carried real structured pricing and a substantial FAQ block. Discovery scored 82.
        </p>
        <p>
          The bad half was embarrassing and cheap to fix. The homepage title read &quot;Home - Agril&quot;. The shop
          page description was the plugin&apos;s own unedited placeholder text, shipped exactly as installed. The
          organisation data was missing its logo, its social profiles, its contact point and its address. Data
          quality scored 48.
        </p>

        <div className="pull reveal">
          The store had built a sophisticated answer-engine layer directly on top of a default nobody had ever read.
        </div>

        <h2>Where the two halves connected</h2>
        <p>
          Look at what fixing this requires. robots.txt is a server-level file. Structured data lives in the theme
          and the SEO plugin. Page titles come out of a template. None of those are things a marketing agency can
          edit, and all of them were being changed for a purely marketing reason: being present when a buyer asks an
          assistant where to shop.
        </p>
        <p>
          A development team would not touch robots.txt on behalf of answer engines, because nobody would have asked
          them to. A marketing team would have written the recommendation and waited. The work happened because one
          team held both the hosting credentials and the reason.
        </p>

        <h2>The result</h2>
        <p>
          <strong>Baseline: 63/100</strong>, from a live audit run on 12 July 2026 against a fixed three-part rubric,
          with the evidence file saved. Discovery 82, data quality 48, actionability 60.
        </p>
        <p>The rubric is fixed on purpose so the re-audit is a comparison rather than a fresh opinion. This is the same method we run for clients, which is why we ran it on ourselves first.</p>

        <h2>What we would do differently</h2>
        <p>
          Read the rendered page titles before writing the llms.txt. The order was backwards. The advanced work was
          done while a default placeholder sat on the most important page on the site. It is a good reminder that
          sophistication at one layer hides nothing about the layer beneath it, and that the cheapest wins are
          usually the ones nobody thought to check.
        </p>
      </CaseDetailShell>
    </>
  );
}
