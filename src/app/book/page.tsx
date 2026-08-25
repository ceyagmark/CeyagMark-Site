import type { Metadata } from "next";
import { BookingFlow } from "./booking-flow";

// Transactional flow, not a ranked page — noindex, same call PPI made for
// /booking/* (F6 exemption, stated not skipped silently).
export const metadata: Metadata = {
  title: "Book a session",
  robots: { index: false, follow: false },
};

export default function BookPage() {
  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl md:text-4xl mb-2">Book a session</h1>
      <p className="text-[var(--text-soft)] mb-10">
        Pick a consulting session, or a free discovery call if you are exploring the Leak
        Report, the Fix Sprint or Build &amp; Run.
      </p>
      <BookingFlow />
    </main>
  );
}
