import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/recovery-forms";

export const metadata: Metadata = { title: "Nuova password", robots: { index: false } };

export default function NuovaPasswordPage({ searchParams }: PageProps<"/nuova-password">) {
  return (
    <AuthCard title="Scegli una nuova password" intro="Dopo il salvataggio potrai accedere subito.">
      <Suspense fallback={<p>Carico…</p>}>
        <Form searchParams={searchParams} />
      </Suspense>
    </AuthCard>
  );
}

async function Form({ searchParams }: { searchParams: PageProps<"/nuova-password">["searchParams"] }) {
  const { token, error } = await searchParams;
  const value = typeof token === "string" ? token : "";
  if (!value || error) {
    return (
      <div role="alert" className="grid gap-3 rounded-lg bg-surface-muted p-4">
        <p className="font-bold">Questo link non è valido o è scaduto.</p>
        <Link href="/password-dimenticata" className="btn btn-primary w-fit">Chiedi un nuovo link</Link>
      </div>
    );
  }
  return <ResetPasswordForm token={value} />;
}
