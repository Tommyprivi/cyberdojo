"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PythonEngine, type KillReason } from "@/lib/python/engine";
import { explainPythonError } from "@/lib/python/errors";
import { OUTPUT_LIMIT_MESSAGE, STOPPED_MESSAGE, TIMEOUT_MESSAGE } from "@/lib/python/limits";

export type SegChannel = "out" | "err" | "in" | "sys" | "help" | "cmd";
export type Seg = { channel: SegChannel; text: string };
export type Mode = "program" | "repl";
/** off = motore non ancora avviato; loading = download in corso; ready = pronto; running = sta girando; input = aspetta un input(). */
export type Status = "off" | "loading" | "ready" | "running" | "input";

function append(list: Seg[], channel: SegChannel, text: string): Seg[] {
  const last = list[list.length - 1];
  if (last && last.channel === channel && channel !== "help" && channel !== "sys") {
    return [...list.slice(0, -1), { channel, text: last.text + text }];
  }
  return [...list, { channel, text }];
}

const KILL_TEXT: Record<KillReason, string> = {
  timeout: TIMEOUT_MESSAGE,
  "output-limit": OUTPUT_LIMIT_MESSAGE,
  user: STOPPED_MESSAGE,
};

/** Stato del terminale Python di una singola istanza: un motore (worker) per ogni terminale. */
export function usePython() {
  const [status, setStatus] = useState<Status>("off");
  const [progress, setProgress] = useState({ fraction: 0, label: "" });
  const [program, setProgram] = useState<Seg[]>([]);
  const [repl, setRepl] = useState<Seg[]>([]);
  const [mode, setModeState] = useState<Mode>("program");
  const [replMore, setReplMore] = useState(false);
  const [fatal, setFatal] = useState<string | null>(null);

  const engineRef = useRef<PythonEngine | null>(null);
  const jobMode = useRef<Mode>("program");
  const errBuf = useRef("");

  const push = useCallback((channel: SegChannel, text: string) => {
    const set = jobMode.current === "program" ? setProgram : setRepl;
    set((l) => append(l, channel, text));
  }, []);

  const getEngine = useCallback((): PythonEngine => {
    if (!engineRef.current) {
      engineRef.current = new PythonEngine({
        onProgress: (fraction, label) => setProgress({ fraction, label }),
        onOutput: (channel, text) => {
          if (channel === "err") errBuf.current += text;
          push(channel, text);
        },
        onNeedInput: () => setStatus("input"),
        onFinish: (s) => {
          if (s === "error") {
            const help = explainPythonError(errBuf.current);
            if (help) push("help", help.text);
          }
          if (jobMode.current === "repl") setReplMore(s === "more");
          setStatus("ready");
        },
        onKilled: (reason) => {
          push("sys", KILL_TEXT[reason]);
          setProgress({ fraction: 0, label: "Riavvio di Python" });
          if (jobMode.current === "repl") setReplMore(false);
          setStatus("ready");
        },
        onFatal: (message) => {
          setFatal(message);
          setStatus("off");
        },
      });
    }
    return engineRef.current;
  }, [push]);

  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    setFatal(null);
    setStatus("loading");
    setProgress({ fraction: 0, label: "Preparo il motore Python" });
    getEngine()
      .start()
      .then(() => setStatus("ready"))
      .catch((e: unknown) => {
        setFatal(e instanceof Error ? e.message : String(e));
        setStatus("off");
      });
  }, [getEngine]);

  const run = useCallback(
    (code: string) => {
      jobMode.current = "program";
      errBuf.current = "";
      setModeState("program");
      setProgram([]);
      setStatus("running");
      void getEngine().runProgram(code);
    },
    [getEngine],
  );

  const submitInput = useCallback(
    (text: string) => {
      jobMode.current = "program";
      setStatus("running");
      void getEngine().submitInput(text);
    },
    [getEngine],
  );

  const replLine = useCallback(
    (line: string) => {
      jobMode.current = "repl";
      errBuf.current = "";
      push("cmd", (replMore ? "... " : ">>> ") + line + "\n");
      setStatus("running");
      void getEngine().replLine(line);
    },
    [getEngine, push, replMore],
  );

  const stop = useCallback(() => engineRef.current?.stop(), []);
  const clear = useCallback(() => (mode === "program" ? setProgram([]) : setRepl([])), [mode]);

  return {
    status,
    progress,
    program,
    repl,
    mode,
    setMode: setModeState,
    replMore,
    fatal,
    start,
    run,
    stop,
    submitInput,
    replLine,
    clear,
  };
}
