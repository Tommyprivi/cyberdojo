import Image from "next/image";
import type { CSSProperties } from "react";
import { BeltIcon, BoltIcon, BookIcon, CheckIcon, FlameIcon, TargetIcon } from "../icons";
import { lastDays, type BeltColor, type MedalIcon } from "@/lib/progress/profile-stats";

const BELT_IMG: Partial<Record<BeltColor, string>> = { white: "bianca", yellow: "gialla", orange: "arancione", green: "verde", blue: "blu", black: "nera" };

/** Cintura illustrata: fascia, nodo centrale e due code. Il colore è quello della cintura (variabili dell'app). */
export function BeltArt({ color, name, className = "" }: { color: BeltColor; name: string; className?: string }) {
  const img = BELT_IMG[color];
  if (img) {
    // Illustrazione: su riquadro crema per restare leggibile nel tema scuro. Le dimensioni vere sono 334x212.
    return (
      <span className={`inline-grid place-items-center rounded-xl bg-[#f4efe4] p-2 ${className}`}>
        <Image src={`/img/premi/cintura-${img}.png`} alt={`Cintura ${name.toLowerCase()}`} width={334} height={212} sizes="(min-width: 1024px) 256px, 60vw" className="h-auto w-full max-w-64 object-contain" />
      </span>
    );
  }
  const fill = `var(--belt-${color})`;
  const edge = "var(--belt-outline)";
  return (
    <svg viewBox="0 0 240 64" role="img" aria-label={`Cintura ${name.toLowerCase()}`} className={className}>
      <path d="M0 22h104v20H0z" fill={fill} stroke={edge} strokeWidth="2" />
      <path d="M136 22h104v20H136z" fill={fill} stroke={edge} strokeWidth="2" />
      <path d="M112 38 94 62h22l8-14 8 14h22l-18-24z" fill={fill} stroke={edge} strokeWidth="2" strokeLinejoin="round" />
      <rect x="100" y="14" width="40" height="36" rx="5" fill={fill} stroke={edge} strokeWidth="2" />
      <path d="M108 32h24" stroke={edge} strokeWidth="2" strokeLinecap="round" />
      <path d="M0 29h104M136 29h104M0 36h104M136 36h104" stroke={edge} strokeWidth="1" opacity="0.35" />
    </svg>
  );
}

const GLYPH: Record<MedalIcon, typeof BoltIcon> = { check: CheckIcon, bolt: BoltIcon, flame: FlameIcon, belt: BeltIcon, book: BookIcon, target: TargetIcon };

/** Medaglie con illustrazione, per id (profile-stats.ts). Le altre restano disegnate in SVG. */
const MEDAL_IMG: Record<string, string> = { first: "primo-caso", s3: "serie-3", s7: "serie-7", s30: "serie-30", challenge1: "sfida", challenge5: "sfida" };

/** Medaglia con nastro. Sbloccata: sigillo rosso e scintilla; bloccata: tratteggiata e spenta. */
export function MedalArt({ icon, unlocked, size = 64, id }: { icon: MedalIcon; unlocked: boolean; size?: number; id?: string }) {
  const img = id ? MEDAL_IMG[id] : undefined;
  if (img) {
    // Decorativa: nome e stato sono già scritti nel testo accanto. Bloccata = grigia e spenta.
    return (
      <span aria-hidden className={`inline-grid place-items-center rounded-xl bg-[#f4efe4] p-1 ${unlocked ? "pop" : "opacity-50 grayscale"}`} style={{ width: size, height: size * 1.125 }}>
        <Image src={`/img/premi/medaglia-${img}.png`} alt="" width={232} height={336} sizes={`${size}px`} className="h-full w-full object-contain" />
      </span>
    );
  }
  const Glyph = GLYPH[icon];
  return (
    <svg viewBox="0 0 64 72" width={size} height={size * 1.125} aria-hidden className={unlocked ? "pop" : ""}>
      <path d="M18 40 10 68l12-6 8 8 6-26z" fill={unlocked ? "var(--primary)" : "var(--surface-muted)"} />
      <path d="M46 40l8 28-12-6-8 8-6-26z" fill={unlocked ? "var(--accent)" : "var(--border)"} />
      <circle cx="32" cy="28" r="25" fill={unlocked ? "var(--surface)" : "var(--surface-muted)"} stroke={unlocked ? "var(--accent)" : "var(--foreground-muted)"} strokeWidth="3" strokeDasharray={unlocked ? undefined : "4 4"} />
      <circle cx="32" cy="28" r="18" fill={unlocked ? "var(--accent)" : "none"} />
      <g style={{ color: unlocked ? "var(--accent-fg)" : "var(--foreground-muted)" } as CSSProperties}>
        <Glyph x={20} y={16} width={24} height={24} strokeWidth={2.2} />
      </g>
    </svg>
  );
}

/** Calendario degli ultimi 14 giorni: fiamma nei giorni in cui hai studiato, anello oggi. */
export function StreakCalendar({ today, doneDays }: { today: string; doneDays: ReadonlySet<string> }) {
  const days = lastDays(today, 14, doneDays);
  const count = days.filter((d) => d.done).length;
  return (
    <div className="grid gap-2">
      <ol className="grid grid-cols-7 gap-1.5" aria-label={`Ultimi 14 giorni: hai studiato in ${count}`}>
        {days.map((d) => (
          <li key={d.day} className="grid justify-items-center gap-1">
            <span className="font-mono text-[0.6875rem] text-muted" aria-hidden>
              {d.label}
            </span>
            <span
              className={`grid size-9 place-items-center rounded-md border text-xs font-bold ${
                d.done ? "border-accent bg-accent text-accent-fg" : "border-border bg-surface-muted text-muted"
              } ${d.isToday ? "ring-2 ring-primary ring-offset-2 ring-offset-surface" : ""}`}
            >
              {d.done ? <FlameIcon width={18} height={18} className="flicker" /> : d.num}
              <span className="sr-only">
                {d.day}
                {d.done ? ": studiato" : ": nessuna lezione"}
                {d.isToday ? " (oggi)" : ""}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
