import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Registrati" };

export default function RegistratiPage() {
  return (
    <AuthCard title="Entra nel dojo." intro="Gratis, in italiano. Ti servono due minuti.">
      <Suspense fallback={<p>Carico…</p>}>
        <SkipIfSignedIn />
        <RegisterForm />
      </Suspense>
    </AuthCard>
  );
}

async function SkipIfSignedIn() {
  if (await getSessionUser()) redirect("/percorso");
  return null;
}
