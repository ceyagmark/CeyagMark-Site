// Ported verbatim from Projects/CeyagMark/CeyagMark/assets/js/free-audit.js
// STEPS array. Only the wiring changed: this now posts to /api/leads instead
// of a Google Apps Script endpoint (see form.tsx).

export type Option = { v: string; label: string | { usd: string; lkr: string }; dq?: string };
export type Field = {
  id: string;
  type: "text" | "tel" | "email" | "radio" | "multi";
  q: string;
  required: boolean;
  placeholder?: string;
  hint?: string;
  max?: number;
  options?: Option[];
};
export type Step = { id: string; title: string; lead: string; fields: Field[] };

function L(usd: string, lkr: string) {
  return { usd, lkr };
}

export const STEPS: Step[] = [
  {
    id: "contact",
    title: "Contact details",
    lead: "So we know who we are talking to and where to reach you.",
    fields: [
      { id: "name", type: "text", q: "Full name", required: true, placeholder: "Your name" },
      { id: "store", type: "text", q: "Business or store name", required: true, placeholder: "Your brand" },
      { id: "whatsapp", type: "tel", q: "WhatsApp number, with country code", required: true, placeholder: "+94 70 000 0000" },
      { id: "email", type: "email", q: "Email address", required: false, hint: "Optional, so we can send your report", placeholder: "you@yourbrand.com" },
      { id: "country", type: "text", q: "Country or region", required: true, placeholder: "Where you are based" },
      {
        id: "role",
        type: "radio",
        q: "Your role",
        required: true,
        options: [
          { v: "owner", label: "Owner or Founder" },
          { v: "cofounder", label: "Co-founder" },
          { v: "marketing", label: "Marketing Manager" },
          { v: "other", label: "Other decision maker" },
        ],
      },
    ],
  },
  {
    id: "storeinfo",
    title: "Your store",
    lead: "A quick picture of what you sell and how big it is.",
    fields: [
      {
        id: "platform",
        type: "radio",
        q: "What is your store built on",
        required: true,
        options: [
          { v: "shopify", label: "Shopify" },
          { v: "woocommerce", label: "WooCommerce" },
          { v: "custom", label: "Custom built" },
          { v: "marketplace", label: "Marketplace only, no own store", dq: "We require a branded e-commerce store of your own, not a marketplace-only listing." },
          { v: "other", label: "Other" },
        ],
      },
      {
        id: "storeage",
        type: "radio",
        q: "How old is your store",
        required: true,
        options: [
          { v: "u6", label: "Under 6 months" },
          { v: "6to12", label: "6 to 12 months" },
          { v: "1to2", label: "1 to 2 years" },
          { v: "2to5", label: "2 to 5 years" },
          { v: "5plus", label: "5 years plus" },
        ],
      },
      {
        id: "aov",
        type: "radio",
        q: "Average order value",
        required: true,
        options: [
          { v: "a1", label: L("Under $10", "Under LKR 3,000") },
          { v: "a2", label: L("$10 to $30", "LKR 3,000 to 9,000") },
          { v: "a3", label: L("$30 to $80", "LKR 9,000 to 24,000") },
          { v: "a4", label: L("$80 to $200", "LKR 24,000 to 60,000") },
          { v: "a5", label: L("$200 plus", "LKR 60,000 plus") },
        ],
      },
      {
        id: "revenue",
        type: "radio",
        q: "Monthly revenue",
        required: true,
        options: [
          { v: "r1", label: L("Under $1K a month", "Under LKR 300K a month") },
          { v: "r2", label: L("$1K to $5K", "LKR 300K to 1.5M") },
          { v: "r3", label: L("$5K to $15K", "LKR 1.5M to 4.5M") },
          { v: "r4", label: L("$15K to $50K", "LKR 4.5M to 15M") },
          { v: "r5", label: L("$50K plus", "LKR 15M plus") },
        ],
      },
    ],
  },
  {
    id: "budget",
    title: "Budget and history",
    lead: "This is where we confirm there is enough data to audit.",
    fields: [
      {
        id: "manager",
        type: "radio",
        q: "Who manages your ads",
        required: true,
        options: [
          { v: "myself", label: "Myself" },
          { v: "team", label: "Internal team" },
          { v: "freelancer", label: "Freelancer" },
          { v: "agency", label: "Agency" },
          { v: "paused", label: "Paused right now" },
          { v: "never", label: "Never run ads", dq: "We need active ad history to audit. Come back once you have campaigns running." },
        ],
      },
      {
        id: "budget",
        type: "radio",
        q: "Daily ad budget across all platforms",
        required: true,
        options: [
          { v: "b1", label: "Under $10 a day", dq: "Below $30 a day there is not enough data for a meaningful audit." },
          { v: "b2", label: "$10 to $30 a day", dq: "Below $30 a day there is not enough data for a meaningful audit." },
          { v: "b3", label: "$30 to $50 a day" },
          { v: "b4", label: "$50 to $100 a day" },
          { v: "b5", label: "$100 to $300 a day" },
          { v: "b6", label: "$300 a day plus" },
        ],
      },
      {
        id: "history",
        type: "radio",
        q: "How long have you been running ads",
        required: true,
        options: [
          { v: "h1", label: "Under 3 months", dq: "We need at least 3 months of ad history to spot patterns worth fixing." },
          { v: "h2", label: "3 to 6 months" },
          { v: "h3", label: "6 to 12 months" },
          { v: "h4", label: "1 to 2 years" },
          { v: "h5", label: "2 years plus" },
        ],
      },
      {
        id: "platforms",
        type: "multi",
        q: "Which platforms are active",
        required: true,
        hint: "Select all that apply",
        options: [
          { v: "meta", label: "Meta" },
          { v: "google", label: "Google" },
          { v: "tiktok", label: "TikTok" },
          { v: "all", label: "All three" },
          { v: "other", label: "Other" },
        ],
      },
    ],
  },
  {
    id: "campaign",
    title: "Campaign details",
    lead: "How your advertising runs today.",
    fields: [
      {
        id: "campaignrun",
        type: "radio",
        q: "How do your campaigns run",
        required: true,
        options: [
          { v: "boost", label: "Boosting posts only" },
          { v: "basic", label: "Basic Ads Manager" },
          { v: "advanced", label: "Advanced, with testing" },
          { v: "external", label: "Managed externally" },
        ],
      },
      {
        id: "tracking",
        type: "radio",
        q: "What is your tracking setup",
        required: true,
        options: [
          { v: "pixelcapi", label: "Pixel and CAPI" },
          { v: "pixel", label: "Pixel only" },
          { v: "ga4ads", label: "GA4 and Ads" },
          { v: "full", label: "Full stack" },
          { v: "neither", label: "Neither" },
          { v: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "roas",
        type: "radio",
        q: "Current average ROAS",
        required: true,
        options: [
          { v: "u1", label: "Under 1x" },
          { v: "1to2", label: "1 to 2x" },
          { v: "2to3", label: "2 to 3x" },
          { v: "3plus", label: "3x plus" },
          { v: "never", label: "Never measured" },
        ],
      },
      {
        id: "emailsms",
        type: "radio",
        q: "Is email or SMS marketing active",
        required: true,
        options: [
          { v: "yeswell", label: "Yes, and performing well" },
          { v: "yesweak", label: "Yes, but underperforming" },
          { v: "no", label: "No" },
        ],
      },
    ],
  },
  {
    id: "goals",
    title: "Your goals",
    lead: "Tell us what to focus on first.",
    fields: [
      {
        id: "challenges",
        type: "multi",
        q: "Your biggest challenges right now",
        required: true,
        max: 2,
        hint: "Pick up to 2",
        options: [
          { v: "highcpa", label: "High CPA" },
          { v: "lowroas", label: "Low ROAS" },
          { v: "fatigue", label: "Creative fatigue" },
          { v: "cvr", label: "Poor conversion rate" },
          { v: "audience", label: "Wrong audience" },
          { v: "scale", label: "Cannot scale" },
          { v: "ltv", label: "Low LTV" },
          { v: "dunno", label: "Not sure" },
        ],
      },
      {
        id: "priority",
        type: "radio",
        q: "Your top priority for the next 90 days",
        required: true,
        options: [
          { v: "revenue", label: "More revenue" },
          { v: "cpa", label: "Lower CPA" },
          { v: "ltv", label: "Improve LTV" },
          { v: "scale", label: "Scale profitably" },
          { v: "creatives", label: "Better creatives" },
          { v: "all", label: "All of the above" },
        ],
      },
    ],
  },
  {
    id: "access",
    title: "Access and case study",
    lead: "Last step. This confirms we can actually run the audit.",
    fields: [
      {
        id: "access",
        type: "radio",
        q: "Can you share read-only platform access",
        required: true,
        options: [
          { v: "all", label: "Yes, I can share all of it" },
          { v: "some", label: "I can share some of it" },
          { v: "no", label: "Prefer not to share", dq: "The audit needs read-only access to your platforms. Reach out when you are comfortable sharing." },
        ],
      },
      {
        id: "casestudy",
        type: "radio",
        q: "Are you open to a case study",
        required: true,
        options: [
          { v: "named", label: "Yes, named brand and results" },
          { v: "results", label: "Results only, no brand" },
          { v: "discuss", label: "Need to discuss" },
        ],
      },
    ],
  },
];
