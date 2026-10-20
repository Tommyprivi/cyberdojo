/**
 * Cornice comune delle email: stessa identità del sito (carta, inchiostro, indaco), ma con tabelle e stili
 * in linea, perché i programmi di posta ignorano i fogli di stile e le immagini sono spesso bloccate:
 * il marchio è testo, nessuna immagine da caricare.
 */

const C = { paper: "#f4efe6", surface: "#fffdf8", ink: "#1a1612", muted: "#5c5448", line: "#d8d0bf", primary: "#1f3a5f", seal: "#b8321c" };

/** Testo dell'utente dentro l'HTML: va sempre neutralizzato, altrimenti un nome come «<b>» rompe l'email. */
export function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export type Block =
  | { type: "p"; text: string }
  | { type: "button"; label: string; url: string }
  | { type: "note"; text: string };

export type FooterLine = { text: string; link?: { label: string; url: string } };
export type EmailContent = {
  subject: string;
  preheader: string;
  title: string;
  blocks: Block[];
  footer: FooterLine[];
  /** Immagine di testata (indirizzo assoluto). Facoltativa: se le immagini sono bloccate, l'email resta leggibile. */
  banner?: string;
};

const FONT_TEXT = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const FONT_SERIF = "Georgia,'Times New Roman',serif";

export function renderHtml(c: EmailContent): string {
  const body = c.blocks
    .map((b) => {
      if (b.type === "p") return `<p style="margin:0 0 16px;font-family:${FONT_TEXT};font-size:16px;line-height:1.6;color:${C.ink}">${esc(b.text)}</p>`;
      if (b.type === "note")
        return `<p style="margin:0 0 16px;padding:12px 14px;background:${C.paper};border-left:4px solid ${C.seal};font-family:${FONT_TEXT};font-size:14px;line-height:1.5;color:${C.muted}">${esc(b.text)}</p>`;
      return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px"><tr><td style="background:${C.primary};border-radius:6px"><a href="${esc(b.url)}" style="display:inline-block;padding:13px 24px;font-family:${FONT_TEXT};font-size:16px;font-weight:600;color:#ffffff;text-decoration:none">${esc(b.label)}</a></td></tr></table><p style="margin:0 0 16px;font-family:${FONT_TEXT};font-size:13px;color:${C.muted}">Se il pulsante non funziona, copia questo indirizzo nel browser:<br><a href="${esc(b.url)}" style="color:${C.primary};word-break:break-all">${esc(b.url)}</a></p>`;
    })
    .join("");

  const footer = c.footer
    .map(
      (l) =>
        `<p style="margin:0 0 6px;font-family:${FONT_TEXT};font-size:12px;line-height:1.5;color:${C.muted}">${esc(l.text)}${
          l.link ? ` <a href="${esc(l.link.url)}" style="color:${C.primary}">${esc(l.link.label)}</a>` : ""
        }</p>`,
    )
    .join("");

  return `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(c.subject)}</title></head>
<body style="margin:0;padding:0;background:${C.paper}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(c.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:${C.surface};border:1px solid ${C.line};border-top:3px solid ${C.ink}">
<tr><td style="padding:24px 32px 0;font-family:${FONT_SERIF};font-size:22px;font-weight:bold;color:${C.ink}"><span style="display:inline-block;padding:2px 6px;background:${C.seal};color:#ffffff;font-size:14px;border-radius:3px;margin-right:8px">道場</span>CyberDojo</td></tr>
${
    c.banner
      ? `<tr><td style="padding:0;line-height:0"><img src="${esc(c.banner)}" width="600" alt="" style="display:block;width:100%;max-width:600px;height:auto;border:0"></td></tr>\n`
      : ""
  }<tr><td style="padding:20px 32px 0"><h1 style="margin:0;font-family:${FONT_SERIF};font-size:28px;line-height:1.2;color:${C.ink}">${esc(c.title)}</h1></td></tr>
<tr><td style="padding:16px 32px 8px">${body}</td></tr>
<tr><td style="padding:16px 32px 28px;border-top:1px solid ${C.line}">${footer}</td></tr>
</table></td></tr></table></body></html>`;
}

/** Versione solo testo: chi non vede l'HTML deve avere lo stesso contenuto e gli stessi link. */
export function renderText(c: EmailContent): string {
  const body = c.blocks
    .map((b) => (b.type === "button" ? `${b.label}: ${b.url}` : b.text))
    .join("\n\n");
  const footer = c.footer.map((l) => (l.link ? `${l.text} ${l.link.label}: ${l.link.url}` : l.text)).join("\n");
  return `${c.title}\n\n${body}\n\n--\n${footer}\n`;
}
