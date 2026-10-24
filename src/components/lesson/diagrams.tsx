import type { ReactNode } from "react";

/**
 * Schemi illustrati per le lezioni: pittogrammi e tre diagrammi pronti (Flow, Layers, Compare).
 * Nell'MDX: <Flow caption="..." steps={[{ icon: "mail", title: "Email", text: "Arriva un messaggio" }, ...]} />
 * Tutto è SVG/HTML statico (nessun JavaScript lato browser) e usa i colori del sito.
 */

const PATHS = {
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14a7 7 0 0 1 4 6",
  laptop: "M5 6h14v9H5zM2 19h20l-2-4H4z",
  phone: "M8 2h8a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1ZM11 19h2",
  server: "M4 4h16v6H4zM4 14h16v6H4zM7 7h.01M7 17h.01M11 7h6M11 17h6",
  database: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3ZM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6",
  cloud: "M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5Z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  wifi: "M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7",
  file: "M6 2h8l5 5v15H6zM14 2v5h5M9 13h6M9 17h6",
  folder: "M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z",
  lock: "M5 11h14v10H5zM8 11V8a4 4 0 0 1 8 0v3M12 15v2",
  key: "M8 15a4.5 4.5 0 1 1 3.9-6.7L21 9v3h-2v2h-3v-2.5l-1.2-1A4.500 4.500 0 0 1 8 15ZM6.5 11h.01",
  shield: "M12 2 4 5v6c0 5 3.400 9 8 11 4.600-2 8-6 8-11V5ZM9 12l2 2 4-4",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  bug: "M9 6a3 3 0 0 1 6 0M8 8h8v8a4 4 0 0 1-8 0ZM3 11h5M16 11h5M4 19l4-3M20 19l-4-3M4 5l4 3M20 5l-4 3",
  fire: "M12 3c1 3-3 5-3 9a4 4 0 0 0 8 0c0-2-1-3-1-5 2 1 4 3.500 4 6.500a8 8 0 0 1-16 0C4 9 9 7 12 3Z",
  bell: "M6 17V11a6 6 0 0 1 12 0v6l2 2H4ZM10 21h4",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2",
  coin: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM14.500 9.500C14 8.500 13 8 12 8c-1.500 0-2.500.8-2.500 2s1 1.700 2.500 2 2.500.8 2.500 2-1 2-2.500 2c-1 0-2-.5-2.500-1.500M12 6v2M12 16v2",
  chart: "M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6",
  link: "M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 12a7 7 0 0 0-.1-1.200l2-1.500-2-3.400-2.400 1a7 7 0 0 0-2-1.200L14 3h-4l-.5 2.700a7 7 0 0 0-2 1.200l-2.400-1-2 3.400 2 1.500A7 7 0 0 0 5 12c0 .4 0 .8.100 1.200l-2 1.500 2 3.400 2.400-1a7 7 0 0 0 2 1.200L10 21h4l.5-2.700a7 7 0 0 0 2-1.200l2.400 1 2-3.400-2-1.500c.1-.4.100-.8.100-1.200Z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.500-4.500",
  warning: "M12 3 2 20h20ZM12 10v4M12 17h.01",
  check: "m5 12 5 5L20 7",
  cross: "M6 6l12 12M18 6 6 18",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  skull: "M12 3a8 8 0 0 0-5 14v3h10v-3a8 8 0 0 0-5-14ZM9 11h.01M15 11h.01M10 20v-2M14 20v-2",
  terminal: "M3 4h18v16H3zM7 9l3 3-3 3M13 15h4",
  code: "m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16",
  mask: "M4 6c4-2 12-2 16 0v5c0 5-4 8-8 9-4-1-8-4-8-9ZM8 11h2M14 11h2",
  hook: "M12 3v10a4 4 0 1 1-4-4M12 3h.01",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5ZM8 7h7",
} as const;

export type PicName = keyof typeof PATHS;
export const PIC_NAMES = Object.keys(PATHS);

export function Pic({ name, size = 28 }: { name: string; size?: number }) {
  const d = PATHS[name as PicName] ?? PATHS.warning;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

type Item = { icon: string; title: string; text?: string };
const TONES = ["var(--sky)", "var(--primary)", "var(--sun)", "var(--accent)", "var(--belt-orange)"];
const ink = (i: number) => (i % TONES.length === 2 ? "var(--sun-fg)" : "#fff");

function Frame({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <figure className="my-2 grid max-w-4xl gap-2 rounded-2xl border-2 border-border bg-surface p-4 sm:p-5">
      {children}
      {caption ? <figcaption className="text-center text-sm text-muted">{caption}</figcaption> : null}
    </figure>
  );
}

function Badge({ icon, i, size = 56 }: { icon: string; i: number; size?: number }) {
  return (
    <span aria-hidden className="grid shrink-0 place-items-center rounded-2xl" style={{ width: size, height: size, background: TONES[i % TONES.length], color: ink(i) }}>
      <Pic name={icon} size={size * 0.54} />
    </span>
  );
}

const Arrow = () => (
  <svg aria-hidden width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="mx-auto shrink-0 rotate-90 sm:rotate-0">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/** Passaggi in sequenza, da sinistra a destra (in colonna su telefono). */
export function Flow({ steps, caption }: { steps: Item[]; caption?: string }) {
  return (
    <Frame caption={caption}>
      <ol className="flex flex-col items-stretch gap-1 sm:flex-row sm:items-start sm:justify-center">
        {steps.map((s, i) => (
          <li key={i} className="contents">
            <div className="grid flex-1 justify-items-center gap-1.5 px-1 text-center">
              <Badge icon={s.icon} i={i} />
              <p className="font-display text-lg font-bold leading-tight">{s.title}</p>
              {s.text ? <p className="text-sm leading-snug text-muted">{s.text}</p> : null}
            </div>
            {i < steps.length - 1 ? <Arrow /> : null}
          </li>
        ))}
      </ol>
    </Frame>
  );
}

/** Livelli uno sopra l'altro: il primo della lista sta in cima. */
export function Layers({ items, caption }: { items: Item[]; caption?: string }) {
  return (
    <Frame caption={caption}>
      <ol className="grid gap-2">
        {items.map((s, i) => (
          <li
            key={i}
            className="flex items-center gap-3 rounded-xl border-2 px-3 py-2.5"
            style={{ borderColor: TONES[i % TONES.length], background: `color-mix(in srgb, ${TONES[i % TONES.length]} 10%, var(--surface))`, marginInline: `${Math.min(i, 4) * 0.6}rem` }}
          >
            <Badge icon={s.icon} i={i} size={44} />
            <div className="min-w-0">
              <p className="font-display text-lg font-bold leading-tight">{s.title}</p>
              {s.text ? <p className="text-sm leading-snug text-muted">{s.text}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

/** Due colonne a confronto: sbagliato/giusto, prima/dopo, attacco/difesa. */
export function Compare({
  left,
  right,
  caption,
}: {
  left: { title: string; icon?: string; points: string[] };
  right: { title: string; icon?: string; points: string[] };
  caption?: string;
}) {
  const col = (c: typeof left, good: boolean) => (
    <div className="rounded-xl border-2 p-3.5" style={{ borderColor: good ? "var(--primary)" : "var(--accent)", background: `color-mix(in srgb, ${good ? "var(--primary)" : "var(--accent)"} 8%, var(--surface))` }}>
      <p className="mb-2 flex items-center gap-2 font-display text-lg font-bold" style={{ color: good ? "var(--primary)" : "var(--accent)" }}>
        <Pic name={c.icon ?? (good ? "check" : "cross")} size={22} /> {c.title}
      </p>
      <ul className="grid gap-1.5 text-sm">
        {c.points.map((p, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="mt-0.5 font-extrabold" style={{ color: good ? "var(--primary)" : "var(--accent)" }}>
              {good ? "✓" : "✗"}
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <Frame caption={caption}>
      <div className="grid gap-3 sm:grid-cols-2">
        {col(left, false)}
        {col(right, true)}
      </div>
    </Frame>
  );
}
