"use client";

import { useSyncExternalStore } from "react";
import { playSound, setSoundOn, soundStore } from "@/lib/sounds";

/** Interruttore dei suoni: piccolo, sempre raggiungibile. Spento, nessun suono parte da nessuna parte. */
export function SoundToggle({ withLabel = false }: { withLabel?: boolean }) {
  const on = useSyncExternalStore(soundStore.subscribe, soundStore.getSnapshot, soundStore.getServerSnapshot);
  return (
    <button
      type="button"
      data-no-sound
      onClick={() => {
        setSoundOn(!on);
        if (!on) playSound("open");
      }}
      aria-pressed={on}
      aria-label={on ? "Suoni accesi. Tocca per spegnerli." : "Suoni spenti. Tocca per accenderli."}
      className="chip text-sm"
    >
      <span aria-hidden>{on ? "🔊" : "🔇"}</span>
      {withLabel ? <span>Suoni: {on ? "accesi" : "spenti"}</span> : null}
    </button>
  );
}
