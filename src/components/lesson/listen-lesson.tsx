"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { buildQueue, chooseSource, clampRate, formatPoint, parsePoint, pointKey, screenStart, stepIndex } from "@/lib/listen/listen";

/** Un secondo di silenzio (WAV): tiene viva la sessione multimediale mentre parla la sintesi, anche a schermo spento. */
function silentWavUrl(): string {
  const rate = 8000;
  const buf = new ArrayBuffer(44 + rate);
  const v = new DataView(buf);
  const w = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF");
  v.setUint32(4, 36 + rate, true);
  w(8, "WAVEfmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, rate, true);
  v.setUint32(28, rate, true);
  v.setUint16(32, 1, true);
  v.setUint16(34, 8, true);
  w(36, "data");
  v.setUint32(40, rate, true);
  new Uint8Array(buf, 44).fill(128);
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}

const hasSpeech = () => typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";

const noSub = () => () => {};

function readPoint(lessonId: string) {
  try {
    return parsePoint(localStorage.getItem(pointKey(lessonId)));
  } catch {
    return null;
  }
}

/**
 * «Ascolta la lezione»: legge in sequenza i testi parlati (<Say>) di tutte le schermate.
 * Usa gli audio già generati se passati in `audio` (schermata -> indirizzo); altrimenti la voce
 * del browser (gratuita). Non avvia mai nessuna generazione a pagamento.
 */
export function ListenLesson({
  lessonId,
  title,
  screens,
  audio,
  hideTrigger = false,
  openRequest = 0,
  onAvailable,
}: {
  lessonId: string;
  title: string;
  screens: string[][];
  audio?: Record<number, string>;
  /** Con il menu «Strumenti» il bottone proprio non serve: lo apre il menu. */
  hideTrigger?: boolean;
  /** Ogni volta che aumenta, apre il pannello. */
  openRequest?: number;
  /** Dice al menu se «Ascolta» è disponibile su questo dispositivo. */
  onAvailable?: (ok: boolean) => void;
}) {
  const queue = useMemo(() => buildQueue(screens, audio), [screens, audio]);
  const speechOk = useSyncExternalStore(noSub, hasSpeech, () => false);
  const ok = queue.length > 0 && (speechOk || queue.some((q) => q.audioUrl));
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [rate, setRate] = useState(1);

  const st = useRef({ playing: false, index: 0, rate: 1, token: 0 });
  const audioEl = useRef<HTMLAudioElement | null>(null);
  const keepAlive = useRef<HTMLAudioElement | null>(null);
  const silentUrl = useRef<string | null>(null);
  const goRef = useRef<(i: number) => void>(() => {});

  const save = useCallback(
    (i: number, r: number) => {
      try {
        localStorage.setItem(pointKey(lessonId), formatPoint({ index: i, rate: r }));
      } catch {
        /* archivio non disponibile: si ignora */
      }
    },
    [lessonId],
  );

  const halt = useCallback(() => {
    st.current.token++;
    if (hasSpeech()) window.speechSynthesis.cancel();
    audioEl.current?.pause();
    keepAlive.current?.pause();
  }, []);

  const speak = useCallback(
    (i: number) => {
      const item = queue[i];
      if (!item) return;
      const token = ++st.current.token;
      if (hasSpeech()) window.speechSynthesis.cancel();
      audioEl.current?.pause();
      const next = () => {
        if (st.current.token !== token || !st.current.playing) return;
        if (i + 1 < queue.length) goRef.current(i + 1);
        else {
          st.current.playing = false;
          setPlaying(false);
          keepAlive.current?.pause();
          st.current.index = 0;
          setIndex(0);
          save(0, st.current.rate);
        }
      };
      const source = chooseSource(item, hasSpeech());
      if (source === "audio" && item.audioUrl) {
        const a = (audioEl.current ??= new Audio());
        a.src = item.audioUrl;
        a.playbackRate = st.current.rate;
        a.onended = next;
        a.onerror = next;
        void a.play().catch(() => {
          st.current.playing = false;
          setPlaying(false);
        });
      } else if (source === "speech") {
        const u = new SpeechSynthesisUtterance(item.text);
        u.lang = "it-IT";
        u.rate = st.current.rate;
        const voice = window.speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith("it"));
        if (voice) u.voice = voice;
        u.onend = next;
        u.onerror = (e) => {
          if (e.error === "interrupted" || e.error === "canceled") return;
          next();
        };
        window.speechSynthesis.speak(u);
      }
    },
    [queue, save],
  );

  const go = useCallback(
    (i: number) => {
      const clamped = stepIndex(queue, i, 0);
      st.current.index = clamped;
      setIndex(clamped);
      save(clamped, st.current.rate);
      if (st.current.playing) speak(clamped);
    },
    [queue, save, speak],
  );

  useEffect(() => {
    goRef.current = go;
  }, [go]);

  const play = useCallback(() => {
    st.current.playing = true;
    setPlaying(true);
    try {
      silentUrl.current ??= silentWavUrl();
      const k = (keepAlive.current ??= new Audio(silentUrl.current));
      k.loop = true;
      k.volume = 0.01;
      void k.play().catch(() => {});
    } catch {
      /* non essenziale */
    }
    speak(st.current.index);
  }, [speak]);

  const pause = useCallback(() => {
    st.current.playing = false;
    setPlaying(false);
    halt();
    save(st.current.index, st.current.rate);
  }, [halt, save]);

  const jumpScreen = useCallback(
    (dir: 1 | -1) => {
      const cur = queue[st.current.index]?.screen ?? 0;
      const atStart = st.current.index === screenStart(queue, cur);
      const target = dir === 1 ? screenStart(queue, cur + 1) : screenStart(queue, atStart ? cur - 1 : cur);
      if (target >= 0) go(target);
      else if (dir === -1) go(0);
    },
    [queue, go],
  );

  const changeRate = (r: number) => {
    const v = clampRate(r);
    st.current.rate = v;
    setRate(v);
    save(st.current.index, v);
    if (audioEl.current) audioEl.current.playbackRate = v;
    if (st.current.playing) speak(st.current.index);
  };

  const openPanel = () => {
    const p = readPoint(lessonId);
    if (p) {
      const i = Math.min(p.index, Math.max(0, queue.length - 1));
      st.current.index = i;
      st.current.rate = p.rate;
      setIndex(i);
      setRate(p.rate);
    }
    setOpen(true);
  };

  // Il menu «Strumenti» chiede di aprire il pannello (openRequest) e vuole sapere se «Ascolta» c'è.
  const openPanelRef = useRef(openPanel);
  useEffect(() => {
    openPanelRef.current = openPanel;
  });
  const handled = useRef(0);
  useEffect(() => {
    if (openRequest > handled.current) {
      handled.current = openRequest;
      openPanelRef.current();
    }
  }, [openRequest]);
  useEffect(() => {
    onAvailable?.(ok);
  }, [ok, onAvailable]);

  // Tasti della schermata di blocco (Media Session).
  useEffect(() => {
    if (!playing || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    try {
      ms.metadata = new MediaMetadata({ title, artist: "CyberDojo", album: `Lezione ${lessonId}` });
      ms.playbackState = "playing";
      ms.setActionHandler("play", play);
      ms.setActionHandler("pause", pause);
      ms.setActionHandler("nexttrack", () => jumpScreen(1));
      ms.setActionHandler("previoustrack", () => jumpScreen(-1));
    } catch {
      /* azioni non supportate */
    }
    return () => {
      try {
        ms.playbackState = "paused";
        for (const a of ["play", "pause", "nexttrack", "previoustrack"] as const) ms.setActionHandler(a, null);
      } catch {
        /* niente */
      }
    };
  }, [playing, title, lessonId, play, pause, jumpScreen]);

  // Si ferma lasciando la pagina. A schermo spento NON si ferma.
  useEffect(() => {
    const stop = () => {
      st.current.playing = false;
      halt();
    };
    window.addEventListener("pagehide", stop);
    return () => {
      window.removeEventListener("pagehide", stop);
      stop();
      if (silentUrl.current) URL.revokeObjectURL(silentUrl.current);
      silentUrl.current = null;
      keepAlive.current = null;
    };
  }, [halt]);

  if (!ok) return null;

  const item = queue[index];

  return (
    <>
      {!open && !hideTrigger && (
        <button
          type="button"
          onClick={openPanel}
          className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] left-3 z-40 min-h-11 rounded-full border border-border bg-surface px-4 text-sm font-semibold shadow-sm lg:bottom-24 lg:left-auto lg:right-40"
        >
          Ascolta la lezione
        </button>
      )}
      {open && (
        <section
          aria-label="Ascolta la lezione"
          className="fixed inset-x-0 bottom-0 z-50 grid gap-3 border-t border-border bg-background p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lg lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-[26rem] lg:rounded-lg lg:border"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold">Ascolta la lezione</h2>
            <button
              type="button"
              onClick={() => {
                pause();
                setOpen(false);
              }}
              className="btn btn-ghost min-h-11"
            >
              Chiudi
            </button>
          </div>
          <p className="text-sm text-muted" aria-live="polite">
            Schermata {(item?.screen ?? 0) + 1} di {screens.length} · frase {index + 1} di {queue.length}
            {item?.audioUrl ? " · audio registrato" : " · voce del dispositivo"}
          </p>
          <p className="line-clamp-3 min-h-[3.75rem] rounded-md bg-surface-muted p-3 text-sm leading-relaxed">{item?.text}</p>
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-ghost min-h-11 flex-1" aria-label="Schermata precedente" onClick={() => jumpScreen(-1)}>
              Indietro
            </button>
            <button type="button" className="btn btn-primary min-h-11 flex-[2]" aria-pressed={playing} onClick={playing ? pause : play}>
              {playing ? "Pausa" : "Ascolta"}
            </button>
            <button type="button" className="btn btn-ghost min-h-11 flex-1" aria-label="Schermata successiva" onClick={() => jumpScreen(1)}>
              Avanti
            </button>
          </div>
          <label className="grid gap-1 text-sm font-semibold">
            Velocità: {rate.toFixed(1)}x
            <input
              type="range"
              min={0.8}
              max={1.5}
              step={0.1}
              value={rate}
              onChange={(e) => changeRate(Number(e.target.value))}
              className="min-h-11 accent-[var(--primary)]"
            />
          </label>
        </section>
      )}
    </>
  );
}
