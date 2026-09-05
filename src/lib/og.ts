/**
 * The shared link-preview image, in one place.
 *
 * Next merges metadata shallowly: a page that declares `openGraph` replaces
 * the parent's whole openGraph object, images included. Every marketing page
 * declares one for its own title and description, so each has to restate the
 * image or lose it. Importing a constant is what stops those 14 copies from
 * drifting apart, and what stops the next new page from silently shipping
 * without a preview.
 *
 * The URL is the generated /opengraph-image route (src/app/opengraph-image.tsx),
 * resolved against metadataBase in the root layout.
 */
import type { Metadata } from "next";

type OgImages = NonNullable<NonNullable<Metadata["openGraph"]>["images"]>;

// Not `as const`: Next types openGraph.images as a mutable array, so a
// readonly tuple fails to assign at every call site.
export const OG_IMAGE: OgImages = [
  { url: "/opengraph-image", width: 1200, height: 630, alt: "CeyagMark" },
];
