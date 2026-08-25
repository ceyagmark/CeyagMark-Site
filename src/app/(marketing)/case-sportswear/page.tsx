import type { Metadata } from "next";
import { CaseDetailShell } from "../case-detail-shell";

export const metadata: Metadata = {
  title: "Case Study: ROAS From 2 to 9 on a Sportswear Brand | CeyagMark",
  description:
    "Rebuilding paid acquisition for a Sri Lankan sportswear brand. Return on ad spend from 2 to 9 in 2.5 months, and why the average order value did most of the work.",
  alternates: { canonical: "/case-sportswear" },
  openGraph: {
    type: "article",
    title: "Case Study: ROAS From 2 to 9 on a Sportswear Brand",
    description: "Why we verified the tracking before touching the campaigns, and why the order value mattered more than the targeting.",
    url: "/case-sportswear",
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ceyagmark.com/" },
    { "@type": "ListItem", position: 2, name: "Portfolio", item: "https://ceyagmark.com/portfolio" },
    { "@type": "ListItem", position: 3, name: "Sportswear brand", item: "https://ceyagmark.com/case-sportswear" },
  ],
};

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Return on ad spend from 2 to 9 on a sportswear brand",
  about: "Paid acquisition and conversion rate optimisation for an apparel brand",
  publisher: { "@type": "Organization", name: "CeyagMark" },
  mainEntityOfPage: "https://ceyagmark.com/case-sportswear",
};

export default function CaseSportswearPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }} />
      <CaseDetailShell
        slug="case-sportswear"
        breadcrumbLabel="Sportswear brand"
        eyebrow="Case study · Marketing, CRO"
        h1="Return on ad spend from 2 to 9 in 2.5 months, and the order value did most of the work."
        lede="A Sri Lankan sportswear brand with an account that was running but not compounding. The first job was not the campaigns. It was checking whether the numbers everyone was optimising against were real."
        facts={[
          ["Client", "Sri Lankan sportswear brand, named on request"],
          ["Sector", "Sportswear apparel e-commerce"],
          ["What we did", "Conversion audit, tracking verification, Meta campaign architecture rebuild"],
          ["Starting score", "54/100 on the conversion audit"],
          ["Headline", "Return on ad spend 2 → 9 in 2.5 months; average order value LKR 2,472 → 6,841 (+177%)"],
        ]}
        ctaText="Check your own economics"
      >
        <h2>The context</h2>
        <p>
          A sportswear brand selling performance and athleisure apparel to a Sri Lankan audience that buys on fit,
          durability and repeat purchase rather than fandom. The audience was real and engaged. The advertising was
          running. The economics were not compounding: spend went up and the returns did not follow, which is the
          pattern that makes founders assume they have an audience problem when the real problem is usually
          somewhere else.
        </p>

        <h2>The constraint</h2>
        <p>
          Apparel in this market runs on thin margins and cash on delivery, which makes every reported conversion
          less reliable than it looks and every rupee of ad spend a real commitment rather than a card charge that
          can be reversed. There was no room to run a month of learning budget to find out whether the setup was
          sound.
        </p>

        <h2>What we decided, and why</h2>
        <p>
          The account was rebuilt into six campaigns with clear separation between prospecting and retargeting, so
          each was answering a different question instead of competing with itself for the same buyer.
        </p>
        <p>
          The first job, though, was not the campaign structure. It was verifying that the Pixel and the Conversions
          API were actually reporting, and reporting the same events, before a rupee of the new structure went live.
          Optimising against broken measurement is how budgets disappear quietly: the algorithm faithfully finds
          more of whatever it is told counts as a conversion, and if that signal is wrong it spends the entire
          budget getting better at the wrong thing.
        </p>

        <div className="pull reveal">
          A return on ad spend figure is only as trustworthy as the event that produced it. Checking the tracking is
          not preparation for the work. It is the first hour of the work.
        </div>

        <h2>Where the two halves connected</h2>
        <p>
          Here is the part that gets misattributed constantly. Average order value moved from LKR 2,472 to LKR
          6,841, up 177 percent. That is not an advertising result. Nothing in a campaign manager raises the value
          of a basket.
        </p>
        <p>
          Order value is won on the site: in what is bundled, what is offered alongside, how the product pages
          present a second item, what the cart does when someone is one item away from free delivery. It is a
          merchandising and conversion problem.
        </p>
        <p>
          And it is the reason the return on ad spend had room to move at all. A higher order value raises the
          ceiling on what the business can afford to pay for a customer, which changes what the campaigns are
          allowed to bid. The advertising then gets to spend against better economics. Read in the wrong order, the
          ads look like they performed a miracle. Read in the right order, the site made the miracle affordable.
        </p>

        <h2>The result</h2>
        <p>
          Return on ad spend moved from 2 to 9 over 2.5 months. Average order value rose from LKR 2,472 to LKR
          6,841, up 177 percent. The conversion audit at the start scored the store 54 out of 100.
        </p>
        <p>
          <strong>How this was measured.</strong> The 54/100 baseline comes from a scored audit run before any
          spend, using the same fixed rubric applied across every store we assess. The ROAS and AOV figures are
          drawn from the client&apos;s own Meta Ads Manager and store reporting over the 2.5-month engagement window.
        </p>

        <h2>What we would do differently</h2>
        <p>
          Record the merchandising changes and the campaign changes as separate, dated events from day one. Both
          worked. Because they overlapped, separating exactly how much of the return came from the offer and how
          much from the media buying is harder than it should be, and that separation is precisely what tells you
          where the next rupee goes.
        </p>
      </CaseDetailShell>
    </>
  );
}
