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
- Amici solo con codice invito scambiato fuori dal sito; serve l'accettazione di entrambi; massimo 30.
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
