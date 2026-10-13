import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { LessonPlayer, type PlayerScreen } from "@/components/lesson/player";
import { lessonComponents } from "@/components/lesson/mdx-components";
import { getRawLesson, readRawLessons, splitScreens } from "@/lib/content/load";
import { LESSON_ID, lessonFrontmatter } from "@/lib/content/schema";

// TODO (con auth): richiedere sessione e verificare che i prerequisiti siano completati.
// TODO: mostrare solo lezioni `published` in produzione.

async function load(id: string) {
  if (!LESSON_ID.test(id)) return null;
  const raw = getRawLesson(id);
  if (!raw) return null;
  const parsed = lessonFrontmatter.safeParse(raw.data);
  return parsed.success ? { fm: parsed.data, body: raw.body } : null;
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
    <Suspense fallback={<p className="p-6">Carico la lezione…</p>}>
      <Lesson params={params} />
    </Suspense>
  );
}

async function Lesson({ params }: { params: PageProps<"/lezione/[id]">["params"] }) {
  const lesson = await load((await params).id);
  if (!lesson) notFound();

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

  return <LessonPlayer lessonId={lesson.fm.id} title={lesson.fm.title} screens={screens} video={lesson.fm.video} />;
}
