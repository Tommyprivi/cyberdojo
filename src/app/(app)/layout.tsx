import type { Viewport } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { CountdownBar } from "@/components/countdown-bar";
import { NewsBanner } from "@/components/news-banner";
import { Sidebar } from "@/components/sidebar";
import { SiteHeader } from "@/components/site-header";
import { UiSounds } from "@/components/ui-sounds";
import { WelcomeNews } from "@/components/welcome-news";
import { readAnnouncements } from "@/lib/announcements";
import { readCountdown } from "@/lib/countdown";

// Serve per usare l'area sicura del telefono (tacca, barra dei gesti) sotto la barra in basso.
export const viewport: Viewport = { viewportFit: "cover" };

/**
 * Due impianti diversi, non uno solo ingrandito:
 * - sotto 1024px (telefono e tablet): intestazione compatta in alto, una colonna che scorre, barra in basso;
 * - PC: app a schermo intero (100dvh): barra laterale fissa e area di lavoro a tutta larghezza e altezza.
 *   La pagina non scorre: le schermate sono pannelli che si adattano all'altezza. Lo scorrimento resta
 *   solo dentro un pannello, se serve davvero.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  const countdown = readCountdown();
  const newsVersion = readAnnouncements()[0]?.id ?? "";
  return (
    <div className="lg:grid lg:h-dvh lg:grid-cols-[14rem_minmax(0,1fr)] lg:overflow-hidden xl:grid-cols-[16rem_minmax(0,1fr)]">
      <UiSounds />
      <Sidebar latestAnnouncementId={newsVersion} />
      <div className="flex min-w-0 flex-col lg:h-dvh lg:min-h-0">
        {countdown && !countdown.maintenance ? <CountdownBar endsAt={countdown.endsAt} label={countdown.label} newsVersion={newsVersion} maintenance={countdown.maintenance} /> : null}
        {/* L'avviso del grande aggiornamento parte subito, una volta sola: non aspetta la fine del conto alla rovescia. */}
        <WelcomeNews version={newsVersion} countdownEndsAt={null} />
        <NewsBanner />
        <div className="lg:hidden">
          <SiteHeader app />
        </div>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-5 lg:mx-0 lg:min-h-0 lg:max-w-none lg:flex-none lg:overflow-y-auto lg:p-6 lg:h-full xl:p-10 2xl:px-14">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
