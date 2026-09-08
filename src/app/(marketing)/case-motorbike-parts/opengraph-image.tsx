import { ImageResponse } from "next/og";
import { CaseStudyCard, OG_CARD_SIZE } from "@/lib/og-card";

export const size = OG_CARD_SIZE;
export const contentType = "image/png";
export const alt = "Case study: scored 38 out of 100, and the biggest win was a phone number";

export default function Image() {
  return new ImageResponse(
    (
      <CaseStudyCard
        eyebrow="Motorbike parts store"
        stat="38/100"
        sub="Conversion score. The biggest single win was a phone number."
      />
    ),
    size
  );
}
