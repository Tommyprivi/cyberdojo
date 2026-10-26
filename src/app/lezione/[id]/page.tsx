import type { Metadata, Viewport } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { CountdownBar } from "@/components/countdown-bar";
import { LessonPlayer, type PlayerScreen } from "@/components/lesson/player";
import { lessonComponents } from "@/components/lesson/mdx-components";
import { UiSounds } from "@/components/ui-sounds";
import { readCountdown } from "@/lib/countdown";
import { getRawLesson, readRawLessons, splitScreens } from "@/lib/content/load";
import { isVisible, LESSON_ID, lessonFrontmatter } from "@/lib/content/schema";
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
  if (!lesson.fm.prerequisites.every((id) => member.completed.has(id))) redirect("/percorso");

  const screens: PlayerScreen[] = await Promise.all(
    splitScreens(lesson.body).map(async (source, i) => {
      const { content } = await compileMDX({
        source,
        components: lessonComponents,
        // blockJS: false serve per le props con espressioni (options={[...]}). Sicuro solo perché
        // l'MDX arriva dal repository e passa da revisione: mai compilare MDX scritto da utenti.
        options: { blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } },
      });
      const title = /<Scene\s+title="([^"]+)"/.exec(source)?.[1] ?? `Schermata ${i + 1}`;
      return { title, gated: source.includes("<Practice"), node: content };
    }),
  );

  const countdown = readCountdown();
  return (
    <>
      <UiSounds />
      <LessonPlayer lessonId={lesson.fm.id} title={lesson.fm.title} screens={screens} video={lesson.fm.video} />
      {countdown ? <CountdownBar variant="floating" endsAt={countdown.endsAt} label={countdown.label} /> : null}
    </>
  );
}
