"use client";

import { useEffect, useRef, useState } from "react";
import { useConsent } from "../consent/consent-provider";
import { PlayIcon } from "../icons";
import { usePlayer } from "./player-context";

/**
 * Video della lezione, preso dal frontmatter (`video:`), mai dalle props dell'MDX.
 * - Player ufficiale YouTube su dominio nocookie, con inizio e fine.
 * - Si carica solo al clic: prima del clic non parte nessuna richiesta verso YouTube.
 * - Se non hai autorizzato i contenuti di terze parti, il clic apre il banner dei cookie
 *   invece di caricare il video: la scelta resta tua.
 * - Il link "Apri su YouTube" resta sempre visibile: serve se l'incorporamento è disattivato
 *   o se il video sparisce (il controllo periodico è nell'epic E9).
 * - Il canale è sempre citato.
 */
export function Video() {
  const { video } = usePlayer();
  const { thirdParty, ask } = useConsent();
  const [loaded, setLoaded] = useState(false);
  const box = useRef<HTMLElement>(null);

  // Le schermate della lezione restano montate anche se nascoste: quando questa sparisce
  // (si passa alla successiva) il video si ferma, altrimenti l'audio continuerebbe a suonare.
  useEffect(() => {
    const el = box.current;
    if (!el || !loaded) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && el.offsetParent === null) setLoaded(false);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [loaded]);

  if (!video) return null;

  const params = new URLSearchParams({ start: String(video.start), end: String(video.end), rel: "0", autoplay: "1", hl: "it" });
  if (video.lang === "en") {
    // Video in inglese: sottotitoli italiani attivi se il canale (o YouTube) li fornisce.
    params.set("cc_load_policy", "1");
    params.set("cc_lang_pref", "it");
  }
  const src = `https://www.youtube-nocookie.com/embed/${video.id}?${params}`;
  const watch = `https://www.youtube.com/watch?v=${video.id}&t=${video.start}s`;
  const minutes = Math.max(1, Math.round((video.end - video.start) / 60));

  return (
    <figure ref={box} className="my-2 grid max-w-4xl gap-2">
      <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-deep">
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
            onClick={() => (thirdParty ? setLoaded(true) : ask())}
            className="absolute inset-0 grid place-items-center gap-2 p-4 text-center text-deep-fg"
          >
            <span className="grid size-20 place-items-center rounded-full bg-primary text-primary-fg">
              <PlayIcon width={34} height={34} />
            </span>
            <span className="text-lg font-bold">{video.title ?? "Guarda il video"}</span>
            <span className="text-sm opacity-90">
              circa {minutes} min · {video.channel}
              {video.lang === "en" ? " · in inglese, sottotitoli in italiano" : ""} · si carica da YouTube solo se clicchi
            </span>
            {!thirdParty ? (
              <span className="text-sm opacity-90">
                Per guardarlo qui ti serve autorizzare i video di YouTube: il banner spiega cosa comporta.
              </span>
            ) : null}
          </button>
        )}
      </div>
      <figcaption className="flex flex-wrap justify-between gap-2 text-sm text-muted">
        <span>
          Video di <strong>{video.channel}</strong>, incorporato da YouTube.
        </span>
        <span className="flex gap-4">
          {loaded ? (
            <button type="button" onClick={() => setLoaded(false)} className="font-semibold text-primary underline">
              Ferma il video
            </button>
          ) : null}
          <a href={watch} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
            Apri su YouTube
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
