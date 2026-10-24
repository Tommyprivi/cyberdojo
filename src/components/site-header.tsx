import Link from "next/link";
import { SITE } from "@/lib/config";
import { TopNav } from "./bottom-nav";
import { Seal } from "./seal";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

/**
 * Intestazione. Due modi:
 * - sito pubblico (default): marchio, menu in orizzontale su PC, utente e tema;
 * - `app`: barra compatta da telefono per l'area riservata (marchio a sinistra, iniziale a destra).
 */
export function SiteHeader({ wide = false, app = false }: { wide?: boolean; app?: boolean }) {
  if (app) {
    return (
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="flex min-h-11 items-center gap-2.5 font-display text-xl font-bold">
            <Seal size={30} />
            {SITE.name}
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu variant="avatar" />
          </div>
        </div>
      </header>
    );
  }
  return (
    <header>
      <div
        className={`mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 ${
          wide ? "max-w-[1680px] lg:px-14" : "max-w-3xl lg:max-w-6xl"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-semibold">
          <Seal size={40} />
          {SITE.name}
        </Link>
        <TopNav />
        <div className="flex items-center gap-2">
          <UserMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

