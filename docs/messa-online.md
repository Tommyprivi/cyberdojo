# Messa online di CyberDojo

Cosa serve dal titolare (io non posso comprare né creare account):

1. **Dominio**: registra `cyberdojo.it` (controllato il 14 ottobre 2026: disponibile, circa 20 dollari il primo anno). Registrar consigliati: Cloudflare Registrar (a prezzo di costo), Namecheap, Aruba. Per i domini .it serve un'identità italiana: il registrar guida nel passaggio.
2. **Hosting**: un account Vercel (gratuito per iniziare) collegato al repository. Alternative: Netlify, Cloudflare Pages.
3. **Database di produzione**: un progetto Neon separato da quello di sviluppo (o un ramo di produzione), così non si mescolano i dati.

Cosa faccio io appena hai il dominio e gli account:

- Variabili d'ambiente di produzione (elenco in `.env.example`; i valori li incolli tu nell'hosting, mai in chat): `DATABASE_URL`, `DATABASE_URL_APP`, `BETTER_AUTH_SECRET` (nuovo), `BETTER_AUTH_URL` (https://cyberdojo.it), Google (`GOOGLE_CLIENT_ID/SECRET` con l'indirizzo di produzione aggiunto nella console Google), `RESEND_API_KEY`, `EMAIL_FROM`, `CRON_SECRET`, `GROQ_API_KEY` o `GEMINI_API_KEY` per l'AI Dojo, `CONTACT_EMAIL`.
- Migrazioni sul database di produzione (`pnpm db:migrate` con l'URL del proprietario).
- Dominio su Resend: record DNS di verifica (SPF/DKIM) per spedire da `@cyberdojo.it`.
- Scheduler orario dei promemoria: chiama `/api/cron/reminders` con `Authorization: Bearer <CRON_SECRET>` (GitHub Actions o cron-job.org).
- Controlli finali: `pnpm build`, test, lint, contrasti, verifica dei video; strumenti interni chiusi in produzione (non impostare `ENABLE_INTERNAL_TOOLS`); lezioni `published` solo se hanno un video.
- Prima del lancio pubblico con minori: rileggere privacy, termini e pagina minori con un consulente; AI Dojo con piano senza addestramento sui dati.
