import type { Metadata } from "next";
import { Suspense } from "react";
import { DojoApp } from "@/components/dojo/dojo-app";
import { catalogForPicker } from "@/lib/ai/context";
import { isAiConfigured } from "@/lib/ai/provider";
import { LESSON_ID } from "@/lib/content/schema";
import { requireMember } from "@/lib/session";

export const metadata: Metadata = { title: "AI Dojo" };

export default function DojoPage({ searchParams }: PageProps<"/dojo">) {
  return (
    <Suspense fallback={<p className="font-mono text-sm text-muted">Apro il dojo…</p>}>
      <Dojo searchParams={searchParams} />
    </Suspense>
  );
}

async function Dojo({ searchParams }: { searchParams: PageProps<"/dojo">["searchParams"] }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.lezione) ? sp.lezione[0] : sp.lezione;
  const lessonId = raw && LESSON_ID.test(raw) ? raw : undefined;
  await requireMember(lessonId ? `/dojo?lezione=${lessonId}` : "/dojo");
  const catalog = catalogForPicker();
  // Si preseleziona la lezione solo se esiste ed è visibile.
  const exists = lessonId ? catalog.some((c) => c.modules.some((m) => m.lessons.some((l) => l.id === lessonId))) : false;
  return <DojoApp catalog={catalog} initialLessonId={exists ? lessonId : undefined} configured={isAiConfigured()} />;
}
