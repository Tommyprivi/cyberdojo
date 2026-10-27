"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CALL_GONE_TEXT, CHAT_MAX_CHARS, STATUS_TEXT } from "@/lib/social/call-client";
import { useCall } from "./use-call";

/** Mostra uno stream in un <video>. Se il browser blocca l'audio automatico, chiede un tocco. */
function StreamVideo({ stream, muted, mirror, label, onBlocked }: { stream: MediaStream | null; muted?: boolean; mirror?: boolean; label: string; onBlocked?: (blocked: boolean) => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.srcObject = stream;
    if (stream) el.play().then(() => onBlocked?.(false), () => onBlocked?.(true));
  }, [stream, onBlocked]);
  return <video ref={ref} aria-label={label} autoPlay playsInline muted={muted} className={`h-full w-full object-cover ${mirror ? "-scale-x-100" : ""}`} />;
}

function CtrlButton({ label, onClick, pressed, danger, hidden, children }: { label: string; onClick: () => void; pressed?: boolean; danger?: boolean; hidden?: boolean; children: React.ReactNode }) {
  if (hidden) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={`grid min-h-14 min-w-14 place-items-center rounded-full border-2 px-3 text-xl font-bold ${
        danger ? "border-accent bg-accent text-accent-fg" : pressed === false ? "border-border bg-surface-muted text-muted" : "border-border bg-surface text-foreground"
      } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus`}
    >
      <span aria-hidden>{children}</span>
      <span className="sr-only">{label}</span>
    </button>
  );
}

export function CallRoom({ friendshipId, friendName, fallbackUrl }: { friendshipId: string; friendName: string | null; fallbackUrl: string }) {
  const router = useRouter();
  const { snap, toggleMic, toggleCamera, switchCamera, hangUp, sendChat } = useCall(friendshipId);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLOListElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const friend = friendName ?? "il tuo amico";
  const canFullscreen = typeof document !== "undefined" && document.fullscreenEnabled === true;

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement !== null);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [snap.chat.length]);

  async function leave() {
    if (document.fullscreenElement) await document.exitFullscreen().catch(() => undefined);
    await hangUp();
    router.push("/social");
  }
  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stageRef.current?.requestFullscreen?.().catch(() => undefined);
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    const err = sendChat(draft);
    setChatError(err);
    if (!err) setDraft("");
  }

  // ---- errori gravi: la chiamata non parte ----
  if (snap.fatalError) {
    const gone = snap.fatalError === CALL_GONE_TEXT;
    return (
      <div role="alert" className="grid gap-3 rounded-lg border-2 border-accent bg-surface p-4">
        <p className="text-lg font-bold">{gone ? "Chiamata chiusa" : "Non posso avviare la chiamata"}</p>
        <p>{snap.fatalError}</p>
        <div className="flex flex-wrap gap-3">
          {!gone && (
            <button type="button" className="btn btn-primary min-h-12" onClick={() => window.location.reload()}>
              Ricarica la pagina
            </button>
          )}
          <Link href="/social" className="btn btn-ghost min-h-12">
            Torna agli amici
          </Link>
        </div>
        {!gone && <FallbackLink url={fallbackUrl} />}
      </div>
    );
  }

  const status = snap.status;
  const connectedLike = status === "connected" || status === "weak";
  const chatReady = connectedLike;

  return (
    <div className="grid gap-4">
      <div ref={stageRef} className="grid gap-3 bg-background">
        <p role="status" aria-live="polite" className={`rounded-lg px-3 py-2 text-center font-semibold ${status === "connected" ? "bg-success text-success-fg" : status === "failed" ? "bg-accent text-accent-fg" : "bg-surface-muted"}`}>
          {snap.phase === "starting" ? "Preparo microfono e fotocamera…" : STATUS_TEXT[status]}
        </p>

        <div className="relative mx-auto aspect-[3/4] max-h-[70vh] w-full overflow-hidden rounded-lg bg-black sm:aspect-video" ref={remoteVideoRef}>
          <StreamVideo stream={snap.remoteStream} label={`Video di ${friend}`} onBlocked={setAudioBlocked} />
          {(!connectedLike || !snap.remoteCamOn) && (
            <div className="absolute inset-0 grid place-items-center bg-black/80 p-4 text-center text-white">
              <p className="text-lg font-semibold">{connectedLike ? `${friend} ha la fotocamera spenta` : STATUS_TEXT[status]}</p>
            </div>
          )}
          {connectedLike && !snap.remoteMicOn && <p className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-sm text-white">Microfono spento</p>}
          {audioBlocked && (
            <button type="button" className="btn btn-primary absolute inset-x-4 bottom-4 min-h-14" onClick={() => void remoteVideoRef.current?.querySelector("video")?.play().then(() => setAudioBlocked(false), () => undefined)}>
              Tocca per attivare l&apos;audio
            </button>
          )}
          <div className="absolute bottom-2 right-2 h-28 w-20 overflow-hidden rounded-lg border-2 border-white/70 bg-black sm:h-36 sm:w-28">
            {snap.camOn ? (
              <StreamVideo stream={snap.localStream} muted mirror={snap.facing === "user"} label="Il tuo video" />
            ) : (
              <p className="grid h-full place-items-center p-1 text-center text-xs text-white">Fotocamera spenta</p>
            )}
          </div>
        </div>

        <div role="group" aria-label="Controlli della chiamata" className="flex flex-wrap items-center justify-center gap-3">
          <CtrlButton label={snap.micOn ? "Spegni il microfono" : "Accendi il microfono"} pressed={snap.micOn} onClick={toggleMic}>
            {snap.micOn ? "🎤" : "🔇"}
          </CtrlButton>
          <CtrlButton label={snap.camOn ? "Spegni la fotocamera" : "Accendi la fotocamera"} pressed={snap.camOn} onClick={toggleCamera}>
            {snap.camOn ? "📹" : "🚫"}
          </CtrlButton>
          <CtrlButton label="Cambia fotocamera (davanti o dietro)" hidden={!snap.camOn || !snap.canSwitchCamera} onClick={switchCamera}>
            🔄
          </CtrlButton>
          <CtrlButton label={fullscreen ? "Esci dallo schermo intero" : "Schermo intero"} hidden={!canFullscreen} onClick={toggleFullscreen}>
            ⛶
          </CtrlButton>
          <CtrlButton label="Riaggancia" danger onClick={() => void leave()}>
            📞
          </CtrlButton>
        </div>
        {snap.notice && (
          <p role="alert" className="rounded-lg border border-border bg-surface p-3 text-sm">
            {snap.notice}
          </p>
        )}
      </div>

      {status === "failed" && (
        <div role="alert" className="grid gap-2 rounded-lg border-2 border-accent bg-surface p-4">
          <p className="font-semibold">Non riesco a collegarmi.</p>
          <p className="text-sm">Controlla il Wi-Fi o la rete del telefono (a volte aiuta passare dall&apos;uno all&apos;altro), poi ricarica la pagina. Anche il tuo amico deve avere la pagina aperta.</p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary min-h-12" onClick={() => window.location.reload()}>
              Ricarica la pagina
            </button>
          </div>
          <FallbackLink url={fallbackUrl} />
        </div>
      )}

      <section aria-labelledby="chat-titolo" className="grid gap-2 rounded-lg border border-border bg-surface p-3">
        <h2 id="chat-titolo" className="font-semibold">
          Chat della chiamata
        </h2>
        <p className="text-xs text-muted">I messaggi vanno direttamente a {friend}, non passano dai server di CyberDojo e spariscono quando chiudete.</p>
        <ol ref={logRef} role="log" aria-live="polite" aria-label="Messaggi" className="grid max-h-56 gap-1.5 overflow-y-auto">
          {snap.chat.length === 0 && <li className="text-sm text-muted">Nessun messaggio.</li>}
          {snap.chat.map((m) => (
            <li key={m.id} className={`max-w-[85%] whitespace-pre-wrap break-words rounded-lg px-3 py-1.5 text-sm ${m.mine ? "justify-self-end bg-primary text-primary-fg" : "justify-self-start bg-surface-muted"}`}>
              <span className="sr-only">{m.mine ? "Tu: " : `${friend}: `}</span>
              {m.text}
            </li>
          ))}
        </ol>
        <form onSubmit={submit} className="flex gap-2">
          <label htmlFor="chat-testo" className="sr-only">
            Scrivi un messaggio
          </label>
          <input
            id="chat-testo"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={CHAT_MAX_CHARS}
            autoComplete="off"
            disabled={!chatReady}
            placeholder={chatReady ? "Scrivi un messaggio" : "Si apre quando siete collegati"}
            className="min-h-12 min-w-0 flex-1 rounded-lg border border-border bg-background px-3"
          />
          <button type="submit" className="btn btn-primary min-h-12" disabled={!chatReady || draft.trim() === ""}>
            Invia
          </button>
        </form>
        {chatError && (
          <p role="alert" className="text-sm font-semibold text-accent">
            {chatError}
          </p>
        )}
      </section>
    </div>
  );
}

/** Ripiego: la stanza Jitsi di prima, in una nuova scheda. Passa da un servizio esterno. */
function FallbackLink({ url }: { url: string }) {
  return (
    <div className="grid gap-1 border-t border-border pt-2">
      <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost min-h-12 w-fit">
        Apri la chiamata di riserva
      </a>
      <p className="text-xs text-muted">Si apre in una nuova scheda sul servizio Jitsi Meet, che non è di CyberDojo. Non condividere dati personali.</p>
    </div>
  );
}
