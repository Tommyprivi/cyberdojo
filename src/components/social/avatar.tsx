import type { ComponentType, SVGProps } from "react";
import { BeltIcon, BoltIcon, BookIcon, BulbIcon, CheckIcon, DumbbellIcon, FlameIcon, LockIcon, MapIcon, PlayIcon, TargetIcon } from "../icons";
import { Mascot } from "../mascot";
import { AVATARS, isAvatarId, type AvatarId } from "@/lib/social/avatars";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

/** Colori dell'app (con il loro testo abbinato, così il contrasto regge anche nel tema scuro). */
const LOOK: Record<Exclude<AvatarId, "sensei">, { Glyph: Icon; bg: string; fg: string }> = {
  fiamma: { Glyph: FlameIcon, bg: "var(--accent)", fg: "var(--accent-fg)" },
  fulmine: { Glyph: BoltIcon, bg: "var(--belt-yellow)", fg: "var(--belt-yellow-fg)" },
  cintura: { Glyph: BeltIcon, bg: "var(--deep)", fg: "var(--deep-fg)" },
  libro: { Glyph: BookIcon, bg: "var(--primary)", fg: "var(--primary-fg)" },
  bersaglio: { Glyph: TargetIcon, bg: "var(--belt-orange)", fg: "var(--belt-orange-fg)" },
  lampadina: { Glyph: BulbIcon, bg: "var(--belt-blue)", fg: "var(--belt-blue-fg)" },
  mappa: { Glyph: MapIcon, bg: "var(--belt-green)", fg: "var(--belt-green-fg)" },
  manubrio: { Glyph: DumbbellIcon, bg: "var(--belt-brown)", fg: "var(--belt-brown-fg)" },
  lucchetto: { Glyph: LockIcon, bg: "var(--foreground-muted)", fg: "var(--background)" },
  spunta: { Glyph: CheckIcon, bg: "var(--success)", fg: "var(--success-fg)" },
  play: { Glyph: PlayIcon, bg: "var(--primary-edge)", fg: "var(--primary-fg)" },
};

/** Avatar predefinito: mai una foto. Un id sconosciuto (dato vecchio o manomesso) diventa il Sensei. */
export function Avatar({ id, size = 40, label }: { id: string | null | undefined; size?: number; label?: string }) {
  const safe: AvatarId = isAvatarId(id) ? id : "sensei";
  const name = AVATARS.find((a) => a.id === safe)?.label ?? "Avatar";
  if (safe === "sensei") {
    return (
      <span
        role="img"
        aria-label={label ?? name}
        className="grid shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-surface-muted"
        style={{ width: size, height: size }}
      >
        <span aria-hidden className="block translate-y-[8%]">
          <Mascot size={Math.round(size * 0.86)} />
        </span>
      </span>
    );
  }
  const { Glyph, bg, fg } = LOOK[safe];
  return (
    <span
      role="img"
      aria-label={label ?? name}
      className="grid shrink-0 place-items-center rounded-full border border-border"
      style={{ width: size, height: size, background: bg, color: fg }}
    >
      <Glyph width={Math.round(size * 0.52)} height={Math.round(size * 0.52)} />
    </span>
  );
}

/** Scelta dell'avatar: elenco di pulsanti (almeno 44px), uno solo selezionato. */
export function AvatarPicker({ value, onChange }: { value: AvatarId; onChange: (id: AvatarId) => void }) {
  return (
    <div role="radiogroup" aria-label="Scegli il tuo avatar" className="grid grid-cols-6 gap-2">
      {AVATARS.map((a) => (
        <button
          key={a.id}
          type="button"
          role="radio"
          aria-checked={value === a.id}
          aria-label={a.label}
          title={a.label}
          onClick={() => onChange(a.id)}
          className={`grid min-h-11 min-w-11 place-items-center rounded-full p-0.5 ${value === a.id ? "ring-2 ring-primary ring-offset-2 ring-offset-surface" : "opacity-80 hover:opacity-100"}`}
        >
          <Avatar id={a.id} size={44} label={a.label} />
        </button>
      ))}
    </div>
  );
}
