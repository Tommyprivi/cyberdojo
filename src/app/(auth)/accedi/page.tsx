import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Accedi" };

export default function AccediPage() {
  return (
    <AuthCard title="Bentornato." intro="Il Sensei ti aspetta. Entra e riprendi il caso.">
      <Suspense fallback={<p>Carico…</p>}>
        <SkipIfSignedIn />
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}

/** Chi è già dentro non ha bisogno di questa pagina. */
async function SkipIfSignedIn() {
  if (await getSessionUser()) redirect("/percorso");
  return null;
}
