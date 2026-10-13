import type { ReactNode } from "react";
import { BoltIcon, BulbIcon } from "../icons";
import { Mascot } from "../mascot";

export function Scene({ children }: { title?: string; children: ReactNode }) {
  // Il titolo serve al player (barra di avanzamento); qui si mostra solo il contenuto.
  return <div className="grid gap-4">{children}</div>;
}

/** Testo delle due voci. Resta sempre visibile come trascrizione; l'audio si aggancia con la pipeline TTS (E6). */
export function Say({ who, children }: { who: "sensei" | "assistente"; children: ReactNode }) {
  const sensei = who === "sensei";
  return (
    <aside className="my-2 flex items-end gap-3" aria-label={`Parla ${sensei ? "il Sensei" : "l'Assistente"}`}>
      <div className="shrink-0">
        {sensei ? (
          <Mascot size={64} mood="stern" />
        ) : (
          <span className="grid size-14 place-items-center rounded-full bg-accent text-accent-fg" aria-hidden>
            <BulbIcon />
          </span>
        )}
      </div>
      <div className="relative rounded-3xl rounded-bl-md border-2 border-border bg-surface-muted px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">{sensei ? "Sensei" : "Assistente"}</p>
        <p className="mt-0.5 leading-relaxed">{children}</p>
      </div>
    </aside>
  );
}

export function Recap({ xp, children }: { xp: number; children: ReactNode }) {
  return (
    <section className="my-2 grid gap-4">
      <div className="rounded-3xl bg-deep p-5 text-deep-fg">
        <h3 className="text-xl font-extrabold">Caso chiuso. Ecco cosa sai adesso</h3>
        <div className="mt-2 [&_li]:marker:text-primary">{children}</div>
      </div>
      <p className="chip w-fit font-extrabold text-primary">
        <BoltIcon width={18} height={18} /> +{xp} XP quando completi la lezione
      </p>
    </section>
  );
}
