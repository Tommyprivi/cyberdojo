import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Mascot } from "../mascot";
import type { Announcement } from "@/lib/announcements";
import type { EngagementSummary } from "@/lib/community/reactions";
import { Engagement } from "./engagement";
import { SafeMarkdown } from "./safe-markdown";

/** Un annuncio da mostrare: quelli dei file (MDX fidato) o del database (Markdown limitato, rendering sicuro). */
export type FeedItem = Announcement & { source?: "file" | "db"; pinned?: boolean };

const TAG_STYLE: Record<string, string> = {
  novità: "bg-primary/15 text-primary",
  corsi: "bg-sky/15 text-sky",
  community: "bg-sun/30 text-foreground",
  importante: "bg-accent/15 text-accent",
};

const when = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Il canale «annunci»: messaggi dello staff, dal più recente, come in una chat di comunità. Sola lettura. */
export async function AnnouncementFeed({ list, engagement }: { list: FeedItem[]; engagement?: Record<string, EngagementSummary> }) {
  if (list.length === 0) {
    return <p className="rounded-2xl border-2 border-dashed border-border p-6 text-muted">Ancora nessun annuncio. Il primo arriva presto.</p>;
  }
  return (
    <ol className="grid gap-5" aria-label="Annunci, dal più recente">
      {await Promise.all(list.map((a, i) => <Message key={a.id} a={a} pinned={Boolean(a.pinned)} latest={i === list.findIndex((x) => !x.pinned)} engagement={engagement?.[a.id]} />))}
    </ol>
  );
}

async function Message({ a, pinned, latest, engagement }: { a: FeedItem; pinned: boolean; latest: boolean; engagement?: EngagementSummary }) {
  // Solo i file del repository (scritti da chi ha accesso al codice) passano da MDX; il testo dello staff mai.
  const body =
    a.source === "db" ? (
      <SafeMarkdown source={a.body} />
    ) : (
      <div className="legal-body">
        {
          (
            await compileMDX({
              source: a.body,
              options: { blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } },
            })
          ).content
        }
      </div>
    );
  return (
    <li id={a.id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 scroll-mt-20">
      <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-border bg-surface">
        <Mascot size={36} />
      </div>
      <div className="min-w-0">
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-extrabold">CyberDojo</span>
          <span className="rounded bg-primary px-1.5 py-0.5 text-[0.6875rem] font-extrabold uppercase tracking-wide text-primary-fg">Staff</span>
          <time dateTime={a.date} className="text-xs text-muted">
            {when(a.date)}
          </time>
          {pinned ? <span className="text-xs font-bold text-accent">📌 Fissato in alto</span> : latest ? <span className="text-xs font-bold text-accent">📌 L&apos;ultimo annuncio</span> : null}
        </p>
        <div className="mt-2 grid gap-3 rounded-2xl rounded-tl-sm border-2 border-border bg-surface p-4">
          <h2 className="font-display text-xl font-bold leading-tight">{a.title}</h2>
          {a.tags.length > 0 ? (
            <p className="flex flex-wrap gap-1.5">
              {a.tags.map((t) => (
                <span key={t} className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${TAG_STYLE[t] ?? "bg-surface-muted text-muted"}`}>
                  {t}
                </span>
              ))}
            </p>
          ) : null}
          {body}
          {engagement ? <Engagement id={a.id} initial={engagement} /> : null}
        </div>
      </div>
    </li>
  );
}
