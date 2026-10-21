/* Worker che esegue Python nel browser con Pyodide. File statico, NON passa dal bundler.
 * Protocollo: vedi src/lib/python/protocol.ts. Documentazione: docs/python-nel-browser.md.
 *
 * input(): un worker non può aspettare in modo sincrono una risposta della pagina senza intestazioni
 * di isolamento (COOP/COEP) che romperebbero i video incorporati. Quindi si usa la RIESECUZIONE:
 * quando il programma chiama input() senza una risposta pronta, si ferma e chiede il testo alla pagina;
 * poi si rilancia da capo con le risposte già date, saltando l'output già mostrato. Il seme di random
 * è lo stesso, quindi il programma si comporta allo stesso modo. */

let pyodide = null;
let decoderOut = new TextDecoder();
let decoderErr = new TextDecoder();
let currentId = 0;
let emitted = 0;
let skip = 0;

function post(msg) {
  self.postMessage(msg);
}

function emit(channel, text) {
  if (!text) return;
  let t = text;
  if (emitted < skip) {
    const drop = Math.min(skip - emitted, t.length);
    emitted += drop;
    t = t.slice(drop);
    if (!t) return;
  }
  emitted += t.length;
  post({ type: "out", id: currentId, channel, text: t });
}

function writer(channel) {
  const decoder = channel === "err" ? decoderErr : decoderOut;
  return {
    write(buf) {
      emit(channel, decoder.decode(buf, { stream: true }));
      return buf.length;
    },
    isatty: false,
  };
}

async function prefetchWasm(base) {
  // Scarica il file grande a parte per mostrare l'avanzamento; poi resta nella cache del browser.
  const ESTIMATE = 9.5 * 1024 * 1024;
  const res = await fetch(base + "pyodide.asm.wasm", { cache: "force-cache" });
  if (!res.ok || !res.body) throw new Error("Download non riuscito (" + res.status + ")");
  const total = Number(res.headers.get("content-length")) || ESTIMATE;
  const reader = res.body.getReader();
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    loaded += value.length;
    post({ type: "progress", fraction: Math.min(0.85, (loaded / total) * 0.85), label: "Scarico il motore Python" });
  }
}

const BOOTSTRAP = `
import sys, builtins, traceback, random, codeop, json, linecache

class _NeedInput(BaseException):
    pass

_state = {"answers": [], "i": 0, "repl": False}

def _input(prompt=""):
    sys.stdout.write(str(prompt))
    sys.stdout.flush()
    if _state["repl"]:
        sys.stdout.write("\\n")
        raise RuntimeError("input() nel REPL non funziona: usa la modalita' Programma")
    i = _state["i"]
    if i < len(_state["answers"]):
        v = _state["answers"][i]
        _state["i"] = i + 1
        sys.stdout.write(v + "\\n")
        sys.stdout.flush()
        return v
    raise _NeedInput()

builtins.input = _input

def _show(e):
    tb = e.__traceback__
    if tb is not None and tb.tb_next is not None:
        tb = tb.tb_next
    traceback.print_exception(type(e), e, tb)

def run_program(code, answers_json, seed):
    _state["answers"] = json.loads(answers_json)
    _state["i"] = 0
    _state["repl"] = False
    random.seed(seed)
    linecache.cache["<esercizio>"] = (len(code), None, code.splitlines(True), "<esercizio>")
    ns = {"__name__": "__main__", "__builtins__": builtins}
    try:
        compiled = compile(code, "<esercizio>", "exec")
    except SyntaxError as e:
        traceback.print_exception(type(e), e, None)
        return "error"
    status = "ok"
    try:
        exec(compiled, ns)
    except _NeedInput:
        status = "need-input"
    except SystemExit:
        pass
    except BaseException as e:
        _show(e)
        status = "error"
    sys.stdout.flush()
    sys.stderr.flush()
    return status

_repl_ns = {"__name__": "__main__"}
_repl_buf = []

def repl_reset():
    _repl_ns.clear()
    _repl_ns["__name__"] = "__main__"
    del _repl_buf[:]

def repl_line(line):
    _state["repl"] = True
    _repl_buf.append(line)
    src = "\\n".join(_repl_buf)
    try:
        c = codeop.compile_command(src, "<repl>", "single")
    except (SyntaxError, OverflowError, ValueError) as e:
        del _repl_buf[:]
        traceback.print_exception(type(e), e, None)
        return "error"
    if c is None:
        return "more"
    del _repl_buf[:]
    status = "ok"
    try:
        exec(c, _repl_ns)
    except SystemExit:
        pass
    except BaseException as e:
        _show(e)
        status = "error"
    sys.stdout.flush()
    sys.stderr.flush()
    return status

# Niente installazione di pacchetti da Internet.
sys.modules["micropip"] = None
sys.modules["pyodide.http"] = None
`;

function blockNetwork() {
  const msg = "La rete non è disponibile in questo terminale";
  const deny = function () {
    throw new Error(msg);
  };
  self.fetch = function () {
    return Promise.reject(new Error(msg));
  };
  self.XMLHttpRequest = deny;
  self.WebSocket = deny;
  self.EventSource = deny;
  self.importScripts = deny;
  self.Worker = deny;
  self.SharedWorker = deny;
}

async function init(indexURL) {
  try {
    await prefetchWasm(indexURL);
    post({ type: "progress", fraction: 0.88, label: "Avvio Python" });
    importScripts(indexURL + "pyodide.js");
    pyodide = await self.loadPyodide({ indexURL });
    pyodide.setStdout(writer("out"));
    pyodide.setStderr(writer("err"));
    pyodide.setStdin({ stdin: () => null });
    pyodide.runPython(BOOTSTRAP);
    blockNetwork();
    post({ type: "progress", fraction: 1, label: "Pronto" });
    post({ type: "ready" });
  } catch (e) {
    post({ type: "init-error", message: String((e && e.message) || e) });
  }
}

function begin(id, skipChars) {
  currentId = id;
  emitted = 0;
  skip = skipChars || 0;
  decoderOut = new TextDecoder();
  decoderErr = new TextDecoder();
}

self.onmessage = (ev) => {
  const m = ev.data;
  if (m.type === "init") {
    init(m.indexURL);
    return;
  }
  if (!pyodide) return;
  if (m.type === "run") {
    begin(m.id, m.skip);
    let status = "error";
    try {
      status = pyodide.globals.get("run_program")(m.code, JSON.stringify(m.answers), m.seed);
    } catch (e) {
      emit("err", String((e && e.message) || e) + "\n");
    }
    post({ type: "done", id: m.id, status });
  } else if (m.type === "repl") {
    begin(m.id, 0);
    let status = "error";
    try {
      status = pyodide.globals.get("repl_line")(m.line);
    } catch (e) {
      emit("err", String((e && e.message) || e) + "\n");
    }
    post({ type: "done", id: m.id, status });
  } else if (m.type === "repl-reset") {
    pyodide.globals.get("repl_reset")();
  }
};
