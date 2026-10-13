import Link from "next/link";
import { SITE } from "@/lib/config";
import { TopNav } from "./bottom-nav";
import { Mascot } from "./mascot";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader({ wide = false }: { wide?: boolean }) {
  return (
    <header>
      <div className={`mx-auto flex items-center justify-between gap-4 px-4 py-3 ${wide ? "max-w-6xl" : "max-w-3xl lg:max-w-6xl"}`}>
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-semibold">
          <Mascot size={38} />
          {SITE.name}
        </Link>
        <TopNav />
        <ThemeToggle />
      </div>
    </header>
  );
}
