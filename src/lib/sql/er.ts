import type { SchemaInfo } from "./schema";

export type ErBox = { name: string; x: number; y: number; w: number; h: number; rows: { text: string; pk: boolean; fk: boolean }[] };
export type ErLink = { from: string; to: string; x1: number; y1: number; x2: number; y2: number; label: string };
export type ErLayout = { width: number; height: number; boxes: ErBox[]; links: ErLink[] };

const HEADER = 28;
const ROW = 19;
const GAP_X = 70;
const GAP_Y = 44;
const PAD = 16;
const CHAR = 7.2;

/**
 * Disposizione del diagramma ER. Se una tabella (i «fatti») ha tre o più relazioni in uscita, va al centro
 * con le altre attorno (schema a stella); altrimenti le tabelle vanno in griglia, vicine a quelle collegate.
 */
export function layoutEr(schema: SchemaInfo): ErLayout {
  const n = schema.tables.length;
  if (n === 0) return { width: 0, height: 0, boxes: [], links: [] };
  const outDeg = new Map(schema.tables.map((t) => [t.name, schema.relations.filter((r) => r.from === t.name).length]));
  const hub = [...schema.tables].sort((a, b) => outDeg.get(b.name)! - outDeg.get(a.name)!)[0];

  // posizione (colonna, riga) di ogni tabella
  const cell = new Map<string, [number, number]>();
  if (n >= 4 && outDeg.get(hub.name)! >= 3) {
    cell.set(hub.name, [1, 1]);
    const spokes: [number, number][] = [[1, 0], [1, 2], [0, 1], [2, 1], [0, 0], [2, 0], [0, 2], [2, 2]];
    schema.tables.filter((t) => t !== hub).slice(0, 8).forEach((t, i) => cell.set(t.name, spokes[i]));
  }
  const rest = schema.tables.filter((t) => !cell.has(t.name));
  if (rest.length) {
    const cols = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(n))));
    const baseRow = cell.size ? 3 : 0;
    // ordine: vicini tra loro (visita a partire dalla prima tabella)
    const order: string[] = [];
    const seen = new Set<string>();
    const visit = (name: string) => {
      if (seen.has(name)) return;
      seen.add(name);
      if (rest.some((t) => t.name === name)) order.push(name);
      for (const r of schema.relations) {
        if (r.from === name) visit(r.to);
        if (r.to === name) visit(r.from);
      }
    };
    for (const t of rest) visit(t.name);
    order.forEach((name, i) => cell.set(name, [i % cols, baseRow + Math.floor(i / cols)]));
  }

  const dims = new Map(
    schema.tables.map((t) => {
      const rows = t.columns.map((c) => ({
        text: `${c.name}  ${c.type}`,
        pk: c.pk,
        fk: Boolean(c.ref),
      }));
      const w = Math.max(150, Math.ceil(Math.max(t.name.length, ...rows.map((r) => r.text.length + 5)) * CHAR) + 24);
      return [t.name, { rows, w, h: HEADER + rows.length * ROW + 8 }] as const;
    }),
  );

  const maxCol = Math.max(...[...cell.values()].map((c) => c[0]));
  const maxRow = Math.max(...[...cell.values()].map((c) => c[1]));
  const colW = Array.from({ length: maxCol + 1 }, () => 0);
  const rowH = Array.from({ length: maxRow + 1 }, () => 0);
  for (const [name, [c, r]] of cell) {
    colW[c] = Math.max(colW[c], dims.get(name)!.w);
    rowH[r] = Math.max(rowH[r], dims.get(name)!.h);
  }
  const colX = colW.map((_, i) => PAD + colW.slice(0, i).reduce((a, b) => a + b + GAP_X, 0));
  const rowY = rowH.map((_, i) => PAD + rowH.slice(0, i).reduce((a, b) => a + b + GAP_Y, 0));

  const boxes: ErBox[] = schema.tables.map((t) => {
    const d = dims.get(t.name)!;
    const [c, r] = cell.get(t.name)!;
    return { name: t.name, x: colX[c] + (colW[c] - d.w) / 2, y: rowY[r] + (rowH[r] - d.h) / 2, w: d.w, h: d.h, rows: d.rows };
  });
  const byName = new Map(boxes.map((b) => [b.name, b]));

  const links: ErLink[] = [];
  for (const rel of schema.relations) {
    const a = byName.get(rel.from);
    const b = byName.get(rel.to);
    if (!a || !b) continue;
    const ac = { x: a.x + a.w / 2, y: a.y + a.h / 2 };
    const bc = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
    const dx = bc.x - ac.x;
    const dy = bc.y - ac.y;
    let x1: number, y1: number, x2: number, y2: number;
    if (Math.abs(dx) * (a.h + b.h) > Math.abs(dy) * (a.w + b.w)) {
      x1 = dx > 0 ? a.x + a.w : a.x;
      x2 = dx > 0 ? b.x : b.x + b.w;
      y1 = ac.y;
      y2 = bc.y;
    } else {
      y1 = dy > 0 ? a.y + a.h : a.y;
      y2 = dy > 0 ? b.y : b.y + b.h;
      x1 = ac.x;
      x2 = bc.x;
    }
    links.push({ from: rel.from, to: rel.to, x1, y1, x2, y2, label: `${rel.fromColumns.join(", ")} → ${rel.toColumns.join(", ")}` });
  }

  const width = colX[maxCol] + colW[maxCol] + PAD;
  const height = rowY[maxRow] + rowH[maxRow] + PAD;
  return { width, height, boxes, links };
}
