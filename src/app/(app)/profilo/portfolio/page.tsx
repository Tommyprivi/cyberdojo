import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PortfolioSettings } from "@/components/portfolio/portfolio-settings";
import { getPortfolioSettings } from "@/lib/portfolio/service";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Portfolio pubblico", robots: { index: false } };

export default function PortfolioSettingsPage() {
  return (
    <Suspense fallback={<div className="h-96 rounded-lg bg-surface-muted" aria-busy="true" aria-label="Carico le impostazioni" />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  const { user } = await requireMember("/profilo/portfolio");
  const s = await getPortfolioSettings(user.id);
  return (
    <div className="mx-auto grid w-full max-w-2xl content-start gap-4 lg:mx-0">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Profilo · Portfolio</p>
          <h1 className="font-display text-3xl font-bold leading-tight">Portfolio pubblico</h1>
        </div>
        <Link href="/profilo" className="inline-flex min-h-11 items-center rounded-md border border-border bg-surface px-3 text-sm font-semibold hover:bg-surface-muted">
          Torna al profilo
        </Link>
      </header>
      <p className="text-muted">
        Una pagina che puoi mostrare a un datore di lavoro o a un amico. È <strong className="text-foreground">spenta</strong> finché non la accendi tu, ed è
        riservata a chi ha almeno 18 anni.
      </p>
      <PortfolioSettings
        initial={{ enabled: s.enabled, showCertificates: s.showCertificates, showBelt: s.showBelt }}
        blockedReason={s.blockedReason}
        nickname={s.nickname}
        avatar={s.avatar}
        publicId={s.ref}
        certificateCount={s.certificateCount}
      />
    </div>
  );
}
