"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSocialNickname } from "@/app/actions/social";
import { DEFAULT_AVATAR, type AvatarId } from "@/lib/social/avatars";
import { NICKNAME_MAX, NICKNAME_MIN } from "@/lib/social/nickname";
import { NICKNAME_COOLDOWN_DAYS } from "@/lib/social/rules";
import { Avatar, AvatarPicker } from "./avatar";

/** Soprannome e avatar: l'unico modo di farsi riconoscere. Mai il nome vero, mai una foto. */
export function NicknameForm({
  initialNickname,
  initialAvatar,
  lockedUntil,
}: {
  initialNickname: string | null;
  initialAvatar: AvatarId;
  lockedUntil: string | null;
}) {
  const router = useRouter();
  const [nickname, setNickname] = useState(initialNickname ?? "");
  const [avatar, setAvatar] = useState<AvatarId>(initialAvatar ?? DEFAULT_AVATAR);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const isNew = !initialNickname;
  const locked = lockedUntil ? new Date(lockedUntil) : null;
  const nicknameLocked = !!locked && nickname !== initialNickname;

  const save = async () => {
    setBusy(true);
    setMessage(null);
    const r = await saveSocialNickname({ nickname, avatar });
    setMessage(r.ok ? { kind: "ok", text: "Fatto: soprannome e avatar salvati." } : { kind: "error", text: r.error });
    setBusy(false);
    if (r.ok) router.refresh();
  };

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <div className="flex items-center gap-3">
        <Avatar id={avatar} size={56} />
        <label className="grid min-w-0 flex-1 gap-1.5">
          <span className="font-semibold">Soprannome</span>
          <input
            className="field w-full"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            minLength={NICKNAME_MIN}
            maxLength={NICKNAME_MAX}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="es. NinjaRiso"
            aria-describedby="nick-help"
          />
        </label>
      </div>
      <p id="nick-help" className="text-sm text-muted">
        Da {NICKNAME_MIN} a {NICKNAME_MAX} caratteri: lettere, numeri, - e _. Non usare il tuo nome, la tua email né dati personali. Si può cambiare una volta ogni {NICKNAME_COOLDOWN_DAYS} giorni.
      </p>
      <AvatarPicker value={avatar} onChange={setAvatar} />
      {nicknameLocked && (
        <p role="status" className="text-sm font-semibold text-accent">
          Potrai cambiare soprannome dal {locked.toLocaleDateString("it-IT")}. Intanto puoi cambiare l&apos;avatar.
        </p>
      )}
      <button type="submit" disabled={busy || nicknameLocked || nickname.trim().length < NICKNAME_MIN} className="btn btn-primary w-fit">
        {isNew ? "Crea il mio soprannome" : "Salva"}
      </button>
      {message && (
        <p role={message.kind === "error" ? "alert" : "status"} className={`font-semibold ${message.kind === "error" ? "text-accent" : "text-success"}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
