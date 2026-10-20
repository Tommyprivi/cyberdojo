"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAV, isActive, NAV_ITEMS } from "./nav-items";

/**
 * Barra in basso, come in un'app: attaccata al bordo, quattro voci con icone grandi, area sicura
 * del telefono rispettata (serve viewport-fit=cover, impostato nel layout). Visibile sotto i 1024px.
 */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigazione principale"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-4">
        {APP_NAV.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[3.75rem] flex-col items-center justify-center gap-0.5 text-xs font-semibold ${
                  active ? "text-primary" : "text-muted"
                }`}
              >
                <span
                  className={`grid h-8 w-14 place-items-center rounded-full transition-colors ${active ? "bg-primary/15" : ""}`}
                >
                  <Icon width={26} height={26} strokeWidth={active ? 2.4 : 1.9} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Stesse voci del sito pubblico, in orizzontale nell'intestazione, solo su PC. */
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
            className={`flex min-h-11 items-center gap-2 rounded-lg px-4 font-semibold ${
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
