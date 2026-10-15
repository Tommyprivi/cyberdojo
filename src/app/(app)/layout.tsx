import { BottomNav } from "@/components/bottom-nav";
import { Sidebar } from "@/components/sidebar";
import { SiteHeader } from "@/components/site-header";

/**
 * Due impianti diversi, non uno solo ingrandito:
 * - telefono: intestazione in alto, una colonna, barra di navigazione in basso;
 * - PC: barra laterale fissa a sinistra e un'area di lavoro larga, a più colonne.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[15.5rem_minmax(0,1fr)]">
      <Sidebar />
      <div className="flex min-w-0 flex-col">
        <div className="lg:hidden">
          <SiteHeader />
        </div>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-4 lg:max-w-[88rem] lg:px-10 lg:pb-12 lg:pt-8">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
