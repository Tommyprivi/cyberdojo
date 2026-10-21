"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { VM_ASSETS, VM_MEGABYTES, VM_STARTER_COMMANDS, VM_TOTAL_BYTES, fetchVerified } from "@/lib/linux/vm-config";

type V86Instance = {
  destroy: () => Promise<void> | void;
  restart: () => void;
  keyboard_set_status: (on: boolean) => void;
  keyboard_send_text: (text: string) => void;
};
type V86Ctor = new (opts: Record<string, unknown>) => V86Instance;

declare global {
  interface Window {
    V86?: V86Ctor;
  }
}

type Phase = "idle" | "loading" | "running" | "error";

/** Carica libv86.js già verificato come script da un indirizzo blob (una sola volta per pagina). */
function injectScript(code: ArrayBuffer): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.V86) return resolve();
    const url = URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
    const s = document.createElement("script");
    s.src = url;
    s.onload = () => {
      URL.revokeObjectURL(url);
      if (window.V86) resolve();
      else reject(new Error("Emulatore non disponibile"));
    };
    s.onerror = () => reject(new Error("Impossibile avviare l'emulatore"));
    document.head.appendChild(s);
  });
}

/**
 * Macchina virtuale Linux (v86) nel browser. Si scarica e parte SOLO dopo il clic su «Avvia».
 * Rete isolata: non si configura nessun relay, quindi nessun pacchetto esce dal browser.
 */
export function VirtualMachine({
  goal,
  commands,
  height = "h-96",
}: {
  goal?: string;
  commands?: string[];
  height?: string;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const emu = useRef<V86Instance | null>(null);
  const screen = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);
  const cache = useRef<Record<string, ArrayBuffer> | null>(null);
  const wasmUrl = useRef<string | null>(null);
  const suggestions = commands ?? VM_STARTER_COMMANDS.slice(0, 5);

  const stop = useCallback(async () => {
    abort.current?.abort();
    const e = emu.current;
    emu.current = null;
    if (e) {
      try {
        await e.destroy();
      } catch {
        /* già fermata */
      }
    }
    setTyping(false);
  }, []);

  const boot = useCallback(async () => {
    await stop();
    setError(null);
    setPhase("loading");
    setProgress(0);
    const ctl = new AbortController();
    abort.current = ctl;
    try {
      if (!cache.current) {
        let done = 0;
        const tick = (n: number) => {
          done += n;
          setProgress(Math.min(100, Math.round((done / VM_TOTAL_BYTES) * 100)));
        };
        const [lib, wasm, bios, vgaBios, kernel] = await Promise.all(
          (["lib", "wasm", "bios", "vgaBios", "kernel"] as const).map((k) => fetchVerified(VM_ASSETS[k], tick, ctl.signal)),
        );
        cache.current = { lib, wasm, bios, vgaBios, kernel };
      }
      const c = cache.current;
      await injectScript(c.lib);
      if (!wasmUrl.current) wasmUrl.current = URL.createObjectURL(new Blob([c.wasm], { type: "application/wasm" }));
      const container = screen.current;
      if (!container || ctl.signal.aborted || !window.V86) return;
      container.innerHTML = '<div style="white-space:pre;font:14px monospace;line-height:14px"></div><canvas style="display:none"></canvas>';
      emu.current = new window.V86({
        wasm_path: wasmUrl.current,
        memory_size: 64 * 1024 * 1024,
        vga_memory_size: 4 * 1024 * 1024,
        screen_container: container,
        bios: { buffer: c.bios },
        vga_bios: { buffer: c.vgaBios },
        bzimage: { buffer: c.kernel },
        cmdline: "tsc=reliable mitigations=off random.trust_cpu=on",
        // Nessuna opzione di rete (né relay né proxy): la macchina è isolata da Internet.
        autostart: true,
      });
      emu.current.keyboard_set_status(false);
      setPhase("running");
    } catch (e) {
      if (ctl.signal.aborted) return;
      setError(e instanceof Error ? e.message : "Errore sconosciuto");
      setPhase("error");
    }
  }, [stop]);

  useEffect(() => {
    return () => {
      abort.current?.abort();
      void emu.current?.destroy();
      if (wasmUrl.current) URL.revokeObjectURL(wasmUrl.current);
    };
  }, []);

  // La tastiera della VM si attiva solo cliccando sullo schermo, così non ruba i tasti al resto della pagina.
  useEffect(() => {
    if (phase !== "running") return;
    const onDown = (ev: MouseEvent) => {
      const inside = screen.current?.contains(ev.target as Node) ?? false;
      emu.current?.keyboard_set_status(inside);
      setTyping(inside);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [phase]);

  const typingRef = useRef(false);
  useEffect(() => {
    typingRef.current = typing;
  }, [typing]);

  const send = (cmd: string) => {
    const e = emu.current;
    if (!e) return;
    // La tastiera emulata deve essere attiva per ricevere il testo; poi si torna allo stato di prima.
    e.keyboard_set_status(true);
    e.keyboard_send_text(cmd + "\n");
    setTimeout(() => {
      if (emu.current === e && !typingRef.current) e.keyboard_set_status(false);
    }, 2500);
  };

  return (
    <section className="dossier not-prose my-4 overflow-hidden" aria-label="Macchina virtuale Linux">
      <p role="note" className="p-4 md:hidden">
        <strong>La macchina virtuale si usa da computer o tablet</strong>
        <span className="mt-1 block text-sm text-muted">Serve molta memoria e una tastiera.</span>
      </p>
      <div className="hidden md:block">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <div className="min-w-0">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted">Macchina virtuale · sperimentale</p>
            {goal && (
              <p className="mt-0.5">
                <span className="font-semibold">Obiettivo:</span> {goal}
              </p>
            )}
          </div>
          {phase === "running" && (
            <div className="flex gap-2">
              <button type="button" className="chip text-sm" onClick={() => emu.current?.restart()}>
                Riavvia
              </button>
              <button type="button" className="chip text-sm" onClick={() => void boot()}>
                Ripristina
              </button>
              <button
                type="button"
                className="chip text-sm"
                onClick={() => {
                  void stop();
                  setPhase("idle");
                }}
              >
                Spegni
              </button>
            </div>
          )}
        </div>

        {phase !== "running" && (
          <div className="grid gap-3 bg-surface-muted p-5">
            {phase === "idle" && (
              <>
                <p>
                  Una vera macchina Linux (emulata, 32 bit) che gira dentro questa pagina. Al clic scarica circa <strong>{VM_MEGABYTES} MB</strong> (solo la prima volta: poi resta nella cache del browser).
                </p>
                <p className="text-sm text-muted">La rete è isolata: dentro la macchina non si raggiunge Internet. Quando chiudi la pagina, tutto sparisce.</p>
                <div>
                  <button type="button" className="btn btn-primary" onClick={() => void boot()}>
                    Avvia la macchina virtuale
                  </button>
                </div>
              </>
            )}
            {phase === "loading" && (
              <div role="status" className="grid gap-2">
                <p>Scarico e controllo i file… {progress}%</p>
                <div className="h-2 overflow-hidden rounded bg-border">
                  <div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
                </div>
                <p className="text-sm text-muted">Dopo il download parte l&apos;avvio di Linux: servono pochi secondi.</p>
              </div>
            )}
            {phase === "error" && (
              <div role="alert" className="grid gap-2">
                <p className="font-semibold text-accent">Non sono riuscito ad avviare la macchina virtuale.</p>
                <p className="text-sm">{error}</p>
                <div>
                  <button type="button" className="btn btn-ghost" onClick={() => void boot()}>
                    Riprova
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div
          ref={screen}
          tabIndex={phase === "running" ? 0 : -1}
          aria-label="Schermo della macchina virtuale: clicca per scrivere"
          className={`${phase === "running" ? `${height} overflow-auto` : "hidden"} bg-black text-white`}
        />

        {phase === "running" && (
          <div className="grid gap-2 border-t border-border px-4 py-2.5">
            <p className="text-sm text-muted">{typing ? "La tastiera è collegata alla macchina virtuale. Clicca fuori per tornare alla pagina." : "Clicca sullo schermo nero per scrivere nella macchina virtuale."}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted">Comandi di partenza:</span>
              {suggestions.map((c) => (
                <button key={c} type="button" className="chip font-mono text-sm" onClick={() => send(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
