import { describe, expect, it } from "vitest";
import { Shell } from "./shell";
import type { ScenarioId } from "./scenarios";

const NOW = new Date(Date.UTC(2026, 9, 20, 10, 5, 0));

function mk(scenario: ScenarioId = "base") {
  const sh = new Shell(scenario, { now: () => NOW });
  const run = (line: string) => sh.run(line).output;
  return { sh, run };
}

describe("navigazione", () => {
  it("pwd e prompt iniziale", () => {
    const { sh, run } = mk();
    expect(run("pwd")).toBe("/home/studente\n");
    expect(sh.prompt()).toBe("studente@lab:~$ ");
  });
  it("cd assoluto, relativo, .., ~ e -", () => {
    const { sh, run } = mk();
    run("cd /var/log");
    expect(sh.prompt()).toBe("studente@lab:/var/log$ ");
    run("cd ..");
    expect(run("pwd")).toBe("/var\n");
    run("cd ~/Documenti");
    expect(sh.cwd).toBe("/home/studente/Documenti");
    expect(run("cd -")).toBe("/var\n");
    run("cd");
    expect(sh.cwd).toBe("/home/studente");
    run("cd Documenti/../Immagini/.");
    expect(sh.cwd).toBe("/home/studente/Immagini");
  });
  it("cd errori", () => {
    const { run } = mk();
    expect(run("cd nonesiste")).toContain("No such file or directory");
    expect(run("cd benvenuto.txt")).toContain("Not a directory");
    expect(run("cd /root")).toContain("Permission denied");
    expect(run("cd a b")).toContain("too many arguments");
  });
  it("$PWD e OLDPWD seguono cd", () => {
    const { run } = mk();
    run("cd /tmp");
    expect(run("echo $PWD $OLDPWD")).toBe("/tmp /home/studente\n");
  });
});

describe("ls", () => {
  it("elenca ordinato e senza nascosti", () => {
    const { run } = mk();
    expect(run("ls")).toBe("accessi.log  appunti  benvenuto.txt  Documenti  frutta.txt  Immagini  indagine  progetti  Scaricati  Scrivania\n");
  });
  it("-a mostra i nascosti, . e ..", () => {
    const { run } = mk();
    const out = run("ls -a");
    expect(out).toContain(".bashrc");
    expect(out.startsWith(".  ..")).toBe(true);
  });
  it("-l: formato lungo con permessi, proprietario e data", () => {
    const { run } = mk();
    const out = run("ls -l Documenti");
    expect(out).toContain("total ");
    expect(out).toMatch(/-rw-r--r-- 1 studente studente\s+\d+ Oct 12 09:30 appunti.txt/);
  });
  it("-la e -lh", () => {
    const { run } = mk();
    expect(run("ls -la")).toContain("drwxr-xr-x");
    expect(run("ls -lh /var/log")).toBe("total 0\n");
  });
  it("-h usa K per i file grandi", () => {
    const { run } = mk("logs");
    expect(run("ls -lh access.log")).toMatch(/\d\.\dK Oct 12 09:30 access.log/);
  });
  it("più cartelle mostrano le intestazioni", () => {
    const { run } = mk();
    const out = run("ls Documenti Immagini");
    expect(out).toContain("Documenti:");
    expect(out).toContain("Immagini:");
  });
  it("file inesistente e cartella proibita", () => {
    const { run } = mk();
    expect(run("ls zzz")).toContain("cannot access 'zzz': No such file or directory");
    expect(run("ls /root")).toContain("cannot open directory '/root': Permission denied");
  });
  it("opzione sconosciuta", () => {
    const { run } = mk();
    expect(run("ls -z")).toContain("invalid option -- 'z'");
  });
  it("-R scende nelle sottocartelle", () => {
    const { run } = mk();
    expect(run("ls -R progetti")).toContain("progetti/sito:");
  });
  it("glob nei comandi", () => {
    const { run } = mk();
    expect(run("ls Documenti/*.csv")).toBe("Documenti/utenti.csv\n");
  });
});

describe("lettura file", () => {
  it("cat, cat -n, cat di più file", () => {
    const { run } = mk();
    expect(run("cat Documenti/lista_spesa.txt")).toContain("latte\npane");
    expect(run("cat -n Documenti/lista_spesa.txt").split("\n")[0]).toBe("     1\tlatte");
    expect(run("cat frutta.txt frutta.txt").split("\n").length).toBe(19);
  });
  it("cat errori", () => {
    const { run } = mk();
    expect(run("cat zzz")).toBe("cat: zzz: No such file or directory\n");
    expect(run("cat Documenti")).toBe("cat: Documenti: Is a directory\n");
    expect(run("cat /etc/shadow")).toContain("Permission denied");
  });
  it("head e tail", () => {
    const { run } = mk();
    expect(run("head -n 2 frutta.txt")).toBe("mela\npera\n");
    expect(run("head -2 frutta.txt")).toBe("mela\npera\n");
    expect(run("tail -n 2 frutta.txt")).toBe("kiwi\npera\n");
    expect(run("tail -n +8 frutta.txt")).toBe("kiwi\npera\n");
    expect(run("head -n 0 frutta.txt")).toBe("");
    expect(run("head -n x frutta.txt")).toContain("invalid number of lines");
  });
  it("head con più file mostra le intestazioni", () => {
    const { run } = mk();
    expect(run("head -n 1 frutta.txt benvenuto.txt")).toContain("==> frutta.txt <==");
  });
  it("wc", () => {
    const { run } = mk();
    expect(run("wc -l frutta.txt")).toBe("9 frutta.txt\n");
    expect(run("cat frutta.txt | wc -l")).toBe("9\n");
    expect(run("wc -w Documenti/lista_spesa.txt")).toBe("6 Documenti/lista_spesa.txt\n");
    expect(run("wc frutta.txt")).toMatch(/9\s+9\s+\d+ frutta.txt/);
    expect(run("wc -l frutta.txt Documenti/lista_spesa.txt")).toContain("total");
  });
  it("less e more stampano il file", () => {
    const { run } = mk();
    expect(run("less frutta.txt")).toContain("mela");
    expect(run("more frutta.txt")).toContain("kiwi");
  });
});

describe("echo, printf, variabili", () => {
  it("echo e opzioni", () => {
    const { run } = mk();
    expect(run("echo ciao mondo")).toBe("ciao mondo\n");
    expect(run("echo -n ciao")).toBe("ciao");
    expect(run("echo -e 'a\\tb'")).toBe("a\tb\n");
    expect(run("echo 'a   b'")).toBe("a   b\n");
  });
  it("printf", () => {
    const { run } = mk();
    expect(run("printf '%s ha %d anni\\n' Ada 36")).toBe("Ada ha 36 anni\n");
    expect(run("printf '%s\\n' a b c")).toBe("a\nb\nc\n");
    expect(run("printf '%5s|%-5s|\\n' ab cd")).toBe("   ab|cd   |\n");
    expect(run("printf '100%%\\n'")).toBe("100%\n");
  });
  it("variabili, export, env", () => {
    const { run } = mk();
    run("X=ciao");
    expect(run("echo $X ${X}!")).toBe("ciao ciao!\n");
    expect(run("env")).not.toContain("X=ciao");
    run("export X");
    expect(run("env")).toContain("X=ciao");
    run("export Y=due");
    expect(run("printenv Y")).toBe("due\n");
    run("unset Y");
    expect(run("echo [$Y]")).toBe("[]\n");
    expect(run("export 1x=3")).toContain("not a valid identifier");
  });
  it("variabili standard", () => {
    const { run } = mk();
    expect(run("echo $HOME $USER")).toBe("/home/studente studente\n");
    expect(run("echo ~")).toBe("/home/studente\n");
  });
  it("$? riporta l'esito", () => {
    const { run } = mk();
    run("ls zzz");
    expect(run("echo $?")).toBe("2\n");
    run("true");
    expect(run("echo $?")).toBe("0\n");
  });
  it("sostituzione di comando", () => {
    const { run } = mk();
    expect(run("echo oggi: $(date +%F)")).toBe("oggi: 2026-10-20\n");
    expect(run("echo $(echo a b)")).toBe("a b\n");
  });
  it("graffe", () => {
    const { run } = mk();
    expect(run("echo a{1,2,3}")).toBe("a1 a2 a3\n");
  });
});

describe("creare, copiare, spostare, eliminare", () => {
  it("mkdir, touch, ls", () => {
    const { run } = mk();
    run("mkdir nuova");
    run("touch nuova/a.txt nuova/b.txt");
    expect(run("ls nuova")).toBe("a.txt  b.txt\n");
  });
  it("mkdir -p e senza -p", () => {
    const { run } = mk();
    expect(run("mkdir x/y/z")).toContain("No such file or directory");
    expect(run("mkdir -p x/y/z")).toBe("");
    expect(run("ls x/y")).toBe("z\n");
    expect(run("mkdir x")).toContain("File exists");
    expect(run("mkdir -p x")).toBe("");
    expect(run("mkdir -p a/{b,c}")).toBe("");
    expect(run("ls a")).toBe("b  c\n");
  });
  it("mkdir in zona protetta", () => {
    const { run } = mk();
    expect(run("mkdir /etc/prova")).toContain("Permission denied");
    run("sudo mkdir /etc/prova");
    expect(run("ls /etc")).toContain("prova");
  });
  it("touch aggiorna la data e rispetta i permessi", () => {
    const { run } = mk();
    run("touch frutta.txt");
    expect(run("ls -l frutta.txt")).toContain("Oct 20 10:05");
    expect(run("touch /etc/nuovo")).toContain("Permission denied");
  });
  it("cp file e cp -r", () => {
    const { run } = mk();
    run("cp frutta.txt copia.txt");
    expect(run("cat copia.txt")).toBe(run("cat frutta.txt"));
    expect(run("cp Documenti backup")).toContain("-r not specified");
    run("cp -r Documenti backup");
    expect(run("ls backup")).toContain("appunti.txt");
    run("cp -r Documenti backup");
    expect(run("ls backup")).toContain("Documenti");
  });
  it("cp errori", () => {
    const { run } = mk();
    expect(run("cp zzz y")).toContain("cannot stat 'zzz'");
    expect(run("cp frutta.txt frutta.txt")).toContain("are the same file");
    expect(run("cp frutta.txt benvenuto.txt Documenti/zzz")).toContain("is not a directory");
    expect(run("cp /etc/shadow .")).toContain("Permission denied");
    expect(run("cp -r Documenti Documenti/dentro")).toContain("into itself");
  });
  it("cp in una cartella", () => {
    const { run } = mk();
    run("cp frutta.txt benvenuto.txt Scrivania");
    expect(run("ls Scrivania")).toBe("benvenuto.txt  frutta.txt\n");
  });
  it("mv rinomina e sposta", () => {
    const { run } = mk();
    run("mv frutta.txt verdura.txt");
    expect(run("ls frutta.txt")).toContain("No such file");
    run("mv verdura.txt Documenti/");
    expect(run("ls Documenti")).toContain("verdura.txt");
    run("mv Documenti Archivio");
    expect(run("ls Archivio")).toContain("appunti.txt");
  });
  it("mv errori", () => {
    const { run } = mk();
    expect(run("mv zzz y")).toContain("cannot stat 'zzz'");
    expect(run("mv Documenti Documenti/x")).toContain("subdirectory of itself");
    expect(run("mv /etc/hosts .")).toContain("percorso di sistema");
  });
  it("rm file, rm -r, rm -f", () => {
    const { run } = mk();
    run("rm frutta.txt");
    expect(run("ls frutta.txt")).toContain("No such file");
    expect(run("rm Documenti")).toContain("Is a directory");
    run("rm -r Documenti");
    expect(run("ls")).not.toContain("Documenti");
    expect(run("rm zzz")).toContain("No such file or directory");
    expect(run("rm -f zzz")).toBe("");
    expect(run("rm")).toContain("missing operand");
    expect(run("rm -rf Immagini Scaricati")).toBe("");
  });
  it("rm blocca i percorsi di sistema con un messaggio didattico", () => {
    const { run } = mk();
    expect(run("rm -rf /")).toContain("percorso di sistema");
    expect(run("sudo rm -rf /etc")).toContain("percorso di sistema");
    expect(run("rm -rf ~")).toContain("percorso di sistema");
    expect(run("rm -rf /home")).toContain("percorso di sistema");
    expect(run("sudo rm -rf /var/log")).toContain("percorso di sistema");
    expect(run("ls /etc")).toContain("passwd");
  });
  it("rm . e ..", () => {
    const { run } = mk();
    expect(run("rm -r .")).toContain("refusing to remove");
    expect(run("rm -r ..")).toContain("refusing to remove");
  });
  it("rm con glob", () => {
    const { run } = mk();
    run("touch a1 a2 b1");
    run("rm a*");
    expect(run("ls")).toContain("b1");
    expect(run("ls")).not.toContain("a1");
  });
  it("rmdir", () => {
    const { run } = mk();
    run("mkdir vuota");
    expect(run("rmdir vuota")).toBe("");
    expect(run("rmdir Documenti")).toContain("Directory not empty");
    expect(run("rmdir frutta.txt")).toContain("Not a directory");
    expect(run("rmdir zzz")).toContain("No such file");
  });
});

describe("redirezioni e pipe", () => {
  it("> sovrascrive, >> aggiunge", () => {
    const { run } = mk();
    run("echo uno > f.txt");
    run("echo due >> f.txt");
    expect(run("cat f.txt")).toBe("uno\ndue\n");
    run("echo tre > f.txt");
    expect(run("cat f.txt")).toBe("tre\n");
  });
  it("< legge da file", () => {
    const { run } = mk();
    expect(run("wc -l < frutta.txt")).toBe("9\n");
    expect(run("wc -l < zzz")).toContain("No such file or directory");
  });
  it("2> e /dev/null", () => {
    const { run } = mk();
    expect(run("ls zzz 2> /dev/null")).toBe("");
    run("ls zzz 2> err.txt");
    expect(run("cat err.txt")).toContain("cannot access");
    run("ls zzz > tutto.txt 2>&1");
    expect(run("cat tutto.txt")).toContain("cannot access");
  });
  it("redirezione verso zona protetta fallisce senza sudo", () => {
    const { run } = mk();
    expect(run("echo x > /etc/prova")).toContain("Permission denied");
    expect(run("echo x > Documenti")).toContain("Is a directory");
    expect(run("echo x > zzz/f")).toContain("No such file or directory");
  });
  it("pipe a più stadi", () => {
    const { run } = mk();
    expect(run("cat frutta.txt | sort | uniq -c | sort -nr | head -n 1")).toBe("      3 mela\n");
  });
  it("tee", () => {
    const { run } = mk();
    expect(run("echo ciao | tee a.txt")).toBe("ciao\n");
    run("echo altro | tee -a a.txt");
    expect(run("cat a.txt")).toBe("ciao\naltro\n");
    expect(run("echo x | tee /etc/prova")).toContain("Permission denied");
  });
  it("&&, || e ;", () => {
    const { run } = mk();
    expect(run("true && echo si")).toBe("si\n");
    expect(run("false && echo si")).toBe("");
    expect(run("false || echo no")).toBe("no\n");
    expect(run("echo a; echo b")).toBe("a\nb\n");
    expect(run("ls zzz 2>/dev/null || echo manca")).toBe("manca\n");
  });
  it("errore di sintassi", () => {
    const { run } = mk();
    expect(run("ls |")).toContain("syntax error");
    expect(run("echo 'aperta")).toContain("unexpected EOF");
  });
});

describe("filtri di testo", () => {
  it("sort, sort -r, -n, -u", () => {
    const { run } = mk();
    expect(run("printf 'b\\nA\\nc\\n' | sort")).toBe("A\nb\nc\n");
    expect(run("printf 'b\\na\\nc\\n' | sort -r")).toBe("c\nb\na\n");
    expect(run("printf '10\\n9\\n100\\n' | sort -n")).toBe("9\n10\n100\n");
    expect(run("printf '10\\n9\\n100\\n' | sort -nr")).toBe("100\n10\n9\n");
    expect(run("printf 'a\\na\\nb\\n' | sort -u")).toBe("a\nb\n");
  });
  it("sort -t -k", () => {
    const { run } = mk();
    expect(run("printf 'x,3\\ny,1\\nz,2\\n' | sort -t, -k2")).toBe("y,1\nz,2\nx,3\n");
  });
  it("uniq", () => {
    const { run } = mk();
    expect(run("printf 'a\\na\\nb\\na\\n' | uniq")).toBe("a\nb\na\n");
    expect(run("printf 'a\\na\\nb\\n' | uniq -c")).toBe("      2 a\n      1 b\n");
    expect(run("printf 'a\\na\\nb\\n' | uniq -d")).toBe("a\n");
    expect(run("printf 'a\\na\\nb\\n' | uniq -u")).toBe("b\n");
  });
  it("cut", () => {
    const { run } = mk();
    expect(run("cut -d, -f1 Documenti/utenti.csv | head -n 2")).toBe("nome\nAda\n");
    expect(run("cut -d, -f1,3 Documenti/utenti.csv | head -n 2")).toBe("nome,ruolo\nAda,admin\n");
    expect(run("cut -d: -f1 /etc/passwd | head -n 1")).toBe("root\n");
    expect(run("echo abcdef | cut -c2-4")).toBe("bcd\n");
    expect(run("echo abc | cut -f1")).toBe("abc\n");
    expect(run("cut Documenti/utenti.csv")).toContain("you must specify");
    expect(run("cut -d,, -f1 x")).toContain("single character");
  });
  it("tr", () => {
    const { run } = mk();
    expect(run("echo ciao | tr a-z A-Z")).toBe("CIAO\n");
    expect(run("echo ciao | tr -d a")).toBe("cio\n");
    expect(run("echo ciao | tr '[:lower:]' '[:upper:]'")).toBe("CIAO\n");
    expect(run("echo 'a  b' | tr -s ' '")).toBe("a b\n");
    expect(run("tr a")).toContain("Two strings");
  });
});

describe("grep", () => {
  it("cerca in un file", () => {
    const { run } = mk();
    expect(run("grep mela frutta.txt")).toBe("mela\nmela\nmela\n");
    expect(run("grep -c mela frutta.txt")).toBe("3\n");
    expect(run("grep -n kiwi frutta.txt")).toBe("8:kiwi\n");
  });
  it("-i e -v", () => {
    const { run } = mk();
    expect(run("grep -i LINUX Documenti/appunti.txt")).toContain("Linux è");
    expect(run("grep LINUX Documenti/appunti.txt")).toBe("");
    expect(run("grep -vc a frutta.txt")).toBe("1\n");
  });
  it("nessuna corrispondenza: codice 1", () => {
    const { run } = mk();
    run("grep zzz frutta.txt");
    expect(run("echo $?")).toBe("1\n");
  });
  it("da pipe", () => {
    const { run } = mk();
    expect(run("cat frutta.txt | grep ^p")).toBe("pera\npera\n");
    expect(run("cat frutta.txt | grep -c a$")).toBe("8\n");
  });
  it("-r e più file mostrano il nome", () => {
    const { run } = mk();
    expect(run("grep -rn Ciao progetti")).toContain("progetti/sito/index.html:1:");
    expect(run("grep Ada Documenti/utenti.csv Documenti/appunti.txt")).toContain("Documenti/utenti.csv:Ada");
    expect(run("grep -l linux -ri Documenti")).toContain("Documenti/appunti.txt");
  });
  it("-E, -F, -w", () => {
    const { run } = mk();
    expect(run("grep -E '^(mela|kiwi)$' frutta.txt")).toBe("mela\nmela\nmela\nkiwi\n");
    expect(run("echo 'a.b' | grep -F 'a.b'")).toBe("a.b\n");
    expect(run("echo 'axb' | grep -F 'a.b'")).toBe("");
    expect(run("echo 'gatto gattone' | grep -wc gatto")).toBe("1\n");
  });
  it("regex in stile BRE: + e ? sono letterali", () => {
    const { run } = mk();
    expect(run("echo 'a+b' | grep 'a+b'")).toBe("a+b\n");
    expect(run("echo 'aab' | grep 'a\\+b'")).toBe("aab\n");
  });
  it("classi POSIX", () => {
    const { run } = mk();
    expect(run("echo 'abc123' | grep '[[:digit:]]'")).toBe("abc123\n");
  });
  it("errori", () => {
    const { run } = mk();
    expect(run("grep x zzz")).toContain("No such file or directory");
    expect(run("grep")).toContain("Usage");
    expect(run("grep '[' frutta.txt")).toContain("invalid regular expression");
    expect(run("grep x Documenti")).toContain("Is a directory");
    expect(run("grep x /etc/shadow")).toContain("Permission denied");
  });
});

describe("find", () => {
  it("-name", () => {
    const { run } = mk();
    expect(run("find . -name '*.txt'")).toContain("./Documenti/appunti.txt");
    expect(run("find Documenti -name 'u*'")).toBe("Documenti/utenti.csv\n");
  });
  it("-type, -maxdepth", () => {
    const { run } = mk();
    expect(run("find progetti -type d")).toBe("progetti\nprogetti/sito\n");
    expect(run("find progetti -maxdepth 1 -type f")).toBe("progetti/README.txt\n");
  });
  it("-iname, -user, -perm", () => {
    const { run } = mk("permessi");
    expect(run("find . -iname 'SEGRETO*' 2>/dev/null")).toBe("./segreto.txt\n");
    expect(run("find . -perm 600 2>/dev/null")).toContain("./segreto.txt");
    expect(run("find . -user alice 2>/dev/null")).toBe("./di_alice.txt\n");
  });
  it("errori", () => {
    const { run } = mk();
    expect(run("find zzz")).toContain("No such file or directory");
    expect(run("find . -foo")).toContain("unknown predicate");
    expect(run("find / -name passwd")).toContain("Permission denied");
  });
});

describe("chmod, chown, chgrp", () => {
  it("chmod ottale e verifica con ls -l", () => {
    const { run } = mk("permessi");
    run("chmod 600 diario.txt");
    expect(run("ls -l diario.txt")).toContain("-rw-------");
  });
  it("chmod +x rende eseguibile uno script", () => {
    const { run } = mk("permessi");
    expect(run("./script.sh")).toContain("Permission denied");
    run("chmod +x script.sh");
    expect(run("./script.sh")).toBe("Funziona! Lo script è stato eseguito.\n");
  });
  it("chmod simbolico", () => {
    const { run } = mk("permessi");
    run("chmod go-r pubblico.txt");
    expect(run("ls -l pubblico.txt")).toContain("-rw-------");
    run("chmod a+rwx pubblico.txt");
    expect(run("ls -l pubblico.txt")).toContain("-rwxrwxrwx");
    run("chmod -x pubblico.txt");
    expect(run("ls -l pubblico.txt")).toContain("-rw-rw-rw-");
  });
  it("chmod -R", () => {
    const { run } = mk("permessi");
    run("chmod -R 700 condiviso");
    expect(run("ls -l condiviso")).toContain("-rwx------");
  });
  it("chmod errori", () => {
    const { run } = mk("permessi");
    expect(run("chmod 999 diario.txt")).toContain("invalid mode");
    expect(run("chmod 644 zzz")).toContain("cannot access 'zzz'");
    expect(run("chmod 644 solo_root.txt")).toContain("Operation not permitted");
    expect(run("chmod")).toContain("missing operand");
    expect(run("chmod 644")).toContain("missing operand after");
    run("sudo chmod 644 solo_root.txt");
    expect(run("cat solo_root.txt")).toContain("Riservato");
  });
  it("chown e chgrp richiedono sudo", () => {
    const { run } = mk("permessi");
    expect(run("chown alice pubblico.txt")).toContain("Operation not permitted");
    expect(run("chgrp lab pubblico.txt")).toContain("Operation not permitted");
    run("sudo chown alice:lab pubblico.txt");
    expect(run("ls -l pubblico.txt")).toContain("alice lab");
    run("sudo chgrp users pubblico.txt");
    expect(run("ls -l pubblico.txt")).toContain("alice users");
  });
  it("chown utenti e gruppi inesistenti", () => {
    const { run } = mk("permessi");
    expect(run("sudo chown zzz pubblico.txt")).toContain("invalid user");
    expect(run("sudo chown :zzz pubblico.txt")).toContain("invalid group");
  });
  it("permessi di lettura e scrittura effettivi", () => {
    const { run } = mk("permessi");
    expect(run("cat segreto.txt")).toContain("proprietario");
    expect(run("cat di_alice.txt")).toContain("Permission denied");
    expect(run("cat solo_root.txt")).toContain("Permission denied");
    expect(run("echo x >> solo_lettura.txt")).toContain("Permission denied");
    expect(run("cd riservata")).toContain("Permission denied");
    expect(run("sudo cat solo_root.txt")).toContain("Riservato");
  });
});

describe("utenti e sistema", () => {
  it("whoami, id, groups", () => {
    const { run } = mk();
    expect(run("whoami")).toBe("studente\n");
    expect(run("sudo whoami")).toContain("root");
    expect(run("id")).toBe("uid=1000(studente) gid=1000(studente) groups=1000(studente),27(sudo),100(users)\n");
    expect(run("id -u")).toBe("1000\n");
    expect(run("id -un alice")).toBe("alice\n");
    expect(run("id zzz")).toContain("no such user");
    expect(run("groups")).toBe("studente sudo users\n");
    expect(run("groups alice")).toBe("alice : alice lab users\n");
  });
  it("date, uname, hostname", () => {
    const { run } = mk();
    expect(run("date")).toBe("Tue Oct 20 10:05:00 UTC 2026\n");
    expect(run("date +%H:%M")).toBe("10:05\n");
    expect(run("uname")).toBe("Linux\n");
    expect(run("uname -a")).toContain("Linux lab 6.8.0");
    expect(run("hostname")).toBe("lab\n");
  });
  it("history", () => {
    const { run } = mk();
    run("echo a");
    run("echo b");
    expect(run("history 2")).toBe("    2  echo b\n    3  history 2\n");
    run("history -c");
    expect(run("history")).toBe("    1  history\n");
  });
  it("clear segnala la pulizia", () => {
    const { sh } = mk();
    expect(sh.run("clear").clear).toBe(true);
    expect(sh.run("pwd").clear).toBe(false);
  });
  it("sudo: password di laboratorio e comportamento", () => {
    const { run, sh } = mk();
    const first = run("sudo ls /root");
    expect(first).toContain("[sudo] password for studente");
    expect(first).toContain("lab123");
    expect(run("sudo ls /root")).not.toContain("password");
    run("sudo -k");
    expect(run("sudo true")).toContain("password");
    expect(sh.user.name).toBe("studente");
    expect(run("sudo")).toContain("usage");
    expect(run("sudo su")).toContain("non apre una shell");
  });
  it("sudo crea file come root", () => {
    const { run } = mk();
    run("sudo touch /tmp/prova");
    expect(run("ls -l /tmp/prova")).toContain("root root");
  });
  it("ps, kill, top", () => {
    const { run } = mk();
    expect(run("ps")).toContain("bash");
    expect(run("ps aux")).toContain("python3 lavoro_lungo.py");
    expect(run("ps -ef")).toContain("PPID");
    expect(run("ps aux | grep python")).toContain("2314");
    expect(run("top")).toContain("%CPU");
    expect(run("kill 2314")).toBe("");
    expect(run("ps aux")).not.toContain("lavoro_lungo");
    expect(run("kill 2314")).toContain("No such process");
    expect(run("kill 688")).toContain("Operation not permitted");
    expect(run("sudo kill -9 688")).not.toContain("not permitted");
    expect(run("ps aux")).not.toContain("sshd: /usr/sbin");
    expect(run("kill abc")).toContain("arguments must be process or job IDs");
    expect(run("sudo kill 1")).toContain("non si può chiudere");
    expect(run("kill -9")).toContain("usage");
  });
  it("apt simulato", () => {
    const { run } = mk();
    expect(run("apt install tree")).toContain("sudo");
    expect(run("sudo apt update")).toContain("Reading package lists");
    expect(run("sudo apt install tree")).toContain("Setting up tree");
    expect(run("sudo apt install tree")).toContain("already the newest");
    expect(run("sudo apt install nonesiste")).toContain("Unable to locate package");
    expect(run("apt list --installed")).toContain("tree");
    expect(run("sudo apt remove tree")).toContain("Removing tree");
  });
  it("man e --help", () => {
    const { run } = mk();
    expect(run("man ls")).toContain("SINTASSI");
    expect(run("man zzz")).toContain("No manual entry");
    expect(run("grep --help")).toContain("Uso:");
    expect(run("ls --help")).toContain("Esempi:");
    expect(run("help")).toContain("Comandi disponibili");
  });
  it("which e exit", () => {
    const { run } = mk();
    expect(run("which ls")).toBe("/usr/bin/ls\n");
    expect(run("which zzz")).toBe("");
    expect(run("exit")).toContain("simulatore");
  });
});

describe("comando sconosciuto", () => {
  it("messaggio stile bash e suggerimento in italiano", () => {
    const { run } = mk();
    const out = run("fooo");
    expect(out).toContain("fooo: command not found");
    expect(out).toContain("Suggerimento");
  });
  it("suggerisce il comando vicino", () => {
    const { run } = mk();
    expect(run("lss")).toContain("«ls»");
    expect(run("grpe x")).toContain("«grep»");
    expect(run("LS")).toContain("maiuscole");
  });
  it("suggerisce l'equivalente per chi arriva da Windows", () => {
    const { run } = mk();
    expect(run("dir")).toContain("ls");
    expect(run("cls")).toContain("clear");
  });
});

describe("script e blocchi", () => {
  it("for sul terminale", () => {
    const { run } = mk();
    expect(run("for i in 1 2 3; do echo n$i; done")).toBe("n1\nn2\nn3\n");
    expect(run("for f in Documenti/*.txt; do echo $f; done")).toBe("Documenti/appunti.txt\nDocumenti/lista_spesa.txt\n");
    expect(run("for i in $(seq 1 3); do echo $i; done")).toBe("1\n2\n3\n");
  });
  it("if con test", () => {
    const { run } = mk();
    expect(run("if [ -f frutta.txt ]; then echo esiste; else echo manca; fi")).toBe("esiste\n");
    expect(run("if [ -d frutta.txt ]; then echo dir; else echo file; fi")).toBe("file\n");
    expect(run("[ 3 -gt 2 ] && echo maggiore")).toBe("maggiore\n");
    expect(run("[ a = b ] || echo diversi")).toBe("diversi\n");
    expect(run("[ -z '' ] && echo vuoto")).toBe("vuoto\n");
    expect(run("[ -f x")).toContain("missing `]'");
    expect(run("[ x -gt 2 ]")).toContain("integer expression expected");
  });
  it("while con limite", () => {
    const { run } = mk();
    expect(run("while true; do echo x; done")).toContain("limite");
  });
  it("esegue lo script del laboratorio con argomenti", () => {
    const { run } = mk("scripting");
    expect(run("bash elenca.sh")).toBe("File: dati.txt\nFile: LEGGIMI.txt\nFile: note.txt\n");
    run("chmod +x saluto.sh");
    expect(run("./saluto.sh Ada")).toContain("incompleto");
  });
  it("script con $1, exit e controllo $?", () => {
    const { run, sh } = mk("scripting");
    sh.fs.writeFile("/home/studente/scripting/s.sh", '#!/bin/bash\nif [ -z "$1" ]; then\n  echo "Uso: ./s.sh NOME"\n  exit 1\nfi\necho "Ciao $1 ($#)"\n', sh.user, 1);
    run("chmod +x s.sh");
    expect(run("./s.sh")).toBe("Uso: ./s.sh NOME\n");
    expect(run("echo $?")).toBe("1\n");
    expect(run("./s.sh Ada")).toBe("Ciao Ada (1)\n");
    expect(run("echo $?")).toBe("0\n");
  });
  it("le variabili dello script non restano", () => {
    const { run, sh } = mk("scripting");
    sh.fs.writeFile("/home/studente/scripting/v.sh", "X=dentro\ncd /tmp\n", sh.user, 1);
    run("bash v.sh");
    expect(run("echo [$X]")).toBe("[]\n");
    expect(sh.cwd).toBe("/home/studente/scripting");
  });
  it("errori nell'esecuzione di script", () => {
    const { run } = mk("scripting");
    expect(run("./zzz.sh")).toContain("No such file or directory");
    expect(run("bash zzz.sh")).toContain("No such file or directory");
    expect(run("bash")).toContain("indica uno script");
  });
});

describe("compatibilità con le lezioni", () => {
  it("la home di base ha indagine e accessi.log", () => {
    const { run } = mk();
    expect(run("cd indagine; ls")).toBe("evidenze  note.txt  registro.log\n");
    expect(run("wc -l registro.log")).toBe("6 registro.log\n");
    expect(run("cd ~; wc -l accessi.log")).toBe("8 accessi.log\n");
    expect(run("grep FALLITO accessi.log | wc -l")).toBe("4\n");
    expect(run("grep FALLITO accessi.log | cut -d' ' -f2 | sort | uniq -c | sort -rn | head -n 1")).toBe("      3 203.0.113.9\n");
  });
  it("file e tail -f", () => {
    const { run } = mk();
    expect(run("file indagine/registro.log")).toBe("indagine/registro.log: ASCII text\n");
    expect(run("file indagine")).toBe("indagine: directory\n");
    expect(run("tail -f -n 1 accessi.log")).toContain("lucia");
  });
});

describe("scenari", () => {
  it("logs: auth.log richiede sudo, access.log no", () => {
    const { run, sh } = mk("logs");
    expect(sh.prompt()).toBe("studente@lab:/var/log$ ");
    expect(run("cat auth.log")).toContain("Permission denied");
    expect(run("sudo grep -c Failed auth.log")).toMatch(/\n\d+\n$/);
    expect(run("grep -c 404 access.log")).toMatch(/^\d+\n$/);
    expect(run("cut -d' ' -f1 access.log | sort | uniq -c | sort -nr | head -n 1")).toContain("192.168.1.20");
    expect(run("grep -c 185.220.101.4 access.log")).not.toBe("0\n");
  });
  it("permessi: parte da ~/permessi", () => {
    const { sh, run } = mk("permessi");
    expect(sh.prompt()).toBe("studente@lab:~/permessi$ ");
    expect(run("ls -l segreto.txt")).toContain("-rw-------");
  });
  it("le modifiche non passano da uno scenario all'altro", () => {
    const a = mk("base");
    a.run("rm frutta.txt");
    const b = mk("base");
    expect(b.run("ls frutta.txt")).toBe("frutta.txt\n");
  });
});

describe("tab-completion", () => {
  it("completa i comandi", () => {
    const { sh } = mk();
    expect(sh.complete("gre").line).toBe("grep ");
    expect(sh.complete("so").line).toBe("sort ");
    expect(sh.complete("ch").options).toEqual(["chgrp", "chmod", "chown"]);
  });
  it("completa file e cartelle", () => {
    const { sh } = mk();
    expect(sh.complete("cd Doc").line).toBe("cd Documenti/");
    expect(sh.complete("cat Documenti/app").line).toBe("cat Documenti/appunti.txt ");
    expect(sh.complete("cat fru").line).toBe("cat frutta.txt ");
  });
  it("più candidati: prefisso comune e opzioni", () => {
    const { sh } = mk();
    const c = sh.complete("ls S");
    expect(c.options).toEqual(["Scaricati/", "Scrivania/"]);
    expect(c.line).toBe("ls Sc");
  });
  it("cd propone solo cartelle", () => {
    const { sh } = mk();
    expect(sh.complete("cd fr").options).toEqual([]);
  });
  it("nessun candidato lascia la riga", () => {
    const { sh } = mk();
    expect(sh.complete("cat zzz").line).toBe("cat zzz");
  });
  it("completa dopo pipe e sudo", () => {
    const { sh } = mk();
    expect(sh.complete("ls | gre").line).toBe("ls | grep ");
    expect(sh.complete("sudo gre").line).toBe("sudo grep ");
  });
  it("non rivela file nascosti senza punto", () => {
    const { sh } = mk();
    expect(sh.complete("cat .bash").line).toBe("cat .bashrc ");
    expect(sh.complete("cat bash").line).toBe("cat bash");
  });
});

describe("sicurezza del parser", () => {
  it("non esegue nulla di reale: nomi strani sono comandi sconosciuti", () => {
    const { run } = mk();
    expect(run("constructor")).toContain("command not found");
    expect(run("__proto__")).toContain("command not found");
    expect(run("toString")).toContain("command not found");
  });
  it("file chiamato __proto__ non inquina gli oggetti", () => {
    const { run } = mk();
    expect(run("touch __proto__")).toContain("Invalid argument");
    expect(({} as Record<string, unknown>).x).toBeUndefined();
  });
  it("nano apre una richiesta di editor", () => {
    const { sh } = mk();
    const r = sh.run("nano frutta.txt");
    expect(r.editor?.path).toBe("/home/studente/frutta.txt");
    expect(sh.saveFile("/home/studente/frutta.txt", "nuovo\n", false)).toBeNull();
    expect(sh.run("cat frutta.txt").output).toBe("nuovo\n");
    expect(sh.saveFile("/etc/hosts", "x", false)).toContain("Permission denied");
    expect(sh.run("nano /etc/shadow").output).toContain("Permission denied");
  });
});
