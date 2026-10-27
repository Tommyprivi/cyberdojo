"use client";

/*
  Lato sito dello «studio senza internet» (vedi public/sw.js). Tutto è per-dispositivo.
  Ogni funzione non fa mai errori: senza service worker il sito funziona uguale.
*/

const LESSONS_CACHE = "cyberdojo-lezioni-v1"; // stesso nome di public/sw-offline.js

/** Dice al service worker che questa lezione è stata aperta: la salva per rileggerla senza rete. */
export function saveLessonOffline(id: string): void {
  try {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.ready.then((reg) => reg.active?.postMessage({ type: "cd-save-lesson", id })).catch(() => {});
  } catch {
    /* niente offline, pazienza */
  }
}

/** All'uscita dall'account: svuota le lezioni salvate (direttamente e con messaggio al service worker). */
export async function clearOfflineLessons(): Promise<void> {
  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      reg?.active?.postMessage({ type: "cd-clear-lessons" });
    }
  } catch {
    /* continua: si cancella anche direttamente */
  }
  try {
    if ("caches" in window) await caches.delete(LESSONS_CACHE);
  } catch {
    /* ignora */
  }
}
