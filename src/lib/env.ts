// PPI lesson (BUILD-NOTES Slice 0, decision-adjacent finding): a dev-database
// flag reaching a production build serves seed data as if it were real, and
// the failure is invisible until someone notices the numbers are fake. Fail
// the build instead of warning.
if (process.env.NODE_ENV === "production" && process.env.CEYAG_DEV_DB === "1") {
  throw new Error(
    "CEYAG_DEV_DB=1 must never be set in a production build. Remove it from the production environment."
  );
}

export const useDevDb = process.env.CEYAG_DEV_DB === "1";
