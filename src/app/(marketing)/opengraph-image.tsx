/**
 * Re-exported so the card also covers the (marketing) route group.
 *
 * Every marketing page declares its own `openGraph` block for a page-specific
 * title and description, and Next replaces the parent's openGraph object
 * wholesale when a page declares one, so the image set in the root layout was
 * being dropped on all 14 of them, including the homepage. The file
 * convention is resolved separately from that object merge, so one file here
 * restores the image across the whole group without touching 14 pages.
 */
export { default, size, contentType, alt } from "@/app/opengraph-image";
