import Link from "next/link";
import { SITE } from "@/lib/config";
import { ThemeToggle } from "./theme-toggle";

const LINKS = [
  { href: "/corsi", label: "Corsi" },
  { href: "/pratica", label: "Pratica" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-display text-xl font-bold">
          {SITE.name}
        </Link>
        <nav aria-label="Principale" className="flex items-center gap-1">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="grid min-h-11 place-items-center rounded-lg px-3 hover:bg-surface-muted">
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
