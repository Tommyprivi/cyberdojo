import webpush from "web-push";

/** Chiavi VAPID dall'ambiente. Se mancano, le notifiche restano spente (e l'interfaccia non compare). */
export function pushConfig(): { publicKey: string; privateKey: string; subject: string } | null {
  const publicKey = process.env.VAPID_PUBLIC_KEY?.trim();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim();
  const subject = process.env.VAPID_SUBJECT?.trim();
  if (!publicKey || !privateKey || !subject) return null;
  return { publicKey, privateKey, subject };
}

/** Chiave pubblica da dare al browser, oppure null se la funzione è spenta. */
export function pushPublicKey(): string | null {
  return pushConfig()?.publicKey ?? null;
}

/** Prepara la libreria; null se spenta o se le chiavi non sono valide (mai eccezioni). */
export function pushClient(): typeof webpush | null {
  const c = pushConfig();
  if (!c) return null;
  try {
    webpush.setVapidDetails(c.subject, c.publicKey, c.privateKey);
    return webpush;
  } catch {
    return null;
  }
}
