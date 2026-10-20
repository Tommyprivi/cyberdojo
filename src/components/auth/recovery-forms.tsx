"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "./auth-card";

/** Chiede il link di recupero. La risposta è sempre la stessa: non si rivela se l'email esiste. */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await authClient.requestPasswordReset({ email, redirectTo: "/nuova-password" });
    if (error && error.status === 429) setError(authErrorMessage(error));
    else setSent(true);
    setBusy(false);
  };

  if (sent) {
    return (
      <div role="status" className="grid gap-3 rounded-lg bg-surface-muted p-4">
        <p className="text-lg font-bold">Controlla la posta.</p>
        <p>
          Se esiste un account per <strong>{email}</strong>, ti abbiamo mandato un link per scegliere una nuova password. Vale un&apos;ora e una volta sola.
        </p>
        <Link href="/accedi" className="btn btn-ghost w-fit">Torna all&apos;accesso</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <label className="grid gap-1.5">
        <span className="font-semibold">La tua email</span>
        <input className="field" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      {error && <p role="alert" className="font-semibold text-accent">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-primary">Mandami il link</button>
      <Link href="/accedi" className="text-center font-semibold text-primary underline">Torna all&apos;accesso</Link>
    </form>
  );
}

/** Sceglie la nuova password usando il token ricevuto per email. */
export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await authClient.resetPassword({ newPassword: password, token });
    if (error) setError(error.code === "INVALID_TOKEN" ? "Questo link è scaduto o è già stato usato. Chiedine uno nuovo." : authErrorMessage(error));
    else setDone(true);
    setBusy(false);
  };

  if (done) {
    return (
      <div role="status" className="grid gap-3 rounded-lg bg-surface-muted p-4">
        <p className="text-lg font-bold">Password cambiata.</p>
        <Link href="/accedi" className="btn btn-primary w-fit">Accedi</Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <label className="grid gap-1.5">
        <span className="font-semibold">Nuova password</span>
        <input className="field" type="password" autoComplete="new-password" minLength={10} required value={password} onChange={(e) => setPassword(e.target.value)} />
        <span className="text-sm text-muted">Almeno 10 caratteri. Una frase lunga va benissimo.</span>
      </label>
      {error && <p role="alert" className="font-semibold text-accent">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-primary">Salva la password</button>
      <Link href="/password-dimenticata" className="text-center font-semibold text-primary underline">Chiedi un nuovo link</Link>
    </form>
  );
}
