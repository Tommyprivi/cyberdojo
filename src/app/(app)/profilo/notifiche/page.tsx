import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import { PushSettings } from "@/components/push/push-settings";
import { schema } from "@/lib/db";
import { withUser } from "@/lib/db/scoped";
import { pushConfig } from "@/lib/push/config";
import { PUSH_KINDS, type PushKind } from "@/lib/push/rules";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "Notifiche", robots: { index: false } };

export default function NotifichePage() {
  return (
    <Suspense fallback={<div className="h-96 rounded-lg bg-surface-muted" aria-busy="true" aria-label="Carico le impostazioni" />}>
      <NotificheContent />
    </Suspense>
  );
}

async function NotificheContent() {
  const { user } = await requireMember("/profilo/notifiche");
  const enabled = pushConfig() !== null;

  const rows = enabled
    ? await withUser(user.id, (tx) =>
        tx
          .select({ hour: schema.pushSubscriptions.hour, kinds: schema.pushSubscriptions.kinds })
          .from(schema.pushSubscriptions)
          .where(eq(schema.pushSubscriptions.userId, user.id))
          .limit(1),
      )
    : [];
  const hour = rows[0]?.hour ?? 18;
  const kinds = (rows[0]?.kinds ?? [...PUSH_KINDS]).filter((k): k is PushKind => (PUSH_KINDS as readonly string[]).includes(k));

  return (
    <div className="mx-auto grid w-full max-w-3xl content-start gap-4 lg:mx-0 lg:max-w-4xl">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">Profilo · Notifiche</p>
          <h1 className="font-display text-3xl font-bold leading-tight">Notifiche</h1>
        </div>
        <Link href="/profilo" className="inline-flex min-h-11 items-center rounded-md border border-border bg-surface px-3 text-sm font-semibold hover:bg-surface-muted">
          Torna al profilo
        </Link>
      </header>

      {enabled ? (
        <>
          <p>
            Le notifiche sono messaggi brevi sul telefono o sul PC. Sono spente finché non le attivi tu, e le puoi spegnere quando vuoi. Il browser ti chiederà il permesso solo quando premi il bottone.
          </p>
          <PushSettings initialHour={hour} initialKinds={kinds} />
        </>
      ) : (
        <p className="rounded-lg border border-border bg-surface-muted p-3">Le notifiche non sono ancora disponibili su questo sito.</p>
      )}
    </div>
  );
}
