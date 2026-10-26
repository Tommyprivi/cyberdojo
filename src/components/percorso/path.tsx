import Link from "next/link";
import { CheckIcon, LockIcon, PlayIcon } from "@/components/icons";

export type PathLesson = { id: string; title: string; minutes: number; state: "done" | "open" | "locked" };

/** Spostamenti laterali, in rem: la strada serpeggia a destra e a sinistra. */
const WIGGLE = [0, 3, 5, 3, 0, -3, -5, -3];

/**
 * Il sentiero del modulo in corso: una tappa per lezione, dall'alto verso il basso.
 * Fatta (verde con spunta), prossima (grande, con «play»), bloccata (grigia con lucchetto).
 */
export function LessonPath({ title, lessons }: { title: string; lessons: PathLesson[] }) {
  if (lessons.length === 0) return null;
  const currentId = lessons.find((l) => l.state === "open")?.id;
  return (
    <section aria-label={`Il sentiero: ${title}`} className="grid gap-3 rounded-2xl border-2 border-border bg-surface p-4">
      <h2 className="font-display text-xl font-bold leading-tight">{title}</h2>
      <ol className="relative grid justify-items-center gap-4 py-2">
        <span aria-hidden className="absolute inset-y-6 left-1/2 w-1 -translate-x-1/2 rounded-full bg-border" />
        {lessons.map((l, i) => {
          const isCurrent = l.id === currentId;
          const size = isCurrent ? "size-20" : "size-14";
          const tone =
            l.state === "done" ? "bg-success text-success-fg" : l.state === "open" ? "bg-primary text-primary-fg" : "bg-surface-muted text-muted";
          const face =
            l.state === "done" ? <CheckIcon width={26} height={26} /> : l.state === "locked" ? <LockIcon width={22} height={22} /> : <PlayIcon width={isCurrent ? 34 : 24} height={isCurrent ? 34 : 24} />;
          const stop = (
            <span className={`relative z-10 grid ${size} place-items-center rounded-full border-b-4 border-black/20 font-bold shadow ${tone} ${isCurrent ? "pulse-ring" : ""}`}>{face}</span>
          );
          return (
            <li key={l.id} className="relative z-10 grid justify-items-center gap-1 text-center" style={{ transform: `translateX(${WIGGLE[i % WIGGLE.length]}rem)` }}>
              {l.state === "locked" ? (
                <div role="img" aria-label={`Bloccata: ${l.title}. Completa prima le lezioni precedenti.`}>
                  {stop}
                </div>
              ) : (
                <Link href={`/lezione/${l.id}`} aria-label={`${l.state === "done" ? "Rivedi" : "Inizia"}: ${l.title}`}>
                  {stop}
                </Link>
              )}
              <span className={`max-w-[11rem] rounded-lg bg-surface px-1.5 text-sm leading-tight ${isCurrent ? "font-bold" : "text-muted"}`}>{l.title}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
