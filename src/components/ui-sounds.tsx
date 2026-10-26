"use client";

import { useEffect } from "react";
import { playSound } from "@/lib/sounds";

/**
 * Un piccolo «tic» quando tocchi un menu o un bottone, in tutta l'app (area riservata e lezioni).
 * Un solo ascoltatore per tutta la pagina. Non suona mentre scrivi, e un elemento con data-no-sound resta muto.
 */
export function UiSounds() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const el = t.closest("nav a, aside a, a.btn, button.btn, [data-sound]");
      if (!el || el.closest("[data-no-sound]") || (el instanceof HTMLButtonElement && el.disabled)) return;
      playSound(el.getAttribute("data-sound") === "open" ? "open" : "tap");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
