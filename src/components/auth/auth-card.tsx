import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Cornice comune alle pagine di accesso. Su PC: illustrazione a sinistra, modulo a destra.
 * Su telefono: testata illustrata e modulo sotto, a tutta larghezza.
 */
export function AuthCard({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-xl border border-border bg-surface shadow-sm lg:grid-cols-[1fr_1.1fr]">
      <div className="relative h-40 bg-surface-muted sm:h-52 lg:order-first lg:h-auto lg:min-h-[640px]">
        <Image
          src="/img/accesso/telefono.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_20%] lg:hidden"
        />
        <Image
          src="/img/accesso/pc.jpg"
          alt=""
          fill
          sizes="480px"
          className="hidden object-cover lg:block"
        />
      </div>
      <div className="grid content-center gap-5 p-6 sm:p-10">
        <div>
          <h1 className="font-display text-3xl font-semibold lg:text-4xl">{title}</h1>
          {intro && <p className="mt-2 text-muted">{intro}</p>}
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

