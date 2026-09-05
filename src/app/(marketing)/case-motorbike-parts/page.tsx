import type { Metadata } from "next";
import { CaseDetailShell } from "../case-detail-shell";
import { OG_IMAGE } from "@/lib/og";

export const metadata: Metadata = {
  title: "Case Study: The Store Scored 38/100 and Needed a Phone Number | CeyagMark",
  description:
    "A conversion audit of a Sri Lankan motorbike parts store. Score 38 out of 100, no navigation menu, no meta descriptions, and the biggest single win was adding a phone number.",
  alternates: { canonical: "/case-motorbike-parts" },
  openGraph: {
    images: OG_IMAGE,
    type: "article",
    title: "Case Study: 38 out of 100, and the Biggest Win Was a Phone Number",
    description: "What a full conversion audit found on a Sri Lankan e-commerce store, and why the fix order matters.",
    url: "/case-motorbike-parts",
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ceyagmark.com/" },
    { "@type": "ListItem", position: 2, name: "Portfolio", item: "https://ceyagmark.com/portfolio" },
    { "@type": "ListItem", position: 3, name: "Motorbike parts store", item: "https://ceyagmark.com/case-motorbike-parts" },
  ],
};

export default function CaseMotorbikePartsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <CaseDetailShell
        slug="case-motorbike-parts"
        breadcrumbLabel="Motorbike parts store"
        eyebrow="Case study · Marketing, SEO, CRO"
        h1="It scored 38 out of 100, and the biggest single win was a phone number."
        lede="A new motorbike spare parts store with a clean look and almost nothing underneath it working. The client came asking about advertising. The honest answer was to fix the shop first."
        facts={[
          ["Client", "Sri Lankan motorbike spare parts store, named on request"],
          ["Sector", "Spare parts e-commerce, WooCommerce"],
          ["What we did", "Full UI, conversion, SEO and technical audit against a scored rubric"],
          ["Baseline", "38/100, audited 4 June 2026"],
          ["Evidence", "Written report plus eight annotated screenshots, saved"],
        ]}
        ctaText="Get your store scored"
      >
        <h2>The context</h2>
        <p>
          An early-stage store selling motorbike spare parts. The visual direction was fine, clean and not amateur,
          which is exactly what makes this case instructive. Nothing about the homepage told the owner anything was
          wrong. The store looked like a store.
        </p>
        <p>The enquiry that started it was about advertising. That is almost always the enquiry, because ad spend is the lever people know they can pull.</p>

        <h2>The constraint</h2>
        <p>
          Early-stage, limited budget, and a category where trust does most of the selling. Nobody buys a brake part
          they cannot inspect from a shop they are not sure is real. Whatever budget existed had to go where it
          changed the outcome, and there was not enough of it to waste a month finding out.
        </p>

        <h2>What the audit found</h2>
        <p>The store had no main navigation menu. Visitors landing on a product page had no route to any other product except the back button.</p>
        <p>It had no meta descriptions anywhere on the site. Thirty-one products carried no descriptions at all. There was a pricing bug, and a wishlist feature that did not work.</p>
        <p>And it had no phone number.</p>

        <h2>Where the two halves connected</h2>
        <p>
          The temptation here is to score the site, hand over a twenty-item list, and start the ad campaign in
          parallel because that is the billable part. That would have been the wrong sequence and everyone would
          have found out slowly.
        </p>
        <p>
          Sending paid traffic to that store meant paying for visitors who would land on one product, find no way to
          browse to a second, see no evidence the business was reachable by a human, and leave. The advertising
          would not have failed loudly. It would have produced a mediocre cost per purchase that looked like a
          targeting problem, and the next month would have been spent optimising audiences against a navigation bug.
        </p>

        <div className="pull reveal">
          In this market a visible phone number is not a nice-to-have on the contact page. It is the single largest
          trust barrier standing between a stranger and their first order.
        </div>

        <p>
          Three fixes were modelled to move the score past 55 on their own: the navigation menu, the phone number,
          and meta descriptions across the site. None of them are advertising. All of them decide what the
          advertising is worth.
        </p>

        <h2>The result</h2>
        <p>
          <strong>Baseline: 38/100</strong>, from a full UI, conversion, SEO and technical audit run on 4 June 2026
          against a scored rubric, with the report and eight screenshots saved. Category-level scores, the
          twenty-item priority list, and the three-fix shortlist all came from the same pass.
        </p>
        <p>The rubric is fixed, so re-auditing the store produces a comparable number rather than a fresh opinion. The before and after are measured with the same ruler.</p>

        <h2>What we would do differently</h2>
        <p>
          Lead the report with the three-fix shortlist rather than the complete twenty-item table. The full list is
          correct and it is also where momentum goes to die. A client looking at twenty items does nothing; a client
          looking at three does three, and then asks for the rest.
        </p>
      </CaseDetailShell>
    </>
  );
}
