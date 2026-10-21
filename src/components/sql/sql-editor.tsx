"use client";

import { useMemo, useRef, type KeyboardEvent } from "react";
import { tokenizeSql, type SqlToken } from "@/lib/sql/highlight";

const COLORS: Record<SqlToken["type"], string> = {
  keyword: "font-bold text-primary",
  string: "text-success",
  number: "text-accent",
  comment: "italic text-muted",
  text: "",
};

/**
 * Editor SQL: una textarea vera (accessibile, con tastiera e lettori di schermo) sopra un livello che
 * colora parole chiave, testi, numeri e commenti. Ctrl+Invio esegue (o solo la selezione, se c'è).
 */
export function SqlEditor({
  value,
  onChange,
  onRun,
  label = "Query SQL",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  onRun: (selection: string | null) => void;
  label?: string;
  className?: string;
}) {
  const layer = useRef<HTMLPreElement>(null);
  const tokens = useMemo(() => tokenizeSql(value), [value]);

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const el = e.currentTarget;
      const sel = el.selectionStart !== el.selectionEnd ? el.value.slice(el.selectionStart, el.selectionEnd) : null;
      onRun(sel);
    }
  }

  const shared = "absolute left-0 top-0 m-0 whitespace-pre p-3 font-mono text-sm leading-6 [tab-size:2]";
  return (
    <div className={`relative min-h-0 overflow-hidden bg-surface ${className}`}>
      <pre
        ref={layer}
        aria-hidden
        className={`${shared} pointer-events-none`}
      >
        {tokens.map((t, i) => (
          <span key={i} className={COLORS[t.type]}>{t.text}</span>
        ))}
        {"\n"}
      </pre>
      <textarea
        aria-label={label}
        value={value}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        wrap="off"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onScroll={(e) => {
          if (layer.current) {
            layer.current.style.transform = `translate(${-e.currentTarget.scrollLeft}px, ${-e.currentTarget.scrollTop}px)`;
          }
        }}
        className={`${shared} size-full resize-none overflow-auto bg-transparent text-transparent caret-foreground outline-none selection:bg-primary/25 focus-visible:ring-2 focus-visible:ring-focus`}
      />
    </div>
  );
}
