"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "system" | "light" | "dark";
const ORDER: Theme[] = ["system", "light", "dark"];
const LABEL: Record<Theme, string> = { system: "Tema: sistema", light: "Tema: chiaro", dark: "Tema: scuro" };

// Piccolo store sul localStorage: la preferenza vive solo nel browser, nessun dato personale.
const listeners = new Set<() => void>();
let memory: Theme = "system"; // fallback se lo storage non è disponibile

function read(): Theme {
  try {
    const v = localStorage.getItem("theme");
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return memory;
  }
}

function write(t: Theme) {
  memory = t;
  try {
    if (t === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", t);
  } catch {
    /* la scelta vale solo per questa visita */
  }
  listeners.forEach((l) => l());
}

function apply(t: Theme) {
  const el = document.documentElement;
  if (t === "system") el.removeAttribute("data-theme");
  else el.setAttribute("data-theme", t);
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, () => "system" as Theme);

  useEffect(() => apply(theme), [theme]);

  return (
    <button
      type="button"
      onClick={() => write(ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length])}
      className="min-h-11 rounded-lg px-3 text-sm hover:bg-surface-muted"
    >
      {LABEL[theme]}
    </button>
  );
}
