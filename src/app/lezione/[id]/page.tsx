import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { remarkGlossary } from "@/lib/glossary/remark-glossary";
import { CountdownBar } from "@/components/countdown-bar";
import { ListenLesson } from "@/components/lesson/listen-lesson";
import { extractSayTexts } from "@/lib/listen/listen";
import { LessonPlayer, type PlayerScreen } from "@/components/lesson/player";
import { lessonComponents } from "@/components/lesson/mdx-components";
import { OfflineSupport } from "@/components/lesson/offline-support";
import { UiSounds } from "@/components/ui-sounds";
import { readAnnouncements } from "@/lib/announcements";
import { readCountdown } from "@/lib/countdown";
import { getRawLesson, readRawLessons, splitScreens } from "@/lib/content/load";
import { lessonWantsCalculator } from "@/lib/lesson-calculator";
import { isVisible, LESSON_ID, lessonFrontmatter } from "@/lib/content/schema";
import { loadCatalog } from "@/lib/content/catalog";
import { allowedDuringMaintenance, MAINTENANCE_HEADER } from "@/lib/maintenance";
import { canOpenLesson } from "@/lib/progress/unlock";
import { requireMember } from "@/lib/session";

export const viewport: Viewport = { viewportFit: "cover" };

async function load(id: string) {
  if (!LESSON_ID.test(id)) return null;
  const raw = getRawLesson(id);
  if (!raw) return null;
  const parsed = lessonFrontmatter.safeParse(raw.data);
  return parsed.success && isVisible(parsed.data.status) ? { fm: parsed.data, body: raw.body } : null;
}

export function generateStaticParams() {
  return readRawLessons().map((l) => ({ id: String(l.data.id) }));
}

export async function generateMetadata({ params }: PageProps<"/lezione/[id]">): Promise<Metadata> {
  const lesson = await load((await params).id);
  return { title: lesson ? lesson.fm.title : "Lezione non trovata" };
}

export default function LessonPage({ params }: PageProps<"/lezione/[id]">) {
  return (
    <Suspense fallback={<p className="p-6 font-mono text-sm text-muted">Carico la lezione…</p>}>
      <Lesson params={params} />
    </Suspense>
  );
}

async function Lesson({ params }: { params: PageProps<"/lezione/[id]">["params"] }) {
  const lesson = await load((await params).id);
  if (!lesson) notFound();

  // Le lezioni sono private: serve l'account, e si va in ordine (prerequisiti completati).
  const member = await requireMember(`/lezione/${lesson.fm.id}`);
  // Le lezioni padroneggiate (prova del modulo) si aprono sempre, per ripassare; contano come prerequisito soddisfatto.
  if (!member.mastered.has(lesson.fm.id) && !canOpenLesson(lesson.fm, { completed: member.completed, mastered: member.mastered })) redirect("/percorso");

  // In manutenzione si continua solo un corso già iniziato (per non perdere la serie).
  if ((await headers()).get(MAINTENANCE_HEADER) === "1" && !allowedDuringMaintenance(lesson.fm.id, member.completed, loadCatalog())) {
    redirect("/manutenzione");
  }

  const screens: PlayerScreen[] = await Promise.all(
    splitScreens(lesson.body).map(async (source, i) => {
      const { content } = await compileMDX({
        source,
        components: lessonComponents,
        // blockJS: false serve per le props con espressioni (options={[...]}). Sicuro solo perché
        // l'MDX arriva dal repository e passa da revisione: mai compilare MDX scritto da utenti.
        options: { blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm, remarkGlossary] } },
      });
      const title = /<Scene\s+title="([^"]+)"/.exec(source)?.[1] ?? `Schermata ${i + 1}`;
      return { title, gated: source.includes("<Practice"), node: content };
    }),
  );

  const countdown = readCountdown();
  return (
    <>
      <UiSounds />
      <OfflineSupport lessonId={lesson.fm.id} />
      <LessonPlayer lessonId={lesson.fm.id} title={lesson.fm.title} screens={screens} video={lesson.fm.video} calculator={lessonWantsCalculator(lesson.fm.id, lesson.body)} />
      <ListenLesson lessonId={lesson.fm.id} title={lesson.fm.title} screens={splitScreens(lesson.body).map(extractSayTexts)} />
      {countdown ? <CountdownBar variant="floating" endsAt={countdown.endsAt} label={countdown.label} newsVersion={readAnnouncements()[0]?.id ?? ""} maintenance={countdown.maintenance} /> : null}
    </>
  );
}
