import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { UnsubscribeForm } from "@/components/auth/unsubscribe-form";
import { verifyUnsubscribeToken } from "@/lib/mail/token";

export const metadata: Metadata = { title: "Disattiva i promemoria", robots: { index: false } };

export default function DisiscrizionePage({ searchParams }: PageProps<"/disiscrizione">) {
  return (
    <AuthCard title="Promemoria di studio.">
      <Suspense fallback={<p>Carico…</p>}>
        <Content searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}

async function Content({ searchParams }: Pick<PageProps<"/disiscrizione">, "searchParams">) {
  const raw = (await searchParams).token;
  const token = typeof raw === "string" ? raw : "";
  if (!verifyUnsubscribeToken(token)) {
    return <p role="alert" className="font-semibold text-accent">Questo link non è valido o è stato modificato. Puoi disattivare i promemoria dal tuo profilo.</p>;
  }
  return <UnsubscribeForm token={token} />;
}
