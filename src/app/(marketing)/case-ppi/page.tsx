import type { Metadata } from "next";
import { CaseDetailShell } from "../case-detail-shell";

export const metadata: Metadata = {
  title: "Case Study: A Booking Funnel That Converts 17 Percent | CeyagMark",
  description:
    "How a vehicle inspection business went from a contact form to a booking engine that converts 17 percent of everyone who opens it, and why fixing the analytics changed the recommendation.",
  alternates: { canonical: "/case-ppi" },
  openGraph: {
    type: "article",
    title: "Case Study: A Booking Funnel That Converts 17 Percent",
    description: "17 percent of everyone who opens the booking page books one. Here is what the funnel actually said.",
    url: "/case-ppi",
  },
};

const BREADCRUMB_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ceyagmark.com/" },
    { "@type": "ListItem", position: 2, name: "Portfolio", item: "https://ceyagmark.com/portfolio" },
    { "@type": "ListItem", position: 3, name: "Perth Pre-Purchase Inspection", item: "https://ceyagmark.com/case-ppi" },
  ],
};

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "A booking funnel that converts 17 percent of everyone who opens it",
  about: "Web development and conversion optimisation for a vehicle inspection business",
  publisher: { "@type": "Organization", name: "CeyagMark" },
  mainEntityOfPage: "https://ceyagmark.com/case-ppi",
};

export default function CasePpiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }} />
      <CaseDetailShell
        slug="case-ppi"
        breadcrumbLabel="Perth Pre-Purchase Inspection"
        eyebrow="Case study · Web build, CRO, SEO, dashboard"
        h1="17 percent of everyone who opened the booking page went on to book."
        lede="A vehicle inspection business in Perth. We built the site, the booking engine, the admin system and the reporting, and then used that reporting to argue against buying traffic."
        facts={[
          ["Client", "Perth Pre-Purchase Inspection, Western Australia"],
          ["Sector", "Pre-purchase vehicle inspection"],
          ["What we did", "Website, booking engine, admin dashboard, SMS and email notifications, funnel reporting, technical SEO"],
          [
            "Live at",
            <a key="url" href="https://perthprepurchaseinspection.com" target="_blank" rel="noopener" style={{ color: "var(--brand-glow)", fontWeight: 600 }}>
              perthprepurchaseinspection.com
            </a>,
          ],
          ["Headline result", "17% of everyone who opens the booking page confirms one (first 3 days)"],
        ]}
        ctaText="See where your own funnel leaks"
      >
        <h2>The context</h2>
        <p>
          Pre-purchase inspection is a business with an unusual shape. Demand is urgent: somebody is about to spend
          serious money on a used car and wants it checked first. Supply is hard-capped, because one inspector can
          only do about three inspections a day. That combination punishes both of the usual mistakes. Lose the
          enquiry and it goes to a competitor within the hour. Win too many and you cannot deliver them.
        </p>
        <p>
          So the job was never &quot;get more traffic&quot;. It was to convert the traffic already arriving at close
          to the ceiling of what the calendar could absorb, and to make the business able to see which of those two
          problems it actually had at any moment.
        </p>

        <h2>The constraint</h2>
        <p>
          Three inspection slots a day. That number governs everything. It means a conversion rate is worth more
          than a click volume, it means the calendar itself is a conversion surface rather than a form field, and it
          means any recommendation to increase spend has to be checked against capacity before it is made.
        </p>

        <h2>What we decided, and why</h2>
        <p>
          The first decision was to build a real booking engine rather than a contact form. A contact form turns an
          urgent buyer into an email in somebody&apos;s inbox, and every hour that email waits is an hour the
          customer spends calling somebody else. A calendar closes the loop while the intent is still hot.
        </p>
        <p>
          The second was to build the reporting into the product rather than bolting analytics on afterwards. Every
          step of the booking flow writes a recorded event to the booking database. That means the funnel is read
          from the system that actually takes the bookings, not from a tag that fires on a page and hopes it lines
          up. When the numbers are read out of the same database that holds the bookings, there is nothing to
          reconcile.
        </p>
        <p>
          The third was to treat the follow-up as part of the build. Confirmations, day-before reminders and
          morning-of reminders all run automatically, over both email and SMS, and every send is logged. A booking
          made three weeks out is worth nothing if the customer forgets it or quietly loses confidence in the
          silence.
        </p>

        <h2>Where the two halves connected</h2>
        <p>This is the part worth reading twice.</p>
        <p>
          The funnel report was naming the wrong drop-off. It still counted postcode entry as a step, left over from
          an earlier version of the form where the postcode came first. The postcode had since moved to a later
          step, so the report was measuring something that no longer existed in that position and confidently
          pointing at a problem that was not there.
        </p>
        <p>
          Fixing the measurement changed the recommendation completely. With the steps aligned to the real form, the
          largest fall-off sits between choosing an inspection and picking a time. The obvious read is a broken
          calendar. The correct read, once capacity is in the picture, is that at three slots a day the calendar is
          frequently just full. People are dropping out because nothing suitable is available, not because the
          interface failed them.
        </p>

        <div className="pull reveal">
          An agency reading that same chart without access to the booking database would have sold more traffic into
          a capacity ceiling, and the client would have paid for clicks that had nowhere to land.
        </div>

        <p>
          The advice instead was to check the bookings list before spending anything on traffic, and to treat the
          calendar itself, meaning lead time, blackout dates and how many slots are exposed, as the lever. That
          recommendation is only available to somebody who can see both the funnel and the calendar, which is to say
          somebody who built both.
        </p>

        <h2>The result</h2>
        <p>
          17 percent of everyone who opens the booking page goes on to confirm a booking. Inside that: 65 percent go
          on to choose an inspection, 58 percent of those pick a time, 90 percent of those start entering their
          details, and half of that last group finish. In the first three days, that funnel produced 28 confirmed
          bookings from 162 page opens. Volume has grown since, so the rate is the number worth watching, not the
          count behind it.
        </p>
        <p>
          <strong>How this was measured.</strong> Every step is a recorded event in the site&apos;s own booking
          database, read through reporting we built. It is not a modelled estimate and it is not a platform marking
          its own homework.
        </p>

        <h2>What we would do differently</h2>
        <p>
          Reminders should have shipped alongside the booking engine rather than several iterations later. One
          customer booked three weeks ahead, heard nothing, and had to text to ask whether the appointment was real.
          Nothing was broken. The silence was the problem, and reminders exist to fill exactly that gap.
        </p>
        <p>
          There is also a live one. The last step is now the biggest leak: 56 people started entering their details
          and 28 finished. Half of the most committed visitors on the site are lost on the final form. That is the
          next piece of work, and it is a build problem rather than a traffic problem, which is the whole reason
          this arrangement exists.
        </p>
      </CaseDetailShell>
    </>
  );
}
