import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/recovery-forms";

export const metadata: Metadata = { title: "Recupera l'account", robots: { index: false } };

export default function PasswordDimenticataPage() {
  return (
    <AuthCard title="Hai perso la password?" intro="Nessun problema: scrivi la tua email e ti mandiamo un link per sceglierne una nuova.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
