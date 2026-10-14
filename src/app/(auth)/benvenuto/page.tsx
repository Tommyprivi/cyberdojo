import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { WelcomeForm } from "@/components/auth/welcome-form";
import { getMemberData } from "@/lib/progress/queries";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: "Benvenuto" };

export default function BenvenutoPage() {
  return (
    <AuthCard title="Ultimo passo." intro="Tre scelte e sei dentro. Servono a costruire il tuo percorso.">
      <Suspense fallback={<p>Carico…</p>}>
        <Guard />
        <WelcomeForm />
      </Suspense>
    </AuthCard>
  );
}

/** Serve una sessione; chi ha già il profilo va dritto al percorso. */
async function Guard() {
  const user = await getSessionUser();
  if (!user) redirect("/accedi");
  if ((await getMemberData(user.id)).profile) redirect("/percorso");
  return null;
}
