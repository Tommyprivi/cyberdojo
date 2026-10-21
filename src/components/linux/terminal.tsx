"use client";

import { useEffect, useImperativeHandle, useRef, useState, type KeyboardEvent, type Ref } from "react";
import type { ScenarioId } from "@/lib/linux/scenarios";
import { Shell, type EditorRequest } from "@/lib/linux/shell";

export type TerminalHandle = {
  /** Scrive un comando nella riga di input (senza eseguirlo) e porta il cursore lì. */
  fill: (text: string) => void;
  focus: () => void;
};

type Line = { id: number; prompt?: string; text: string };

const MAX_LINES = 600;
const BANNER =
  "Terminale Linux simulato di CyberDojo. Tutto resta in questa pagina: nessun file vero viene toccato.\nScrivi «help» per l'elenco dei comandi, «man ls» per un manuale. Tab completa, ↑ ↓ richiamano i comandi, Ctrl+C annulla, Ctrl+L pulisce.\n";

/**
 * Terminale a righe: lo stato (filesystem, cartella, variabili) vive in un oggetto Shell creato al montaggio.
 * Per ricominciare, chi lo usa cambia la `key` del componente.
 */
export function Terminal({
  scenario,
  ref,
  className = "",
}: {
  scenario: ScenarioId;
  ref?: Ref<TerminalHandle>;
  className?: string;
}) {
  const [shell] = useState(() => new Shell(scenario));
  const [lines, setLines] = useState<Line[]>(() => [{ id: 0, text: BANNER }]);
  const [input, setInput] = useState("");
  const [editor, setEditor] = useState<(EditorRequest & { draft: string }) | null>(null);
  const [, bump] = useState(0);
  const idRef = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const histPos = useRef<number | null>(null);
  const draft = useRef("");

  useImperativeHandle(ref, () => ({
    fill: (text) => {
      setInput(text);
      histPos.current = null;
      inputRef.current?.focus();
    },
    focus: () => inputRef.current?.focus(),
  }));

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, editor]);

  const push = (...add: Omit<Line, "id">[]) =>
    setLines((prev) => [...prev, ...add.map((l) => ({ ...l, id: idRef.current++ }))].slice(-MAX_LINES));

  const submit = () => {
    const line = input;
    const prompt = shell.prompt();
    setInput("");
    histPos.current = null;
    const res = shell.run(line);
    if (res.clear) {
      setLines([]);
    } else {
      push({ prompt, text: line }, ...(res.output ? [{ text: res.output.replace(/\n$/, "") }] : []));
    }
    if (res.editor) setEditor({ ...res.editor, draft: res.editor.content });
    bump((n) => n + 1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const c = shell.complete(input);
      if (c.line !== input) setInput(c.line);
      else if (c.options.length > 1) push({ prompt: shell.prompt(), text: input }, { text: c.options.join("  ") });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = shell.history;
      if (h.length === 0) return;
      if (histPos.current === null) {
        draft.current = input;
        histPos.current = h.length - 1;
      } else histPos.current = Math.max(0, histPos.current - 1);
      setInput(h[histPos.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = shell.history;
      if (histPos.current === null) return;
      if (histPos.current >= h.length - 1) {
        histPos.current = null;
        setInput(draft.current);
      } else {
        histPos.current += 1;
        setInput(h[histPos.current]);
      }
    } else if (e.ctrlKey && (e.key === "c" || e.key === "C") && !window.getSelection()?.toString()) {
      e.preventDefault();
      push({ prompt: shell.prompt(), text: input + "^C" });
      setInput("");
      histPos.current = null;
    } else if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
      e.preventDefault();
      setLines([]);
    }
  };

  const closeEditor = (save: boolean) => {
    if (!editor) return;
    if (save && !editor.readOnly) {
      const err = shell.saveFile(editor.path, editor.draft, editor.asRoot);
      const n = editor.draft === "" ? 0 : editor.draft.replace(/\n$/, "").split("\n").length;
      push({ text: err ?? `[ Scritte ${n} righe in ${editor.display} ]` });
    } else push({ text: save ? "[ File in sola lettura: non salvato ]" : "[ Uscito senza salvare ]" });
    setEditor(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div
      className={`relative flex min-h-0 flex-col bg-deep font-mono text-sm leading-relaxed text-deep-fg ${className}`}
      onClick={() => {
        if (!editor && !window.getSelection()?.toString()) inputRef.current?.focus();
      }}
    >
      <div ref={scrollRef} role="log" aria-label="Terminale Linux simulato" className="min-h-0 flex-1 overflow-y-auto p-3">
        {lines.map((l) => (
          <div key={l.id} className="whitespace-pre-wrap break-words">
            {l.prompt !== undefined && <PromptText prompt={l.prompt} />}
            {l.text}
          </div>
        ))}
        <label className="flex items-baseline">
          <PromptText prompt={shell.prompt()} />
          <span className="sr-only">Riga di comando</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={editor !== null}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent font-mono text-deep-fg caret-current outline-none focus:outline-none focus-visible:outline-none"
          />
        </label>
      </div>

      {editor && (
        <div className="absolute inset-0 z-10 flex flex-col bg-deep">
          <div className="flex items-center justify-between gap-3 border-b border-deep-fg/30 px-3 py-1.5 text-xs">
            <span>
              nano (semplificato) — {editor.display}
              {editor.isNew ? " [nuovo file]" : ""}
              {editor.readOnly ? " [sola lettura]" : ""}
            </span>
            <span className="flex gap-2">
              <button type="button" onClick={() => closeEditor(true)} className="rounded border border-deep-fg/50 px-2 py-0.5 hover:bg-deep-fg/10">
                Salva ed esci (Ctrl+S)
              </button>
              <button type="button" onClick={() => closeEditor(false)} className="rounded border border-deep-fg/50 px-2 py-0.5 hover:bg-deep-fg/10">
                Esci senza salvare (Ctrl+X)
              </button>
            </span>
          </div>
          <textarea
            autoFocus
            aria-label={`Contenuto di ${editor.display}`}
            value={editor.draft}
            readOnly={editor.readOnly}
            spellCheck={false}
            onChange={(e) => setEditor({ ...editor, draft: e.target.value })}
            onKeyDown={(e) => {
              if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
                e.preventDefault();
                closeEditor(true);
              } else if (e.ctrlKey && (e.key === "x" || e.key === "X")) {
                e.preventDefault();
                closeEditor(false);
              }
            }}
            className="min-h-0 flex-1 resize-none bg-transparent p-3 font-mono text-deep-fg outline-none"
          />
        </div>
      )}
    </div>
  );
}

function PromptText({ prompt }: { prompt: string }) {
  const m = /^(.*?@lab)(:.*?)(\$ )$/.exec(prompt);
  if (!m) return <span>{prompt}</span>;
  return (
    <span className="shrink-0 whitespace-pre">
      <span className="font-bold text-[#8fd6a8]">{m[1]}</span>
      <span>:</span>
      <span className="font-bold text-[#8fb4ee]">{m[2].slice(1)}</span>
      <span>{m[3]}</span>
    </span>
  );
}
