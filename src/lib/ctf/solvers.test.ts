import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { buildFor, findChallenge } from "./catalog";
import { caesar, vigenere } from "./gen";
import type { Artifact } from "./types";
import { LOGIN_SELECT, LOGIN_TEMPLATE, runQuery, SEARCH_SELECT, SEARCH_TEMPLATE } from "./sqlsim";

/* Ogni sfida viene risolta «come un giocatore» con codice scritto qui, indipendente dai generatori. */

const USERS = Array.from({ length: 25 }, (_, i) => `utente-${i}`);
const SECRET = "s";

function each(id: string, solve: (a: Artifact, built: ReturnType<typeof buildFor>) => string) {
  const c = findChallenge(id)!;
  expect(c, id).toBeDefined();
  for (const u of USERS) {
    const b = buildFor(SECRET, u, c);
    expect(solve(b.artifact, b).toLowerCase(), `${id}/${u}`).toBe(b.flag);
  }
}

const body = (a: Artifact) => (a.kind === "text" ? a.body : "");
const lines = (a: Artifact) => (a.kind === "log" ? a.lines : []);
const rows = (a: Artifact) => (a.kind === "table" ? a.rows : []);
const lastWord = (s: string) => s.trim().split(" ").pop()!;
const hexBytes = (h: string) => h.trim().split(/\s+/).map((x) => parseInt(x, 16));
const text = (bs: number[]) => String.fromCharCode(...bs);
const ipOf = (l: string) => /from (\S+) /.exec(l)![1];

describe("crittografia", () => {
  it("cesare: prova tutti gli spostamenti", () => {
    each("cesare-biglietto", (a) => {
      const s = [...Array(26).keys()].map((k) => caesar(body(a), k)).find((t) => t.startsWith("la parola d'ordine del club e "))!;
      return `cyberdojo{${lastWord(s)}}`;
    });
  });
  it("base64", () => each("base64-messaggio", (a) => `cyberdojo{${lastWord(Buffer.from(body(a), "base64").toString())}}`));
  it("esadecimale", () => each("esadecimale-nota", (a) => `cyberdojo{${lastWord(text(hexBytes(body(a))))}}`));
  it("xor con chiave", () =>
    each("xor-chiave-nota", (a) => {
      const [k, h] = body(a).split("\n").map((l) => l.split(": ")[1]);
      return `cyberdojo{${lastWord(text(hexBytes(h).map((b) => b ^ Number(k))))}}`;
    }));
  it("vigenere", () =>
    each("vigenere-club", (a) => {
      const [k, m] = body(a).split("\n").map((l) => l.split(": ")[1]);
      return `cyberdojo{${lastWord(vigenere(m, k, true))}}`;
    }));
  it("xor con prefisso noto", () =>
    each("xor-prefisso-noto", (a) => {
      const bs = hexBytes(body(a));
      const key = bs[0] ^ "C".charCodeAt(0);
      return text(bs.map((b) => b ^ key));
    }));
  it("due strati", () =>
    each("strati-cifrati", (a) => {
      const inner = Buffer.from(body(a), "base64").toString();
      const s = [...Array(26).keys()].map((k) => caesar(inner, k)).find((t) => t.startsWith("la parola e "))!;
      return `cyberdojo{${lastWord(s)}}`;
    }));
});

describe("log", () => {
  it("firewall: l'indirizzo con più righe DENY sulla 22", () =>
    each("firewall-intruso", (a) => {
      const count = new Map<string, number>();
      for (const l of lines(a)) if (l.includes("DENY") && l.endsWith(":22")) count.set(/src=(\S+)/.exec(l)![1], (count.get(/src=(\S+)/.exec(l)![1]) ?? 0) + 1);
      const top = [...count.entries()].sort((x, y) => y[1] - x[1]);
      expect(top.length).toBe(1);
      return `cyberdojo{${top[0][0].replace(/\./g, "-")}}`;
    }));
  it("file notturno", () =>
    each("file-notturno", (a) => {
      const odd = rows(a).filter((r) => Number(r[1].slice(11, 13)) < 6);
      expect(odd).toHaveLength(1);
      return `cyberdojo{${odd[0][0].split(".")[0]}}`;
    }));
  it("ssh: accesso esterno riuscito", () =>
    each("ssh-primo-accesso", (a) => {
      const acc = lines(a).filter((l) => l.includes("Accepted") && !/from (10\.|192\.168\.)/.test(l));
      expect(acc).toHaveLength(1);
      const user = /for (\S+) from/.exec(acc[0])![1];
      const t = /^Mar 14 (\d\d):(\d\d):/.exec(acc[0])!;
      return `cyberdojo{${user}-${t[1]}${t[2]}}`;
    }));
  it("forza bruta: prima falliti, poi accettato", () =>
    each("forza-bruta", (a) => {
      const l = lines(a);
      const hits = l.flatMap((line, i) => {
        if (!line.includes("Accepted")) return [];
        const ip = ipOf(line);
        return l.slice(0, i).some((x) => x.includes("Failed") && x.includes(`from ${ip} `)) && !/^(10\.|192\.168\.)/.test(ip) ? [line] : [];
      });
      expect(hits).toHaveLength(1);
      return `cyberdojo{${/for (\S+) from/.exec(hits[0])![1]}_${ipOf(hits[0]).replace(/\./g, "-")}}`;
    }));
});

describe("web e password", () => {
  it("commento dimenticato", () => each("commento-dimenticato", (a) => `cyberdojo{${/codice di servizio: (\S+) -->/.exec(body(a))![1]}}`));
  it("xss: il campo in grassetto", () =>
    each("xss-concetto", (a) => {
      const bad = rows(a).filter((r) => r[2].includes("GRASSETTO"));
      expect(bad).toHaveLength(1);
      return `cyberdojo{xss_${bad[0][0]}_${/ID (\d+)/.exec((a as { title: string }).title)![1]}}`;
    }));
  it("md5 riconosciuto dalla lunghezza", () =>
    each("hash-riconosci-md5", (a) => `cyberdojo{md5_${rows(a).find((r) => r[1].length === 32)![0].toLowerCase()}}`));
  it("tabella hash", () =>
    each("hash-tabella-md5", (a) => {
      const h = (a as { title: string }).title.split(": ")[1];
      return `cyberdojo{${rows(a).find((r) => r[1] === h)![0]}}`;
    }));
  it("stessa password", () =>
    each("hash-stessa-password", (a) => {
      const by = new Map<string, string[]>();
      for (const [u, h] of rows(a)) by.set(h, [...(by.get(h) ?? []), u]);
      const twins = [...by.values()].find((v) => v.length === 2)!.sort();
      return `cyberdojo{${twins[0]}_${twins[1]}}`;
    }));
  it("sale + sha256", () =>
    each("hash-con-sale", (a) => {
      const [salt, hash, cands] = body(a).split("\n").map((l) => l.split(": ")[1]);
      const pw = cands.split(", ").find((c) => createHash("sha256").update(salt + c).digest("hex") === hash)!;
      return `cyberdojo{${pw}}`;
    }));
});

describe("SQL finto", () => {
  it("login: admin'-- entra e mostra la nota con la bandiera", () => {
    const c = findChallenge("sql-login-finto")!;
    for (const u of USERS) {
      const b = buildFor(SECRET, u, c);
      const res = runQuery(LOGIN_SELECT, LOGIN_TEMPLATE, ["admin'--", ""], b.sql!.rows);
      expect(String(res.rows[0].note).toLowerCase()).toContain(b.flag.slice(9));
      expect(runQuery(LOGIN_SELECT, LOGIN_TEMPLATE, ["admin", ""], b.sql!.rows).rows).toHaveLength(0);
    }
  });
  it("ricerca: il prodotto nascosto esce solo con il commento", () => {
    const c = findChallenge("sql-ricerca-nascosta")!;
    for (const u of USERS) {
      const b = buildFor(SECRET, u, c);
      const ok = runQuery(SEARCH_SELECT, SEARCH_TEMPLATE, ["' OR 1=1 --"], b.sql!.rows);
      expect(ok.rows.map((r) => String(r.note)).join(" ").toLowerCase()).toContain(b.flag.slice(9));
      const normal = runQuery(SEARCH_SELECT, SEARCH_TEMPLATE, [""], b.sql!.rows);
      expect(JSON.stringify(normal.rows).toLowerCase()).not.toContain(b.flag.slice(9));
    }
  });
});

describe("reti", () => {
  const bytesOfHex = (a: Artifact) => (a.kind === "hex" ? hexBytes(a.hex) : []);
  it("ip sorgente: byte 12-15", () => each("pacchetto-ip-sorgente", (a) => `cyberdojo{${bytesOfHex(a).slice(12, 16).join("-")}}`));
  it("protocollo e porta di destinazione", () =>
    each("pacchetto-protocollo-porta", (a) => {
      const b = bytesOfHex(a);
      const proto = b[9] === 6 ? "tcp" : "udp";
      return `cyberdojo{${proto}-${(b[22] << 8) | b[23]}}`;
    }));
  it("payload dopo 20 + data offset", () =>
    each("pacchetto-payload", (a) => {
      const b = bytesOfHex(a);
      expect((b[0] & 0xf) * 4).toBe(20);
      const tcpOff = ((b[20 + 12] >> 4) & 0xf) * 4;
      return `cyberdojo{${text(b.slice(20 + tcpOff)).replace("token=", "")}}`;
    }));
  it("il checksum IP del pacchetto è valido (somma = 0xFFFF)", () => {
    const c = findChallenge("pacchetto-protocollo-porta")!;
    const b = hexBytes((buildFor(SECRET, "u", c).artifact as { hex: string }).hex);
    let sum = 0;
    for (let i = 0; i < 20; i += 2) sum += (b[i] << 8) | b[i + 1];
    while (sum > 0xffff) sum = (sum & 0xffff) + (sum >>> 16);
    expect(sum).toBe(0xffff);
  });
});

describe("OSINT", () => {
  const posts = (a: Artifact) => (a.kind === "posts" ? a.items : []);
  it("animale: «il mio»", () =>
    each("osint-nome-animale", (a) => {
      const p = posts(a).find((x) => /il mio (cane|gatto) (\w+)/.test(x.text))!;
      return `cyberdojo{${/il mio (?:cane|gatto) (\w+)/.exec(p.text)![1]}}`;
    }));
  it("password prevedibile", () =>
    each("osint-password-prevedibile", (a) => {
      const all = posts(a).map((p) => p.text);
      const year = /sono del (\d{4})/.exec(all.join(" "))![1];
      const pet = /La mia (?:cagnolina|gattina) (\w+)/.exec(all.join(" "))![1];
      return `cyberdojo{${pet}${year}}`;
    }));
  it("abitudini", () =>
    each("osint-abitudini", (a) => {
      const count = new Map<string, number>();
      for (const p of posts(a)) {
        const place = /luogo: ([^\]]+)\]/.exec(p.text)![1];
        count.set(place, (count.get(place) ?? 0) + 1);
      }
      const [place] = [...count.entries()].sort((x, y) => y[1] - x[1])[0];
      const day = posts(a).find((p) => p.text.includes(place))!.when.split(" ")[0].replace("ì", "i");
      return `cyberdojo{${place.toLowerCase().replace(/ /g, "-")}_${day}}`;
    }));
});
