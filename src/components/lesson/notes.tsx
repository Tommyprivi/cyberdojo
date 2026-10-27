"use client";

import { useEffect, useRef, useState } from "react";
import { loadNote, saveNote } from "@/app/actions/notes";
import { NOTE_MAX } from "@/lib/notes/note-core";

/**
 * Appunti personali della lezione: bottone discreto + pannello con una casella di testo semplice.
 * Si carica solo all'apertura e si salva da solo poco dopo l'ultima modifica.
 */
export function LessonNotes({ lessonId }: { lessonId: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const loaded = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latest = useRef("");
  const dirty = useRef(false);

  useEffect(() => {
    if (!open || loaded.current) return;
    loaded.current = true;
    setStatus("loading");
    loadNote(lessonId)
      .then((body) => {
        setText(body);
        latest.current = body;
        setStatus("idle");
      })
      .catch(() => {
        loaded.current = false;
        setStatus("error");
        setMessage("Non riesco a caricare gli appunti.");
      });
  }, [open, lessonId]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const save = async (value: string) => {
    dirty.current = false;
    setStatus("saving");
    try {
      const res = await saveNote(lessonId, value);
      if (res.ok) setStatus("saved");
      else {
        setStatus("error");
        setMessage(res.error);
      }
    } catch {
      setStatus("error");
      setMessage("Salvataggio non riuscito. Riprova.");
    }
  };

  const onChange = (value: string) => {
    const v = value.slice(0, NOTE_MAX);
    setText(v);
    latest.current = v;
    dirty.current = true;
    setStatus("idle");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => void save(latest.current), 1000);
  };

  const close = () => {
    clearTimeout(timer.current);
    if (dirty.current) void save(latest.current);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-3 z-40 min-h-11 rounded-full border border-border bg-surface px-4 text-sm font-semibold shadow-sm lg:bottom-24 lg:right-6"
      >
        Appunti
      </button>
      {open ? (
        <div role="dialog" aria-label="I tuoi appunti" className="fixed inset-x-0 bottom-0 z-50 grid gap-3 border-t border-border bg-background p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lg lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-[26rem] lg:rounded-lg lg:border">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold">I tuoi appunti</h2>
            <button type="button" onClick={close} className="min-h-11 px-3 text-sm font-semibold underline">
              Chiudi
            </button>
          </div>
          <label htmlFor="appunti-testo" className="sr-only">
            Appunti di questa lezione
          </label>
          <textarea
            id="appunti-testo"
            value={text}
            onChange={(e) => onChange(e.target.value)}
            disabled={status === "loading"}
            maxLength={NOTE_MAX}
            rows={6}
            placeholder="Scrivi qui quello che vuoi ricordare. Solo testo, solo per te."
            className="w-full rounded-md border border-border bg-surface p-3 text-base"
          />
          <p className="flex justify-between font-mono text-xs text-muted" aria-live="polite">
            <span>
              {status === "loading" ? "Carico…" : status === "saving" ? "Salvo…" : status === "saved" ? "Salvato" : status === "error" ? message : ""}
            </span>
            <span>
              {text.length}/{NOTE_MAX}
            </span>
          </p>
        </div>
      ) : null}
    </>
  );
}
