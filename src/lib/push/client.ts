/** Aiuti per il browser (solo lato client). Non chiedono mai il permesso da soli: lo fa solo chi li chiama. */

export function pushSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

function keyToBytes(base64Url: string): Uint8Array<ArrayBuffer> {
  const padded = base64Url + "=".repeat((4 - (base64Url.length % 4)) % 4);
  const raw = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/** Il dispositivo è già iscritto? (non chiede nulla) */
export async function currentSubscription(): Promise<PushSubscription | null> {
  if (!pushSupported()) return null;
  try {
    const reg = await navigator.serviceWorker.getRegistration("/sw.js");
    return (await reg?.pushManager.getSubscription()) ?? null;
  } catch {
    return null;
  }
}

/**
 * Chiede il permesso (va chiamata SOLO dopo un clic dell'utente o una lezione completata) e crea l'iscrizione.
 * Restituisce l'iscrizione in forma semplice, oppure il motivo per cui non è andata.
 */
export async function requestAndSubscribe(
  publicKey: string,
): Promise<{ ok: true; subscription: { endpoint: string; keys: { p256dh: string; auth: string } } } | { ok: false; reason: "non-supportato" | "negato" | "errore" }> {
  if (!pushSupported()) return { ok: false, reason: "non-supportato" };
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return { ok: false, reason: "negato" };
    const reg = (await navigator.serviceWorker.getRegistration("/sw.js")) ?? (await navigator.serviceWorker.register("/sw.js"));
    await navigator.serviceWorker.ready;
    const sub =
      (await reg.pushManager.getSubscription()) ??
      (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyToBytes(publicKey) }));
    const json = sub.toJSON();
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return { ok: false, reason: "errore" };
    return { ok: true, subscription: { endpoint: json.endpoint, keys: { p256dh: json.keys.p256dh, auth: json.keys.auth } } };
  } catch {
    return { ok: false, reason: "errore" };
  }
}

/** Toglie l'iscrizione del browser e restituisce l'indirizzo, per toglierla anche dal server. */
export async function browserUnsubscribe(): Promise<string | null> {
  const sub = await currentSubscription();
  if (!sub) return null;
  const endpoint = sub.endpoint;
  await sub.unsubscribe().catch(() => {});
  return endpoint;
}
