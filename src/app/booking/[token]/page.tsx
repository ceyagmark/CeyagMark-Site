import type { Metadata } from "next";
import { ManageBooking } from "./manage-booking";

// Unguessable-token page, same call PPI made for its manage page: noindex,
// nofollow, no-referrer.
export const metadata: Metadata = {
  title: "Manage your booking",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ManageBookingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ManageBooking token={token} />;
}
