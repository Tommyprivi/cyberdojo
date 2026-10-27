# Social (classifica, amici, gruppi, sfide)

Pagine: `/social` (schede Classifica, Amici, Gruppi, Sfide) e `/profilo/social` (soprannome, avatar, interruttori).
Codice: `src/lib/social/*` (regole e logica), `src/app/actions/social.ts` (azioni), `src/components/social/*` (interfaccia),
`src/lib/db/schema-social.ts` e `drizzle/0005_social.sql` (database).

## Cosa NON esiste, di proposito
Chat libera, messaggi privati, foto, testo libero visibile ad altri, ricerca globale di utenti, nomi reali.
L'unico testo libero visibile ad altri è il soprannome (molto vincolato). I nomi dei gruppi si compongono da elenchi chiusi.

## Regole per i minori (14-17)
- Tutto è opt-in e spento di default (tre interruttori separati: classifica, mostra agli amici, accetta richieste).
- Due fasce separate: minori e adulti non si vedono mai in classifica e non possono essere amici (controllo nell'app, nelle funzioni SQL e nei trigger).
- Amici solo con codice invito scambiato fuori dal sito (richiesta da accettare, oppure link di invito: vedi «Invito per WhatsApp»); massimo 30.
- I minori non creano gruppi: entrano solo con codice, in gruppi "per 14-17" creati da un adulto responsabile (unica eccezione alla separazione). Ogni gruppo dichiara «visibile ai membri». Massimo 40 persone, 5 gruppi per persona, 3 gruppi creati per adulto.
- Se la fascia d'età nel profilo cambia, il social si azzera (soprannome, amici, gruppi): `resetSocialIfAgeChanged` in `saveProfile`.
- Segnala = blocco immediato (reciproco per la visibilità); salva solo tipo, id pubblico, motivo (elenco chiuso) e data, e manda un'email a `CONTACT_EMAIL` senza dati personali.

## Scelte tecniche
- **Dati altrui solo da funzioni SQL SECURITY DEFINER in sola lettura** (`social_leaderboard`, `social_friends`, `social_my_groups`, `social_group_detail`, `social_resolve_*_code`). Leggono l'utente da `app.user_id` (impostato da `withUser`), restituiscono solo soprannome, avatar, XP e un id pubblico opaco. Le lezioni dei singoli membri di un gruppo non escono mai: solo i totali.
- **Trigger** ripetono le regole (età, limiti, cooldown soprannome 7 giorni, creatore adulto) anche se l'app venisse aggirata. Se cambi un numero in `src/lib/social/rules.ts`, cambialo anche nella migrazione (nuova migrazione).
- **Settimana**: lunedì 00:00 - lunedì 00:00, ora di Roma (`src/lib/social/week.ts`, gestisce l'ora legale). Gli XP della settimana si calcolano da `xp_events`; nulla da azzerare.
- **Sfide**: l'iscrizione è salvata, l'avanzamento no (si calcola da lezioni e XP dopo l'iscrizione). Medaglie «Sfidante» (1 vinta) e «Campione di sfide» (5), contate solo su settimane concluse.
- **Segnalazioni**: tabella solo-inserimento (l'app non può rileggerla). Per moderare, apri `social_reports` come proprietario, trova la persona con `social_profiles.public_id` e, se serve, metti `nickname = null` e spegni i consensi.
- **Soprannome**: 3-16 caratteri ASCII, parole vietate IT/EN (con trucchi tipo «c4zz0»), riservati, mai nome o email, unico (senza maiuscole e separatori), cambio ogni 7 giorni. La lista in `nickname.ts` è una base da ampliare con le segnalazioni.
- Cancellazione account: cascata su tutto (anche i gruppi creati, con i loro membri). Esportazione: sezione `social` in `exportMyData`.

## Rischi residui / da fare
- La fascia d'età è dichiarata, non verificata: un adulto può dichiararsi minore o creare un gruppo "per ragazzi". Mitigazioni: nessuna chat, codici, segnalazioni. Valutare un ruolo «docente» verificato dal titolare.
- Il cambio di fascia nel profilo non ha attesa: da limitare. La policy UPDATE delle amicizie non ha un trigger che blocchi la modifica degli id (l'app aggiorna solo lo stato).
- Limiti (30/40/5/3) senza blocco di concorrenza: richieste parallele possono superarli di poco.
- Limite dei tentativi sui codici in memoria (per istanza). Le serie dei congelamenti degli amici non sono mostrate.
- Lista di parole vietate da ampliare; i testi legali vanno rivisti da un professionista (versioni dei documenti non cambiate).

## Community grande (annunci, reazioni, classifiche per corso, squadre)
Codice: `src/lib/community/*` (regole pure con test), `src/app/actions/community.ts` (azioni), `src/components/announcements/*`, `src/components/social/teams-compare.tsx`. Database: migrazione 0006.

- **Commenti a frasi, niente testo libero.** Sotto un annuncio si sceglie da un elenco chiuso: reazioni 👍 🔥 🎉 ❤️ 🤯 👏 (una per persona e per annuncio) e frasi `grazie`, `bellissimo`, `non-vedo-lora`, `ottimo-lavoro`, `ho-una-domanda`, `funziona-bene`, `ho-unidea` (testi in `reactions.ts`). Il database ripete l'elenco con un vincolo CHECK. Gli altri vedono solo i conteggi (funzioni SQL `announcement_reaction_counts` e `announcement_phrase_counts`), mai chi ha scelto cosa. Se cambi l'elenco, cambialo anche in una nuova migrazione. Limite: 20 azioni al minuto per persona (in memoria, per istanza).
- **Annunci dello staff** (`/annunci/scrivi`). Staff = riga in `staff_roles` OPPURE email verificata nella variabile `STAFF_EMAILS` (separata da virgole). Il controllo sta in ogni azione lato server (403 per gli altri). Testo semplice o Markdown limitato (titoletti, elenchi, grassetto, corsivo, codice, link https): mai MDX né HTML, e il testo con tag o graffe viene rifiutato. Resa con elementi React, mai HTML grezzo. Il registro di chi ha fatto cosa va nei log del server (`audit: "annunci"`, azione, id utente, id annuncio). Gli annunci dei file in `content/announcements` restano come archivio; gli id del database iniziano per `db-`, quindi non collidono.
- **Attenzione:** le regole del database permettono di scrivere gli annunci solo a chi ha una riga in `staff_roles`. Chi è staff solo per email deve avere anche quella riga.
- **Classifica per corso:** funzione SQL `course_leaderboard` (stessa forma di `social_leaderboard`, conta gli XP delle sole lezioni del corso nella settimana). Stesse regole: solo chi partecipa, solo la propria fascia d'età.
- **Sfide a squadre:** nessuna tabella nuova. Confronto dei gruppi dell'utente per XP della settimana (solo totali di gruppo, più la media per persona), separato per fascia (minori/adulti).
- **Novità viste per account:** `profiles.seen_news_version`; il localStorage resta come ripiego senza sessione.

## Docente verificato e classi
Codice: `src/lib/docente/*` (regole pure con test), `src/app/actions/docente.ts`, `src/app/(app)/docente/page.tsx` (pagina `/docente`), `src/components/social/share-progress-toggle.tsx`. Database: migrazione 0009 (funzione `class_progress`, ancora da applicare).

- **Il ruolo docente non si auto-assegna.** Lo dà solo il proprietario del database: `npx tsx --env-file=.env.local scripts/aggiungi-staff.mts nome@scuola.it --ruolo docente` (senza `--ruolo` resta «staff»; `--togli` toglie qualunque ruolo). Una riga sola per persona in `staff_roles`: rilanciare con l'altro ruolo lo cambia.
- **Docente e staff sono separati.** Il docente non scrive gli annunci (`hasStaffRole` conta solo staff e admin); lo staff semplice non vede le classi. Attenzione: le policy SQL degli annunci (migrazione 0006) accettano qualunque riga di `staff_roles`, quindi un docente potrebbe scrivere annunci aggirando l'app. Da stringere con una nuova migrazione (`role in ('staff','admin')`).
- **Una classe è un gruppo di studio** creato dal docente (adulto) con audience «minori» o «adulti»; gli studenti entrano col codice. Nessun nuovo canale: niente chat, niente messaggi.
- **Consenso esplicito dello studente** (`group_members.share_progress`, spento di default): interruttore nella scheda del gruppo, con la spiegazione di cosa vede il docente (soprannome, lezioni completate, XP, ultimo giorno attivo). Mai email, risposte o testi. Si spegne quando si vuole; uscendo dal gruppo la riga sparisce.
- **`/docente`**: controllo SEMPRE lato server (ruolo letto dal database; chi non è docente vede «non trovata»). I progressi arrivano solo da `class_progress(gruppo)`, che ripete il controllo (docente o admin E creatore del gruppo) e restituisce solo gli studenti consenzienti. `toProgressRow` tiene solo i campi permessi.
- **Non fatto di proposito:** «mentore» con messaggi tra utenti (rischio per i minori).
- **Da verificare dopo la migrazione 0009:** `class_progress` sul database vero (finora mai provata) e il flusso docente -> classe -> studente consenziente.

## Invito per WhatsApp e «Studia insieme»
Codice: `src/lib/social/invite.ts` e `call-room.ts` (funzioni pure con test), `service.ts` (`getInvitePreview`, `acceptInvite`, `getCall`), azione `acceptFriendInvite`, componenti `invite-share.tsx` e `invite-accept.tsx`, pagine `/invito/[codice]` (pubblica) e `/chiamata/[id]` (protetta). Database: migrazione 0011 (tre funzioni SQL, nessuna tabella; **da applicare**, mai provata sul database vero).

**Invito**
- Ogni persona ha UN solo codice amico; il link è `<origine>/invito/<CODICE>`. Il pannello amici offre «Invita su WhatsApp» (`wa.me`), «Copia il link» e, se il telefono lo permette, «Condividi». Il testo contiene solo il link e il soprannome, e solo se la persona lo mostra agli amici: mai nome, email o altro.
- La pagina valida il codice (`normalizeCode`) e usa lo stesso limite di tentativi di `sendFriendRequest`. Senza accesso rimanda a `/accedi` o `/registrati` con `next=/invito/<codice>`; senza profilo completo passa da `/benvenuto`.
- **Amicizia immediata**: chi accetta diventa subito amico (riga `accepted`, requester = chi usa il link). Lo fa la funzione `friend_accept_by_code` (SECURITY DEFINER), solo se: chi accetta ha un soprannome; il proprietario ha «accetta richieste» attivo e un soprannome; stessa fascia d'età; utenti diversi; nessun blocco; nessuna amicizia già esistente. Il trigger `friendships_guard` ripete età e limite di 30. `friend_invite_preview` (sola lettura) dà soprannome e avatar di chi invita, solo se si mostra agli amici (altrimenti «un amico»).
- **Consenso**: chi accetta vede cosa vedrà l'amico (soprannome, avatar, serie, XP della settimana; mai email né nome) e deve spuntare la casella; l'accettazione imposta `show_to_friends = true` nella stessa transazione. Senza soprannome, un primo passo (soprannome e avatar) con le azioni esistenti.
- **Motivo non rivelato**: codice inesistente, proprietario che non accetta richieste, fasce d'età diverse, blocchi, amicizia già esistente e limite dell'altra persona danno lo stesso messaggio gentile, che ricorda la regola delle fasce d'età. Rischio noto: chi ha il link può diventare amico senza che il proprietario approvi, quindi il link va dato solo a persone fidate; basta «Rinnova» o «Spegni» il codice per annullarlo.

**Studia insieme (chiamate)**
- Chat, voce, video e schermo con Jitsi Meet, senza server nostri e senza nuove tabelle. Base configurabile con `JITSI_BASE_URL` (solo https, default `https://meet.jit.si`; da aggiungere a `.env.example`).
- **Solo adulti.** Il pulsante appare solo agli adulti; ai minori una nota («Le chiamate sono per ora solo tra adulti…»). Il controllo vero è sempre sul server: `/chiamata/[id]` chiama `getCall`, che legge dal database (`friend_call_info`) la fascia d'età di ENTRAMBI, lo stato dell'amicizia e i blocchi, e applica `isCallAllowed` (adulti con adulti, amicizia accettata, nessun blocco). Altrimenti «non trovata».
- **Stanza**: `cyberdojo-` + 24 caratteri esadecimali di HMAC-SHA256(`BETTER_AUTH_SECRET`, id amicizia). Uguale per i due amici, stabile, non indovinabile; il segreto non lascia il server.
- Pre-ingresso Jitsi attivo, video spento all'inizio, nome mostrato = proprio soprannome. CyberDojo non registra né salva nulla; avviso in pagina che la chiamata passa da Jitsi e di non condividere dati personali.
- **Da valutare**: la fascia d'età è dichiarata, non verificata (vedi rischi sopra): un minore che si dichiara adulto potrebbe entrare nelle chiamate tra adulti. Gli ospiti Jitsi non sono controllati da noi.
