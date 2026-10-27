"use client";

import { useState } from "react";
import { createStudyGroup, deleteStudyGroup, joinStudyGroup, leaveStudyGroup, renewStudyGroupCode } from "@/app/actions/social";
import { BoltIcon, BookIcon } from "../icons";
import { GROUP_KINDS, GROUP_THEMES } from "@/lib/social/group-names";
import { MAX_GROUP_SIZE, MAX_OWNED_GROUPS, canCreateGroup } from "@/lib/social/rules";
import type { GroupView, SocialSettings } from "@/lib/social/service";
import { Avatar } from "./avatar";
import { CodeBox } from "./code-box";
import { ReportButton } from "./report-button";
import { ShareProgressToggle } from "./share-progress-toggle";
import { TeamsCompare } from "./teams-compare";
import { NoticeLine, useAction } from "./use-action";

function GroupCard({ g }: { g: GroupView }) {
  const { busy, notice, run } = useAction();
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <article className="grid gap-3 rounded-lg border border-border bg-surface p-4">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h3 className="font-display text-xl font-bold">{g.name}</h3>
        <span className="rounded-md bg-deep px-2 py-0.5 font-mono text-[0.6875rem] font-bold uppercase tracking-wider text-deep-fg">{g.audience === "minori" ? "per 14-17 anni" : "per adulti"}</span>
        <span className="font-mono text-xs text-muted">
          {g.members}/{MAX_GROUP_SIZE} persone
        </span>
      </header>
      <p className="rounded-md border border-border bg-background px-3 py-2 text-xs">
        <strong>Visibile ai membri:</strong> tutti nel gruppo vedono soprannome, avatar e XP della settimana degli altri. Nessun messaggio, nessuna chat.
        {g.audience === "minori" && " Il creatore è un adulto responsabile del gruppo."}
      </p>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <span className="inline-flex items-center gap-1.5">
          <BookIcon width={16} height={16} /> Lezioni completate dal gruppo: <strong>{g.totalLessons}</strong>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <BoltIcon width={16} height={16} /> XP del gruppo questa settimana: <strong>{g.totalXpWeek}</strong>
        </span>
      </div>
      <ol className="grid gap-1" aria-label={`Classifica interna di ${g.name}`}>
        {g.list.map((m, i) => (
          <li key={m.ref} className={`flex flex-wrap items-center gap-3 rounded-md px-2 py-1 ${m.isMe ? "bg-surface-muted font-bold" : ""}`}>
            <span className="w-6 text-center font-mono text-sm text-muted">{i + 1}</span>
            <Avatar id={m.avatar} size={36} />
            <span className="min-w-0 flex-1 truncate">
              {m.nickname}
              {m.isMe && <span className="ml-1 text-sm font-semibold text-muted">(tu)</span>}
              {m.isOwner && <span className="ml-1 text-xs font-semibold text-muted">· creatore</span>}
            </span>
            <span className="font-mono text-sm font-bold">{m.xp} XP</span>
            {!m.isMe && <ReportButton kind="user" targetId={m.ref} what={`il soprannome ${m.nickname}`} />}
          </li>
        ))}
      </ol>

      {!g.isOwner && <ShareProgressToggle groupId={g.id} />}

      {g.isOwner && g.code && (
        <div className="grid gap-2 rounded-md border border-border bg-background p-3">
          <p className="text-sm font-semibold">Codice del gruppo (daglielo tu, fuori dal sito)</p>
          <CodeBox code={g.code} label="Codice del gruppo" />
          <button type="button" disabled={busy} className="btn btn-ghost w-fit" onClick={() => run(() => renewStudyGroupCode(g.id), "Nuovo codice: il vecchio non funziona più.")}>
            Rinnova il codice
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {g.isOwner ? (
          confirmDelete ? (
            <>
              <span className="text-sm font-semibold">Eliminare il gruppo per tutti?</span>
              <button type="button" disabled={busy} className="btn btn-primary" onClick={() => run(() => deleteStudyGroup(g.id))}>
                Sì, elimina
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setConfirmDelete(false)}>
                Annulla
              </button>
            </>
          ) : (
            <button type="button" className="btn btn-ghost text-accent" onClick={() => setConfirmDelete(true)}>
              Elimina gruppo
            </button>
          )
        ) : (
          <>
            <button type="button" disabled={busy} className="btn btn-ghost" onClick={() => run(() => leaveStudyGroup(g.id))}>
              Esci dal gruppo
            </button>
            <ReportButton kind="group" targetId={g.id} what={`il gruppo ${g.name}`} />
          </>
        )}
      </div>
      <NoticeLine notice={notice} />
    </article>
  );
}

export function GroupsPanel({ settings, groups }: { settings: SocialSettings; groups: GroupView[] }) {
  const { busy, notice, run } = useAction();
  const [code, setCode] = useState("");
  const [kind, setKind] = useState<string>(GROUP_KINDS[0]);
  const [theme, setTheme] = useState<string>(GROUP_THEMES[0]);
  const [num, setNum] = useState(1);
  const [audience, setAudience] = useState<"minori" | "adulti">("minori");
  const [created, setCreated] = useState<string | null>(null);
  const adult = canCreateGroup(settings.ageGroup);
  // Un adulto può creare un gruppo per ragazzi (classe, ad esempio) o per adulti; un ragazzo non crea.
  const owned = groups.filter((g) => g.isOwner).length;

  return (
    <div className="grid gap-4 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <section aria-label="I tuoi gruppi" className="grid content-start gap-3 lg:min-h-0 lg:overflow-y-auto">
        {groups.length === 0 && (
          <p className="rounded-lg border border-border bg-surface p-4 text-sm">
            Non sei in nessun gruppo. I gruppi servono a studiare insieme (una classe, una squadra): si entra solo con un codice che ti dà chi lo ha creato.
          </p>
        )}
        <TeamsCompare groups={groups} />
        {groups.map((g) => (
          <GroupCard key={g.id} g={g} />
        ))}
      </section>

      <aside className="grid content-start gap-4 lg:min-h-0 lg:overflow-y-auto">
        <section className="grid gap-3 rounded-lg border border-border bg-surface p-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted">Entra con un codice</h2>
          <form
            className="grid gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              const r = await run(() => joinStudyGroup(code), "Sei entrato nel gruppo.");
              if (r.ok) setCode("");
            }}
          >
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold">Codice del gruppo</span>
              <input
                className="field font-mono uppercase tracking-widest"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="XXXX-XXXX"
                maxLength={12}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
              />
            </label>
            <p className="rounded-md border border-border bg-background p-2.5 text-xs">
              Entrando, i membri del gruppo vedranno il tuo soprannome «{settings.nickname}», il tuo avatar e i tuoi XP della settimana. Puoi uscire quando vuoi.
            </p>
            <button type="submit" disabled={busy || code.trim().length < 8} className="btn btn-primary">
              Entra nel gruppo
            </button>
          </form>
        </section>

        {adult ? (
          <section className="grid gap-3 rounded-lg border border-border bg-surface p-4">
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted">Crea un gruppo</h2>
            <form
              className="grid gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                const r = await run(() => createStudyGroup({ kind, theme, num, audience }), "Gruppo creato.");
                if (r.ok && "code" in r) setCreated(r.code);
              }}
            >
              <div className="grid grid-cols-[1fr_1fr_5rem] gap-2">
                <label className="grid gap-1">
                  <span className="text-xs font-semibold">Tipo</span>
                  <select className="field" value={kind} onChange={(e) => setKind(e.target.value)}>
                    {GROUP_KINDS.map((k) => (
                      <option key={k}>{k}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1">
                  <span className="text-xs font-semibold">Tema</span>
                  <select className="field" value={theme} onChange={(e) => setTheme(e.target.value)}>
                    {GROUP_THEMES.map((k) => (
                      <option key={k}>{k}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1">
                  <span className="text-xs font-semibold">N.</span>
                  <input className="field" type="number" min={1} max={99} value={num} onChange={(e) => setNum(Math.max(1, Math.min(99, Number(e.target.value) || 1)))} />
                </label>
              </div>
              <p className="text-xs text-muted">Il nome si sceglie dagli elenchi (nessun testo libero): «{kind} {theme} {num}».</p>
              <fieldset className="grid gap-1">
                <legend className="text-sm font-semibold">A chi è aperto</legend>
                <label className="flex min-h-11 items-center gap-2 text-sm">
                  <input type="radio" className="size-5 accent-[var(--primary)]" checked={audience === "minori"} onChange={() => setAudience("minori")} />
                  Ragazzi di 14-17 anni (tu sei l&apos;adulto responsabile)
                </label>
                <label className="flex min-h-11 items-center gap-2 text-sm">
                  <input type="radio" className="size-5 accent-[var(--primary)]" checked={audience === "adulti"} onChange={() => setAudience("adulti")} />
                  Adulti, 18 anni e più
                </label>
              </fieldset>
              <p className="rounded-md border border-border bg-background p-2.5 text-xs">
                Il gruppo è visibile ai membri: vedranno soprannome, avatar e XP della settimana di tutti. Non ci sono messaggi. Puoi creare fino a {MAX_OWNED_GROUPS} gruppi, di {MAX_GROUP_SIZE} persone al massimo.
              </p>
              <button type="submit" disabled={busy || owned >= MAX_OWNED_GROUPS} className="btn btn-primary">
                Crea il gruppo
              </button>
              {created && <p className="text-sm font-semibold text-success">Gruppo creato. Il suo codice è nella scheda del gruppo: daglielo tu.</p>}
            </form>
          </section>
        ) : (
          <p className="rounded-lg border border-border bg-surface p-4 text-sm">
            I gruppi per ragazzi li crea un adulto responsabile (un insegnante, un genitore). Tu puoi entrare con il codice che ti dà.
          </p>
        )}
        <NoticeLine notice={notice} />
      </aside>
    </div>
  );
}
