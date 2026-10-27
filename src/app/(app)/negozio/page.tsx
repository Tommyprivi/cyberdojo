import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopApp } from "@/components/shop/shop-app";
import { requireMember } from "@/lib/session";
import { getShopState } from "@/lib/shop/service";

export const metadata: Metadata = { title: "Negozio del Sensei", robots: { index: false } };

export default function NegozioPage() {
  return (
    <Suspense fallback={<div className="h-96 rounded-lg bg-surface-muted" aria-busy="true" aria-label="Carico il negozio" />}>
      <NegozioContent />
    </Suspense>
  );
}

async function NegozioContent() {
  const { user } = await requireMember("/negozio");
  const state = await getShopState(user.id);
  return (
    <div className="grid gap-4">
      <header>
        <h1 className="font-display text-3xl font-bold">Negozio del Sensei</h1>
        <p className="mt-1 text-sm text-muted">Spendi le monete guadagnate studiando per vestire il Sensei.</p>
      </header>
      <ShopApp coins={state.coins} owned={state.owned} equipped={state.equipped} />
    </div>
  );
}
