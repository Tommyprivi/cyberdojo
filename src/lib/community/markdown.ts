/**
 * Markdown limitato per gli annunci scritti dallo staff nel database: paragrafi, titoletti (##, ###), elenchi con «-»,
 * **grassetto**, _corsivo_, `codice` e link http(s). Niente MDX, niente HTML: il risultato sono dati semplici che il
 * componente trasforma in elementi React (mai dangerouslySetInnerHTML), quindi ogni cosa non riconosciuta resta testo.
 */

export type Inline =
  | { t: "text"; v: string }
  | { t: "bold"; v: string }
  | { t: "italic"; v: string }
  | { t: "code"; v: string }
  | { t: "link"; v: string; href: string };

export type Block = { type: "p"; inline: Inline[] } | { type: "h"; level: 2 | 3; inline: Inline[] } | { type: "ul"; items: Inline[][] };

const TOKEN = /\*\*([^*]+)\*\*|_([^_]+)_|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of src.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ t: "text", v: src.slice(last, at) });
    if (m[1] !== undefined) out.push({ t: "bold", v: m[1] });
    else if (m[2] !== undefined) out.push({ t: "italic", v: m[2] });
    else if (m[3] !== undefined) out.push({ t: "code", v: m[3] });
    else out.push({ t: "link", v: m[4], href: m[5] });
    last = at + m[0].length;
  }
  if (last < src.length) out.push({ t: "text", v: src.slice(last) });
  return out;
}

export function parseSafeMarkdown(source: string): Block[] {
  const blocks: Block[] = [];
  for (const chunk of source.replace(/\r\n/g, "\n").split(/\n{2,}/)) {
    const lines = chunk.split("\n").filter((l) => l.trim() !== "");
    if (lines.length === 0) continue;
    const head = /^(#{2,3})\s+(.+)$/.exec(lines[0]);
    if (head && lines.length === 1) {
      blocks.push({ type: "h", level: head[1].length === 2 ? 2 : 3, inline: parseInline(head[2].trim()) });
    } else if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      blocks.push({ type: "ul", items: lines.map((l) => parseInline(l.replace(/^\s*[-*]\s+/, "").trim())) });
    } else {
      blocks.push({ type: "p", inline: parseInline(lines.map((l) => l.trim()).join(" ")) });
    }
  }
  return blocks;
}
