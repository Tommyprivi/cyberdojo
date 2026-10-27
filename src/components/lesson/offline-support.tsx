"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { saveLessonOffline } from "@/lib/offline/client";

const subscribe = (cb: () => void) => {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
};

/**
 * Studio senza internet: salva la lezione aperta sul dispositivo e, se manca la rete,
 * avvisa che si può rileggere ma non completare. Non tocca i progressi né le risposte.
 */
export function OfflineSupport({ lessonId }: { lessonId: string }) {
  const offline = useSyncExternalStore(
    subscribe,
    () => !navigator.onLine,
    () => false,
  );

  useEffect(() => {
    if (navigator.onLine) saveLessonOffline(lessonId);
  }, [lessonId]);

  if (!offline) return null;
  return (
    <div
      role="status"
      className="fixed inset-x-3 top-[calc(0.5rem+env(safe-area-inset-top))] z-50 mx-auto grid max-w-xl gap-1 rounded-lg border border-border bg-surface p-3 text-sm shadow-lg"
    >
      <p className="font-semibold">Sei offline: puoi rileggere, ma per completare serve la rete.</p>
      <Link href="/offline-lezioni.html" prefetch={false} className="underline">
        Lezioni disponibili offline
      </Link>
    </div>
  );
}
