"use client";

import { useState, useTransition } from "react";
import { buyItemAction, equipItemAction } from "@/app/actions/shop";
import { Mascot } from "@/components/mascot";
import { lookFromEquipped, SHOP_ITEMS, SLOT_LABELS, type ShopItem } from "@/lib/shop/items";
import { ArtImage, ART } from "@/components/page-art";

/** Negozio del Sensei: anteprima, acquisto ed equipaggiamento. Il saldo mostrato arriva dal server. */
export function ShopApp({ coins, owned, equipped }: { coins: number; owned: string[]; equipped: string[] }) {
  const [preview, setPreview] = useState<ShopItem | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const look = preview ? { ...lookFromEquipped(equipped), ...preview.look } : lookFromEquipped(equipped);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>, done: string) {
    setMessage(null);
    start(async () => {
      const r = await fn();
      setMessage(r.ok ? done : (r.error ?? "Qualcosa non ha funzionato."));
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div className="flex items-center gap-3 lg:col-span-2">
        <ArtImage src={ART.negozio.src} width={ART.negozio.width} height={ART.negozio.height} size={72} alt="" wide />
        <p className="text-sm text-muted">Scegli, guarda l&apos;anteprima e indossa.</p>
      </div>
      <div className="grid content-start justify-items-center gap-3 rounded-lg border border-border bg-surface p-5 lg:sticky lg:top-4">
        <Mascot size={160} look={look} animate />
        <p className="text-sm text-muted">{preview ? `Anteprima: ${preview.name}` : "Il tuo Sensei"}</p>
        <p className="flex items-center gap-2 rounded-md bg-deep px-3 py-1.5 font-mono text-sm font-bold text-deep-fg">
          <ArtImage src={ART.moneta.src} width={ART.moneta.width} height={ART.moneta.height} size={28} className="!p-0.5" />
          {coins} {coins === 1 ? "moneta" : "monete"}
        </p>
        <p className="text-center text-xs text-muted">Le monete sono punti di gioco: 10 XP = 1 moneta. Nessun soldo vero.</p>
      </div>

      <div className="grid gap-3">
        <p role="status" aria-live="polite" className="min-h-6 text-sm font-semibold">
          {message}
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {SHOP_ITEMS.map((item) => {
            const has = owned.includes(item.id);
            const on = equipped.includes(item.id);
            const afford = coins >= item.price;
            return (
              <li key={item.id} className="grid gap-2 rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.img ? <ArtImage src={item.img.src} width={item.img.width} height={item.img.height} size={48} /> : null}
                    <p className="font-bold">{item.name}</p>
                  </div>
                  <span className="font-mono text-xs text-muted">{SLOT_LABELS[item.slot]}</span>
                </div>
                <p className="text-sm text-muted">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="min-h-11 rounded-md border border-border px-3 text-sm font-semibold"
                    onClick={() => setPreview(preview?.id === item.id ? null : item)}
                    aria-pressed={preview?.id === item.id}
                  >
                    Anteprima
                  </button>
                  {has ? (
                    <button
                      type="button"
                      disabled={pending}
                      className="min-h-11 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg disabled:opacity-60"
                      onClick={() => run(() => equipItemAction(item.id), on ? "Tolto." : "Indossato!")}
                    >
                      {on ? "Togli" : "Indossa"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={pending || !afford}
                      className="min-h-11 rounded-md bg-primary px-3 text-sm font-semibold text-primary-fg disabled:opacity-50"
                      onClick={() => run(() => buyItemAction(item.id), `Comprato: ${item.name}!`)}
                    >
                      Compra · {item.price}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
