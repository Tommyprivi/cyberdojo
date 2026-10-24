"use client";

import { useState } from "react";
import { addFriendByCode, answerFriendRequest, manageFriendCode, removeFriend, saveSocialToggles } from "@/app/actions/social";
import { BoltIcon, FlameIcon } from "../icons";
import { MAX_FRIENDS } from "@/lib/social/rules";
import type { FriendRow, SocialSettings } from "@/lib/social/service";
import { Avatar } from "./avatar";
import { CodeBox } from "./code-box";
import { ReportButton } from "./report-button";
import { NoticeLine, useAction } from "./use-action";

const BELT_LABEL = { white: "Cintura bianca", yellow: "Cintura gialla" } as const;

export function FriendsPanel({ settings, friends }: { settings: SocialSettings; friends: FriendRow[] }) {
  const { busy, notice, run } = useAction();
  const [code, setCode] = useState("");
  const toggles = { joinLeaderboard: settings.joinLeaderboard, showToFriends: settings.showToFriends, acceptRequests: settings.acceptRequests };
  const incoming = friends.filter((f) => f.status === "pending" && f.incoming);
  const outgoing = friends.filter((f) => f.status === "pending" && !f.incoming);
  const accepted = friends.filter((f) => f.status === "accepted");
  const name = (f: FriendRow) => f.nickname ?? "Utente nascosto";

  return (
    <div className="grid gap-4 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <section aria-label="I tuoi amici" className="grid content-start gap-3 rounded-lg border border-border bg-surface p-3 lg:min-h-0 lg:overflow-y-auto">
        <h2 className="px-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted">
          Amici · {accepted.length}/{MAX_FRIENDS}
        </h2>

        {incoming.length > 0 && (
          <div className="grid gap-2 rounded-md border-2 border-primary p-3">
            <p className="font-semibold">Richieste per te</p>
            {incoming.map((f) => (
              <div key={f.id} className="flex flex-wrap items-center gap-3">
                <Avatar id={f.avatar} size={40} />
                <span className="min-w-0 flex-1 truncate font-semibold">{name(f)}</span>
                <button type="button" disabled={busy} className="btn btn-primary" onClick={() => run(() => answerFriendRequest(f.id, true), "Richiesta accettata.")}>
                  Accetta
                </button>
                <button type="button" disabled={busy} className="btn btn-ghost" onClick={() => run(() => answerFriendRequest(f.id, false), "Richiesta rifiutata.")}>
                  Rifiuta
                </button>
                {f.nickname && <ReportButton kind="user" targetId={f.ref} what={`il soprannome ${f.nickname}`} />}
              </div>
            ))}
          </div>
        )}

        {accepted.length === 0 && incoming.length === 0 && (
          <p className="rounded-md border border-border bg-background p-3 text-sm">
            Non hai ancora amici. Dai il tuo codice a una persona che conosci, oppure inserisci il suo: serve che entrambi siate d&apos;accordo.
          </p>
        )}

        <ul className="grid gap-2">
          {accepted.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-background p-2.5">
              <Avatar id={f.avatar} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{name(f)}</p>
                {f.visible ? (
                  <p className="flex flex-wrap items-center gap-x-3 font-mono text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <FlameIcon width={13} height={13} /> serie {f.streak ?? 0}
                    </span>
                    <span>{f.belt ? BELT_LABEL[f.belt] : ""}</span>
                    <span className="inline-flex items-center gap-1">
                      <BoltIcon width={13} height={13} /> {f.xp ?? 0} XP questa settimana
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-muted">Questo amico ha nascosto il suo profilo.</p>
                )}
              </div>
              <button type="button" disabled={busy} className="btn btn-ghost" onClick={() => run(() => removeFriend(f.id), "Amico rimosso.")}>
                Rimuovi
              </button>
              {f.nickname && <ReportButton kind="user" targetId={f.ref} what={`il soprannome ${f.nickname}`} />}
            </li>
          ))}
        </ul>

        {outgoing.length > 0 && (
          <div className="grid gap-2">
            <p className="px-1 text-sm font-semibold text-muted">Richieste inviate, in attesa</p>
            {outgoing.map((f) => (
              <div key={f.id} className="flex flex-wrap items-center gap-3 rounded-md border border-dashed border-border p-2.5">
                <Avatar id={f.avatar} size={36} />
                <span className="min-w-0 flex-1 truncate">{name(f)}</span>
                <button type="button" disabled={busy} className="btn btn-ghost" onClick={() => run(() => removeFriend(f.id), "Richiesta ritirata.")}>
                  Ritira
                </button>
              </div>
            ))}
          </div>
        )}
        <NoticeLine notice={notice} />
      </section>

      <aside className="grid content-start gap-4 lg:min-h-0 lg:overflow-y-auto">
        <section className="grid gap-3 rounded-lg border border-border bg-surface p-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted">Il tuo codice invito</h2>
          {settings.acceptRequests && settings.friendCode ? (
            <>
              <CodeBox code={settings.friendCode} label="Il tuo codice invito" />
              <p className="text-sm text-muted">Dallo tu, di persona o con un messaggio tuo: chi lo inserisce ti manda una richiesta e decidi tu. Se lo rinnovi, il vecchio smette subito di funzionare.</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={busy} className="btn btn-ghost" onClick={() => run(() => manageFriendCode("renew"), "Nuovo codice generato.")}>
                  Rinnova
                </button>
                <button type="button" disabled={busy} className="btn btn-ghost" onClick={() => run(() => manageFriendCode("disable"), "Codice spento: nessuno può più usarlo.")}>
                  Spegni
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm">Il codice è spento: nessuno può mandarti richieste. Se lo accendi, gli amici vedranno il tuo soprannome, avatar, serie, cintura e XP della settimana.</p>
              <button
                type="button"
                disabled={busy}
                className="btn btn-primary w-fit"
                onClick={() => run(() => saveSocialToggles({ ...toggles, acceptRequests: true, showToFriends: true }), "Codice attivato.")}
              >
                Attiva il mio codice
              </button>
            </>
          )}
        </section>

        <section className="grid gap-3 rounded-lg border border-border bg-surface p-4">
          <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted">Aggiungi un amico</h2>
          {settings.showToFriends ? (
            <form
              className="grid gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                const r = await run(() => addFriendByCode(code), "Richiesta inviata: ora deve accettare.");
                if (r.ok) setCode("");
              }}
            >
              <label className="grid gap-1.5">
                <span className="text-sm font-semibold">Codice di un amico</span>
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
              <button type="submit" disabled={busy || code.trim().length < 8} className="btn btn-primary">
                Invia richiesta
              </button>
              <p className="text-xs text-muted">Puoi avere fino a {MAX_FRIENDS} amici. Si può essere amici solo con chi è nella tua stessa fascia d&apos;età.</p>
            </form>
          ) : (
            <>
              <p className="text-sm">Per mandare richieste devi mostrare il tuo soprannome agli amici.</p>
              <button type="button" disabled={busy} className="btn btn-primary w-fit" onClick={() => run(() => saveSocialToggles({ ...toggles, showToFriends: true }), "Ora i tuoi amici vedono il tuo soprannome.")}>
                Mostro il soprannome agli amici
              </button>
            </>
          )}
        </section>
      </aside>
    </div>
  );
}
