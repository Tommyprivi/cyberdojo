"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { buyItemAction, equipItemAction } from "@/app/actions/shop";
import { SenseiPreview } from "@/components/shop/sensei-preview";
import { ART } from "@/components/page-art";
import {
  equipGroup,
  getItem,
  SHOP_ITEMS,
  SLOT_LABELS,
  SLOT_ORDER,
  type ShopItem,
} from "@/lib/shop/items";

const COIN = ART.moneta;

function Coin({ size }: { size: number }) {
  return (
    <Image
      src={COIN.src}
      alt=""
      width={COIN.width}
      height={COIN.height}
      sizes={`${size}px`}
      style={{ width: size, height: size }}
      className="inline-block shrink-0"
    />
  );
}

const coinsText = (n: number) => `${n} ${n === 1 ? "moneta" : "monete"}`;

/** Equipaggiamento di prova: l'oggetto provato prende il posto di quello dello stesso gruppo. */
function withTry(equipped: readonly string[], tryId: string | null): string[] {
  const item = tryId ? getItem(tryId) : undefined;
  if (!item) return [...equipped];
  const group = equipGroup(item);
  const kept = equipped.filter((id) => {
    const other = getItem(id);
    return !other || equipGroup(other) !== group;
  });
  return [...kept, item.id];
}

/** Negozio del Sensei: anteprima, acquisto ed equipaggiamento. Il saldo mostrato arriva dal server. */
export function ShopApp({
  coins,
  owned,
  equipped,
}: {
  coins: number;
  owned: string[];
  equipped: string[];
}) {
  const [tryId, setTryId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const tried = tryId ? getItem(tryId) : undefined;

  function run(
    fn: () => Promise<{ ok: boolean; error?: string }>,
    done: string,
  ) {
    setMessage(null);
    start(async () => {
      const r = await fn();
      if (r.ok) setTryId(null);
      setMessage(r.ok ? done : (r.error ?? "Qualcosa non ha funzionato."));
    });
  }

  return (
    <div className="grid gap-6">
      {/* Testata: la bancarella, con il saldo */}
      <section
        aria-label="La bancarella del Sensei"
        className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4"
      >
        <span className="grid w-36 shrink-0 place-items-center rounded-xl bg-[#f4efe4] p-1.5 sm:w-52">
          <Image
            src={ART.negozio.src}
            alt=""
            width={ART.negozio.width}
            height={ART.negozio.height}
            sizes="(min-width: 640px) 13rem, 9rem"
            priority
            className="h-auto w-full"
          />
        </span>
        <div className="grid min-w-0 gap-2">
          <p className="text-sm text-muted">
            Scegli, provalo sul Sensei e indossalo.
          </p>
          <p className="inline-flex w-fit items-center gap-2 rounded-md bg-deep px-3 py-2 font-mono text-base font-bold text-deep-fg">
            <Coin size={28} />
            <span>{coinsText(coins)}</span>
          </p>
          <p className="text-xs text-muted">
            Le monete sono punti di gioco: 10 XP = 1 moneta. Nessun soldo vero.
          </p>
        </div>
      </section>

      {/* Il tuo Sensei */}
      <section
        aria-labelledby="titolo-sensei"
        className="grid justify-items-center gap-2 rounded-lg border border-border bg-surface p-4"
      >
        <h2 id="titolo-sensei" className="font-display text-xl font-bold">
          Il tuo Sensei
        </h2>
        <SenseiPreview
          equipped={withTry(equipped, tryId)}
          animate
          className="aspect-[4/3] w-full max-w-sm"
        />
        <p className="min-h-5 text-sm text-muted">
          {tried
            ? `Anteprima: ${tried.name} (non ancora tuo)`
            : "Ecco come ti vedono gli altri."}
        </p>
        <p
          role="status"
          aria-live="polite"
          className="min-h-6 text-center text-sm font-semibold"
        >
          {message}
        </p>
      </section>

      {SLOT_ORDER.map((slot) => (
        <section
          key={slot}
          aria-labelledby={`sezione-${slot}`}
          className="grid gap-3"
        >
          <h2
            id={`sezione-${slot}`}
            className="font-display text-2xl font-bold"
          >
            {SLOT_LABELS[slot]}
          </h2>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
            {SHOP_ITEMS.filter((i) => i.slot === slot).map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                has={owned.includes(item.id)}
                on={equipped.includes(item.id)}
                coins={coins}
                pending={pending}
                trying={tryId === item.id}
                onTry={() => setTryId(tryId === item.id ? null : item.id)}
                onBuy={() =>
                  run(() => buyItemAction(item.id), `Comprato: ${item.name}!`)
                }
                onEquip={(wasOn) =>
                  run(
                    () => equipItemAction(item.id),
                    wasOn ? "Tolto." : "Indossato!",
                  )
                }
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function ItemCard({
  item,
  has,
  on,
  coins,
  pending,
  trying,
  onTry,
  onBuy,
  onEquip,
}: {
  item: ShopItem;
  has: boolean;
  on: boolean;
  coins: number;
  pending: boolean;
  trying: boolean;
  onTry: () => void;
  onBuy: () => void;
  onEquip: (wasOn: boolean) => void;
}) {
  const isBg = item.slot === "background";
  const missing = item.price - coins;
  const reasonId = `motivo-${item.id}`;
  const btn = "min-h-12 w-full rounded-md px-3 text-sm font-semibold";
  return (
    <li className="grid content-start gap-2 rounded-lg border border-border bg-surface p-3">
      <span
        className={`relative block overflow-hidden rounded-xl bg-[#f4efe4] ${isBg ? "aspect-video" : "aspect-[4/3]"}`}
      >
        <Image
          src={item.img.src}
          alt=""
          fill
          sizes="(min-width: 1280px) 16rem, (min-width: 1024px) 20vw, 45vw"
          className={isBg ? "object-cover" : "object-contain p-2"}
        />
      </span>
      <h3 className="font-bold leading-tight">{item.name}</h3>
      <p className="text-sm text-muted">{item.description}</p>
      <p className="flex items-center gap-1.5 font-mono text-sm font-bold">
        <Coin size={20} />
        {item.price}
        {on ? (
          <span className="ml-auto rounded bg-deep px-1.5 py-0.5 text-xs text-deep-fg">
            Indossato
          </span>
        ) : has ? (
          <span className="ml-auto text-xs text-muted">Tuo</span>
        ) : null}
      </p>
      {has ? (
        <button
          type="button"
          disabled={pending}
          className={`${btn} bg-primary text-primary-fg disabled:opacity-60`}
          aria-label={`${on ? "Togli" : "Indossa"} ${item.name}`}
          onClick={() => onEquip(on)}
        >
          {on ? "Togli" : "Indossa"}
        </button>
      ) : (
        <>
          <button
            type="button"
            disabled={pending || missing > 0}
            aria-describedby={missing > 0 ? reasonId : undefined}
            className={`${btn} bg-primary text-primary-fg disabled:opacity-50`}
            aria-label={`Compra ${item.name} per ${coinsText(item.price)}`}
            onClick={onBuy}
          >
            Compra
          </button>
          {missing > 0 ? (
            <p id={reasonId} className="text-xs text-muted">
              Ti{" "}
              {missing === 1 ? "manca 1 moneta" : `mancano ${missing} monete`}.
            </p>
          ) : null}
          <button
            type="button"
            className={`${btn} border border-border`}
            aria-pressed={trying}
            aria-label={`${trying ? "Smetti di provare" : "Prova"} ${item.name} sul Sensei`}
            onClick={onTry}
          >
            {trying ? "Smetti di provare" : "Provalo"}
          </button>
        </>
      )}
    </li>
  );
}
