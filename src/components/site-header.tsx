import Link from "next/link";
import { SITE } from "@/lib/config";
import { TopNav } from "./bottom-nav";
import { Seal } from "./seal";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function SiteHeader({ wide = false }: { wide?: boolean }) {
  return (
    <header>
      <div
        className={`mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 ${
          wide ? "max-w-6xl" : "max-w-3xl lg:max-w-6xl"
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
