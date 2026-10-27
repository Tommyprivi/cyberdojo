"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createStaffAnnouncement, deleteStaffAnnouncement, pinStaffAnnouncement, updateStaffAnnouncement } from "@/app/actions/community";
import { ANNOUNCEMENT_TAGS, BODY_MAX, SUMMARY_MAX, TITLE_MAX } from "@/lib/community/validation";

export type EditableAnnouncement = { id: string; title: string; summary: string; body: string; tags: string[]; pinned: boolean; date: string };

const EMPTY = { title: "", summary: "", body: "", tags: [] as string[], pinned: false };

/** Pannello per lo staff: scrivi, modifica, fissa e cancella. Il server ricontrolla ogni volta che sei staff. */
export function StaffEditor({ items }: { items: EditableAnnouncement[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  async function run(fn: () => Promise<{ ok: boolean; error?: string }>, okText: string, after?: () => void) {
    if (busy) return;
    setBusy(true);
    setNotice(null);
    try {
      const r = await fn();
      if (r.ok) {
        setNotice({ kind: "ok", text: okText });
        after?.();
        router.refresh();
      } else setNotice({ kind: "error", text: r.error ?? "Qualcosa non ha funzionato." });
    } catch {
      setNotice({ kind: "error", text: "Connessione persa. Riprova." });
    } finally {
      setBusy(false);
    }
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, tags: form.tags };
    void run(() => (editing ? updateStaffAnnouncement(editing, payload) : createStaffAnnouncement(payload)), editing ? "Modifiche salvate." : "Annuncio pubblicato.", () => {
      setForm(EMPTY);
      setEditing(null);
    });
  };

  const toggleTag = (t: string) => setForm((f) => ({ ...f, tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t] }));

  return (
    <div className="grid gap-8">
      <form onSubmit={save} className="grid gap-3 rounded-2xl border-2 border-border bg-surface p-4">
        <h2 className="font-display text-xl font-bold">{editing ? "Modifica annuncio" : "Nuovo annuncio"}</h2>
        <label className="grid gap-1 text-sm font-semibold">
          Titolo
          <input className="min-h-11 rounded-md border-2 border-border bg-background px-3 font-normal" value={form.title} maxLength={TITLE_MAX} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Riassunto (facoltativo)
          <input className="min-h-11 rounded-md border-2 border-border bg-background px-3 font-normal" value={form.summary} maxLength={SUMMARY_MAX} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Testo
          <textarea className="min-h-48 rounded-md border-2 border-border bg-background p-3 font-normal" value={form.body} maxLength={BODY_MAX} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
          <span className="text-xs font-normal text-muted">
            {form.body.length}/{BODY_MAX}. Niente HTML né parentesi graffe.
          </span>
        </label>
        <fieldset className="flex flex-wrap gap-2">
          <legend className="mb-1 text-sm font-semibold">Etichette</legend>
          {ANNOUNCEMENT_TAGS.map((t) => (
            <button key={t} type="button" aria-pressed={form.tags.includes(t)} onClick={() => toggleTag(t)} className={`min-h-9 rounded-full border-2 px-3 text-sm font-bold ${form.tags.includes(t) ? "border-primary bg-primary/15" : "border-border"}`}>
              {t}
            </button>
          ))}
        </fieldset>
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} /> Fissa in alto
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={busy} className="btn btn-primary">
            {editing ? "Salva le modifiche" : "Pubblica"}
          </button>
          {editing ? (
            <button type="button" className="btn btn-ghost" onClick={() => { setEditing(null); setForm(EMPTY); }}>
              Annulla
            </button>
          ) : null}
        </div>
        {notice ? (
          <p role={notice.kind === "error" ? "alert" : "status"} className={`text-sm font-semibold ${notice.kind === "error" ? "text-accent" : "text-primary"}`}>
            {notice.text}
          </p>
        ) : null}
      </form>

      <section aria-label="Annunci scritti qui" className="grid gap-3">
        <h2 className="font-display text-xl font-bold">Annunci scritti da qui</h2>
        {items.length === 0 ? <p className="text-muted">Ancora nessuno.</p> : null}
        {items.map((a) => (
          <article key={a.id} className="grid gap-2 rounded-2xl border-2 border-border bg-surface p-4">
            <p className="font-bold">
              {a.pinned ? "📌 " : ""}
              {a.title} <span className="text-xs font-normal text-muted">{a.date}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => { setEditing(a.id); setForm({ title: a.title, summary: a.summary, body: a.body, tags: a.tags.filter((t) => (ANNOUNCEMENT_TAGS as readonly string[]).includes(t)), pinned: a.pinned }); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                Modifica
              </button>
              <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => run(() => pinStaffAnnouncement(a.id, !a.pinned), a.pinned ? "Staccato." : "Fissato in alto.")}>
                {a.pinned ? "Stacca" : "Fissa in alto"}
              </button>
              {confirmDelete === a.id ? (
                <>
                  <button type="button" className="btn btn-primary" disabled={busy} onClick={() => run(() => deleteStaffAnnouncement(a.id), "Annuncio cancellato.", () => setConfirmDelete(null))}>
                    Sì, cancella
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>
                    No
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-ghost text-accent" onClick={() => setConfirmDelete(a.id)}>
                  Cancella
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
