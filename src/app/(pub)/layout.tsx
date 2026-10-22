import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/**
 * Pagine pubbliche (legali, aggiornamenti, contatti): pagina aperta, senza area riservata.
 * Stessa testata e stesso piè di pagina del sito, così non sembrano pagine di un altro.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
