/** Legge docs/lavori-da-fare.md: titoli (##) e voci con etichetta [fatto] [in corso] [da fare] [tuo]. */
export const TODO_LABELS = ["fatto", "in corso", "da fare", "tuo"] as const;
export type TodoLabel = (typeof TODO_LABELS)[number];

export type TodoItem = { label: TodoLabel | null; text: string };
export type TodoGroup = { title: string; items: TodoItem[] };

export function parseTodo(md: string): { intro: string; groups: TodoGroup[] } {
  const groups: TodoGroup[] = [];
  const intro: string[] = [];
  let cur: TodoGroup | null = null;
  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trim();
    const h = /^#{2,3}\s+(.+)$/.exec(line);
    if (h) {
      cur = { title: h[1].trim(), items: [] };
      groups.push(cur);
      continue;
    }
    const li = /^[-*]\s+(.*)$/.exec(line);
    if (li && cur) {
      let text = li[1];
      let label: TodoLabel | null = null;
      const m = /^\[(x| |fatto|in corso|da fare|tuo)\]\s*/i.exec(text);
      if (m) {
        const k = m[1].toLowerCase();
        label = k === "x" ? "fatto" : k === " " ? "da fare" : (k as TodoLabel);
        text = text.slice(m[0].length);
      }
      cur.items.push({ label, text: text.replace(/\*\*/g, "").trim() });
    } else if (line && !cur && !line.startsWith("#")) intro.push(line.replace(/\*\*/g, ""));
  }
  return { intro: intro.join(" "), groups: groups.filter((g) => g.items.length) };
}
