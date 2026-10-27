/* Studio senza internet: regole pure (senza rete né memoria), così si provano con i test.
   Usato da sw.js con importScripts e dai test (src/lib/offline/policy.test.ts).
   Le lezioni sono private: si salva solo quello che l'utente ha già aperto, per questo dispositivo. */
(function (root) {
  var LESSONS_CACHE = "cyberdojo-lezioni-v1";
  var STATIC_CACHE = "cyberdojo-statici-v1";
  var MAX_LESSONS = 30;
  var MAX_STATIC = 400;
  var LESSON_ID = /^[A-Z]\.\d{2}\.\d{3}$/;
  var LESSON_PATH = /^\/lezione\/([A-Z]\.\d{2}\.\d{3})$/;

  function isLessonPath(pathname) {
    return typeof pathname === "string" && LESSON_PATH.test(pathname);
  }
  function isStaticAsset(pathname) {
    return typeof pathname === "string" && pathname.indexOf("/_next/static/") === 0;
  }
  /* Solo una pagina HTML completa e normale: niente errori, reindirizzamenti (login, percorso) o flussi RSC. */
  function canStoreLesson(r) {
    return r.status === 200 && !r.redirected && r.type === "basic" && /^text\/html/i.test(r.contentType || "");
  }
  /* Indirizzi da togliere perché le lezioni salvate sono più del limite: via le più vecchie. */
  function lessonsToEvict(entries, max) {
    var limit = typeof max === "number" ? max : MAX_LESSONS;
    var sorted = entries.slice().sort(function (a, b) {
      var x = isFinite(a.savedAt) ? a.savedAt : -Infinity;
      var y = isFinite(b.savedAt) ? b.savedAt : -Infinity;
      return x === y ? 0 : x < y ? -1 : 1;
    });
    var extra = sorted.length - limit;
    return extra > 0
      ? sorted.slice(0, extra).map(function (e) {
          return e.url;
        })
      : [];
  }
  /* Le chiavi della memoria arrivano in ordine di inserimento: si tolgono le prime. */
  function staticToEvict(keys, max) {
    var limit = typeof max === "number" ? max : MAX_STATIC;
    return keys.length > limit ? keys.slice(0, keys.length - limit) : [];
  }
  function isOwnCache(name) {
    return name === LESSONS_CACHE || name === STATIC_CACHE;
  }
  function titleFromHtml(html) {
    var m = /<title[^>]*>([^<]*)<\/title>/i.exec(html || "");
    if (!m) return "";
    return m[1]
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#x27;|&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .trim()
      .slice(0, 200);
  }
  function isClearMessage(d) {
    return !!d && typeof d === "object" && d.type === "cd-clear-lessons";
  }
  function lessonIdFromMessage(d) {
    if (!d || typeof d !== "object" || d.type !== "cd-save-lesson") return null;
    return typeof d.id === "string" && LESSON_ID.test(d.id) ? d.id : null;
  }

  var api = {
    LESSONS_CACHE: LESSONS_CACHE,
    STATIC_CACHE: STATIC_CACHE,
    MAX_LESSONS: MAX_LESSONS,
    MAX_STATIC: MAX_STATIC,
    isLessonPath: isLessonPath,
    isStaticAsset: isStaticAsset,
    canStoreLesson: canStoreLesson,
    lessonsToEvict: lessonsToEvict,
    staticToEvict: staticToEvict,
    isOwnCache: isOwnCache,
    titleFromHtml: titleFromHtml,
    isClearMessage: isClearMessage,
    lessonIdFromMessage: lessonIdFromMessage,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CdOffline = api;
})(typeof self !== "undefined" ? self : this);
