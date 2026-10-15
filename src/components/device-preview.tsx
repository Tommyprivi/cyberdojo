"use client";

import { useEffect, useRef, useState } from "react";

const PAGES = [
  { path: "/", label: "Home" },
  { path: "/corsi", label: "Corsi" },
  { path: "/pratica", label: "Pratica" },
  { path: "/pratica/calcolatore", label: "Laboratorio" },
  { path: "/lezione/F.05.001", label: "Lezione" },
  { path: "/accedi", label: "Accedi" },
  { path: "/percorso", label: "Percorso (serve l'accesso)" },
  { path: "/profilo", label: "Profilo (serve l'accesso)" },
];

/** Una pagina reale dentro una cornice, rimpicciolita per stare nello spazio disponibile. */
function Frame({ src, width, height, kind }: { src: string; width: number; height: number; kind: "pc" | "telefono" }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, el.clientWidth / width));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={box} className="w-full">
      <div
        className={kind === "telefono" ? "mx-auto overflow-hidden rounded-[2.2rem] border-[10px] border-fg bg-fg shadow-xl" : "overflow-hidden rounded-xl border border-border bg-surface shadow-xl"}
        style={{ width: width * scale + (kind === "telefono" ? 20 : 0), maxWidth: "100%" }}
      >
        {kind === "pc" && (
          <div className="flex items-center gap-1.5 border-b border-border bg-surface-muted px-3 py-2" aria-hidden>
            <span className="size-2.5 rounded-full bg-accent" />
            <span className="size-2.5 rounded-full bg-belt-yellow" />
            <span className="size-2.5 rounded-full bg-primary" />
          </div>
        )}
        <div style={{ width: width * scale, height: height * scale }} className="overflow-hidden bg-white">
          <iframe
            title={`Anteprima ${kind}`}
            src={src}
            style={{ width, height, transform: `scale(${scale})`, transformOrigin: "top left", border: 0 }}
          />
        </div>
      </div>
    </div>
  );
}

export function DevicePreview() {
  const [path, setPath] = useState(PAGES[0].path);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Pagina da mostrare">
        {PAGES.map((p) => (
          <button key={p.path} type="button" className={`chip ${p.path === path ? "bg-primary text-primary-fg" : ""}`} aria-pressed={p.path === path} onClick={() => setPath(p.path)}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[2fr_1fr]">
        <section aria-label="Interfaccia per PC" className="grid gap-2">
          <h2 className="font-display text-xl font-semibold">Su PC <span className="text-sm font-normal text-muted">1440 × 900</span></h2>
          <Frame src={path} width={1440} height={900} kind="pc" />
        </section>
        <section aria-label="Interfaccia per telefono" className="grid gap-2">
          <h2 className="font-display text-xl font-semibold">Su telefono <span className="text-sm font-normal text-muted">390 × 844</span></h2>
          <Frame src={path} width={390} height={844} kind="telefono" />
        </section>
      </div>
    </div>
  );
}
