import { SiteChrome } from "@/components/site-chrome";

// /book sits outside the (marketing) group but is a public, user-facing page,
// so it needs the same chrome. Without this it rendered with no nav, no
// footer and no background, a dead end for anyone who lands on it.
export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
