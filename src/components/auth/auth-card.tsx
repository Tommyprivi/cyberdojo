import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Seal } from "../seal";

/**
 * Cornice delle pagine di accesso, con i colori dell'app.
 * PC: l'illustrazione riempie tutto lo schermo e il modulo sta a destra, su un pannello semitrasparente.
 * Telefono: illustrazione verticale in testa che sfuma nel foglio, con il modulo sotto.
 * Le immagini si servono ad alta qualità (q 95) perché a tutto schermo si vedono i difetti.
 */
export function AuthCard({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* PC: illustrazione a tutto schermo dietro a tutto */}
      <Image
        src="/img/accesso/orizzontale.jpg"
        alt=""
        fill
        priority
        quality={95}
        sizes="100vw"
        className="hidden object-cover object-[35%_40%] lg:block"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 hidden h-1/3 bg-gradient-to-t from-[#1a1612]/70 to-transparent lg:block" />
      <Link href="/" className="absolute left-10 top-8 z-10 hidden items-center gap-3 font-display text-2xl font-semibold text-[#1a1612] lg:flex">
        <Seal size={44} />
        CyberDojo
      </Link>
      <p className="absolute bottom-10 left-10 z-10 hidden max-w-lg font-display text-3xl font-semibold leading-tight text-white lg:block">
        Gli attacchi non si leggono. Si decodificano.
      </p>

      {/* Pannello del modulo: a destra su PC */}
      <section className="auth-grid relative z-10 flex min-h-dvh flex-col border-border lg:ml-auto lg:w-[min(560px,44vw)] lg:border-l lg:bg-background/90 lg:backdrop-blur-md">
        {/* Telefono: testata illustrata che sfuma nel foglio */}
        <div className="relative h-[38dvh] min-h-60 shrink-0 lg:hidden">
          <Image src="/img/accesso/verticale.jpg" alt="" fill priority quality={95} sizes="100vw" className="object-cover object-[50%_35%]" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
          <Link href="/" className="absolute left-5 top-5 flex items-center gap-2 font-display text-xl font-semibold text-[#1a1612]">
            <Seal size={34} />
            CyberDojo
          </Link>
        </div>

        <div className="relative z-10 mx-auto -mt-8 flex w-full max-w-md flex-1 flex-col justify-center px-5 pb-10 lg:mt-0 lg:px-10 lg:py-12">
          <div className="brackets scanline grid gap-6 overflow-hidden border border-border bg-surface/90 p-6 shadow-[var(--shadow)] backdrop-blur sm:p-8">
            <div className="grid gap-3">
              <p className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.25em] text-primary">
                <span aria-hidden className="size-2 rounded-full bg-success motion-safe:animate-pulse" />
                Accesso al dojo
              </p>
              <h1 className="font-display text-4xl font-semibold leading-tight">{title}</h1>
              {intro && <p className="text-muted">{intro}</p>}
            </div>
            {children}
          </div>
          <p className="mt-4 text-center font-mono text-xs uppercase tracking-widest text-muted">Connessione cifrata · i tuoi dati sono tuoi</p>
        </div>
      </section>
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
