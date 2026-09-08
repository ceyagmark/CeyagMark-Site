import { ImageResponse } from "next/og";
import { CaseStudyCard, OG_CARD_SIZE } from "@/lib/og-card";

export const size = OG_CARD_SIZE;
export const contentType = "image/png";
export const alt = "Case study: auditing our own store for AI search, scored 63 out of 100";

export default function Image() {
  return new ImageResponse(
    (
      <CaseStudyCard
        eyebrow="Our own e-commerce store"
        stat="63/100"
        sub="AI search visibility score, published rather than hidden."
      />
    ),
    size
  );
}
