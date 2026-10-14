"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { displayName, firstName } from "@/lib/display-name";

/**
 * Menu utente nell'intestazione. Legge la sessione dal browser (non dal server), così le pagine
 * statiche restano statiche. Finché non sa chi sei, riserva lo spazio senza mostrare nulla.
 */
export function UserMenu() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  if (isPending) return <span className="inline-block h-11 w-28" aria-hidden />;

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

  const first = firstName(data.user);
  return (
    <div className="flex items-center gap-2">
      <Link href="/profilo" className="chip text-sm hover:bg-surface-muted" aria-label={`Profilo di ${displayName(data.user)}`}>
        {first}
      </Link>
      <button
        type="button"
        className="chip text-sm hover:bg-surface-muted"
        onClick={async () => {
          await authClient.signOut();
          router.push("/");
          router.refresh();
        }}
      >
        Esci
      </button>
    </div>
  );
}
