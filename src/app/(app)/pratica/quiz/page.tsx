import type { Metadata } from "next";
import Link from "next/link";
import { QuizLazy } from "@/components/practice/quiz-lazy";

export const metadata: Metadata = { title: "Quiz veloci" };

export default function QuizPage() {
  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <header>
        <Link href="/pratica" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-muted hover:text-foreground">
          <span aria-hidden>←</span> Pratica
        </Link>
        <h1 className="font-display text-3xl font-semibold">Quiz veloci</h1>
      </header>
      <QuizLazy />
    </div>
  );
}
