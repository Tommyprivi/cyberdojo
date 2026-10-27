/* Service worker di CyberDojo.
   Fa due cose sole: mostra una pagina «sei offline» quando manca la rete e (in futuro) riceve le notifiche.
   Non salva in memoria le lezioni né i dati dell'account: sono privati e cambiano. */
importScripts("/sw-offline.js"); // regole dello «studio senza internet» (CdOffline)
const CACHE = "cyberdojo-offline-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([OFFLINE_URL, "/offline-lezioni.html", "/icons/icon-192.png"])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && !CdOffline.isOwnCache(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Solo le pagine (navigazioni): se la rete manca, pagina offline. Tutto il resto passa dritto.
  if (req.mode !== "navigate") return;
  // Le pagine lezione le gestisce il blocco «Studio senza internet» in fondo al file.
  if (CdOffline.isLessonPath(new URL(req.url).pathname)) return;
  event.respondWith(fetch(req).catch(async () => (await caches.match(req)) || caches.match(OFFLINE_URL)));
});

/* Notifiche push: il server manda un piccolo JSON {title, body, url, tag}. Testo gentile, mai dati personali. */
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }
  const title = typeof data.title === "string" && data.title ? data.title.slice(0, 80) : "CyberDojo";
  const body = typeof data.body === "string" ? data.body.slice(0, 200) : "";
  const tag = typeof data.tag === "string" ? data.tag.slice(0, 40) : "cyberdojo";
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: typeof data.url === "string" ? data.url : "/percorso" },
    }),
  );
});

/* Solo percorsi interni: «/qualcosa», mai «//sito» né indirizzi esterni. */
function internalUrl(u) {
  if (typeof u !== "string" || !u.startsWith("/") || u.startsWith("//") || u.includes("\\")) return "/percorso";
  return u;
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = internalUrl(event.notification.data && event.notification.data.url);
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url.startsWith(self.location.origin) && "focus" in c) {
          if ("navigate" in c) c.navigate(url);
          return c.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});

/* ===== Studio senza internet =====
   Si salva sul dispositivo solo la pagina HTML delle lezioni già aperte (massimo 30, via le più vecchie)
   e i file pubblici di Next (/_next/static) che servono a farla funzionare. Mai risposte delle verifiche né
   dati di altri: la memoria si svuota all'uscita dall'account (messaggio «cd-clear-lessons»). */
async function saveLessonResponse(url, res) {
  const ct = res.headers.get("content-type");
  if (!CdOffline.canStoreLesson({ status: res.status, redirected: res.redirected, type: res.type, contentType: ct })) return;
  const html = await res.clone().text();
  const headers = new Headers({
    "content-type": "text/html; charset=utf-8",
    "x-cd-saved-at": String(Date.now()),
    "x-cd-title": encodeURIComponent(CdOffline.titleFromHtml(html)),
  });
  const cache = await caches.open(CdOffline.LESSONS_CACHE);
  await cache.put(url, new Response(html, { headers }));
  const entries = [];
  for (const k of await cache.keys()) {
    const r = await cache.match(k);
    entries.push({ url: k.url, savedAt: Number(r && r.headers.get("x-cd-saved-at")) });
  }
  await Promise.all(CdOffline.lessonsToEvict(entries).map((u) => cache.delete(u)));
}

async function trimStatic(cache) {
  const keys = await cache.keys();
  await Promise.all(CdOffline.staticToEvict(keys.map((k) => k.url)).map((u) => cache.delete(u)));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate" && CdOffline.isLessonPath(url.pathname)) {
    const key = url.origin + url.pathname; // senza query
    event.respondWith(
      fetch(req).then(
        (res) => {
          event.waitUntil(saveLessonResponse(key, res.clone()).catch(() => {}));
          return res;
        },
        async () => (await (await caches.open(CdOffline.LESSONS_CACHE)).match(key)) || (await caches.match(OFFLINE_URL)),
      ),
    );
    return;
  }

  // File pubblici e immutabili di Next: prima la memoria, poi la rete.
  if (CdOffline.isStaticAsset(url.pathname)) {
    event.respondWith(
      caches.open(CdOffline.STATIC_CACHE).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.status === 200 && res.type === "basic") {
          await cache.put(req, res.clone());
          event.waitUntil(trimStatic(cache));
        }
        return res;
      }),
    );
  }
});

self.addEventListener("message", (event) => {
  if (CdOffline.isClearMessage(event.data)) {
    event.waitUntil(caches.delete(CdOffline.LESSONS_CACHE));
    return;
  }
  const id = CdOffline.lessonIdFromMessage(event.data);
  if (id) {
    // Il sito dice «ho aperto questa lezione»: la scarico (con i cookie dell'utente) e la tengo per l'offline.
    const path = "/lezione/" + id;
    event.waitUntil(
      fetch(path, { headers: { accept: "text/html" }, credentials: "same-origin" })
        .then((res) => saveLessonResponse(self.location.origin + path, res))
        .catch(() => {}),
    );
  }
});
