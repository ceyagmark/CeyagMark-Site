// Money is integer minor units everywhere (ADR-001 #5 / W5). These are
// display-only formatters, never used on a path that computes a total.

export function formatLkr(wholeRupees: number): string {
  return `LKR ${wholeRupees.toLocaleString("en-LK")}`;
}

export function formatUsdCents(cents: number): string {
  const dollars = cents / 100;
  // Show cents only when the price is not a whole dollar amount, so a future
  // non-round price (e.g. $19.50) never silently truncates to "$20" the way
  // a naive toFixed(0) on the divided value would.
  const hasCents = cents % 100 !== 0;
  return `$${dollars.toFixed(hasCents ? 2 : 0)}`;
}
