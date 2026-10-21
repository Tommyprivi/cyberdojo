"use client";

import { useRef, type KeyboardEvent } from "react";

const INDENT = "    ";

/**
 * Editor di codice semplice: una textarea (accessibile, funziona con lettori di schermo e tastiera)
 * con numeri di riga. Tab inserisce 4 spazi; Esc e poi Tab per uscire dall'editor con la tastiera.
 * Invio mantiene il rientro (e lo aumenta dopo i due punti). Ctrl+Invio esegue.
 */
export function CodeEditor({
  value,
  onChange,
  onRun,
  readOnly = false,
  label,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  onRun?: () => void;
  readOnly?: boolean;
  label: string;
  className?: string;
}) {
  const gutter = useRef<HTMLDivElement>(null);
  const escaped = useRef(false);
  const lines = value.split("\n").length;

  function replaceSelection(el: HTMLTextAreaElement, text: string) {
    el.setRangeText(text, el.selectionStart, el.selectionEnd, "end");
    onChange(el.value);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    if (e.key === "Escape") {
      escaped.current = true;
      return;
    }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onRun?.();
      return;
    }
    if (readOnly) return;
    if (e.key === "Tab" && !e.shiftKey) {
      if (escaped.current) return; // lascia uscire il focus
      e.preventDefault();
      replaceSelection(el, INDENT);
      return;
    }
    escaped.current = false;
    if (e.key === "Enter" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      const before = el.value.slice(0, el.selectionStart);
      const currentLine = before.slice(before.lastIndexOf("\n") + 1);
      let indent = /^ */.exec(currentLine)?.[0] ?? "";
      if (/:\s*$/.test(currentLine)) indent += INDENT;
      replaceSelection(el, "\n" + indent);
    }
  }

  return (
    <div className={`flex min-h-0 overflow-hidden bg-surface font-mono text-sm leading-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-focus ${className}`}>
      <div
        ref={gutter}
        aria-hidden
        className="w-11 shrink-0 select-none overflow-hidden border-r border-border bg-surface-muted py-3 pr-2 text-right text-muted"
      >
        {Array.from({ length: lines }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => (escaped.current = false)}
        onScroll={(e) => {
          if (gutter.current) gutter.current.scrollTop = e.currentTarget.scrollTop;
        }}
        aria-label={label}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        wrap="off"
        className="min-w-0 flex-1 resize-none overflow-auto bg-transparent px-3 py-3 font-mono text-sm leading-6 text-foreground outline-none"
      />
    </div>
  );
}
