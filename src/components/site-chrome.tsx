import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { BgAura } from "@/components/bg-aura";

// The shared page shell: aura, nav, footer, theme toggle, WhatsApp button.
// Extracted so /book gets the same chrome as the marketing pages instead of
// rendering as an orphaned document with no navigation.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BgAura />
      <SiteNav />
      <main id="main">{children}</main>
      <SiteFooter />
      <div className="theme-dock">
        <ThemeToggle />
      </div>
      <WhatsAppFab />
    </>
  );
}
