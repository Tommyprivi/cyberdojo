import type { BankItem } from "../banks";

/**
 * Banche di domande del modulo F9 (Fondamenta IT, Linux e Reti). Una chiave per lezione: "f09-<argomento>".
 * Ogni banca ha almeno 12 domande a scelta, una sola risposta giusta, opzioni distinte.
 *
 * Il codice sta nel testo della domanda su una riga: il simbolo ↵ vale «a capo» e, dove serve,
 * le righe dopo i due punti sono rientrate (la lezione lo ricorda prima della verifica).
 * Le risposte sono state controllate riga per riga a mano, ragionando come l'interprete (Python 3.11+).
 */
export const F09_ITEMS: Record<string, BankItem[]> = {
  // ---------- F.09.001: il primo programma ----------
  "f09-primo-programma": [
    { q: "Cosa stampa `print('Ciao')`?", ok: "Ciao", no: ["'Ciao'", "print('Ciao')", "Errore"] },
    { q: "Cosa stampa `print('SOC', 3)`?", ok: "SOC 3", no: ["SOC3", "('SOC', 3)", "SOC, 3"] },
    { q: "Cosa stampa `print(2 + 3)`?", ok: "5", no: ["2 + 3", "23", "Errore"] },
    { q: "Cosa stampa `print('2 + 3')`?", ok: "2 + 3", no: ["5", "23", "Errore"] },
    { q: "Cosa stampa `print('2' + '3')`?", ok: "23", no: ["5", "2 + 3", "Errore"] },
    {
      q: "Quale di queste righe dà un errore (NameError)?",
      ok: "Print('a')",
      no: ["print('a')", "print(5)", "# print(5)"],
    },
    { q: "Cosa stampa la riga `# print('Ciao')`?", ok: "Niente: è un commento", no: ["Ciao", "# print('Ciao')", "Errore"] },
    {
      q: "Quale comando esegue da terminale Linux il file ciao.py?",
      ok: "python3 ciao.py",
      no: ["ciao.py python3", "run ciao.py", "python3 < ciao"],
    },
    {
      q: "Cosa indica il simbolo >>> nella shell di Python?",
      ok: "L'interprete è pronto a ricevere un comando",
      no: ["Il programma ha dato errore", "Una riga di commento", "Il file è stato salvato"],
    },
    {
      q: "Come si scrive un commento in Python?",
      ok: "Con il simbolo # davanti alla riga",
      no: ["Con // davanti alla riga", "Con -- davanti alla riga", "Tra parentesi tonde"],
    },
    {
      q: "Python è un linguaggio interpretato. Cosa significa?",
      ok: "Un interprete esegue il codice riga per riga",
      no: ["Funziona solo su Linux", "Funziona solo con Internet acceso", "Si scrive direttamente in binario"],
    },
    { q: "Come si esce dalla shell interattiva di Python?", ok: "exit()", no: ["close", "stop", "Ctrl+X"] },
    { q: "Cosa stampa `print(10 / 4)`?", ok: "2.5", no: ["2", "2.0", "2 resto 2"] },
    { q: "Cosa stampa `print('Ciao', 'SOC')`?", ok: "Ciao SOC", no: ["CiaoSOC", "('Ciao', 'SOC')", "Ciao,SOC"] },
    {
      q: "Quale errore dà `print('ciao)` con le virgolette non chiuse?",
      ok: "SyntaxError: la stringa non è chiusa",
      no: ["NameError", "ZeroDivisionError", "TypeError"],
    },
  ],

  // ---------- F.09.002: variabili e tipi ----------
  "f09-variabili": [
    { q: "Cosa stampa `x = 5; print(x + 2)`?", ok: "7", no: ["52", "x + 2", "Errore"] },
    { q: "Cosa stampa `a = '5'; print(a + '2')`?", ok: "52", no: ["7", "5 + 2", "Errore"] },
    { q: "Cosa stampa `a = 5; b = 2; print(a / b)`?", ok: "2.5", no: ["2", "3", "2.0"] },
    { q: "Cosa stampa `print(7 // 2)`?", ok: "3", no: ["3.5", "4", "1"] },
    { q: "Cosa stampa `print(7 % 2)`?", ok: "1", no: ["3", "3.5", "0"] },
    { q: "Cosa stampa `print(type(3.0))`?", ok: "<class 'float'>", no: ["<class 'int'>", "<class 'str'>", "3.0"] },
    { q: "Cosa stampa `print(type('3'))`?", ok: "<class 'str'>", no: ["<class 'int'>", "<class 'float'>", "3"] },
    { q: "Cosa stampa `print(int('22') + 1)`?", ok: "23", no: ["221", "22 + 1", "Errore"] },
    {
      q: "Cosa succede eseguendo `print('22' + 1)`?",
      ok: "Errore (TypeError): non si sommano testo e numero",
      no: ["Stampa 23", "Stampa 221", "Stampa 22 + 1"],
    },
    { q: "Cosa stampa `print('Porta: ' + str(22))`?", ok: "Porta: 22", no: ["Porta: str(22)", "Porta:22", "Errore"] },
    { q: "Cosa stampa `print(int(3.9))`?", ok: "3", no: ["4", "3.9", "Errore"] },
    { q: "Cosa stampa `print(2 ** 3)`?", ok: "8", no: ["6", "5", "9"] },
    {
      q: "Quale di questi è un nome di variabile valido?",
      ok: "porta_ssh",
      no: ["2porte", "porta ssh", "porta-ssh"],
    },
    { q: "Cosa stampa `x = 10; x = x + 1; print(x)`?", ok: "11", no: ["10", "1", "Errore"] },
    { q: "Cosa stampa `print(type(True))`?", ok: "<class 'bool'>", no: ["<class 'str'>", "<class 'int'>", "True"] },
    { q: "Cosa stampa `print('ab' * 3)`?", ok: "ababab", no: ["ab3", "abababab", "Errore"] },
    {
      q: "Cosa succede eseguendo `print(int('ventidue'))`?",
      ok: "ValueError: il testo non è un numero",
      no: ["Stampa 22", "Stampa 0", "TypeError: manca una virgola"],
    },
    { q: "Cosa stampa `print(5 > 3)`?", ok: "True", no: ["5 > 3", "1", "False"] },
    {
      q: "Quale di queste righe è scritta in modo sbagliato?",
      ok: "3porta = 80",
      no: ["porta = 22", "_porta = 22", "Porta = 22"],
    },
    { q: "Cosa stampa `print(10 / 5)`?", ok: "2.0", no: ["2", "2.5", "Errore"] },
  ],

  // ---------- F.09.003: testo e input ----------
  "f09-testo": [
    { q: "Cosa stampa `print(len('SOC'))`?", ok: "3", no: ["2", "SOC", "Errore"] },
    { q: "Cosa stampa `print('ciao'[0])`?", ok: "c", no: ["i", "ciao", "o"] },
    { q: "Cosa stampa `print('ciao'[-1])`?", ok: "o", no: ["c", "a", "Errore"] },
    { q: "Cosa stampa `print('ciao'[1:3])`?", ok: "ia", no: ["cia", "iao", "ao"] },
    { q: "Cosa stampa `nome = 'Ada'; print(f'Ciao {nome}')`?", ok: "Ciao Ada", no: ["Ciao nome", "Ciao {nome}", "Errore"] },
    { q: "Cosa stampa `porta = 22; print(f'porta={porta + 1}')`?", ok: "porta=23", no: ["porta=22", "porta=porta + 1", "Errore"] },
    { q: "Cosa stampa `print('  ssh  '.strip())`?", ok: "ssh", no: ["  ssh  ", "SSH", "ssh  "] },
    { q: "Cosa stampa `print('ssh'.upper())`?", ok: "SSH", no: ["ssh", "Ssh", "Errore"] },
    { q: "Cosa stampa `print('a,b,c'.split(','))`?", ok: "['a', 'b', 'c']", no: ["a,b,c", "['a,b,c']", "abc"] },
    { q: "Cosa stampa `print('10.0.0.1'.replace('.', '-'))`?", ok: "10-0-0-1", no: ["10.0.0.1", "10-0-0.1", "1-0-0-1"] },
    {
      q: "Il programma esegue `x = input(); print(x * 2)` e l'utente scrive 5. Cosa stampa?",
      ok: "55",
      no: ["10", "5 2", "Errore"],
    },
    {
      q: "Quale funzione trasforma il testo digitato dall'utente in un numero intero?",
      ok: "int()",
      no: ["str()", "len()", "type()"],
    },
    { q: "Cosa stampa `print('FAILED' in 'login FAILED da 10.0.0.1')`?", ok: "True", no: ["False", "FAILED", "Errore"] },
    {
      q: "Cosa stampa `s = 'ssh'; s.upper(); print(s)`?",
      ok: "ssh",
      no: ["SSH", "Errore", "None"],
    },
    {
      q: "Cosa succede eseguendo `print('Porta ' + 22)`?",
      ok: "TypeError: manca str() intorno a 22",
      no: ["Stampa Porta 22", "Stampa Porta22", "Stampa 22"],
    },
    { q: "Cosa stampa `print(f'{40 / 3:.2f}')`?", ok: "13.33", no: ["13.3", "13", "13.333333"] },
    {
      q: "Quale metodo toglie gli spazi all'inizio e alla fine di un testo?",
      ok: "strip()",
      no: ["cut()", "trim()", "clean()"],
    },
    { q: "Cosa stampa `print('a-b-c'.count('-'))`?", ok: "2", no: ["3", "1", "a-b-c"] },
    { q: "Cosa stampa `print('443'.isdigit())`?", ok: "True", no: ["False", "443", "Errore"] },
  ],

  // ---------- F.09.004: decisioni ----------
  "f09-decisioni": [
    { q: "Cosa stampa `print(5 == 5.0)`?", ok: "True", no: ["False", "5", "Errore"] },
    { q: "Cosa stampa `print('22' == 22)`?", ok: "False", no: ["True", "22", "Errore"] },
    { q: "Cosa stampa `print(5 != 3)`?", ok: "True", no: ["False", "5", "Errore"] },
    { q: "Cosa stampa `print(3 > 2 and 2 > 5)`?", ok: "False", no: ["True", "None", "Errore"] },
    { q: "Cosa stampa `print(3 > 2 or 2 > 5)`?", ok: "True", no: ["False", "None", "Errore"] },
    { q: "Cosa stampa `print(not 3 > 5)`?", ok: "True", no: ["False", "3", "Errore"] },
    { q: "Cosa stampa `print(10 % 2 == 0)`?", ok: "True", no: ["False", "0", "Errore"] },
    { q: "Cosa stampa `print(22 in [22, 80])`?", ok: "True", no: ["False", "22", "Errore"] },
    { q: "Cosa stampa `print(not True or True)`?", ok: "True", no: ["False", "None", "Errore"] },
    {
      q: "Quale di queste condizioni è scritta in modo sbagliato?",
      ok: "if porta = 22:",
      no: ["if porta == 22:", "if porta != 22:", "if porta >= 22:"],
    },
    {
      q: "Cosa manca nella riga `if porta == 22`?",
      ok: "I due punti alla fine",
      no: ["Le parentesi tonde intorno alla condizione", "La parola then", "Il punto e virgola"],
    },
    {
      q: "Codice (↵ = a capo, solo `print('A')` è rientrata): `x = 7 ↵ if x > 5: ↵ print('A') ↵ print('B')`. Cosa stampa?",
      ok: "A e poi B, su due righe",
      no: ["Solo A", "Solo B", "Niente"],
    },
    {
      q: "Codice (↵ = a capo): `x = 3 ↵ if x > 5: print('A') ↵ else: print('B')`. Cosa stampa?",
      ok: "B",
      no: ["A", "A e B", "Errore"],
    },
    {
      q: "Codice (↵ = a capo): `p = 80 ↵ if p == 22: print('ssh') ↵ elif p == 80: print('web') ↵ else: print('altro')`. Cosa stampa?",
      ok: "web",
      no: ["ssh", "altro", "web e altro"],
    },
    {
      q: "Codice (↵ = a capo): `t = 25 ↵ if t >= 5: print('medio') ↵ elif t >= 20: print('alto') ↵ else: print('basso')`. Cosa stampa?",
      ok: "medio",
      no: ["alto", "basso", "medio e alto"],
    },
    {
      q: "Quando viene eseguito il ramo else?",
      ok: "Quando nessuna delle condizioni precedenti è vera",
      no: ["Sempre, dopo l'if", "Solo quando la condizione dell'if è vera", "Solo se c'è un errore"],
    },
    {
      q: "Quanti spazi si usano di norma per il rientro in Python?",
      ok: "4 spazi (convenzione)",
      no: ["Nessuno: bastano le parentesi graffe", "Un punto e virgola", "Due tabulazioni obbligatorie"],
    },
  ],

  // ---------- F.09.005: cicli ----------
  "f09-cicli": [
    {
      q: "Cosa stampa `for i in range(3): print(i)`?",
      ok: "0, 1 e 2, uno per riga",
      no: ["1, 2 e 3, uno per riga", "0, 1, 2 e 3, uno per riga", "3 stampato tre volte"],
    },
    {
      q: "Cosa stampa `for i in range(1, 4): print(i)`?",
      ok: "1, 2 e 3, uno per riga",
      no: ["1, 2, 3 e 4, uno per riga", "0, 1 e 2, uno per riga", "4 stampato tre volte"],
    },
    {
      q: "Cosa stampa `for i in range(2, 10, 3): print(i)`?",
      ok: "2, 5 e 8, uno per riga",
      no: ["2, 5, 8 e 10, uno per riga", "3, 6 e 9, uno per riga", "2, 3 e 4, uno per riga"],
    },
    {
      q: "Codice (↵ = a capo): `n = 0 ↵ for i in range(5): n += i ↵ print(n)`. Cosa stampa l'ultima riga?",
      ok: "10",
      no: ["15", "5", "4"],
    },
    {
      q: "Codice (↵ = a capo): `s = 0 ↵ for i in range(1, 4): s = s + i ↵ print(s)`. Cosa stampa?",
      ok: "6",
      no: ["10", "3", "4"],
    },
    {
      q: "Cosa stampa `for c in 'ssh': print(c)`?",
      ok: "s, s e h, una per riga",
      no: ["ssh, una volta sola", "c, c e c, una per riga", "3 stampato tre volte"],
    },
    {
      q: "Codice (↵ = a capo, righe dopo i due punti rientrate): `for i in range(5): ↵ if i == 2: break ↵ print(i)`. Cosa stampa?",
      ok: "0 e 1, uno per riga",
      no: ["0, 1 e 2, uno per riga", "2", "0, 1, 3 e 4, uno per riga"],
    },
    {
      q: "Codice (↵ = a capo, righe dopo i due punti rientrate): `for i in range(4): ↵ if i == 1: continue ↵ print(i)`. Cosa stampa?",
      ok: "0, 2 e 3, uno per riga",
      no: ["0 e 1, uno per riga", "1", "0, 1, 2 e 3, uno per riga"],
    },
    {
      q: "Codice (↵ = a capo): `n = 3 ↵ while n > 0: n -= 1 ↵ print(n)`. Cosa stampa?",
      ok: "0",
      no: ["3", "2", "1"],
    },
    {
      q: "Cosa manca nella riga `for i in range(3)`?",
      ok: "I due punti alla fine",
      no: ["Un punto e virgola", "La parola do", "Le graffe intorno al blocco"],
    },
    {
      q: "Codice (↵ = a capo): `x = 0 ↵ while x < 3: print(x)`. Cosa succede?",
      ok: "Ciclo infinito: stampa 0 senza fermarsi",
      no: ["Stampa 0, 1 e 2", "Stampa 0 una volta sola", "Errore di sintassi"],
    },
    {
      q: "Quale istruzione salta solo il giro corrente e passa al successivo?",
      ok: "continue",
      no: ["break", "pass", "return"],
    },
    {
      q: "Quale istruzione esce subito e del tutto dal ciclo?",
      ok: "break",
      no: ["continue", "pass", "next"],
    },
    { q: "Quante volte stampa 'x' il codice `for i in range(10): print('x')`?", ok: "10 volte", no: ["9 volte", "11 volte", "1 volta"] },
    {
      q: "Codice (↵ = a capo, riga dopo il for rientrata): `n = 0 ↵ for x in ['OK', 'FAILED', 'FAILED']: ↵ if x == 'FAILED': n += 1 ↵ print(n)`. Cosa stampa?",
      ok: "2",
      no: ["3", "1", "0"],
    },
  ],

  // ---------- F.09.006: liste e dizionari ----------
  "f09-liste-dizionari": [
    { q: "Cosa stampa `l = [10, 20, 30]; print(l[1])`?", ok: "20", no: ["10", "30", "Errore"] },
    { q: "Cosa stampa `l = [10, 20, 30]; print(l[-1])`?", ok: "30", no: ["10", "20", "-1"] },
    { q: "Cosa stampa `l = [1, 2, 3, 4]; print(l[1:3])`?", ok: "[2, 3]", no: ["[1, 2, 3]", "[2, 3, 4]", "[2]"] },
    { q: "Cosa stampa `l = [1, 2]; l.append(3); print(len(l))`?", ok: "3", no: ["2", "1", "Errore"] },
    { q: "Cosa stampa `l = [3, 1, 2]; l.sort(); print(l)`?", ok: "[1, 2, 3]", no: ["None", "[3, 1, 2]", "Errore"] },
    { q: "Cosa stampa `l = [3, 1, 2]; print(l.sort())`?", ok: "None", no: ["[1, 2, 3]", "[3, 1, 2]", "Errore"] },
    {
      q: "Cosa succede eseguendo `l = [1, 2, 3]; print(l[3])`?",
      ok: "IndexError: indice fuori dalla lista",
      no: ["Stampa 3", "Stampa None", "KeyError"],
    },
    { q: "Cosa stampa `d = {'a': 1}; print(d['a'])`?", ok: "1", no: ["a", "None", "Errore"] },
    {
      q: "Cosa succede eseguendo `d = {'a': 1}; print(d['b'])`?",
      ok: "KeyError: la chiave non esiste",
      no: ["Stampa None", "Stampa 0", "IndexError"],
    },
    { q: "Cosa stampa `d = {'a': 1}; print(d.get('b', 0))`?", ok: "0", no: ["None", "b", "KeyError"] },
    { q: "Cosa stampa `d = {'a': 1}; d['b'] = 2; print(len(d))`?", ok: "2", no: ["1", "3", "Errore"] },
    { q: "Cosa stampa `d = {'a': 1}; d['a'] += 5; print(d)`?", ok: "{'a': 6}", no: ["{'a': 5}", "{'a': 1}", "Errore"] },
    { q: "Cosa stampa `print('b' in {'a': 1, 'b': 2})`?", ok: "True", no: ["False", "2", "b"] },
    { q: "Cosa stampa `print(2 in {'a': 2})`?", ok: "False", no: ["True", "a", "2"] },
    { q: "Cosa stampa `l = [5, 5, 7]; print(l.count(5))`?", ok: "2", no: ["3", "5", "1"] },
    {
      q: "Per contare quante volte compare ciascun indirizzo IP, quale struttura conviene?",
      ok: "Un dizionario: l'IP è la chiave e il conteggio è il valore",
      no: ["Una stringa unica con tutti gli IP", "Un numero intero", "Una lista di soli numeri senza gli IP"],
    },
    { q: "Cosa stampa `for k, v in {'a': 1}.items(): print(k, v)`?", ok: "a 1", no: ["a", "1", "('a', 1)"] },
    { q: "Cosa stampa `print(len({'a': 1, 'a': 2}))`?", ok: "1", no: ["2", "0", "Errore"] },
    { q: "Cosa stampa `print([1, 2, 3][:2])`?", ok: "[1, 2]", no: ["[1, 2, 3]", "[2, 3]", "[3]"] },
  ],

  // ---------- F.09.007: funzioni ----------
  "f09-funzioni": [
    {
      q: "Codice (↵ = a capo): `def f(x): return x * 2 ↵ print(f(4))`. Cosa stampa?",
      ok: "8",
      no: ["None", "4", "Errore"],
    },
    {
      q: "Codice (↵ = a capo): `def f(x): print(x * 2) ↵ print(f(4))`. Cosa stampa?",
      ok: "8 e poi None, su due righe",
      no: ["Solo 8", "Solo None", "4 e poi 8, su due righe"],
    },
    {
      q: "Codice (↵ = a capo): `def f(a, b=10): return a + b ↵ print(f(1))`. Cosa stampa?",
      ok: "11",
      no: ["1", "10", "Errore"],
    },
    {
      q: "Codice (↵ = a capo): `def f(a, b=10): return a + b ↵ print(f(1, 2))`. Cosa stampa?",
      ok: "3",
      no: ["12", "11", "Errore"],
    },
    {
      q: "Un programma contiene solo la riga `def f(): print('x')`. Cosa stampa?",
      ok: "Niente: la funzione è definita ma mai chiamata",
      no: ["x", "None", "Errore"],
    },
    {
      q: "Codice (↵ = a capo): `def f(n): return n > 5 ↵ print(f(7))`. Cosa stampa?",
      ok: "True",
      no: ["7", "False", "None"],
    },
    {
      q: "Codice (↵ = a capo): `def f(n): r = n + 1 ↵ f(1) ↵ print(r)`. Cosa succede?",
      ok: "NameError: r esiste solo dentro la funzione",
      no: ["Stampa 2", "Stampa 1", "Stampa None"],
    },
    {
      q: "Codice (↵ = a capo): `def f(x): return ↵ print(f(3))`. Cosa stampa?",
      ok: "None",
      no: ["3", "0", "Errore"],
    },
    { q: "Quale parola chiave definisce una funzione in Python?", ok: "def", no: ["func", "function", "define"] },
    {
      q: "Quale parola chiave restituisce un valore a chi ha chiamato la funzione?",
      ok: "return",
      no: ["print", "send", "out"],
    },
    {
      q: "Cosa manca nella riga `def f(x)`?",
      ok: "I due punti alla fine",
      no: ["Il punto e virgola", "La parola then", "Le graffe"],
    },
    {
      q: "Codice (↵ = a capo): `def f(a, b): return a - b ↵ print(f(b=1, a=5))`. Cosa stampa?",
      ok: "4",
      no: ["-4", "6", "Errore"],
    },
    {
      q: "Codice (↵ = a capo): `def f(x): return x ↵ print(f('ssh').upper())`. Cosa stampa?",
      ok: "SSH",
      no: ["ssh", "None", "Errore"],
    },
    {
      q: "Perché conviene scrivere funzioni piccole che restituiscono un valore?",
      ok: "Si possono provare da sole con pochi esempi (assert)",
      no: ["Girano sempre più veloci", "Occupano meno spazio sul disco", "Non serve più testarle"],
    },
    {
      q: "Codice (↵ = a capo): `x = 1 ↵ def f(): return x + 1 ↵ print(f())`. Cosa stampa?",
      ok: "2",
      no: ["1", "Errore", "None"],
    },
    {
      q: "Codice (↵ = a capo): `def f(n): return n ** 2 ↵ print(f(3))`. Cosa stampa?",
      ok: "9",
      no: ["6", "5", "Errore"],
    },
    {
      q: "Codice (↵ = a capo): `def f(a, b): return a + b ↵ print(f(1))`. Cosa succede?",
      ok: "TypeError: manca un argomento",
      no: ["Stampa 1", "Stampa None", "NameError"],
    },
  ],

  // ---------- F.09.008: file e moduli ----------
  "f09-file": [
    {
      q: "Quale modo di open() cancella il contenuto esistente del file?",
      ok: "'w'",
      no: ["'r'", "'a'", "'rb'"],
    },
    {
      q: "Quale modo di open() aggiunge testo in fondo senza cancellare il resto?",
      ok: "'a'",
      no: ["'w'", "'r'", "'r+'"],
    },
    {
      q: "Perché si usa `with open(...) as f:`?",
      ok: "Il file si chiude da solo alla fine del blocco, anche in caso di errore",
      no: ["Il file diventa più veloce", "Il file viene cifrato", "Senza with non si può leggere un file"],
    },
    { q: "Che tipo di valore restituisce `f.read()`?", ok: "Un testo (str) con tutto il file", no: ["Una lista di righe", "Un numero intero", "Un dizionario"] },
    { q: "Cosa stampa `print('ok\\n'.strip() == 'ok')`?", ok: "True", no: ["False", "ok", "Errore"] },
    {
      q: "Un file ha due righe, 'a' e 'b'. Quante volte gira `for riga in f:`?",
      ok: "2 volte",
      no: ["1 volta", "3 volte", "Una volta per ogni lettera del file"],
    },
    {
      q: "Cosa succede con `open('manca.log')` se il file non esiste?",
      ok: "FileNotFoundError",
      no: ["Crea il file vuoto", "Restituisce None", "Restituisce un testo vuoto"],
    },
    {
      q: "Quale parola introduce il blocco che gestisce l'errore, dopo try?",
      ok: "except",
      no: ["catch", "error", "rescue"],
    },
    {
      q: "Codice (↵ = a capo, righe rientrate): `try: ↵ int('x') ↵ except ValueError: ↵ print('no')`. Cosa stampa?",
      ok: "no",
      no: ["x", "Niente", "Errore ValueError non gestito"],
    },
    {
      q: "Codice (↵ = a capo, righe rientrate): `try: ↵ print(1 / 0) ↵ except ZeroDivisionError: ↵ print('zero')`. Cosa stampa?",
      ok: "zero",
      no: ["0", "inf", "Errore non gestito"],
    },
    {
      q: "Quale istruzione carica un modulo per poter usare `json.loads`?",
      ok: "import json",
      no: ["include json", "use json", "load json"],
    },
    {
      q: "Codice (↵ = a capo): `import math ↵ print(math.sqrt(9))`. Cosa stampa?",
      ok: "3.0",
      no: ["3", "9.0", "Errore"],
    },
    {
      q: "Quale modulo di Python serve per leggere e scrivere file CSV?",
      ok: "csv",
      no: ["xls", "table", "sheet"],
    },
    {
      q: "Cosa restituisce `json.loads('[1, 2]')`?",
      ok: "La lista [1, 2]",
      no: ["Il testo '[1, 2]'", "Un errore", "None"],
    },
    {
      q: "Codice (↵ = a capo): `from pathlib import Path ↵ print(Path('log/a.txt').suffix)`. Cosa stampa?",
      ok: ".txt",
      no: ["a.txt", "log", "txt"],
    },
    {
      q: "Leggendo host.csv con csv.DictReader, di che tipo è il valore riga['porta']?",
      ok: "Testo (str), anche se contiene un numero",
      no: ["Numero intero (int)", "Numero con la virgola (float)", "Booleano (bool)"],
    },
    {
      q: "Due chiamate di seguito a `f.write('ciao')`, senza a capo. Cosa finisce nel file?",
      ok: "ciaociao su una sola riga",
      no: ["ciao su due righe", "ciao una sola volta", "Un errore alla seconda chiamata"],
    },
  ],

  // ---------- F.09.009: socket e automazione ----------
  "f09-socket": [
    { q: "Cosa stampa `print('ciao'.encode('utf-8'))`?", ok: "b'ciao'", no: ["ciao", "'ciao'", "4"] },
    { q: "Cosa stampa `print(b'ciao'.decode('utf-8'))`?", ok: "ciao", no: ["b'ciao'", "4", "Errore"] },
    { q: "Cosa stampa `print(len('ciao'.encode()))`?", ok: "4", no: ["ciao", "b'ciao'", "8"] },
    {
      q: "A quale indirizzo si collega un client per provare il proprio server sullo stesso computer?",
      ok: "127.0.0.1",
      no: ["255.255.255.255", "192.168.0.0", "8.8.8.8"],
    },
    {
      q: "Cosa fa `server.listen(1)`?",
      ok: "Mette il socket in attesa di connessioni (con una coda di 1)",
      no: ["Invia un messaggio ai client", "Chiude il socket", "Sceglie la porta"],
    },
    {
      q: "Quale chiamata del server resta ferma finché non arriva un client?",
      ok: "accept()",
      no: ["bind()", "listen()", "close()"],
    },
    {
      q: "Quale chiamata assegna indirizzo e porta al socket del server?",
      ok: "bind()",
      no: ["connect()", "accept()", "recv()"],
    },
    {
      q: "Quale chiamata usa il client per collegarsi al server?",
      ok: "connect()",
      no: ["bind()", "listen()", "accept()"],
    },
    {
      q: "Cosa succede se il client parte prima che il server sia in ascolto?",
      ok: "ConnectionRefusedError: nessuno ascolta sulla porta",
      no: ["Il client crea il server da solo", "Il client riceve un testo vuoto", "Python avvia il server in automatico"],
    },
    {
      q: "Perché serve `.encode()` prima di inviare un testo con sendall()?",
      ok: "La rete trasporta byte, non testo",
      no: ["Per cifrare il messaggio", "Per rendere il testo più corto", "Per aggiungere la porta"],
    },
    {
      q: "Cosa crea `socket.socket(socket.AF_INET, socket.SOCK_STREAM)`?",
      ok: "Un socket TCP su IPv4",
      no: ["Un socket UDP su IPv4", "Un socket TCP su IPv6", "Un socket UDP su IPv6"],
    },
    {
      q: "Perché negli esercizi il client si collega solo a 127.0.0.1?",
      ok: "Provare le porte di computer altrui senza permesso scritto non è lecito: si prova solo ciò che è tuo",
      no: ["Python non permette altri indirizzi", "Gli altri indirizzi sono più lenti", "127.0.0.1 è l'unico indirizzo che esiste"],
    },
    {
      q: "Quale riga di cron esegue uno script ogni giorno alle 06:30?",
      ok: "30 6 * * * python3 /home/ada/riassunto.py",
      no: ["6 30 * * * python3 /home/ada/riassunto.py", "* * 6 30 * python3 /home/ada/riassunto.py", "30 6 1 * * python3 /home/ada/riassunto.py"],
    },
    {
      q: "Perché in una riga di cron si usano percorsi assoluti?",
      ok: "Cron non parte dalla cartella dello script",
      no: ["I percorsi relativi sono vietati da Python", "Rendono lo script più veloce", "Cron legge solo file .py"],
    },
    { q: "Quale metodo di Path rinomina un file?", ok: "rename()", no: ["move()", "change()", "rewrite()"] },
    {
      q: "Cosa restituisce `conn.recv(1024)`?",
      ok: "Al massimo 1024 byte ricevuti (tipo bytes)",
      no: ["Un testo di 1024 caratteri", "Il numero di client collegati", "Sempre l'intero messaggio, qualunque lunghezza"],
    },
    {
      q: "Perché si scrive `with socket.socket(...) as s:`?",
      ok: "Il socket si chiude da solo alla fine del blocco",
      no: ["Per renderlo più veloce", "Per collegarsi a Internet", "Perché senza with non si può inviare nulla"],
    },
  ],
};
