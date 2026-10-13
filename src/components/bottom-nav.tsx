"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon, DumbbellIcon, MapIcon } from "./icons";

const ITEMS = [
  { href: "/percorso", label: "Percorso", Icon: MapIcon },
  { href: "/pratica", label: "Allenati", Icon: DumbbellIcon },
  { href: "/corsi", label: "Corsi", Icon: BookIcon },
];

/** Barra fluttuante in basso. Strumenti e Profilo arrivano con l'account (vedi spec, sezione 8). */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigazione principale"
      className="fixed inset-x-0 bottom-3 z-20 mx-auto flex w-[min(92vw,26rem)] justify-around rounded-full border border-border bg-surface/95 p-1.5 shadow-[var(--shadow)] backdrop-blur"
    >
      {ITEMS.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`grid min-h-14 flex-1 place-items-center rounded-full px-3 text-xs font-semibold ${
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
