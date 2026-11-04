// Deterministic maths for /villa-check. Everything with a currency sign on that
// page comes from here, so the tests in tests/villa-check.test.ts pin it.

// Display rate only, shown to the owner next to the result. Update when the
// rupee moves more than a few percent.
export const LKR_PER_USD = 300;

export type VillaInputs = {
  rooms: number;
  nightlyRate: number;
  currency: "USD" | "LKR";
  occupancyPct: number;
  otaSharePct: number;
  commissionPct: number;
};

export type VillaResult = {
  yearlyRevenueLkr: number;
  yearlyCommissionLkr: number;
  keepAt10Lkr: number;
  keepAt25Lkr: number;
  nightlyRateUsd: number;
};

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function clampInputs(i: VillaInputs): VillaInputs {
  return {
    rooms: Math.round(clamp(i.rooms, 1, 60)),
    nightlyRate: clamp(i.nightlyRate, 0, i.currency === "USD" ? 5000 : 1_500_000),
    currency: i.currency,
    occupancyPct: clamp(i.occupancyPct, 0, 100),
    otaSharePct: clamp(i.otaSharePct, 0, 100),
    commissionPct: clamp(i.commissionPct, 0, 40),
  };
}

export function calculateVilla(raw: VillaInputs): VillaResult {
  const i = clampInputs(raw);
  const rateLkr = i.currency === "USD" ? i.nightlyRate * LKR_PER_USD : i.nightlyRate;
  const yearlyRevenueLkr = i.rooms * rateLkr * 365 * (i.occupancyPct / 100);
  const commission = i.commissionPct / 100;
  // Moving x% of all bookings direct can never save more than the OTA share.
  const keep = (movedPct: number) => yearlyRevenueLkr * (Math.min(movedPct, i.otaSharePct) / 100) * commission;
  return {
    yearlyRevenueLkr: roundLkr(yearlyRevenueLkr),
    yearlyCommissionLkr: roundLkr(yearlyRevenueLkr * (i.otaSharePct / 100) * commission),
    keepAt10Lkr: roundLkr(keep(10)),
    keepAt25Lkr: roundLkr(keep(25)),
    nightlyRateUsd: i.currency === "USD" ? i.nightlyRate : i.nightlyRate / LKR_PER_USD,
  };
}

// Owner-facing numbers are estimates, so round to the nearest 10,000.
function roundLkr(n: number): number {
  return Math.round(n / 10_000) * 10_000;
}

export function formatLkr(n: number): string {
  return `LKR ${n.toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;
}

// Hot leads get a free homepage preview (capped at 5 a week by hand). The
// listing score is checked by a person, not here.
export function isHotLead(i: VillaInputs): boolean {
  const c = clampInputs(i);
  const rateUsd = c.currency === "USD" ? c.nightlyRate : c.nightlyRate / LKR_PER_USD;
  return c.rooms >= 4 && rateUsd >= 40;
}

export type WebsiteState = "none" | "old" | "good";
export type GoogleProfile = "yes" | "no" | "unsure";

export type Fix = { title: string; body: string };

export function pickFixes(website: WebsiteState, google: GoogleProfile): Fix[] {
  const fixes: Fix[] = [];
  if (website === "none") {
    fixes.push({
      title: "Give guests a place to book you directly",
      body: "Guests who find you on Booking.com often search your name next. With no website, that search sends them straight back to Booking.com, and you pay commission again.",
    });
  } else if (website === "old") {
    fixes.push({
      title: "Turn your website into a booking page",
      body: "Most guests browse on a phone. A slow site with no clear 'Book direct' button loses them in seconds. One tap to WhatsApp with their dates already filled in fixes that.",
    });
  } else {
    fixes.push({
      title: "Give guests a reason to book direct",
      body: "Offer perks only direct guests get, like free airport pickup or late checkout. Keep your public price the same as on Booking.com to stay inside their rules.",
    });
  }
  if (google !== "yes") {
    fixes.push({
      title: "Claim your Google Business Profile",
      body: "When guests search your villa's name, Google shows a profile card first. Without one, the top result is your Booking.com listing. Claiming it is free.",
    });
  } else {
    fixes.push({
      title: "Point your Google profile at your own site",
      body: "Check the website link on your Google profile. If it points to Booking.com or nowhere, change it to your own booking page.",
    });
  }
  fixes.push({
    title: "Bring last year's guests back yourself",
    body: "Put a small QR card in each room: 'Next time, book direct and get free airport pickup.' A returning guest who books through you costs you no commission.",
  });
  return fixes;
}
