import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { BgAura } from "@/components/bg-aura";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BgAura />
      <SiteNav />
      <main id="main">{children}</main>
      <SiteFooter />
      <ThemeToggle />
      <WhatsAppFab />
    </>
  );
}
