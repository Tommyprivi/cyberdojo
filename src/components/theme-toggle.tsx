"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";
const ORDER: Theme[] = ["light", "dark", "system"];
const LABEL: Record<Theme, string> = { light: "Chiaro", dark: "Scuro", system: "Sistema" };

// Piccolo store sul localStorage: la preferenza vive solo nel browser, nessun dato personale.
// Predefinito: chiaro.
const listeners = new Set<() => void>();
let memory: Theme = "light"; // fallback se lo storage non è disponibile

function read(): Theme {
  try {
    const v = localStorage.getItem("theme");
    return v === "light" || v === "dark" || v === "system" ? v : "light";
  } catch {
    return memory;
  }
}

function write(t: Theme) {
  memory = t;
  try {
    localStorage.setItem("theme", t);
  } catch {
    /* la scelta vale solo per questa visita */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};

function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "light" as Theme);
}

/** Montato nel layout radice: applica la preferenza anche nelle pagine senza interruttore. */
export function ThemeSync() {
  const theme = useTheme();
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  return null;
}

export function ThemeToggle() {
  const theme = useTheme();

  return (
    <button
      type="button"
      onClick={() => write(ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length])}
      aria-label={`Tema: ${LABEL[theme]}. Tocca per cambiare.`}
      className="chip text-sm"
    >
      Tema: {LABEL[theme]}
    </button>
  );
}
