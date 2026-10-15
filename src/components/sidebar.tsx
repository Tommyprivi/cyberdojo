"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/config";
import { isActive, NAV_ITEMS } from "./nav-items";
import { Seal } from "./seal";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

/**
 * Barra laterale: l'impianto del sito su PC. Fissa a sinistra, sempre a vista.
 * Su telefono non c'è (si usano l'intestazione e la barra in basso).
 */
export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r border-border bg-surface px-4 py-6 lg:flex">
      <Link href="/" className="flex items-center gap-3 px-2 font-display text-2xl font-bold">
        <Seal size={40} />
        {SITE.name}
      </Link>

      <nav aria-label="Navigazione principale" className="grid gap-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-lg border-l-4 px-3 font-semibold ${
                active ? "border-accent bg-surface-muted" : "border-transparent text-muted hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              <Icon width={20} height={20} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto grid gap-3 border-t border-border pt-4">
        <UserMenu />
        <ThemeToggle />
      </div>
    </aside>
  );
}
