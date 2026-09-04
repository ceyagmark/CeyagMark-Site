import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow } from "./booking-flow";

// Transactional flow, not a ranked page — noindex, same call PPI made for
// /booking/* (F6 exemption, stated not skipped silently).
export const metadata: Metadata = {
  title: "Book a session",
  robots: { index: false, follow: false },
};

export default function BookPage() {
  return (
    <section className="page-hero">
      <div className="wrap bk-wrap">
        <span className="eyebrow">Consulting</span>
        <h1>Book a session</h1>
        <p className="lede">
          Pick a consulting session, or a free discovery call if you are exploring the Leak
          Report, the Fix Sprint or Build &amp; Run.
        </p>
        {/* useSearchParams (for ?session=slug preselection) requires a Suspense boundary. */}
        <Suspense fallback={<div aria-busy="true" className="bk-loading">Loading…</div>}>
          <BookingFlow />
        </Suspense>
      </div>
    </section>
  );
}
