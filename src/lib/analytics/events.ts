// Every event here mirrors a real dataLayer.push() call that already exists in
// the live static site (assets/js/{main,portfolio,free-audit,quiz}.js), same
// event names, same field names, so any GTM tag or variable Shashika already
// has half-configured for the old site keeps working. `booking_completed` and
// `contact_submitted` are new: neither funnel existed as a real conversion on
// the static site (booking didn't exist; contact silently discarded leads),
// so there was nothing to port for them, they're named to match the existing
// convention, not invented data.

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function push(payload: Record<string, unknown> & { event: string }) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function trackWhatsappClick() {
  push({ event: "whatsapp_click" });
}

export function trackPortfolioFilter(filter: string) {
  push({ event: "portfolio_filter", filter });
}

export function trackCaseOpened(caseSlug: string, linkKind: string) {
  push({ event: "case_opened", case_slug: caseSlug, link_kind: linkKind });
}

export function trackCaseCtaClick(caseSlug: string) {
  push({ event: "case_cta_click", case_slug: caseSlug });
}

export function trackFoundingAuditApplication(input: {
  qualified: boolean;
  dqReason?: string;
  name?: string;
  email?: string;
  phone?: string;
  store?: string;
  country?: string;
  budget?: string;
  roas?: string;
}) {
  push({
    event: "founding_audit_application",
    lead_source: "free-audit",
    qualified: input.qualified,
    dq_reason: input.dqReason ?? "",
    name: input.name ?? "",
    email: input.email ?? "",
    phone: input.phone ?? "",
    store: input.store ?? "",
    country: input.country ?? "",
    budget: input.budget ?? "",
    roas: input.roas ?? "",
  });
}

export function trackGrowthAuditCompleted(input: {
  tier: string;
  score: number;
  grade: string;
  industry: string;
  name?: string;
  email?: string;
  phone?: string;
}) {
  push({
    event: "growth_audit_completed",
    lead_source: "growth-audit-quiz",
    tier: input.tier,
    score: input.score,
    grade: input.grade,
    industry: input.industry,
    name: input.name ?? "",
    email: input.email ?? "",
    phone: input.phone ?? "",
  });
}

export function trackBookingCompleted(input: {
  confirmationCode: string;
  sessionTypeName: string;
  sessionTypeSlug: string;
  valueUsdCents: number;
}) {
  push({
    event: "booking_completed",
    confirmation_code: input.confirmationCode,
    session_type: input.sessionTypeName,
    session_type_slug: input.sessionTypeSlug,
    value: input.valueUsdCents / 100,
    currency: "USD",
  });
}

export function trackContactSubmitted(input: { hasCompany: boolean }) {
  push({ event: "contact_submitted", has_company: input.hasCompany });
}
