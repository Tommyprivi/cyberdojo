# Piano per la lingua inglese (da fare dopo le chiamate)

Stato: SOLO PIANO, nessun codice scritto. Preparato il 27 ottobre 2026 leggendo il codice (Next 16.4.3, React 19.3, cacheComponents attivo).
Regola: nessun URL esistente deve rompersi (link condivisi, /invito, /lezione, assetlinks, manifest, app Android, PWA). L'italiano resta la lingua principale e il ripiego.

## Cosa c'è da tradurre (stima)
- **Interfaccia:** circa 200 file con testi italiani (85 in `src/app`, 117 in `src/components`), 73 pagine, 24 file di azioni server (messaggi d'errore), 8 rotte API. Stringhe scritte a mano: 3.000–4.500.
- **Testi lunghi:** pagine pubbliche ≈ 6.800 parole (privacy 1.418, termini 1.040, minori 694, app 710, laboratorio 751, cookie 511, crediti 509, accessibilità 557, contatti 331, aggiornamenti 247); email ≈ 1.860 parole (`src/lib/mail`); glossario 161 termini; prompt del tutor AI ≈ 860 parole.
- **Lezioni:** 665 file `.mdx`, circa 756.000 parole. Per corso: dati 183k (149 lezioni), cybersecurity 168k (134), trading 99k (89), hedge 80k (76), fondamenta 80k (74), programmazione 40k, IA 40k, sviluppo web 38k, mondo digitale 29k. In più circa 4.900 tag `<Say>` (voce).
- **Domande:** circa 7.200 domande scritte a mano (≈ 323.000 parole) più i generatori con seme.
- **Totale:** circa 1,1 milioni di parole di contenuti più 60.000 di interfaccia, email e legale.

## Architettura scelta: preferenza (cookie + profilo), URL invariati
- La lingua si risolve in UN punto sul server: `src/lib/i18n/locale.ts` → `getLocale()`: prima `profiles.locale` (già nel database), poi cookie `cd_locale`, poi `Accept-Language` solo alla prima visita, poi italiano. Si chiama solo dentro `Suspense` (come `getSessionUser`), per non rendere dinamico tutto il sito.
- Dizionari propri: `src/lib/i18n/dict/it/<area>.ts` (fonte di verità, tipi dedotti) e `dict/en/<area>.ts` tipato (TypeScript segnala le chiavi mancanti). Aree: common, nav, auth, profile, social, shop, lesson, practice, mail, notif, errors.
- Server: `getT()`. Client: `<I18nProvider>` dentro un componente dinamico in Suspense + `useT()`, passando solo il sotto-dizionario necessario.
- Pagine pubbliche statiche: restano in italiano; l'inglese pubblico (con hreflang) eventualmente con `/en/...` solo per quelle (fase 5, facoltativo).
- Cambio lingua: azione server che aggiorna `profiles.locale` + cookie, e avvisa il service worker di svuotare le cache delle lezioni (versione `cyberdojo-lezioni-v2`).
- `src/proxy.ts` non si tocca per la lingua. Non usare `[locale]` né `next-intl`: stesso costo con più rischi (tocca ogni link, il contenitore Android, il manifest e il service worker) e le lezioni sono dietro login, quindi senza vantaggio SEO.

## Controlli di qualità
- Test `i18n.test.ts`: stesse chiavi it/en, stessi segnaposto, nessun valore vuoto, nessuna chiave inutilizzata o mancante.
- Script `scripts/check-i18n.ts`: cerca stringhe italiane rimaste nel codice, con una soglia che scende a zero.
- Plurali con `Intl.PluralRules`; date e numeri con `Intl` in `src/lib/i18n/format.ts`.

## Contenuti
- **Lezioni:** cartella parallela `content-en/<corso>/<modulo>/<ID>.mdx` con gli stessi ID e la stessa struttura (separatori, `<Say>`, `<Practice>`). Il frontmatter inglese ha solo i campi traducibili; il resto si eredita dall'italiano. Il lint controlla stesso numero di schermate e stessi tag.
- **Caricamento:** `getRawLesson(id, locale)` cerca prima `content-en`, poi ripiega sull'italiano con l'avviso «Questa lezione non è ancora tradotta». Estendere `outputFileTracingIncludes` a `./content-en/**/*`.
- **Domande:** file paralleli `banks-en/<modulo>.ts` con le stesse chiavi e lo stesso ordine; test su stesso numero di domande e opzioni.
- **Voce e ricerca:** la voce usa `en-US`; glossario e ricerca per lingua.
- **Ordine:** 1 Fondamenta (80k parole, ~8 task), 2 Cybersecurity (~14), 3 Dati (~15), 4 Trading (~9), 5 Hedge fund (~8), poi i corsi minori (~14). Totale circa 68 task (1 task = 1 modulo di ~10 lezioni), più circa 6 per glossario, annunci, email e prompt.

## Fasi
- **Fase 0 (uno solo):** fondamenta i18n, selettore lingua nel profilo, persistenza, test e script di controllo. Nessuna stringa tradotta.
- **Fase 1 (in parallelo):** shell e navigazione, pagine pubbliche non legali, accesso, profilo.
- **Fase 2 (in parallelo per area):** percorso/corsi, lezione e strumenti, pratica/ripasso/sfide/CTF, social/duelli/leghe/chiamata, negozio/certificato/portfolio/notifiche.
- **Fase 3:** email (lingua dal profilo del destinatario), notifiche, tutor AI che risponde nella lingua scelta.
- **Fase 4:** contenuti, un modulo per agente (prima i meccanismi: caricamento, lint, ricerca).
- **Fase 5:** testi legali in inglese come «traduzione di cortesia, fa fede l'italiano», con revisione di un legale o madrelingua.

## Decisioni del titolare
1. Lingua per preferenza (consigliato) o per indirizzo `/en/`.
2. Revisione umana delle traduzioni (a campione) e chi la fa.
3. Video: lezioni inglesi con video inglese o con gli stessi video e sottotitoli.
4. Legale: solo traduzione di cortesia.
5. Corsi nuovi in preparazione: tradurli dopo il rilascio italiano.
6. Filtri del social (nickname, segnalazioni) da estendere all'inglese prima di aprire il social agli utenti inglesi.
