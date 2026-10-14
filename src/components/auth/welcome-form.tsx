"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { saveProfile } from "@/app/actions/profile";
import { browserTimeZone, draftProblem, EMPTY_DRAFT, ProfileFields, type ProfileDraft } from "./profile-fields";

function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : "/percorso";
}

/** Per chi è entrato con Google o con il link e non ha ancora scelto età, obiettivo e ritmo. */
export function WelcomeForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [draft, setDraft] = useState<ProfileDraft>(EMPTY_DRAFT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const problem = draftProblem(draft);
    if (problem) return setError(problem);
    setBusy(true);
    const saved = await saveProfile({ ...draft, timezone: browserTimeZone() });
    if (!saved.ok) {
      setError(saved.error);
      return setBusy(false);
    }
    router.push(next);
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <ProfileFields value={draft} onChange={setDraft} />
      {error && <p role="alert" className="font-semibold text-accent">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-primary">
        Entra nel dojo
      </button>
    </form>
  );
}
