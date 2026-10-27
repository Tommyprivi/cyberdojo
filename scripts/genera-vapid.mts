/**
 * Genera le chiavi per le notifiche push (VAPID). Si lancia una volta sola:
 *   npx tsx scripts/genera-vapid.mts
 * Stampa tre righe da copiare nelle variabili d'ambiente (.env.local e Vercel). Non scrive nessun file.
 * La chiave PRIVATA è un segreto: non incollarla in chat e non metterla nel repository.
 */
import webpush from "web-push";

const keys = webpush.generateVAPIDKeys();
console.log("Copia queste righe nelle variabili d'ambiente (e poi cambia la mail con la tua):\n");
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log("VAPID_SUBJECT=mailto:tua-email@esempio.it");
