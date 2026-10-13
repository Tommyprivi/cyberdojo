import Link from "next/link";
import { SITE } from "@/lib/config";
import { Mascot } from "./mascot";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header>
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <Mascot size={36} />
          {SITE.name}
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
