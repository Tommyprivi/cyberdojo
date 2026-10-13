# CyberDojo

Scuola online italiana di cybersecurity: pratica prima della teoria, nessun salto di livello senza prova superata.

Decisioni vincolanti: [DECISIONS.md](DECISIONS.md). Database: [docs/database.md](docs/database.md).

## Avvio
```bash
pnpm install
pnpm dev
```
Apri http://localhost:3000. Senza `.env.local` funzionano home, corsi, lezione di prova e Pratica. Account e salvataggio progressi richiedono il database (copia `.env.example` in `.env.local`).

## Controlli
| Comando | Cosa fa |
|---|---|
| `pnpm test` | Test unitari (generatori, lint dei contenuti) |
| `pnpm lint:content` | Frontmatter, ID, prerequisiti, struttura delle lezioni |
| `pnpm check:contrast` | Contrasto AA dei token, tema chiaro e scuro |
| `pnpm lint` / `pnpm typecheck` | ESLint e TypeScript |
| `pnpm build` | Build di produzione |

## Contenuti
Le lezioni sono MDX in `content/<corso>/<modulo>/<id>.mdx`. Le schermate si separano con `{/* screen */}`. Stati: `draft` → `ai-reviewed` → `tested` → `published`. Per `published` servono `approved: true` e, in C8, `human_reviewed: true`.

MDX solo da fonti fidate (il repository): il rendering consente espressioni JavaScript nelle props.

## Licenze
Codice: MIT (`LICENSE`). Contenuti: tutti i diritti riservati (`CONTENT-LICENSE.md`).
