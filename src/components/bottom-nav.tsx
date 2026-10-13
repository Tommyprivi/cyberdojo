"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive, NAV_ITEMS } from "./nav-items";

/** Barra fluttuante in basso, solo su schermi piccoli. Strumenti e Profilo arrivano con l'account. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigazione principale"
      className="fixed inset-x-0 bottom-3 z-20 mx-auto flex w-[min(92vw,26rem)] justify-around rounded-full border border-border bg-surface/95 p-1.5 shadow-[var(--shadow)] backdrop-blur lg:hidden"
    >
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`grid min-h-14 flex-1 place-items-center rounded-full px-3 text-xs font-bold ${
              active ? "bg-primary text-primary-fg" : "text-muted"
            }`}
          >
            <Icon width={22} height={22} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Stesse voci, in orizzontale nell'intestazione, solo su PC. */
export function TopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigazione principale" className="hidden items-center gap-1 lg:flex">
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center gap-2 rounded-full px-4 font-bold ${
              active ? "bg-primary text-primary-fg" : "hover:bg-surface"
            }`}
          >
            <Icon width={20} height={20} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
