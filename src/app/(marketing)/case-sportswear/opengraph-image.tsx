import { ImageResponse } from "next/og";
import { CaseStudyCard, OG_CARD_SIZE } from "@/lib/og-card";

export const size = OG_CARD_SIZE;
export const contentType = "image/png";
export const alt = "Case study: return on ad spend from 2 to 9 on a sportswear brand";

export default function Image() {
  return new ImageResponse(
    (
      <CaseStudyCard
        eyebrow="Sportswear brand, Sri Lanka"
        stat="2 → 9"
        statColor="#46d39a"
        sub="Return on ad spend, in 2.5 months."
      />
    ),
    size
  );
}
