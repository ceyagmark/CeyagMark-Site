// Ported verbatim from Projects/CeyagMark/CeyagMark/assets/js/quiz.js, question
// text, options, insight copy and the scoring/tier algorithm are unchanged.
// NOT ported: localStorage save-for-later, the base64 share-link, and the
// resume gate. Those are real UX conveniences in the original but are
// secondary to the funnel's correctness; cut to keep this port bounded, and
// logged as an open item in BUILD-NOTES rather than silently dropped.

export type Industry = { id: string; label: string; noun: string; one: string; repeat: string; cart: string };

export const INDUSTRIES: Industry[] = [
  { id: "ecom", label: "Ecommerce or online store", noun: "customers", one: "customer", repeat: "repeat purchases", cart: "abandoned cart" },
  { id: "product", label: "Physical product brand", noun: "customers", one: "customer", repeat: "repeat purchases", cart: "abandoned cart" },
  { id: "course", label: "Course or education brand", noun: "students", one: "student", repeat: "repeat enrolments", cart: "abandoned checkout" },
  { id: "service", label: "Service business or agency", noun: "clients", one: "client", repeat: "repeat projects", cart: "dropped enquiry" },
  { id: "saas", label: "SaaS or digital product", noun: "users", one: "user", repeat: "renewals", cart: "abandoned signup" },
  { id: "local", label: "Local or appointment business", noun: "customers", one: "customer", repeat: "repeat bookings", cart: "abandoned booking" },
  { id: "other", label: "Something else", noun: "customers", one: "customer", repeat: "repeat purchases", cart: "abandoned cart" },
];

export function fillTokens(str: string, industry: Industry): string {
  return str
    .replace(/\{noun\}/g, industry.noun)
    .replace(/\{one\}/g, industry.one)
    .replace(/\{repeat\}/g, industry.repeat)
    .replace(/\{cart\}/g, industry.cart);
}

export type BestPracticeQ = { tag: "Acquisition" | "Conversion" | "Retention"; q: string; options: string[]; insight: string };

export const BEST_PRACTICE: BestPracticeQ[] = [
  {
    tag: "Acquisition",
    q: "Do you know your current cost per acquisition (CPA) and the target CPA your margins can sustain?",
    options: ["No, I am not sure what it costs to win a {one}", "Roughly, but I don't track it", "Yes, I review it monthly", "Yes, I track it in near real time against a target"],
    insight: "You don't track CPA against a target. Without one, every scaling decision is a guess and rising costs go unnoticed until they hurt margins.",
  },
  {
    tag: "Conversion",
    q: "Do you regularly A/B test your landing pages, offers or checkout?",
    options: ["Never", "Occasionally, no real process", "Yes, a few tests now and then", "Yes, on a structured, ongoing roadmap"],
    insight: "Because you rarely test pages and offers, you're likely leaving conversions, and revenue you already paid for, on the table.",
  },
  {
    tag: "Acquisition",
    q: "How often do you launch fresh ad creative?",
    options: ["Rarely, the same ads for months", "Every few months", "Monthly", "Weekly or continuously"],
    insight: "Creative fatigue is one of the fastest ways CPA climbs. Refreshing too slowly means you pay more for the same result over time.",
  },
  {
    tag: "Retention",
    q: "Do you have automated email or SMS flows, like welcome, {cart}, post-purchase and win-back?",
    options: ["None", "Just a welcome email", "A couple of flows", "A full lifecycle set, segmented"],
    insight: "Missing lifecycle flows means you win {noun} once and don't bring them back, the single biggest drag on lifetime value.",
  },
  {
    tag: "Retention",
    q: "Do you know your customer lifetime value (LTV) and payback period?",
    options: ["No", "I have a rough idea", "Yes, I've calculated it", "Yes, and I use it to set acquisition budgets"],
    insight: "If you don't know your LTV, you don't know how much you can afford to win a {one}, so you are either underspending or overspending.",
  },
  {
    tag: "Acquisition",
    q: "Do you use audience segmentation and retargeting?",
    options: ["No", "Basic retargeting only", "Yes, some segmentation", "Yes, sophisticated segments and retargeting"],
    insight: "Without segmentation and retargeting, you pay full price to reach {noun} who were one nudge away from buying.",
  },
  {
    tag: "Conversion",
    q: "Is your conversion tracking and attribution set up correctly?",
    options: ["I'm not sure it's accurate", "Basic pixel only", "Mostly, with some gaps", "Yes, server side and verified"],
    insight: "Shaky tracking means you optimise on bad data. You cannot fix or scale what you cannot measure accurately.",
  },
  {
    tag: "Conversion",
    q: "Do your marketing decisions follow a structured testing plan, or gut feel?",
    options: ["Mostly gut feel", "A loose plan", "A documented plan", "A prioritised roadmap reviewed regularly"],
    insight: "Random testing wastes spend. A prioritised roadmap is what turns a marketing budget into compounding learnings.",
  },
  {
    tag: "Retention",
    q: "Do you track {repeat} and retention?",
    options: ["No", "Rarely", "Yes, occasionally", "Yes, it's a core KPI"],
    insight: "Retention is invisible until you measure it. If {repeat} aren't a KPI, growth is leaking out the back door.",
  },
  {
    tag: "Acquisition",
    q: "Can you confidently forecast next month's revenue?",
    options: ["No, it is unpredictable", "A rough guess", "Within a reasonable range", "Yes, with confidence"],
    insight: "Unpredictable revenue is a symptom. It usually means the underlying acquisition and retention system isn't yet a system.",
  },
];

export const PROFILE = [
  {
    id: "industry",
    tag: "Your business",
    q: "First, what kind of business are you growing?",
    help: "This tailors the rest of your audit to how your model actually makes money.",
    options: INDUSTRIES.map((i) => i.label),
  },
  {
    id: "situation",
    tag: "Your stage",
    q: "Roughly where is your revenue right now?",
    options: ["Just getting started, little or no revenue yet", "Up to about 10k a month", "About 10k to 100k a month", "100k a month or more"],
  },
];

export const STRATEGIC = [
  { id: "goal", tag: "Your goal", q: "What's your most important goal for the next 90 days?", options: ["Scale revenue profitably", "Lower my cost per acquisition", "Increase {repeat} and LTV", "Make revenue predictable"] },
  { id: "obstacle", tag: "The obstacle", q: "What's the single biggest obstacle stopping you right now?", options: ["Ad costs rising, margins shrinking", "Traffic doesn't convert well enough", "{noun} don't come back", "I can't trust my data or see what's working"] },
  { id: "solution", tag: "How we'd help", q: "If we could help, which approach suits you best?", options: ["Give me a DIY playbook and templates", "A group program or coaching", "Tools and software to run it myself", "Done for you, your team runs it for me"] },
] as const;

export const OPEN_QUESTION = {
  tag: "Anything else",
  q: "Anything else we should know about your situation?",
  placeholder: "Optional. The more context you share, the more specific your recommendations.",
};

export const BAND_REACTION: Record<"high" | "mid" | "low", string> = {
  high: "You have strong foundations, but there is clear room to optimize and pull ahead.",
  mid: "You're halfway there. The fundamentals exist, but key pieces are missing money.",
  low: "You have a lot of room to improve, which means a lot of upside once the leaks are fixed.",
};

export const CTA: Record<"high" | "mid" | "low", { eyebrow: string; h: string; p: string; stack: string[]; btn: string; href: string }> = {
  high: {
    eyebrow: "You're a strong fit for the Growth Partner engagement",
    h: "Let's turn these gaps into your next growth curve.",
    p: "Your numbers and your goals line up with the businesses we move fastest. Book a strategy call and we'll map the exact plan to fix your biggest leak first.",
    stack: ["A live diagnosis of your specific funnel", "A modelled target CPA, payback and LTV plan", "First 90 day growth roadmap", "Bonus, priority onboarding if we're a fit"],
    btn: "Book my strategy call",
    href: "/contact?tier=high",
  },
  mid: {
    eyebrow: "Recommended, a focused Single Lever Sprint",
    h: "Fix the one thing costing you the most, first.",
    p: "You don't need everything at once. Start with a focused sprint on your weakest lever, prove the return, then scale. Book a short call and we'll scope it.",
    stack: ["A scoped plan for your single biggest leak", "Clear target metrics and timeline", "No long term lock in to start"],
    btn: "Scope my sprint",
    href: "/contact?tier=mid",
  },
  low: {
    eyebrow: "Start here, free resources",
    h: "You're earlier in the journey. Let's build the foundation.",
    p: "The fastest win for you is getting the fundamentals right. Keep your scorecard, work the recommendations above, and grab our free growth resources. When your revenue is ready to scale, we'll be here.",
    stack: ["Your saved Growth Scorecard", "The 3 fixes above, prioritised", "Free CeyagMark growth guides and newsletter"],
    btn: "Email me my scorecard and guides",
    href: "/contact?tier=low",
  },
};

export type Contact = { name: string; email: string; phone: string };

export function computeResult(bp: number[], unknown: Record<number, boolean>, profile: Record<string, number>, big: Record<string, number>, industry: Industry) {
  const levers: Record<"Acquisition" | "Conversion" | "Retention", { got: number; max: number }> = {
    Acquisition: { got: 0, max: 0 },
    Conversion: { got: 0, max: 0 },
    Retention: { got: 0, max: 0 },
  };
  const weakest: { i: number; score: number; unknown: boolean }[] = [];
  let unknownCount = 0;

  BEST_PRACTICE.forEach((q, i) => {
    const unk = !!unknown[i];
    const v = unk ? 0 : bp[i] ?? 0;
    if (unk) unknownCount++;
    levers[q.tag].got += v;
    levers[q.tag].max += 3;
    weakest.push({ i, score: v, unknown: unk });
  });

  let got = 0;
  let max = 0;
  (Object.keys(levers) as (keyof typeof levers)[]).forEach((k) => {
    got += levers[k].got;
    max += levers[k].max;
  });
  const pct = Math.round((got / max) * 100);
  const grade = pct >= 85 ? "A" : pct >= 70 ? "B" : pct >= 55 ? "C" : pct >= 40 ? "D" : "E";
  const band: "high" | "mid" | "low" = pct >= 70 ? "high" : pct >= 45 ? "mid" : "low";

  const standing = (o: { got: number; max: number }) => {
    const p = o.got / o.max;
    return p >= 0.7 ? "Strong" : p >= 0.45 ? "Needs work" : "Leaking";
  };
  const leverStanding = { Acquisition: standing(levers.Acquisition), Conversion: standing(levers.Conversion), Retention: standing(levers.Retention) };

  weakest.sort((a, b) => a.score - b.score);
  const insights = weakest.slice(0, 3).map((w) => ({
    tag: BEST_PRACTICE[w.i]!.tag,
    text: fillTokens(BEST_PRACTICE[w.i]!.insight, industry),
    unknown: w.unknown,
  }));

  const budget = big.solution; // 0 DIY,1 group,2 software,3 DFY
  const size = profile.situation; // 0 starting ... 3 large
  let tier: "high" | "mid" | "low";
  if ((budget === 3 && (size ?? 0) >= 1) || (budget === 2 && (size ?? 0) >= 2)) tier = "high";
  else if (budget === 0 || size === 0) tier = "low";
  else tier = "mid";

  return { pct, grade, band, leverStanding, insights, tier, unknownCount, industryLabel: industry.label };
}
