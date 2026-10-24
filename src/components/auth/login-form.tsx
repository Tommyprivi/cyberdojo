"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "./auth-card";
import { TwoFactorStep } from "./two-factor-step";

/** Solo percorsi interni: `?next=` non può portare su un altro sito. */
function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : "/percorso";
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  // Il link magico non apre la sessione a chi ha la verifica in due passaggi: tornano qui con un errore.
  const blockedBy2fa = ["failed_to_create_session", "unable_to_create_session"].includes(params.get("error") ?? "");
  const [mode, setMode] = useState<"password" | "link">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    blockedBy2fa
      ? "Se hai attivato la verifica in due passaggi, il link via email non basta: accedi con email e password e poi col codice dell'app."
      : null,
  );
  const [sent, setSent] = useState(false);
  const [needsCode, setNeedsCode] = useState(false);
  const errorCallbackURL = `/accedi?next=${encodeURIComponent(next)}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    if (mode === "password") {
      const { data, error } = await authClient.signIn.email({ email, password });
      if (error) setError(authErrorMessage(error));
      else if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
        setPassword("");
        setNeedsCode(true);
      } else {
        router.push(next);
        router.refresh();
      }
    } else {
      const { error } = await authClient.signIn.magicLink({ email, callbackURL: next, errorCallbackURL });
      if (error) setError(authErrorMessage(error));
      else setSent(true);
    }
    setBusy(false);
  };

  if (needsCode) {
    return (
      <TwoFactorStep
        next={next}
        onRestart={(message) => {
          setNeedsCode(false);
          setError(message || null);
        }}
      />
    );
  }

  if (sent) {
    return (
      <div role="status" className="grid gap-3 rounded-2xl bg-surface-muted p-4">
        <p className="text-lg font-extrabold">Controlla la posta.</p>
        <p>
          Se esiste un account per <strong>{email}</strong> (o se ne crea uno nuovo), ti abbiamo mandato un link che vale
          pochi minuti e una volta sola.
        </p>
        <button type="button" className="btn btn-ghost w-fit" onClick={() => setSent(false)}>
          Cambia email
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">

      <div role="tablist" aria-label="Come vuoi accedere" className="grid grid-cols-2 gap-2">
        {([["password", "Con la password"], ["link", "Con un link"]] as const).map(([m, label]) => (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={mode === m}
            onClick={() => { setMode(m); setError(null); }}
            className={`min-h-11 rounded-xl border-2 font-bold ${mode === m ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="grid gap-3">
        <label className="grid gap-1.5">
          <span className="font-semibold">Email</span>
          <input className="field" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {mode === "password" && (
          <label className="grid gap-1.5">
            <span className="font-semibold">Password</span>
            <input className="field" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        )}
        {error && <p role="alert" className="font-semibold text-accent">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary">
          {mode === "password" ? "Accedi" : "Mandami il link"}
        </button>
        {mode === "password" && (
          <Link href="/password-dimenticata" className="text-center text-sm font-semibold text-primary underline">
            Hai dimenticato la password?
          </Link>
        )}
      </form>

      <p className="text-center">
        Non hai un account?{" "}
        <Link href={`/registrati?next=${encodeURIComponent(next)}`} className="font-bold text-primary underline">
          Registrati
        </Link>
      </p>
    </div>
  );
}
