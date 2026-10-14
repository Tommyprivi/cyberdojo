import type { ReactNode } from "react";
import { Mascot } from "../mascot";

/** Cornice comune alle pagine di accesso: un solo riquadro al centro, con la mascotte. */
export function AuthCard({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="card relative grid gap-5 p-6 sm:p-8">
        <Mascot size={72} className="absolute -top-9 right-6" animate />
        <div>
          <h1 className="font-display text-3xl font-semibold">{title}</h1>
          {intro && <p className="mt-1 text-muted">{intro}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

/** Messaggi di errore in italiano per i codici di Better Auth. */
export function authErrorMessage(error: { code?: string; message?: string; status?: number } | null | undefined): string {
  switch (error?.code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return "Email o password non corrette.";
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "Esiste già un account con questa email. Prova ad accedere.";
    case "PASSWORD_TOO_SHORT":
      return "La password è troppo corta: servono almeno 10 caratteri.";
    case "PASSWORD_TOO_LONG":
      return "La password è troppo lunga.";
    case "INVALID_EMAIL":
      return "L'email non sembra valida.";
  }
  if (error?.status === 429) return "Troppi tentativi: aspetta un minuto e riprova.";
  return "Non è andata a buon fine. Riprova tra poco.";
}
