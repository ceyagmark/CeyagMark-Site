// Portable source for the portfolio page, ported verbatim from
// Projects/CeyagMark/CeyagMark/portfolio.html + Projects/CeyagMark/portfolio/cases.json.
// Matrix rows and filter chip counts are DERIVED from `tags` below rather than
// hand-maintained twice, the original build session found the matrix heading
// and the filter counts drifting out of sync; generating both from one array
// makes that class of bug structurally impossible here.

export const DISCIPLINES = ["Web Build", "Marketing", "SEO", "CRO", "CRM", "Dashboard"] as const;
export type Discipline = (typeof DISCIPLINES)[number];

export type CaseMetric = { k: string; v: string; neutral?: boolean };

export type FunnelStep = { label: string; note?: string; pct: number };

export type CaseCardData = {
  slug: string;
  kind: "outcome-lead" | "outcome" | "build" | "progress";
  client: string;
  industry?: string;
  headline: string;
  metrics?: CaseMetric[];
  basis?: string;
  basisLabel?: string; // e.g. "How it was measured." / "What we built.", omit for no bold prefix
  connect?: string;
  engagement?: { label: string; href?: string };
  tags: Discipline[];
  cardTags: string[]; // display chips on the card (can differ from discipline tags)
  liveUrl?: string;
  detailHref?: string;
  funnel?: FunnelStep[];
  funnelNote?: string;
  concept?: boolean; // our own demo build, not client work: excluded from the project count
};

export const CASES: CaseCardData[] = [
  {
    slug: "case-ppi",
    kind: "outcome-lead",
    client: "Perth Pre-Purchase Inspection",
    industry: "Vehicle inspection · Perth, Australia",
    headline: "17 percent of everyone who opened the booking page went on to book.",
    metrics: [
      { k: "Opened the page to confirmed booking", v: "17%" },
      { k: "Final step completion (details started to booking confirmed)", v: "50%" },
    ],
    basis:
      "The site's own funnel report, reading the live booking database. Every step is a recorded event, not a modelled estimate. In the first three days after launch, that was 28 confirmed bookings from 162 page opens. Volume has grown since, which is why the rate above is the number we track rather than the count behind it.",
    connect:
      "The funnel report was naming the wrong drop-off. It still counted postcode entry as a step from an earlier version of the form, so it pointed at a problem that no longer existed. Fixing the measurement changed the decision: at three inspection slots a day, the fall-off between choosing a tier and picking a time is mostly a full calendar rather than a broken one. The advice was to check the bookings list before buying any traffic. An ads agency reading the same chart would have sold more clicks into a capacity ceiling.",
    engagement: { label: "Build & Run", href: "/services#build-and-run" },
    tags: ["Web Build", "SEO", "CRO", "Dashboard"],
    cardTags: ["Web build", "Booking engine", "SEO", "CRO", "Admin dashboard", "SMS & email"],
    liveUrl: "https://perthprepurchaseinspection.com",
    detailHref: "/case-ppi",
    funnel: [
      { label: "Opened the booking page", pct: 100 },
      { label: "Chose an inspection", note: "65% of the step before", pct: 65 },
      { label: "Picked a time", note: "58% of the step before", pct: 38 },
      { label: "Started their details", note: "90% of the step before", pct: 35 },
      { label: "Confirmed the booking", note: "50% of the step before", pct: 17 },
    ],
    funnelNote: "The last step is the current leak. Half of everyone who starts entering their details does not finish, which is where the next work goes.",
  },
  {
    slug: "case-translation-device",
    kind: "outcome",
    client: "US translation-device brand",
    industry: "Consumer electronics e-commerce · United States",
    headline: "The receipt page that would have trained the ad campaign on fake orders",
    metrics: [{ k: "Marketing audit score, July → September", v: "46 → 56" }],
    basis:
      "The same five-part marketing audit, covering content, conversion, SEO, competitors and brand, run against the live site in July and again on 10 September 2026. The client's developers shipped the fixes. We wrote the list and re-checked each item on the live site rather than taking it on their word.",
    connect:
      "Before any budget went into Google's Performance Max, the tracking check found that the order confirmation page believed whatever was typed into its address bar. A made-up order for $14,999.50 showed the \"your payment went through\" screen and fired a real purchase event. Performance Max learns from purchase events, so every fake or test visit would have taught it to find more people who never buy. The fix went in on the server, and seven fake orders were rejected on the retest before the campaign plan was written.",
    tags: ["Marketing", "SEO", "CRO"],
    cardTags: ["Marketing audit", "Tracking QA", "GA4 & GTM", "Performance Max", "CRO"],
  },
  {
    slug: "case-wound-care",
    kind: "build",
    client: "Suwasetha",
    industry: "Elder care, wound care and home nursing · Veyangoda, Sri Lanka",
    headline: "The person searching is rarely the person being treated.",
    metrics: [
      { k: "Claims on the site traced to a source before launch", v: "574 of 574", neutral: true },
      { k: "Accessibility violations in the launch scan", v: "0", neutral: true },
      { k: "Home page load on a phone, against a 2.5s budget", v: "1.4s", neutral: true },
    ],
    basisLabel: "What we built.",
    basis:
      "A nine page site, relaunched in September 2026 with elder care as the lead service alongside wound care, home visits and care at the centre. Every price, qualification and clinical statement was checked against a source before launch, and the release gate ran an automated accessibility scan and a timed page load. Enquiries open a prefilled WhatsApp message instead of an email form.",
    connect:
      "The person searching is usually an adult child, often working abroad, arranging care for a parent who is not the one doing the searching, so the site answers a stranger's questions about someone else's condition. When elder care became the lead service, the site's single set of opening hours contradicted every elder-care package on the same domain, because the evening hours belonged to the nurse's wound-care clinic. It now publishes two labelled sets of hours, in the copy and in the data Google reads. One combined span would have been false, since nobody covers the gap between them.",
    tags: ["Web Build", "SEO"],
    cardTags: ["Service site", "Elder care relaunch", "WhatsApp enquiries", "Accessibility", "Local SEO"],
    liveUrl: "https://suwasetha.lk",
  },
  {
    slug: "case-restaurant",
    kind: "build",
    client: "Lotus Edge",
    industry: "Garden restaurant and lounge · Matale, Sri Lanka",
    headline: "A menu the owner changes in a spreadsheet, live on every table's QR code within a minute",
    metrics: [
      { k: "Menu page load on a phone, median of five live tests", v: "1.4s", neutral: true },
      { k: "Dishes the owner edits without a developer", v: "85", neutral: true },
    ],
    basis:
      "Load time is the largest-paint figure from five Lighthouse mobile runs against the live menu page, all inside a 2.5 second budget. The 85 dishes in 14 sections are read from the restaurant's own Google Sheet, refreshed every 60 seconds, with a saved copy served if the sheet is ever unreachable.",
    connect:
      "The printed leaflets already pointed at lotusedge.lk, and the page they reached still said \"Opening\" with a countdown, sample prices and a demo phone number, so fixing it came before any promotion. Nobody on staff is there to update a website, so the menu reads the sheet the owner already edits: untick a dish and it shows as sold out on every table. Table ordering was held back on purpose until the restaurant picks a till that can accept orders from the web, because two systems holding the same order is how staff end up abandoning one of them.",
    tags: ["Web Build", "SEO"],
    cardTags: ["Restaurant site", "QR menu", "Google Sheets as CMS", "Restaurant schema", "Performance"],
    liveUrl: "https://lotusedge.lk",
  },
  {
    slug: "case-velani-house",
    kind: "build",
    concept: true,
    client: "Velani House (concept)",
    industry: "Villa website design · fictional villa, Tangalle, Sri Lanka",
    headline: "A villa website where the scroll bar flies you from sunrise over the sea to dinner by the pool",
    metrics: [
      { k: "First view on a phone, Lighthouse mobile largest paint", v: "2.3s", neutral: true },
      { k: "Drone film driven by the visitor's scroll", v: "15s", neutral: true },
    ],
    basisLabel: "What we built.",
    basis:
      "A concept build, not a client result. Velani House is fictional: the film and photos were generated with AI from two keyframes we art-directed, then upscaled to 2K. Phones get a lighter film, desktops swap in an HD one after the page is already usable.",
    connect:
      "Most Sri Lankan villa sites are a photo slider and a Booking.com button, which sends the guest straight back to the commission. This one makes the visit itself the pitch. The film holds attention, a side-by-side panel shows what booking direct adds at the same price (Booking.com contracts often rule out a cheaper direct rate), and the enquiry opens in WhatsApp with the dates already filled in.",
    tags: ["Web Build", "CRO"],
    cardTags: ["Villa website", "Scroll-driven film", "AI video", "Book-direct perks", "WhatsApp enquiry"],
    liveUrl: "https://ceyagmark.com/work/velani-house",
  },
  {
    slug: "case-agrilhotech",
    kind: "outcome",
    client: "AgrilHoTech",
    industry: "Premium houseplants and tropicals · Sri Lanka",
    headline: 'The AI search audit that found the shop introducing itself as "Agril"',
    metrics: [
      { k: "AI-visibility baseline", v: "63/100", neutral: true },
      { k: "Discovery · Data quality · Actionability", v: "82 · 48 · 60", neutral: true },
    ],
    basis:
      "A live audit of the store run on 12 July 2026 against a fixed three-part rubric, with the evidence file saved. This is a starting score on our own property, published because a baseline you can check beats a result you cannot.",
    connect:
      'robots.txt explicitly allows GPTBot, PerplexityBot and ClaudeBot while blocking the scrapers that give nothing back. That is a server-level edit made for a marketing reason: being answerable when a buyer asks an AI assistant where to buy a plant in Sri Lanka. A build team has no reason to touch robots.txt for answer engines, and a marketing team is not allowed to. The same audit found the homepage title reading "Home - Agril" and the shop description still carrying an unedited plugin placeholder, one file away from an llms.txt that was thorough.',
    engagement: { label: "Build & Run", href: "/services#build-and-run" },
    tags: ["Web Build", "Marketing", "SEO", "CRO"],
    cardTags: ["WooCommerce", "AI search visibility", "Technical SEO", "CRO", "LiteSpeed"],
    liveUrl: "https://agrilhotech.com",
    detailHref: "/case-agrilhotech",
  },
  {
    slug: "case-motorbike-parts",
    kind: "outcome",
    client: "Sri Lankan motorbike parts store",
    industry: "Spare parts e-commerce · Sri Lanka",
    headline: "Scored 38 out of 100, and the biggest single win was a phone number",
    metrics: [{ k: "Conversion readiness at the start", v: "38/100", neutral: true }],
    basis:
      "A full UI, CRO, SEO and technical audit run on 4 June 2026 against a scored rubric, with the report and eight screenshots saved. Same rubric on re-audit, so the next score is comparable rather than a fresh opinion.",
    connect:
      "The store had no main navigation menu, no meta descriptions anywhere, a pricing bug, a broken wishlist and thirty-one products with no descriptions. It also had no phone number, which in this market is the largest single trust barrier before anyone will order a part they cannot inspect. Three fixes, navigation, phone number and meta descriptions, were modelled to move the score past 55. Selling traffic into that store first would have spent the budget on a shop nobody could navigate.",
    engagement: { label: "The Leak Report", href: "/services#leak-report" },
    tags: ["Marketing", "SEO", "CRO"],
    cardTags: ["Conversion audit", "Technical SEO", "Trust signals", "WooCommerce"],
    detailHref: "/case-motorbike-parts",
  },
  {
    slug: "case-sportswear",
    kind: "outcome",
    client: "Sri Lankan sportswear brand",
    industry: "Sportswear apparel · Sri Lanka",
    headline: "Return on ad spend from 2 to 9, average order value up 177 percent",
    metrics: [
      { k: "Return on ad spend, 2.5 months", v: "2 → 9" },
      { k: "Average order value", v: "LKR 2,472 → 6,841" },
      { k: "Conversion readiness at the start", v: "54/100", neutral: true },
    ],
    basis:
      "The 54/100 starting score comes from a scored audit run before any spend. ROAS and AOV are drawn from the client's own Meta Ads Manager and store reporting over the 2.5-month engagement.",
    connect:
      "The account was rebuilt into six campaigns, but the first job was verifying that the Pixel and the Conversions API were actually reporting before a rupee of the new structure went live, since optimising against broken data is how budgets disappear quietly. Average order value moving from LKR 2,472 to 6,841, up 177 percent, is not an ads result. It is a merchandising and on-site result that the ads then get to spend against, and it is the reason the return on spend had room to move at all.",
    tags: ["Marketing", "CRO"],
    cardTags: ["Meta ads", "Pixel & CAPI", "Campaign architecture", "CRO"],
    detailHref: "/case-sportswear",
  },
  {
    slug: "case-fashion-label",
    kind: "build",
    client: "Sri Lankan fashion label",
    industry: "Clothing · Sri Lanka",
    headline: "A body-shape fit simulator, built because ads cannot answer a sizing question",
    basisLabel: "What we built.",
    basis:
      "A custom HTML5 Canvas tool that renders an anatomical body silhouette from the shopper's own measurements, so they can see how a piece will sit before they order it. The label's Meta sales campaign is running now, and its results are not in yet, so none are shown here.",
    connect:
      "Online fashion here loses orders at the size question, and no amount of ad spend answers it, so the fit tool exists because the same team was watching where the drop-off happened. The ads audit found the same kind of gap from the other side: in the 31 days before the audit, the store's Pixel recorded about 100,000 page views, one add-to-cart and no purchases. A campaign told to find buyers would have had nothing to learn from, so the site's tracking went first on the launch plan, ahead of any creative.",
    engagement: { label: "Build & Run", href: "/services#build-and-run" },
    tags: ["Web Build", "Marketing", "CRO"],
    cardTags: ["HTML5 Canvas", "Custom tool", "WooCommerce", "Meta sales campaign", "Pixel audit", "CRO"],
  },
  {
    slug: "case-resort-group",
    kind: "outcome",
    client: "Resort group, Maldives",
    industry: "Hospitality and resorts · Maldives",
    headline: "The account reported 2,853 conversions. They were clicks on Book Now, not bookings.",
    metrics: [
      { k: "Google Ads spend audited, 12 weeks", v: "$4,669", neutral: true },
      { k: "Spent on searches that should have been blocked", v: "≈ $520", neutral: true },
      { k: "Search-term spend already going to generic searches", v: "68%", neutral: true },
    ],
    basisLabel: "How it was measured.",
    basis:
      "Read from the account's own exports for 6 July to 28 September 2026, across three campaigns and 21,915 search terms, with every figure marked as either observed in the data or calculated from it. Underneath the ads sits the stack built earlier in the engagement: Meta Pixel, Google Ads and GA4, Hotjar session recordings and Klaviyo email automation.",
    connect:
      "Bookings finish on a third-party booking engine, so the campaigns launched optimising for the last step the site could see: a click on Book Now. Twelve weeks of data showed that stand-in was measuring browsing, not buying. It counted every click, and brand and generic searches converted at the same 30 percent, which real booking data never does. A real booking event from the booking engine is the fix now being set up. The same audit found one resort's only ad disapproved, which had switched its whole campaign off, and the blocked-search waste above going to competitor resorts, job hunters and a Careers link Google had added on its own. Earlier, the same weekly watch caught copycat domains impersonating the brand.",
    tags: ["Marketing", "CRO"],
    cardTags: ["Google Ads audit", "Conversion tracking", "Meta Pixel & GA4", "Hotjar", "Klaviyo automation", "Brand protection"],
  },
  {
    slug: "case-ssms",
    kind: "build",
    client: "Spear Systems Modular Solutions",
    industry: "Modular industrial systems · Sri Lanka",
    headline: "Seven pages, dark industrial, and every path ends in WhatsApp",
    basis: "A static lead-generation site built for speed and for one job: getting a qualified enquiry into the owner's hands.",
    connect:
      "Built lead-generation first rather than brochure first. In this market the enquiry happens on WhatsApp, so the site hands people to WhatsApp with context already attached instead of burying a contact form on page seven and hoping.",
    tags: ["Web Build", "SEO", "CRM"],
    cardTags: ["Static build", "Lead generation", "Technical SEO", "CRM handoff"],
    liveUrl: "https://spearsystems.lk/",
  },
  {
    slug: "case-kenny",
    kind: "build",
    client: "Kenny Dissanayake",
    industry: "Fashion model portfolio · Sri Lanka",
    headline: "A portfolio that reads like a magazine and indexes like a business",
    basis: "A dark editorial single-page site with scroll-driven motion, built to hold attention on a phone.",
    connect:
      "A portfolio site is usually treated as decoration. This one had to satisfy two very different readers at once: a casting director scrolling on a phone, and a search engine deciding whether this name is a real, indexable entity worth ranking for.",
    tags: ["Web Build", "SEO"],
    cardTags: ["Editorial design", "Scroll motion", "Entity SEO", "Performance"],
    liveUrl: "https://kennydissanayake.com/",
  },
  {
    slug: "case-security",
    kind: "progress",
    client: "Vigor Security",
    industry: "Private security services · Moratuwa, Sri Lanka",
    headline: "A security firm with no track record yet, so every trust signal has to be checkable",
    basisLabel: "What we built.",
    basis:
      "A six page site covering six service lines, careers and contact, on a brand system sampled from the logo file rather than eyeballed. A holding page is live at vigorsecurity.lk while the full site is completed.",
    connect:
      "A new security company has no clients to name, no testimonials and no photographs of its guards, and this industry's templates fill that gap with invented numbers. The first detail we asked the client for was their Ministry of Defence registration, because it is the one credential a buyer can check. The same rule runs through the design: the brand gold measures 1.76 to 1 against white, unreadable as text, so it only appears on navy, where it clears 8 to 1.",
    tags: ["Web Build", "SEO"],
    cardTags: ["Brand system", "Six service lines", "Trust design", "Careers page", "Local SEO"],
  },
  {
    slug: "case-construction",
    kind: "progress",
    client: "Ransewana Constructions",
    industry: "Construction and contracting · Nittambuwa, Sri Lanka",
    headline: "A new contractor's site with no invented history on it",
    basis:
      "Five pages plus service-detail pages, real photography, and a contact path that falls back to the visitor's own email client if the server ever fails, so an enquiry is never silently lost.",
    connect:
      "The client is newly established, so the site carries its founding year, an in-house team, a 24-hour reply commitment and a two-year workmanship warranty, instead of the fabricated project counts and certification badges that this industry's templates ship with by default. The homepage runs an honest FAQ where testimonials would normally sit. Trust signals that turn out to be false cost far more than having fewer of them.",
    engagement: { label: "Build & Run (in progress)" },
    tags: ["Web Build", "SEO", "Marketing", "CRM"],
    cardTags: ["Static build", "Local SEO", "Lead capture", "CRM", "Marketing"],
  },
  {
    slug: "case-event-ticketing",
    kind: "outcome",
    client: "Event ticketing campaign",
    industry: "Live event, ticket sales · Sri Lanka",
    headline: "LKR 1M in ad spend turned into LKR 18M in bookings",
    metrics: [{ k: "Ad spend to bookings, ~18× return", v: "LKR 1M → 18M" }],
    basis: "Reported spend and bookings across Meta and Google for the campaign, pulled from the platforms' own ad accounts.",
    tags: ["Marketing"],
    cardTags: ["Paid social", "Google Ads", "Event ticketing"],
  },
  {
    slug: "case-footwear",
    kind: "outcome",
    client: "Footwear brand, New Zealand",
    industry: "Footwear e-commerce · New Zealand",
    headline: "Conversion rate from 0.7 percent to 2.8 percent in one month",
    metrics: [
      { k: "Conversion rate, one month", v: "0.7% → 2.8%" },
      { k: "Return on ad spend", v: "3.2 → 7.6" },
    ],
    basis:
      "Site-wide conversion rate and blended ROAS, read from GA4 and Meta Ads Manager over a one-month engagement, alongside a 28 percent lift in average order value.",
    tags: ["Marketing", "CRO"],
    cardTags: ["CRO", "Paid acquisition"],
  },
  {
    slug: "case-cpp-drop",
    kind: "outcome",
    client: "International e-commerce brand",
    industry: "E-commerce",
    headline: "Cost per purchase from $28 down to $4 in two months",
    metrics: [{ k: "Cost per purchase, 2 months", v: "$28 → $4" }],
    basis: "Cost per purchase reported in the ad account, tracked over a two-month engagement.",
    tags: ["Marketing"],
    cardTags: ["Paid social", "Cost efficiency"],
  },
  {
    slug: "case-registrations",
    kind: "outcome",
    client: "Education brand",
    industry: "Education",
    headline: "Registrations from 28 to 346 in one month, cost per lead halved",
    metrics: [
      { k: "Registrations, one month", v: "28 → 346" },
      { k: "Cost per lead", v: "LKR 414 → 192" },
    ],
    basis: "Course registrations and cost per lead, read from the platform's own lead-gen reporting over a one-month window.",
    tags: ["Marketing"],
    cardTags: ["Lead generation", "Paid social"],
  },
  {
    slug: "case-hnc",
    kind: "outcome",
    client: "HNC Associates",
    industry: "Accounting and financial services · Sri Lanka",
    headline: "$400 in ad spend turned into LKR 9M in revenue for an accounting firm",
    metrics: [{ k: "Ad spend to revenue, FY 2024-25", v: "$400 → LKR 9M" }],
    basis: "Lead-generation campaign spend and attributed revenue for FY 2024-25, reported by the client against closed engagements.",
    connect:
      "Accounting firms sell on trust and referral more than on a landing page, so the ads are doing the work a website usually would: explaining the service and getting a name into a conversation. That funnel is currently running with no site behind it, which is the honest state of this engagement right now. The website is the next lever, once the same numbers are there to justify what to build.",
    tags: ["Marketing"],
    cardTags: ["Meta ads", "Lead generation", "Web build upcoming"],
  },
];
