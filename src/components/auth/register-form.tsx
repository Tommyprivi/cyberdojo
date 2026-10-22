"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { recordLegalConsent } from "@/app/actions/legal";
import { saveProfile } from "@/app/actions/profile";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "./auth-card";
import { browserTimeZone, draftProblem, EMPTY_DRAFT, ProfileFields, type ProfileDraft } from "./profile-fields";

function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : "/percorso";
}

export function RegisterForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [draft, setDraft] = useState<ProfileDraft>(EMPTY_DRAFT);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!accepted) return setError("Per registrarti devi accettare i Termini e l'Informativa privacy.");
    const problem = draftProblem(draft);
    if (problem) return setError(problem);
    if (password.length < 10) return setError("La password è troppo corta: servono almeno 10 caratteri.");

    setBusy(true);
    const { error: signUpError } = await authClient.signUp.email({ name: name.trim(), email, password, callbackURL: "/profilo" });
    if (signUpError) {
      setError(authErrorMessage(signUpError));
      return setBusy(false);
    }
    // L'account esiste e la sessione è attiva: ora si salva il profilo. Se fallisse, /benvenuto lo fa completare.
    const saved = await saveProfile({ ...draft, timezone: browserTimeZone() });
    // L'accettazione dei documenti è un atto separato dal salvataggio del profilo: si registra dopo,
    // e un suo fallimento non deve bloccare l'iscrizione.
    await recordLegalConsent(["termini", "privacy"]);
    router.push(saved.ok ? next : `/benvenuto?next=${encodeURIComponent(next)}`);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <label className="grid gap-1.5">
        <span className="font-semibold">Come ti chiami</span>
        <input className="field" autoComplete="name" required minLength={2} maxLength={60} value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="grid gap-1.5">
        <span className="font-semibold">Email</span>
        <input className="field" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="grid gap-1.5">
        <span className="font-semibold">Password</span>
        <input className="field" type="password" autoComplete="new-password" required minLength={10} value={password} onChange={(e) => setPassword(e.target.value)} />
        <span className="text-sm text-muted">Almeno 10 caratteri. Una frase lunga vale più di una parola complicata.</span>
      </label>

      <ProfileFields value={draft} onChange={setDraft} />

      <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-2xl border-2 border-border bg-surface-muted p-3">
        <input
          type="checkbox"
          className="mt-1 size-5 accent-[var(--primary)]"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          required
        />
        <span>
          Ho letto e accetto i{" "}
          <Link href="/termini" className="font-bold text-primary underline" target="_blank">
            Termini e condizioni
          </Link>{" "}
          e l&apos;{" "}
          <Link href="/privacy" className="font-bold text-primary underline" target="_blank">
            Informativa privacy
          </Link>
          , e dichiaro di avere almeno 14 anni.
        </span>
      </label>

      {error && <p role="alert" className="font-semibold text-accent">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-primary">
        Crea il mio account
      </button>
      <p className="text-center">
        Hai già un account?{" "}
        <Link href={`/accedi?next=${encodeURIComponent(next)}`} className="font-bold text-primary underline">
          Accedi
        </Link>
      </p>
    </form>
  );
}
