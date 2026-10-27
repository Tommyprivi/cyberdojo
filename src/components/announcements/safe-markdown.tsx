import type { ReactNode } from "react";
import { parseSafeMarkdown, type Inline } from "@/lib/community/markdown";

function renderInline(list: Inline[]): ReactNode[] {
  return list.map((n, i) => {
    switch (n.t) {
      case "bold":
        return <strong key={i}>{n.v}</strong>;
      case "italic":
        return <em key={i}>{n.v}</em>;
      case "code":
        return <code key={i}>{n.v}</code>;
      case "link":
        return (
          <a key={i} href={n.href} target="_blank" rel="noopener noreferrer nofollow" className="font-semibold text-primary underline">
            {n.v}
          </a>
        );
      default:
        return n.v;
    }
  });
}

/** Mostra testo semplice o Markdown limitato come elementi React (mai HTML grezzo, mai MDX). */
export function SafeMarkdown({ source }: { source: string }) {
  return (
    <div className="legal-body">
      {parseSafeMarkdown(source).map((b, i) => {
        if (b.type === "h") return b.level === 2 ? <h2 key={i}>{renderInline(b.inline)}</h2> : <h3 key={i}>{renderInline(b.inline)}</h3>;
        if (b.type === "ul")
          return (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{renderInline(it)}</li>
              ))}
            </ul>
          );
        return <p key={i}>{renderInline(b.inline)}</p>;
      })}
    </div>
  );
}
