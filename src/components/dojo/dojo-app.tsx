"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { parseVerdict, scoreOf, type Verdict } from "@/lib/ai/verdict";
import { playSound } from "@/lib/sounds";
import { Mascot } from "../mascot";
import { MicButton, ReadAloud } from "./voice-controls";

type Lesson = { id: string; title: string };
type Catalog = { id: string; title: string; modules: { n: number; title: string; lessons: Lesson[] }[] }[];
type Msg = { role: "user" | "assistant"; content: string };
type Mode = "chat" | "quiz";

const START = "Inizia l'interrogazione.";
const NOTICE =
  "Le domande vengono elaborate da un servizio esterno (Google Gemini, piano gratuito): non scrivere dati personali. Le risposte dell'IA possono sbagliare: controlla sempre le lezioni.";
const LESSON_LINK = /(\/lezione\/[A-Z]\.\d{2}\.\d{3})/g;

/** Testo del Sensei: i riferimenti /lezione/<id> diventano collegamenti. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(LESSON_LINK).map((part, i) =>
        /^\/lezione\/[A-Z]\.\d{2}\.\d{3}$/.test(part) ? (
          <Link key={i} href={part} className="font-semibold text-primary underline underline-offset-2">
            {part.slice(9)}
          </Link>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export function DojoApp({ catalog, initialLessonId, configured }: { catalog: Catalog; initialLessonId?: string; configured: boolean }) {
  const found = initialLessonId
    ? catalog.flatMap((c) => c.modules.map((m) => ({ c, m }))).find(({ m }) => m.lessons.some((l) => l.id === initialLessonId))
    : undefined;

  const [mode, setMode] = useState<Mode>("chat");
  const [courseId, setCourseId] = useState(found?.c.id ?? catalog[0]?.id ?? "F");
  const [moduleN, setModuleN] = useState(found?.m.n ?? 0);
  const [lessonId, setLessonId] = useState(initialLessonId ?? "");
  const [count, setCount] = useState(5);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [verdicts, setVerdicts] = useState<Verdict[]>([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [inactive, setInactive] = useState(!configured);

  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastHistory = useRef<Msg[] | null>(null);

  const course = catalog.find((c) => c.id === courseId) ?? catalog[0];
  const mod = course?.modules.find((m) => m.n === moduleN);
  const lessonsInScope = mod ? mod.lessons : [];

  const answered = mode === "quiz" ? Math.max(0, messages.filter((m) => m.role === "user").length - 1) : 0;
  const finished = mode === "quiz" && started && answered >= count && !loading && messages.at(-1)?.role === "assistant";
  const score = scoreOf(verdicts);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, loading, error]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setVerdicts([]);
    setStarted(false);
    setLoading(false);
    setError(null);
    setInput("");
  }, []);

  const scope = { courseId, ...(moduleN ? { module: moduleN } : {}), ...(lessonId ? { lessonId } : {}) };

  const call = useCallback(
    async (history: Msg[]) => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const timer = setTimeout(() => ctrl.abort(), 25_000);
      lastHistory.current = history;
      setMessages(history);
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/dojo", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ mode, scope, ...(mode === "quiz" ? { count } : {}), messages: history }),
          signal: ctrl.signal,
        });
        const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string; inactive?: boolean };
        if (ctrl.signal.aborted && abortRef.current !== ctrl) return;
        if (!res.ok || !data.reply) {
          setError(data.error ?? "Qualcosa è andato storto. Riprova.");
          return;
        }
        if (data.inactive) setInactive(true);
        const reply = data.reply;
        setMessages([...history, { role: "assistant", content: reply }]);
        playSound("open");
        if (mode === "quiz") {
          const { verdict } = parseVerdict(reply);
          if (verdict) {
            setVerdicts((v) => [...v, verdict]);
            if (verdict === "giusta") playSound("success");
          }
        }
      } catch {
        if (abortRef.current === ctrl) setError("Il Sensei ci mette troppo o non c'è connessione. Riprova.");
      } finally {
        clearTimeout(timer);
        if (abortRef.current === ctrl) setLoading(false);
        inputRef.current?.focus();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, courseId, moduleN, lessonId, count],
  );

  function startQuiz() {
    reset();
    setStarted(true);
    void call([{ role: "user", content: START }]);
  }

  /** Riprova l'ultima richiesta dopo un errore: il messaggio dello studente resta a schermo. */
  function retry() {
    if (lastHistory.current) void call(lastHistory.current);
  }

  function sendKeep() {
    const text = input.trim();
    if (!text || loading || finished) return;
    setInput("");
    void call([...messages, { role: "user", content: text }]);
  }

  function changeScope(fn: () => void) {
    fn();
    reset();
  }

  const shown = messages.filter((m, i) => !(mode === "quiz" && i === 0 && m.role === "user" && m.content === START));
  const canType = !loading && !finished && (mode === "chat" || started);

  const selectors = (
    <div className="grid gap-4">
      <fieldset className="grid gap-2">
        <legend className="mb-1 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-muted">Modalità</legend>
        {(
          [
            ["chat", "Chiedi al Sensei", "Fai domande sulle lezioni."],
            ["quiz", "Interrogazione", "Il Sensei ti interroga."],
          ] as const
        ).map(([id, label, help]) => (
          <label
            key={id}
            className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-md border p-3 ${
              mode === id ? "border-primary bg-surface-muted" : "border-border"
            } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)]`}
          >
            <input
              type="radio"
              name="mode"
              className="mt-1 size-4 accent-[var(--primary)]"
              checked={mode === id}
              onChange={() => changeScope(() => setMode(id))}
            />
            <span className="grid leading-snug">
              <span className="font-semibold">{label}</span>
              <span className="text-sm text-muted">{help}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="grid gap-3">
        <label className="grid gap-1 text-sm font-semibold">
          Corso
          <select
            className="field w-full font-normal"
            value={courseId}
            onChange={(e) => changeScope(() => { setCourseId(e.target.value); setModuleN(0); setLessonId(""); })}
          >
            {catalog.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Modulo
          <select
            className="field w-full font-normal"
            value={moduleN}
            onChange={(e) => changeScope(() => { setModuleN(Number(e.target.value)); setLessonId(""); })}
          >
            <option value={0}>Tutto il corso</option>
            {course?.modules.map((m) => (
              <option key={m.n} value={m.n}>
                {m.n}. {m.title}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Lezione
          <select
            className="field w-full font-normal"
            value={lessonId}
            disabled={!moduleN}
            onChange={(e) => changeScope(() => setLessonId(e.target.value))}
          >
            <option value="">{moduleN ? "Tutto il modulo" : "Scegli prima un modulo"}</option>
            {lessonsInScope.map((l) => (
              <option key={l.id} value={l.id}>
                {l.id} · {l.title}
              </option>
            ))}
          </select>
        </label>
        {mode === "quiz" && (
          <label className="grid gap-1 text-sm font-semibold">
            Numero di domande
            <select className="field w-full font-normal" value={count} onChange={(e) => changeScope(() => setCount(Number(e.target.value)))}>
              {[5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {mode === "quiz" && (
        <button type="button" className="btn btn-primary min-h-11" onClick={startQuiz} disabled={loading}>
          {started ? "Ricomincia l'interrogazione" : "Inizia l'interrogazione"}
        </button>
      )}
      <button type="button" className="btn btn-ghost min-h-11" onClick={() => { reset(); inputRef.current?.focus(); }}>
        Nuova conversazione
      </button>
    </div>
  );

  return (
    <div className="grid gap-4 lg:h-[calc(100dvh-3rem)] lg:min-h-0 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-6 xl:h-[calc(100dvh-5rem)]">
      {/* Scelte: a sinistra su PC, a tendina su telefono */}
      <aside className="dossier hidden min-h-0 gap-5 overflow-y-auto p-5 lg:grid lg:content-start" aria-label="Scelta di modalità e lezione">
        <div className="flex items-center gap-3">
          <Mascot size={56} animate />
          <div className="leading-tight">
            <h1 className="font-display text-2xl font-bold">AI Dojo</h1>
            <p className="text-sm text-muted">Il Sensei ti risponde e ti interroga.</p>
          </div>
        </div>
        {selectors}
      </aside>
      <details className="dossier lg:hidden">
        <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-2 px-4 font-semibold">
          <span>
            AI Dojo · {mode === "chat" ? "Chiedi al Sensei" : "Interrogazione"}
          </span>
          <span className="text-sm font-normal text-muted">Scelte</span>
        </summary>
        <div className="border-t border-border p-4">{selectors}</div>
      </details>

      <section className="dossier flex min-h-[60dvh] min-w-0 flex-col lg:min-h-0" aria-label="Conversazione">
        <p className="border-b border-border bg-surface-muted px-4 py-2 text-sm leading-snug text-muted">{NOTICE}</p>
        {inactive && (
          <p className="border-b border-border px-4 py-2 text-sm font-semibold text-accent" role="status">
            L&apos;AI Dojo non è ancora attivo: manca la chiave.{mode === "quiz" ? " L'interrogazione parte in modalità dimostrativa." : ""}
          </p>
        )}

        <div role="log" aria-live="polite" aria-relevant="additions text" aria-label="Messaggi" className="flex-1 overflow-y-auto px-4 py-4 lg:min-h-0">
          {shown.length === 0 && !loading && (
            <div className="grid max-w-md gap-2 py-6 text-muted">
              <p className="font-display text-xl font-bold text-foreground">
                {mode === "chat" ? "Chiedi pure." : "Pronto a metterti alla prova?"}
              </p>
              {mode === "chat" && (
                <Link href="/ripasso" className="btn btn-primary mt-2 min-h-11 w-fit">
                  Allenami sui miei errori
                </Link>
              )}
              <p>
                {mode === "chat"
                  ? "Scegli la lezione (nelle scelte) e fai una domanda. Il Sensei risponde solo con ciò che c'è nei corsi."
                  : "Scegli cosa ripassare e quante domande, poi premi «Inizia l'interrogazione». Non assegna XP né serie e non viene salvata."}
              </p>
            </div>
          )}
          <ul className="grid gap-3">
            {shown.map((m, i) => {
              const text = m.role === "assistant" ? parseVerdict(m.content).text : m.content;
              return (
                <li key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-4 py-3 leading-relaxed ${
                      m.role === "user" ? "bg-primary text-primary-fg" : "border border-border bg-surface-muted"
                    }`}
                  >
                    <span className="sr-only">{m.role === "user" ? "Tu: " : "Sensei: "}</span>
                    {m.role === "assistant" ? <Rich text={text} /> : text}
                  </div>
                </li>
              );
            })}
          </ul>
          {loading && (
            <p className="mt-3 flex items-center gap-2 text-sm text-muted" role="status">
              <span className="inline-flex gap-1" aria-hidden>
                <span className="size-2 animate-bounce rounded-full bg-muted [animation-delay:-0.2s]" />
                <span className="size-2 animate-bounce rounded-full bg-muted [animation-delay:-0.1s]" />
                <span className="size-2 animate-bounce rounded-full bg-muted" />
              </span>
              Il Sensei sta scrivendo…
            </p>
          )}
          {error && (
            <div role="alert" className="mt-3 grid gap-2 rounded-lg border border-accent p-3 text-sm">
              <p className="font-semibold text-accent">{error}</p>
              <button type="button" className="btn btn-ghost min-h-11 w-fit" onClick={retry}>
                Riprova
              </button>
            </div>
          )}
          {mode === "quiz" && started && verdicts.length > 0 && (
            <p className="mt-3 font-mono text-xs text-muted">
              Risposte valutate: {verdicts.length} di {count} · punteggio provvisorio {score} su {count}
            </p>
          )}
          {finished && (
            <div className="mt-4 grid gap-1 rounded-lg border-2 border-primary p-4" role="status">
              <p className="font-display text-xl font-bold">
                Interrogazione finita: {score} su {count}
              </p>
              <p className="text-sm text-muted">Giusta = 1 punto, parziale = mezzo punto. Non assegna XP né serie e non è salvata.</p>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Campo di testo: fisso in basso sul telefono (sopra la barra di navigazione), nel pannello su PC */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendKeep();
          }}
          className="fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] z-20 flex items-end gap-2 border-t border-border bg-surface p-3 lg:static lg:z-auto lg:bottom-auto lg:p-4"
        >
          <label htmlFor="dojo-input" className="sr-only">
            {mode === "quiz" ? "La tua risposta" : "La tua domanda"}
          </label>
          <textarea
            id="dojo-input"
            ref={inputRef}
            rows={1}
            maxLength={1000}
            value={input}
            disabled={!canType}
            placeholder={
              mode === "quiz" && !started ? "Prima inizia l'interrogazione" : finished ? "Interrogazione finita" : mode === "quiz" ? "Scrivi la tua risposta…" : "Scrivi la tua domanda…"
            }
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendKeep();
              }
            }}
            className="field max-h-32 min-h-11 flex-1 resize-none py-2.5 text-base"
          />
          <MicButton value={input} onChange={setInput} disabled={!canType} />
          <ReadAloud text={loading ? "" : parseVerdict(messages.findLast((m) => m.role === "assistant")?.content ?? "").text} />
          <button type="submit" disabled={!canType || !input.trim()} className="btn btn-primary min-h-11 min-w-11 px-4">
            Invia
          </button>
        </form>
      </section>
      <div className="h-16 lg:hidden" aria-hidden />
    </div>
  );
}
