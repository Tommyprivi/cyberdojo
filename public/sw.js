/* Service worker di CyberDojo.
   Fa due cose sole: mostra una pagina «sei offline» quando manca la rete e (in futuro) riceve le notifiche.
   Non salva in memoria le lezioni né i dati dell'account: sono privati e cambiano. */
const CACHE = "cyberdojo-offline-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([OFFLINE_URL, "/icons/icon-192.png"])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Solo le pagine (navigazioni): se la rete manca, pagina offline. Tutto il resto passa dritto.
  if (req.mode !== "navigate") return;
  event.respondWith(fetch(req).catch(() => caches.match(OFFLINE_URL)));
});
