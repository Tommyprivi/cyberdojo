# Pubblicare CyberDojo su Vercel (link gratuito, senza scadenza)

Il link che ottieni da Vercel (tipo `cyberdojo.vercel.app`) è gratuito e non scade. Dopo puoi collegare il dominio `cyberdojo.it`.

## 1. Account e progetto
1. Vai su vercel.com e registrati con GitHub (gratis).
2. Metti il progetto su GitHub (repository privato va bene).
3. In Vercel: **Add New → Project**, scegli il repository, poi **Deploy**.

## 2. Variabili d'ambiente (i valori li inserisci tu, mai in chat)
In **Settings → Environment Variables** aggiungi quelle elencate in `.env.example`, con i valori di produzione:
- `DATABASE_URL`, `DATABASE_URL_APP` (un database Neon di produzione, separato da quello di sviluppo)
- `BETTER_AUTH_SECRET` (nuovo, lungo, casuale)
- `BETTER_AUTH_URL` = `https://IL-TUO-LINK.vercel.app` (poi `https://cyberdojo.it`)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `CRON_SECRET`, `CONTACT_EMAIL`
- `GROQ_API_KEY` o `GEMINI_API_KEY` (per l'AI Dojo)
- **Non impostare** `ENABLE_INTERNAL_TOOLS` e `SHOW_DRAFTS`: così gli strumenti interni restano chiusi.

Poi **Redeploy**.

## 3. Database di produzione
Con l'URL del proprietario, dal tuo computer: `pnpm db:migrate`. Non usare il database di sviluppo.

## 4. Google e Resend
- Google Cloud: aggiungi `https://IL-TUO-LINK.vercel.app/api/auth/callback/google` tra gli URI di reindirizzamento.
- Resend: per spedire a tutti serve il dominio verificato (vedi sotto).

## 5. Dominio cyberdojo.it
1. Compra il dominio (registrar a prezzo di costo, es. Cloudflare Registrar).
2. In Vercel: **Settings → Domains → Add** `cyberdojo.it`, segui i record DNS che ti mostra.
3. Su Resend: aggiungi il dominio con i record SPF/DKIM e cambia `EMAIL_FROM` in `CyberDojo <ciao@cyberdojo.it>`.
4. Aggiorna `BETTER_AUTH_URL` e Google con `https://cyberdojo.it`.

## 6. Promemoria orari
Lo scheduler chiama `https://cyberdojo.it/api/cron/reminders` ogni ora con l'intestazione `Authorization: Bearer <CRON_SECRET>` (GitHub Actions o cron-job.org).

## Controllo finale
Apri il link, registra un account di prova, verifica che le lezioni si vedano e che l'email di benvenuto arrivi.
