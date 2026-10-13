"use client";

import { useState } from "react";
import { PlayIcon } from "../icons";
import { usePlayer } from "./player-context";

/**
 * Video della lezione, preso dal frontmatter (`video:`), mai dalle props dell'MDX.
 * - Player ufficiale YouTube su dominio nocookie, con inizio e fine.
 * - Si carica solo al clic: prima del clic non parte nessuna richiesta verso YouTube.
 * - Il link "Apri su YouTube" resta sempre visibile: serve se l'incorporamento è disattivato
 *   o se il video sparisce (il controllo periodico è nell'epic E9).
 * - Il canale è sempre citato.
 */
export function Video() {
  const { video } = usePlayer();
  const [loaded, setLoaded] = useState(false);
  if (!video) return null;

  const params = new URLSearchParams({ start: String(video.start), end: String(video.end), rel: "0", autoplay: "1" });
  const src = `https://www.youtube-nocookie.com/embed/${video.id}?${params}`;
  const watch = `https://www.youtube.com/watch?v=${video.id}&t=${video.start}s`;
  const minutes = Math.max(1, Math.round((video.end - video.start) / 60));

  return (
    <figure className="my-2 grid gap-2">
      <div className="relative aspect-video overflow-hidden rounded-3xl border-2 border-border bg-deep">
        {loaded ? (
          <iframe
            src={src}
            title={`Video: ${video.title ?? "spiegazione"} (${video.channel})`}
            className="absolute inset-0 size-full"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="absolute inset-0 grid place-items-center gap-2 p-4 text-center text-deep-fg"
          >
            <span className="grid size-20 place-items-center rounded-full bg-primary text-primary-fg shadow-[0_6px_0_var(--primary-edge)]">
              <PlayIcon width={34} height={34} />
            </span>
            <span className="text-lg font-bold">{video.title ?? "Guarda il video"}</span>
            <span className="text-sm opacity-90">
              circa {minutes} min · {video.channel} · si carica da YouTube solo se clicchi
            </span>
          </button>
        )}
      </div>
      <figcaption className="flex flex-wrap justify-between gap-2 text-sm text-muted">
        <span>
          Video di <strong>{video.channel}</strong>, incorporato da YouTube.
        </span>
        <a href={watch} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
          Apri su YouTube
        </a>
      </figcaption>
    </figure>
  );
}
