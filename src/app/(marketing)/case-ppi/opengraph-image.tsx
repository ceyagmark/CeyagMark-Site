import { ImageResponse } from "next/og";
import { CaseStudyCard, OG_CARD_SIZE } from "@/lib/og-card";

export const size = OG_CARD_SIZE;
export const contentType = "image/png";
export const alt = "Case study: a booking funnel that converts 17 percent";

export default function Image() {
  return new ImageResponse(
    (
      <CaseStudyCard
        eyebrow="Vehicle inspection booking funnel"
        stat="17%"
        sub="of everyone who opens the booking page books one."
      />
    ),
    size
  );
}
