"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { clearOfflineLessons } from "@/lib/offline/client";
import { displayName, firstName } from "@/lib/display-name";
import { LogOutIcon } from "./nav-icons";

function useSignOut() {
  const router = useRouter();
  return async () => {
    await clearOfflineLessons(); // le lezioni salvate sono private: via dal dispositivo
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };
}

/** Iniziale in un quadratino scuro: lo stesso segno in barra laterale, intestazione e profilo. */
export function Avatar({ name, size = 40, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-md bg-deep font-display font-bold uppercase text-deep-fg ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.46 }}
    >
      {name.trim().charAt(0) || "?"}
    </span>
  );
}

/** Pulsante «Esci» a larghezza piena, per la pagina Profilo su telefono. */
export function SignOutButton({ className = "" }: { className?: string }) {
  const signOut = useSignOut();
  return (
    <button type="button" onClick={signOut} className={`btn btn-ghost min-h-12 w-full ${className}`}>
      <span className="inline-flex items-center gap-2">
        <LogOutIcon width={18} height={18} /> Esci dall&apos;account
      </span>
    </button>
  );
}

/**
 * Menu utente. Legge la sessione dal browser (non dal server), così le pagine statiche restano
 * statiche. Finché non sa chi sei, riserva lo spazio senza mostrare nulla.
 * - default: nome ed «Esci» in orizzontale (intestazione del sito pubblico);
 * - card: scheda per la barra laterale su PC;
 * - avatar: solo l'iniziale, per l'intestazione compatta su telefono.
 */
export function UserMenu({ variant = "default" }: { variant?: "default" | "card" | "avatar" }) {
  const signOut = useSignOut();
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    const cls = variant === "card" ? "h-[6.25rem]" : variant === "avatar" ? "size-11" : "h-11 w-28";
    return <span className={`inline-block ${cls}`} aria-hidden />;
  }

  if (!data) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/accedi" className="btn btn-ghost min-h-11 px-4 text-sm">
          Accedi
        </Link>
        <Link href="/registrati" className="btn btn-primary min-h-11 px-4 text-sm">
          Registrati
        </Link>
      </div>
    );
  }

  const name = displayName(data.user);

  if (variant === "avatar") {
    return (
      <Link href="/profilo" aria-label={`Profilo di ${name}`} className="grid size-11 place-items-center">
        <Avatar name={name} size={36} />
      </Link>
    );
  }

  if (variant === "card") {
    return (
      <div className="grid gap-2 rounded-lg border border-border bg-background p-3">
        <Link href="/profilo" aria-label={`Profilo di ${name}`} className="flex min-w-0 items-center gap-3 rounded-md hover:opacity-80">
          <Avatar name={name} size={40} />
          <span className="min-w-0">
            <span className="block truncate font-semibold leading-tight">{name}</span>
            <span className="block truncate font-mono text-xs text-muted">{data.user.email}</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="flex min-h-9 items-center gap-2 rounded-md px-1 text-sm font-semibold text-muted hover:text-foreground"
        >
          <LogOutIcon width={16} height={16} /> Esci
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/profilo" className="chip text-sm hover:bg-surface-muted" aria-label={`Profilo di ${name}`}>
        {firstName(data.user)}
      </Link>
      <button type="button" className="chip text-sm hover:bg-surface-muted" onClick={signOut}>
        Esci
      </button>
    </div>
  );
}
