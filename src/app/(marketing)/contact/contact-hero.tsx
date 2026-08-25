"use client";

import { useSearchParams } from "next/navigation";
import { TIER_COPY } from "./contact-form";

const DEFAULT_HEAD = "Let us talk about your numbers.";
const DEFAULT_SUB =
  "Tell us where you are and where you want to be. You talk to the person who would run your account, not a sales rep, and you get a straight answer about whether and how we can help. We reply within one business day.";

export function ContactHero() {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier");
  const intent = searchParams.get("intent");

  let heading = DEFAULT_HEAD;
  let sub = DEFAULT_SUB;
  if (tier && TIER_COPY[tier]) {
    [heading, sub] = TIER_COPY[tier];
  }
  if (intent === "consulting") {
    heading = "Let us get a consulting session booked.";
    sub =
      "Tell us what you would like to cover and your rough availability, and we will send you a time. Prefer instant booking? Use the calendar on the consulting page or message us on WhatsApp.";
  }

  return (
    <>
      <h1 className="reveal">{heading}</h1>
      <p className="lede reveal">{sub}</p>
    </>
  );
}
