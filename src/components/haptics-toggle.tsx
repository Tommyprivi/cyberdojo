"use client";

import { useSyncExternalStore } from "react";
import { haptic, hapticsStore, hapticsSupportStore, setHapticsOn } from "@/lib/app/haptics";

/** Interruttore della vibrazione, accanto ai suoni. Compare solo sui dispositivi che sanno vibrare. */
export function HapticsToggle({ withLabel = false }: { withLabel?: boolean }) {
  const on = useSyncExternalStore(hapticsStore.subscribe, hapticsStore.getSnapshot, hapticsStore.getServerSnapshot);
  const supported = useSyncExternalStore(hapticsSupportStore.subscribe, hapticsSupportStore.getSnapshot, hapticsSupportStore.getServerSnapshot);
  if (!supported) return null;
  return (
    <button
      type="button"
      data-no-sound
      onClick={() => {
        setHapticsOn(!on);
        if (!on) haptic("right");
      }}
      aria-pressed={on}
      aria-label={on ? "Vibrazione accesa. Tocca per spegnerla." : "Vibrazione spenta. Tocca per accenderla."}
      className="chip text-sm"
    >
      <span aria-hidden>{on ? "📳" : "📴"}</span>
      {withLabel ? <span>Vibrazione: {on ? "accesa" : "spenta"}</span> : null}
    </button>
  );
}
