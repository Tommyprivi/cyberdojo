import { describe, expect, it } from "vitest";
import {
  classifyAddress,
  describeNetwork,
  formatIpv4,
  fromInt,
  maskFromPrefix,
  octetBinary,
  parseIpv4,
  prefixFromMask,
  toInt,
  type Ipv4,
} from "./netcalc";

const ip = (s: string) => parseIpv4(s)!;
const fmt = formatIpv4;

describe("parseIpv4", () => {
  it("accetta quattro numeri da 0 a 255", () => {
    expect(parseIpv4("192.168.1.66")).toEqual([192, 168, 1, 66]);
    expect(parseIpv4(" 0.0.0.0 ")).toEqual([0, 0, 0, 0]);
    expect(parseIpv4("255.255.255.255")).toEqual([255, 255, 255, 255]);
  });

  it("rifiuta tutto il resto", () => {
    for (const bad of ["", "1.2.3", "1.2.3.4.5", "256.1.1.1", "1.2.3.-4", "a.b.c.d", "01.2.3.4", "1..3.4", "1.2.3.4 5", "1,2,3,4", "999.999.999.999", "1.2.3.04"]) {
      expect(parseIpv4(bad), bad).toBeNull();
    }
  });
});

describe("conversioni", () => {
  it("toInt e fromInt sono l'uno l'inverso dell'altro, anche sopra 2^31", () => {
    for (const s of ["0.0.0.0", "255.255.255.255", "128.0.0.1", "192.168.1.66", "10.0.0.1"]) {
      expect(fmt(fromInt(toInt(ip(s))))).toBe(s);
    }
    expect(toInt(ip("255.255.255.255"))).toBe(4294967295);
    expect(toInt(ip("128.0.0.0"))).toBe(2147483648);
  });

  it("octetBinary mantiene gli zeri iniziali", () => {
    expect(octetBinary(66)).toBe("01000010");
    expect(octetBinary(0)).toBe("00000000");
    expect(octetBinary(255)).toBe("11111111");
  });
});

describe("maschere", () => {
  it("dal prefisso alla maschera", () => {
    expect(fmt(maskFromPrefix(24))).toBe("255.255.255.0");
    expect(fmt(maskFromPrefix(26))).toBe("255.255.255.192");
    expect(fmt(maskFromPrefix(12))).toBe("255.240.0.0");
    expect(fmt(maskFromPrefix(0))).toBe("0.0.0.0");
    expect(fmt(maskFromPrefix(32))).toBe("255.255.255.255");
  });

  it("rifiuta prefissi impossibili", () => {
    for (const p of [-1, 33, 1.5, NaN]) expect(() => maskFromPrefix(p)).toThrow();
  });

  it("dalla maschera al prefisso, solo se è continua", () => {
    for (let p = 0; p <= 32; p++) expect(prefixFromMask(maskFromPrefix(p))).toBe(p);
    expect(prefixFromMask(ip("255.0.255.0"))).toBeNull();
    expect(prefixFromMask(ip("255.255.255.1"))).toBeNull();
  });
});

describe("describeNetwork", () => {
  it("192.168.1.66/24, il caso del laboratorio", () => {
    const n = describeNetwork(ip("192.168.1.66"), 24);
    expect(fmt(n.network)).toBe("192.168.1.0");
    expect(fmt(n.broadcast)).toBe("192.168.1.255");
    expect(fmt(n.firstHost)).toBe("192.168.1.1");
    expect(fmt(n.lastHost)).toBe("192.168.1.254");
    expect(fmt(n.mask)).toBe("255.255.255.0");
    expect(fmt(n.wildcard)).toBe("0.0.0.255");
    expect(n.hosts).toBe(254);
    expect(n.bits).toEqual(["11000000", "10101000", "00000001", "01000010"]);
  });

  it("10.1.2.3/8 e 172.16.5.9/12", () => {
    const a = describeNetwork(ip("10.1.2.3"), 8);
    expect([fmt(a.network), fmt(a.broadcast), a.hosts]).toEqual(["10.0.0.0", "10.255.255.255", 16777214]);
    const b = describeNetwork(ip("172.16.5.9"), 12);
    expect([fmt(b.network), fmt(b.broadcast), b.hosts]).toEqual(["172.16.0.0", "172.31.255.255", 1048574]);
  });

  it("192.168.1.130/26: la rete non inizia da .0", () => {
    const n = describeNetwork(ip("192.168.1.130"), 26);
    expect([fmt(n.network), fmt(n.broadcast), fmt(n.firstHost), fmt(n.lastHost), n.hosts]).toEqual([
      "192.168.1.128", "192.168.1.191", "192.168.1.129", "192.168.1.190", 62,
    ]);
  });

  it("i casi limite /0, /30, /31 e /32", () => {
    const all = describeNetwork(ip("8.8.8.8"), 0);
    expect([fmt(all.network), fmt(all.broadcast), all.hosts]).toEqual(["0.0.0.0", "255.255.255.255", 4294967294]);
    expect(describeNetwork(ip("192.168.1.5"), 30).hosts).toBe(2);
    const p2p = describeNetwork(ip("192.168.1.5"), 31);
    expect([fmt(p2p.firstHost), fmt(p2p.lastHost), p2p.hosts]).toEqual(["192.168.1.4", "192.168.1.5", 2]);
    const one = describeNetwork(ip("192.168.1.5"), 32);
    expect([fmt(one.firstHost), fmt(one.lastHost), one.hosts]).toEqual(["192.168.1.5", "192.168.1.5", 1]);
  });

  it("rete e broadcast sono coerenti per ogni prefisso", () => {
    for (let p = 0; p <= 32; p++) {
      const n = describeNetwork(ip("203.45.99.201"), p);
      expect(toInt(n.network)).toBeLessThanOrEqual(toInt(n.ip));
      expect(toInt(n.ip)).toBeLessThanOrEqual(toInt(n.broadcast));
      expect(toInt(n.broadcast) - toInt(n.network) + 1).toBe(2 ** (32 - p));
    }
  });
});

describe("classifyAddress", () => {
  const scope = (s: string) => classifyAddress(ip(s)).scope;
  const id = (s: string) => classifyAddress(ip(s)).id;

  it("le tre reti private e i loro confini", () => {
    for (const s of ["10.0.0.1", "10.255.255.254", "172.16.0.1", "172.31.255.255", "192.168.0.1", "192.168.255.255"]) {
      expect(scope(s), s).toBe("privato");
    }
  });

  it("i vicini delle reti private sono pubblici (la trappola del 172)", () => {
    for (const s of ["9.255.255.255", "11.0.0.1", "172.15.255.255", "172.32.0.1", "172.40.12.9", "192.167.1.1", "192.169.0.1"]) {
      expect(scope(s), s).toBe("pubblico");
    }
  });

  it("gli indirizzi speciali hanno il loro nome", () => {
    expect(id("127.0.0.1")).toBe("loopback");
    expect(id("169.254.1.1")).toBe("link-local");
    expect(id("100.64.0.1")).toBe("cgnat");
    expect(id("100.127.255.255")).toBe("cgnat");
    expect(scope("100.128.0.1")).toBe("pubblico");
    expect(id("224.0.0.251")).toBe("multicast");
    expect(id("240.0.0.1")).toBe("reserved");
    expect(id("255.255.255.255")).toBe("limited-broadcast");
    expect(id("203.0.113.9")).toBe("doc-3");
    expect(id("192.0.2.1")).toBe("doc-1");
    expect(id("198.51.100.7")).toBe("doc-2");
    expect(id("0.0.0.0")).toBe("this-network");
  });

  it("un indirizzo normale è pubblico", () => {
    for (const s of ["8.8.8.8", "1.1.1.1", "185.109.166.189", "93.184.216.34"]) expect(scope(s), s).toBe("pubblico");
  });

  it("è d'accordo con il generatore degli esercizi sulle tre reti private", async () => {
    const { isPrivate } = await import("./practice/ip");
    for (let a = 0; a < 256; a += 5) {
      for (let b = 0; b < 256; b += 3) {
        const addr: Ipv4 = [a, b, 7, 9];
        // Solo le tre reti RFC 1918: gli altri blocchi speciali non rientrano in isPrivate.
        expect(classifyAddress(addr).scope === "privato", `${a}.${b}`).toBe(isPrivate(addr));
      }
    }
  });
});
