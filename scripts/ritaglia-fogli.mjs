/**
 * Ritaglia in file singoli le immagini dei «fogli» generati con l'IA (design/fogli/foglio-NN.jpg).
 * Ogni voce: foglio, file di uscita, riquadro [x, y, larghezza, altezza] e opzioni:
 *   transparent: lo sfondo crema collegato ai bordi diventa trasparente (per oggetti da sovrapporre);
 *   dropLabel:   toglie la scritta sotto l'elemento;
 *   scale:       ingrandimento (default: raddoppia se il lato maggiore è sotto i 400 px).
 * Uso: node scripts/ritaglia-fogli.mjs   (richiede `sharp`, già tra le dipendenze di Next).
 */
import { createRequire } from "node:module";
import { mkdirSync, readdirSync } from "node:fs";
import { dirname } from "node:path";

const pnpm = "node_modules/.pnpm";
const sharpDir = readdirSync(pnpm).find((d) => d.startsWith("sharp@"));
const sharp = createRequire(`${process.cwd()}/${pnpm}/${sharpDir}/node_modules/sharp/`)("sharp");

const T = { transparent: true };
const L = { transparent: true, dropLabel: true };

/** [foglio, uscita, [x, y, w, h], opzioni] */
const SPEC = [
  // Foglio 31: il Sensei in 12 pose
  ...[
    ["felice", [66, 78, 207, 240]], ["pensa", [360, 52, 213, 240]], ["studia", [625, 98, 168, 221]], ["triste", [889, 41, 168, 278]],
    ["celebra", [84, 359, 191, 256]], ["cuffie", [342, 383, 204, 232]], ["microfono", [614, 383, 190, 232]], ["dorme", [889, 376, 167, 239]],
    ["lente", [87, 676, 190, 232]], ["scudo", [330, 676, 222, 232]], ["allenatore", [616, 676, 213, 232]], ["correzione-codice", [840, 672, 269, 236]],
  ].map(([n, r]) => [31, `public/img/mascotte/sensei-${n}.png`, r, L]),

  // Foglio 29: negozio
  ...[
  ["fascia-blu", [28, 48, 140, 90]], ["fascia-oro", [196, 48, 140, 90]], ["fascia-nera", [364, 48, 140, 90]], ["fascia-verde", [533, 48, 140, 90]],
  ["elmo-samurai", [874, 28, 140, 112]], ["corona", [1043, 38, 135, 100]], ["cappello-pirata", [1198, 38, 160, 100]],
  ["cappello-mago", [28, 193, 140, 120]], ["cappello-cuoco", [198, 198, 135, 115]], ["cappello-paglia", [356, 198, 155, 120]],
  ["ventaglio", [1033, 220, 155, 105]], ["katana-di-carta", [1203, 193, 155, 145]],
  ["cuffie", [33, 383, 135, 118]], ["occhiali-tondi", [198, 403, 130, 65]],
].map(([n, r]) => [29, `public/img/negozio/${n}.png`, r, T]),
  [29, "public/img/negozio/negozio.png", [512, 200, 395, 305], T],
  [29, "public/img/negozio/moneta.png", [1045, 392, 110, 110], T],
  ...[
    ["sfondo-dojo", [22, 557, 320, 183]], ["sfondo-giardino-zen", [360, 557, 320, 183]], ["sfondo-montagna", [697, 557, 320, 183]], ["sfondo-notte-lanterne", [1033, 557, 320, 183]],
  ].map(([n, r]) => [29, `public/img/negozio/${n}.png`, r, {}]),

  // Foglio 28: cinture, medaglie, leghe, pergamena
  ...[["bianca", 35], ["gialla", 225], ["arancione", 418], ["verde", 608], ["blu", 800], ["marrone", 990], ["nera", 1182]].map(([n, x]) => [28, `public/img/premi/cintura-${n}.png`, [x - 4, 38, 168, 106], T]),
  ...[["primo-caso", 106], ["serie-3", 274], ["serie-7", 442], ["serie-30", 610], ["sfida", 778], ["certificato", 944], ["ctf", 1112], ["ascolto", 1278]].map(([n, c]) => [28, `public/img/premi/medaglia-${n}.png`, [c - 68, 214, 136, 168], T]),
  ...[["bronzo", 93], ["argento", 238], ["oro", 383], ["zaffiro", 527], ["rubino", 672], ["diamante", 817]].map(([n, c]) => [28, `public/img/premi/lega-${n}.png`, [c - 62, 502, 124, 168], T]),
  [28, "public/img/premi/certificato-pergamena.png", [912, 443, 433, 296], {}],

  // Foglio 27: funzioni
  ...[["tutorial-1-porta", 31], ["tutorial-2-sentiero", 198], ["tutorial-3-sensei", 364], ["tutorial-4-premi", 531]].map(([n, x]) => [27, `public/img/funzioni/${n}.png`, [x - 2, 60, 160, 152], {}]),
  ...[["test-ingresso", 31], ["prova-padronanza", 198], ["ripasso", 364], ["mappa-sapere", 531]].map(([n, x]) => [27, `public/img/funzioni/${n}.png`, [x - 2, 276, 160, 148], {}]),
  [27, "public/img/funzioni/cerca.png", [722, 68, 90, 90], T], [27, "public/img/funzioni/glossario.png", [826, 72, 98, 80], T],
  [27, "public/img/funzioni/appunti.png", [944, 72, 76, 82], T], [27, "public/img/funzioni/segnalibro.png", [1052, 72, 54, 82], T],
  [27, "public/img/funzioni/ascolta-lezione.png", [1144, 66, 86, 88], T], [27, "public/img/funzioni/sensei-voce.png", [1258, 76, 100, 64], T],
  [27, "public/img/funzioni/ctf-copertina.png", [721, 278, 181, 229], {}],
  [27, "public/img/funzioni/ctf-crittografia.png", [924, 288, 116, 98], T], [27, "public/img/funzioni/ctf-forensics.png", [1072, 282, 116, 106], T], [27, "public/img/funzioni/ctf-web.png", [1222, 284, 118, 102], T],
  [27, "public/img/funzioni/ctf-password.png", [932, 424, 110, 106], T], [27, "public/img/funzioni/ctf-reti.png", [1072, 422, 118, 106], T], [27, "public/img/funzioni/ctf-osint.png", [1212, 422, 136, 108], T],
  [27, "public/img/funzioni/docente.png", [28, 603, 152, 140], T], [27, "public/img/funzioni/eventi-dal-vivo.png", [188, 601, 175, 140], T], [27, "public/img/funzioni/duello.png", [366, 616, 156, 118], T],
  [27, "public/img/funzioni/classe.png", [551, 603, 165, 136], T], [27, "public/img/funzioni/portfolio.png", [724, 603, 165, 136], T], [27, "public/img/funzioni/notifiche.png", [930, 610, 130, 130], T],
  [27, "public/img/funzioni/offline.png", [1076, 610, 130, 130], T], [27, "public/img/funzioni/installa-app.png", [1258, 601, 86, 142], T],

  // Foglio 26: stati vuoti e messaggi
  [26, "public/img/stati/vuoto-appunti.png", [42, 28, 158, 222], T], [26, "public/img/stati/vuoto-segnalibri.png", [255, 28, 124, 222], T],
  [26, "public/img/stati/errore-404.png", [435, 62, 296, 188], T], [26, "public/img/stati/manutenzione.png", [778, 28, 264, 214], T], [26, "public/img/stati/successo.png", [1082, 88, 296, 156], T],

  // Foglio 25: icone dell'app e grafiche per i negozi
  [25, "public/img/app/icona-app-crema.png", [47, 35, 270, 258], {}], [25, "public/img/app/icona-app-blu.png", [363, 35, 273, 258], {}],
  [25, "public/img/app/grafica-funzione.png", [1012, 295, 361, 178], {}], [25, "public/img/app/immagine-condivisione.png", [1012, 520, 361, 200], {}],

  // Foglio 30: copertine dei corsi nuovi (provvisorie: risoluzione bassa)
  ...[
    ["sviluppo-web", [1038, 18, 320, 210]], ["programmazione", [18, 245, 262, 267]], ["app-telefono", [297, 245, 251, 267]], ["intelligenza-artificiale", [563, 245, 249, 267]],
    ["database-grandi-dati", [830, 245, 248, 267]], ["cloud-devops", [1096, 245, 262, 267]],
    ["reti-internet", [18, 528, 322, 210]], ["hacking-etico", [357, 528, 323, 210]], ["blockchain", [697, 528, 323, 210]], ["mondo-digitale", [1037, 528, 321, 210]],
  ].map(([n, r]) => [30, `public/img/corsi/${n}.png`, r, { cover: true }]),
];

const dist = (d, i, bg) => Math.abs(d[i] - bg[0]) + Math.abs(d[i + 1] - bg[1]) + Math.abs(d[i + 2] - bg[2]);
const sheets = new Map();
async function loadSheet(n) {
  if (!sheets.has(n)) {
    const img = sharp(`design/fogli/foglio-${n}.jpg`).removeAlpha();
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    sheets.set(n, { data, W: info.width, H: info.height, bg: [data[0], data[1], data[2]] });
  }
  return sheets.get(n);
}

async function cut(n, out, [rx, ry, rw, rh], opts) {
  const s = await loadSheet(n);
  const x0 = Math.max(0, rx), y0 = Math.max(0, ry), w = Math.min(s.W - x0, rw), h = Math.min(s.H - y0, rh);
  const px = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const si = ((y0 + y) * s.W + x0 + x) * 3, di = (y * w + x) * 4;
      px[di] = s.data[si]; px[di + 1] = s.data[si + 1]; px[di + 2] = s.data[si + 2]; px[di + 3] = 255;
    }
  const bg = s.bg;
  const ink = (x, y) => dist(px, (y * w + x) * 4, bg) > 70;
  // 1) riquadro del contenuto (e scritta sotto, se va tolta)
  let top = 0, bottom = h - 1, left = 0, right = w - 1;
  const rowHas = (y) => { for (let x = 0; x < w; x++) if (ink(x, y)) return true; return false; };
  const colHas = (x, a, b) => { for (let y = a; y <= b; y++) if (ink(x, y)) return true; return false; };
  while (top < h && !rowHas(top)) top++;
  while (bottom > top && !rowHas(bottom)) bottom--;
  if (opts.dropLabel) {
    // risale dal fondo: ultimo blocco di righe con inchiostro = scritta, se c'è uno stacco di almeno 5 righe
    let y = bottom;
    while (y > top && rowHas(y)) y--;           // scritta
    const labelTop = y + 1;
    let gap = 0;
    while (y > top && !rowHas(y)) { gap++; y--; }
    if (gap >= 5 && y > top && bottom - labelTop < (bottom - top) * 0.4) bottom = y;
  }
  while (left < w && !colHas(left, top, bottom)) left++;
  while (right > left && !colHas(right, top, bottom)) right--;
  const pad = opts.cover ? 0 : 6;
  const cx0 = Math.max(0, left - pad), cy0 = Math.max(0, top - pad), cx1 = Math.min(w - 1, right + pad), cy1 = Math.min(h - 1, bottom + pad);
  const cw = cx1 - cx0 + 1, ch = cy1 - cy0 + 1;
  const buf = Buffer.alloc(cw * ch * 4);
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const si = ((cy0 + y) * w + cx0 + x) * 4, di = (y * cw + x) * 4;
    buf[di] = px[si]; buf[di + 1] = px[si + 1]; buf[di + 2] = px[si + 2]; buf[di + 3] = 255;
  }
  // 2) sfondo trasparente: riempimento dai bordi
  if (opts.transparent) {
    const seen = new Uint8Array(cw * ch);
    const st = [];
    const push = (x, y) => { const i = y * cw + x; if (!seen[i] && dist(buf, i * 4, bg) <= 54) { seen[i] = 1; st.push(i); } };
    for (let x = 0; x < cw; x++) { push(x, 0); push(x, ch - 1); }
    for (let y = 0; y < ch; y++) { push(0, y); push(cw - 1, y); }
    while (st.length) {
      const i = st.pop(), x = i % cw, y = (i / cw) | 0;
      buf[i * 4 + 3] = 0;
      if (x > 0) push(x - 1, y); if (x < cw - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < ch - 1) push(x, y + 1);
    }
    // bordo sfumato: i pixel vicini al vuoto diventano un po' trasparenti in base a quanto somigliano allo sfondo
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      const i = y * cw + x;
      if (seen[i]) continue;
      const near = (x > 0 && seen[i - 1]) || (x < cw - 1 && seen[i + 1]) || (y > 0 && seen[i - cw]) || (y < ch - 1 && seen[i + cw]);
      if (near) buf[i * 4 + 3] = Math.min(255, 90 + dist(buf, i * 4, bg) * 3);
    }
  }
  let img = sharp(buf, { raw: { width: cw, height: ch, channels: 4 } });
  const scale = opts.scale ?? (opts.cover ? 3 : Math.max(cw, ch) < 400 ? 2 : 1);
  if (scale !== 1) img = img.resize(Math.round(cw * scale), Math.round(ch * scale), { kernel: "lanczos3" });
  mkdirSync(dirname(out), { recursive: true });
  await img.png({ compressionLevel: 9 }).toFile(out);
  return `${out} ${Math.round(cw * scale)}x${Math.round(ch * scale)}`;
}

let ok = 0;
for (const [n, out, rect, opts] of SPEC) {
  console.log(await cut(n, out, rect, opts));
  ok++;
}
console.log(`\n${ok} immagini ritagliate.`);
