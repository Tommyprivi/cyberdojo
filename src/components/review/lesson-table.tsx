"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { isReadyToPublish, type LessonRow } from "@/lib/content/reviews";

export type TableRow = LessonRow & { moduleCode: string; screens: number; questions: number; status: string; hasNote: boolean };

const STATES = [
  { id: "all", label: "Tutte" },
  { id: "todo", label: "Da approvare" },
  { id: "approved", label: "Approvate" },
  { id: "video", label: "Video da guardare" },
  { id: "novideo", label: "Senza video" },
  { id: "c8", label: "C8 da rivedere" },
  { id: "ready", label: "Pronte" },
] as const;

const match = (r: TableRow, s: string) =>
  s === "all" ||
  (s === "todo" && !r.approved) ||
  (s === "approved" && r.approved) ||
  (s === "video" && r.hasVideo && !r.videoReviewed) ||
  (s === "novideo" && !r.hasVideo) ||
  (s === "c8" && r.isAttack && !r.humanReviewed) ||
  (s === "ready" && isReadyToPublish(r));

const Mark = ({ ok, yes, no }: { ok: boolean; yes: string; no: string }) => (
  <span className={`font-semibold ${ok ? "text-success" : "text-accent"}`}>{ok ? `✓ ${yes}` : no}</span>
);

/** Tabella delle lezioni con filtri per modulo e stato e ricerca per titolo. */
export function LessonTable({ rows, modules }: { rows: TableRow[]; modules: { code: string; title: string }[] }) {
  const [mod, setMod] = useState("all");
  const [state, setState] = useState<string>("all");
  const [q, setQ] = useState("");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter(
      (r) =>
        (mod === "all" || r.moduleCode === mod) &&
        match(r, state) &&
        (!needle || r.title.toLowerCase().includes(needle) || r.id.toLowerCase().includes(needle)),
    );
  }, [rows, mod, state, q]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-[1fr_16rem_16rem]">
        <label className="grid gap-1 text-sm font-bold">
          Cerca per titolo
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="es. permesso, IP, firewall" className="field font-normal" />
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Modulo
          <select value={mod} onChange={(e) => setMod(e.target.value)} className="field font-normal">
            <option value="all">Tutti i moduli</option>
            {modules.map((m) => (
              <option key={m.code} value={m.code}>{m.code} · {m.title}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-bold">
          Stato
          <select value={state} onChange={(e) => setState(e.target.value)} className="field font-normal">
            {STATES.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>
      <p role="status" className="font-mono text-xs uppercase tracking-widest text-muted">
        {shown.length} di {rows.length} lezioni
      </p>

      {/* Telefono: schede. PC: tabella. */}
      <ul className="grid gap-3 lg:hidden">
        {shown.map((r) => (
          <li key={r.id} className="card grid gap-2 p-4">
            <p className="font-mono text-xs font-bold text-accent">{r.id}</p>
            <p className="font-display text-lg font-semibold">{r.title}</p>
            <p className="flex flex-wrap gap-x-4 text-sm">
              <Mark ok={r.approved} yes="approvata" no="da approvare" />
              {r.hasVideo ? <Mark ok={r.videoReviewed} yes="video guardato" no="video da guardare" /> : <span className="font-semibold text-accent">senza video</span>}
              {r.isAttack && <Mark ok={r.humanReviewed} yes="riletta" no="C8 da rivedere" />}
            </p>
            {isReadyToPublish(r) && <p className="text-sm font-bold text-success">Pronta per la pubblicazione</p>}
            <Link href={`/revisione/lezioni/${r.id}`} className="btn btn-primary w-fit">Leggi e approva</Link>
          </li>
        ))}
      </ul>

      <div className="card hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">Lezioni e stato di revisione</caption>
          <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="px-3 py-3">ID</th>
              <th scope="col" className="px-3 py-3">Titolo</th>
              <th scope="col" className="px-3 py-3">Schermate</th>
              <th scope="col" className="px-3 py-3">Approvazione</th>
              <th scope="col" className="px-3 py-3">Video</th>
              <th scope="col" className="px-3 py-3">C8</th>
              <th scope="col" className="px-3 py-3">Domande</th>
              <th scope="col" className="px-3 py-3"><span className="sr-only">Azioni</span></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className="border-b border-border align-top last:border-0">
                <td className="px-3 py-3 font-mono">{r.id}</td>
                <td className="px-3 py-3 font-semibold">
                  {r.title}
                  {r.hasNote && <span className="ml-2 chip min-h-6 px-2 text-xs">nota</span>}
                  {isReadyToPublish(r) && <span className="block text-xs font-bold text-success">Pronta per la pubblicazione</span>}
                </td>
                <td className="px-3 py-3">{r.screens}</td>
                <td className="px-3 py-3"><Mark ok={r.approved} yes="approvata" no="da approvare" /></td>
                <td className="px-3 py-3">
                  {r.hasVideo ? <Mark ok={r.videoReviewed} yes="guardato" no="da guardare" /> : <span className="font-semibold text-accent">manca</span>}
                </td>
                <td className="px-3 py-3">{r.isAttack ? <Mark ok={r.humanReviewed} yes="riletta" no="da rivedere" /> : <span className="text-muted">-</span>}</td>
                <td className="px-3 py-3">{r.questions || "-"}</td>
                <td className="px-3 py-3">
                  <Link href={`/revisione/lezioni/${r.id}`} className="font-bold text-primary underline">Leggi e approva</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="p-6 text-muted">Nessuna lezione con questi filtri.</p>}
      </div>
      {shown.length === 0 && <p className="text-muted lg:hidden">Nessuna lezione con questi filtri.</p>}
    </div>
  );
}
