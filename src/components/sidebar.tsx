"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/config";
import { APP_NAV, isActive } from "./nav-items";
import { Seal } from "./seal";
import { SoundToggle } from "./sound-toggle";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

/**
 * Barra laterale: l'impianto del sito su PC. Fissa a sinistra, sempre a vista.
 * Su telefono e tablet non c'è (si usano l'intestazione compatta e la barra in basso).
 */
export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col gap-8 border-r border-border bg-surface px-5 py-7 lg:flex">
      <Link href="/" className="flex items-center gap-3 px-1">
        <Seal size={40} />
        <span className="grid leading-tight">
          <span className="font-display text-2xl font-bold">{SITE.name}</span>
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted">Scuola di cybersecurity</span>
        </span>
      </Link>

      <nav aria-label="Navigazione principale" className="grid gap-1">
        <p className="mb-1 px-3 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-muted">Studio</p>
        {APP_NAV.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`nav-press relative flex min-h-11 items-center gap-3 rounded-md px-3 font-semibold transition-colors ${
                active ? "bg-surface-muted text-foreground" : "text-muted hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              {active && <span aria-hidden className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" />}
              <Icon width={20} height={20} className={active ? "nav-active-icon text-primary" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto grid gap-3 border-t border-border pt-5">
        <UserMenu variant="card" />
        <div className="flex flex-wrap gap-2">
          <ThemeToggle />
          <SoundToggle />
        </div>
      </div>
    </aside>
  );
}
