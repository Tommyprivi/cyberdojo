"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { appendDictation, speakable } from "@/lib/listen/voice";

type RecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};

function getRecognition(): (new () => RecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => RecognitionLike; webkitSpeechRecognition?: new () => RecognitionLike };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const noSub = () => () => {};
const hasSynth = () => typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";

/**
 * Microfono: parte solo dopo il clic (con avviso privacy). Il testo dettato si aggiunge al campo
 * e si può correggere prima di inviare. Si nasconde se il browser non supporta il riconoscimento vocale.
 */
export function MicButton({ value, onChange, max = 1000, disabled }: { value: string; onChange: (v: string) => void; max?: number; disabled?: boolean }) {
  const ok = useSyncExternalStore(noSub, () => getRecognition() !== null, () => false);
  const [listening, setListening] = useState(false);
  const [info, setInfo] = useState(false);
  const rec = useRef<RecognitionLike | null>(null);
  const base = useRef("");

  useEffect(() => {
    return () => rec.current?.abort();
  }, []);

  if (!ok) return null;

  const start = () => {
    const Ctor = getRecognition();
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = "it-IT";
    r.interimResults = false;
    r.continuous = false;
    base.current = value;
    r.onresult = (e) => {
      const said = Array.from(e.results)
        .map((x) => x[0]?.transcript ?? "")
        .join(" ");
      onChange(appendDictation(base.current, said, max));
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    rec.current = r;
    try {
      r.start();
      setListening(true);
      setInfo(false);
    } catch {
      setListening(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-pressed={listening}
        aria-label={listening ? "Smetti di dettare" : "Detta la domanda con il microfono"}
        onClick={() => (listening ? rec.current?.stop() : setInfo((v) => !v))}
        className={`btn min-h-11 min-w-11 px-3 ${listening ? "btn-primary" : "btn-ghost"}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
        </svg>
      </button>
      {info && !listening && (
        <div role="dialog" aria-label="Avviso privacy microfono" className="absolute bottom-full right-0 z-30 mb-2 grid w-64 gap-2 rounded-lg border border-border bg-background p-3 text-sm shadow-lg">
          <p>Il browser può inviare la tua voce al suo servizio di riconoscimento vocale (non a CyberDojo). Usa il microfono solo se sei d&apos;accordo.</p>
          <div className="flex gap-2">
            <button type="button" className="btn btn-primary min-h-11 flex-1" onClick={start}>
              Va bene, parla
            </button>
            <button type="button" className="btn btn-ghost min-h-11" onClick={() => setInfo(false)}>
              No
            </button>
          </div>
        </div>
      )}
      <span className="sr-only" role="status">
        {listening ? "Ti ascolto" : ""}
      </span>
    </div>
  );
}

/**
 * Lettura ad alta voce delle risposte del Sensei (voce del browser), con interruttore.
 * Legge `text` quando cambia, se l'interruttore è acceso. `text` vuoto = niente da leggere.
 */
export function ReadAloud({ text }: { text: string }) {
  const ok = useSyncExternalStore(noSub, hasSynth, () => false);
  const [on, setOn] = useState(false);
  const lastSpoken = useRef("");

  useEffect(() => {
    return () => {
      if (hasSynth()) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!ok) return;
    if (!on) {
      window.speechSynthesis.cancel();
      return;
    }
    const t = speakable(text);
    if (!t || t === lastSpoken.current) return;
    lastSpoken.current = t;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "it-IT";
    const voice = window.speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith("it"));
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  }, [text, on, ok]);

  if (!ok) return null;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Leggi ad alta voce le risposte del Sensei"
      onClick={() => {
        if (on) lastSpoken.current = "";
        setOn(!on);
      }}
      className={`btn min-h-11 min-w-11 px-3 ${on ? "btn-primary" : "btn-ghost"}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 9v6h4l5 4V5L8 9H4z" />
        {on ? <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /> : <path d="M17 9l5 6M22 9l-5 6" />}
      </svg>
    </button>
  );
}
