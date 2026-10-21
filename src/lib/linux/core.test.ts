import { describe, expect, it } from "vitest";
import { braceExpand, expandWords } from "./expand";
import { expandGlob, globMatch } from "./glob";
import { ParseError, parse, tokenize } from "./parser";
import { basename, dirname, isInside, normalize, tildify } from "./path";
import { applyChmod, hasPerm, modeString } from "./perms";
import { buildFs } from "./scenarios";
import { identityOf } from "./users";

const studente = identityOf("studente")!;
const root = identityOf("root")!;

describe("percorsi", () => {
  it("normalizza . e ..", () => {
    expect(normalize("a/./b/../c", "/x")).toBe("/x/a/c");
    expect(normalize("../../..", "/a/b")).toBe("/");
    expect(normalize("/a//b/", "/")).toBe("/a/b");
  });
  it("dirname, basename, tilde", () => {
    expect(dirname("/a/b/c")).toBe("/a/b");
    expect(dirname("/a")).toBe("/");
    expect(basename("/a/b.txt")).toBe("b.txt");
    expect(tildify("/home/studente/x", "/home/studente")).toBe("~/x");
    expect(tildify("/home/studente", "/home/studente")).toBe("~");
    expect(tildify("/var", "/home/studente")).toBe("/var");
  });
  it("isInside", () => {
    expect(isInside("/a/b", "/a")).toBe(true);
    expect(isInside("/ab", "/a")).toBe(false);
  });
});

describe("permessi", () => {
  it("modeString", () => {
    expect(modeString({ kind: "file", owner: "a", group: "b", mode: 0o644, content: "", mtime: 0 })).toBe("-rw-r--r--");
    expect(modeString({ kind: "dir", owner: "a", group: "b", mode: 0o755, children: {}, mtime: 0 })).toBe("drwxr-xr-x");
  });
  it("chmod ottale", () => {
    expect(applyChmod("755", 0, false)).toBe(0o755);
    expect(applyChmod("0600", 0o777, false)).toBe(0o600);
    expect(applyChmod("999", 0, false)).toBeNull();
  });
  it("chmod simbolico", () => {
    expect(applyChmod("u+x", 0o644, false)).toBe(0o744);
    expect(applyChmod("go-rwx", 0o755, false)).toBe(0o700);
    expect(applyChmod("a=r", 0o755, false)).toBe(0o444);
    expect(applyChmod("u=rwx,g=rx,o=", 0o000, false)).toBe(0o750);
    expect(applyChmod("+x", 0o644, false)).toBe(0o755);
    expect(applyChmod("a+X", 0o644, false)).toBe(0o644);
    expect(applyChmod("a+X", 0o644, true)).toBe(0o755);
    expect(applyChmod("u+q", 0o644, false)).toBeNull();
    expect(applyChmod("", 0o644, false)).toBeNull();
  });
  it("hasPerm: proprietario, gruppo, altri, root", () => {
    const f = { kind: "file" as const, owner: "studente", group: "lab", mode: 0o640, content: "", mtime: 0 };
    expect(hasPerm(f, studente, "w")).toBe(true);
    expect(hasPerm(f, identityOf("alice")!, "r")).toBe(true); // alice è nel gruppo lab
    expect(hasPerm(f, identityOf("alice")!, "w")).toBe(false);
    expect(hasPerm(f, identityOf("ospite")!, "r")).toBe(false);
    expect(hasPerm(f, root, "w")).toBe(true);
    expect(hasPerm(f, root, "x")).toBe(false); // root non esegue file senza bit x
  });
});

describe("parser", () => {
  it("separa parole e operatori", () => {
    expect(tokenize("ls -l | grep x").map((t) => t.k)).toEqual(["word", "word", "op", "word", "word"]);
  });
  it("virgolette tengono insieme le parole", () => {
    const [ao] = parse(`echo "a b" 'c d'`);
    const cmd = ao.first.cmds[0];
    expect(cmd.kind === "simple" && cmd.words.length).toBe(3);
  });
  it("pipe, && e ||", () => {
    const [ao] = parse("a | b && c || d");
    expect(ao.first.cmds).toHaveLength(2);
    expect(ao.rest.map((r) => r.op)).toEqual(["&&", "||"]);
  });
  it("redirezioni", () => {
    const [ao] = parse("cat < a > b 2>> c 2>&1");
    const cmd = ao.first.cmds[0];
    expect(cmd.kind === "simple" && cmd.redirs.map((r) => r.op)).toEqual(["<", ">", "2>>", "2>&1"]);
  });
  it("virgolette non chiuse sono un errore", () => {
    expect(() => parse(`echo "ciao`)).toThrow(ParseError);
    expect(() => parse(`echo 'ciao`)).toThrow(ParseError);
  });
  it("errori di sintassi", () => {
    expect(() => parse("ls |")).toThrow(ParseError);
    expect(() => parse("| ls")).toThrow(ParseError);
    expect(() => parse("echo (a)")).toThrow(ParseError);
    expect(() => parse("fi")).toThrow(ParseError);
    expect(() => parse("cat >")).toThrow(ParseError);
  });
  it("commenti ignorati", () => {
    expect(parse("# solo commento")).toHaveLength(0);
    expect(parse("echo a # commento")).toHaveLength(1);
  });
  it("blocchi for e if su più righe", () => {
    const l = parse("for x in a b; do\n echo $x\ndone\nif true; then echo ok; else echo no; fi");
    expect(l).toHaveLength(2);
    expect(l[0].first.cmds[0].kind).toBe("for");
    expect(l[1].first.cmds[0].kind).toBe("if");
  });
  it("for senza done è un errore", () => {
    expect(() => parse("for x in a; do echo $x")).toThrow(ParseError);
  });
  it("niente aritmetica $((...))", () => {
    expect(() => parse("echo $((1+1))")).toThrow(ParseError);
  });
  it("rifiuta righe enormi", () => {
    expect(() => parse("a".repeat(5000))).toThrow(ParseError);
  });
});

describe("graffe e glob", () => {
  it("braceExpand", () => {
    expect(braceExpand("a{1,2}b")).toEqual(["a1b", "a2b"]);
    expect(braceExpand("{1..3}")).toEqual(["1", "2", "3"]);
    expect(braceExpand("x{a,b}{1,2}")).toEqual(["xa1", "xa2", "xb1", "xb2"]);
    expect(braceExpand("{solo}")).toEqual(["{solo}"]);
  });
  it("globMatch", () => {
    expect(globMatch("*.txt", "a.txt")).toBe(true);
    expect(globMatch("*.txt", "a.md")).toBe(false);
    expect(globMatch("f?.c", "f1.c")).toBe(true);
    expect(globMatch("[ab]*", "bello")).toBe(true);
    expect(globMatch("[!ab]*", "bello")).toBe(false);
    expect(globMatch("A*", "ada", true)).toBe(true);
  });
  it("expandGlob sul filesystem", () => {
    const fs = buildFs("base");
    expect(expandGlob(fs, "/home/studente/Documenti", "*.txt", studente)).toEqual(["appunti.txt", "lista_spesa.txt"]);
    expect(expandGlob(fs, "/home/studente", "Doc*/ut*", studente)).toEqual(["Documenti/utenti.csv"]);
    expect(expandGlob(fs, "/home/studente", "*.zzz", studente)).toEqual([]);
    expect(expandGlob(fs, "/", "/home/*", studente)).toEqual(["/home/alice", "/home/bob", "/home/ospite", "/home/studente"]);
  });
  it("il glob non mostra i file nascosti, a meno che il modello inizi con il punto", () => {
    const fs = buildFs("base");
    expect(expandGlob(fs, "/home/studente", "*rc", studente)).toEqual([]);
    expect(expandGlob(fs, "/home/studente", ".*rc", studente)).toEqual([".bashrc"]);
  });
  it("expandWords: variabili, tilde, virgolette, graffe", () => {
    const env = { getVar: (n: string) => ({ A: "x y", B: "z" })[n], subst: () => "out", glob: () => [], home: "/h" };
    const w = (s: string) => {
      const c = parse(s)[0].first.cmds[0];
      return c.kind === "simple" ? expandWords(c.words, env) : [];
    };
    expect(w("$A")).toEqual(["x", "y"]);
    expect(w(`"$A"`)).toEqual(["x y"]);
    expect(w("~/f")).toEqual(["/h/f"]);
    expect(w("'$B'")).toEqual(["$B"]);
    expect(w("f{1,2}")).toEqual(["f1", "f2"]);
    expect(w("$(boh)")).toEqual(["out"]);
    expect(w("$NIENTE")).toEqual([]);
    expect(w(`""`)).toEqual([""]);
  });
});
