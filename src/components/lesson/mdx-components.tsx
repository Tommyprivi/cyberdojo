import type { ComponentPropsWithoutRef } from "react";
import { BitLab } from "./bit-lab";
import { BitGrid, Callout, Envelope, Log } from "./bits";
import { Recap, Say, Scene } from "./blocks";
import { Flashcards } from "./flashcards";
import { Guided } from "./guided";
import { Practice } from "./practice";
import { Quiz } from "./quiz";
import { Video } from "./video";
import { LinuxTerminal } from "../linux/linux-terminal";
import { VirtualMachine } from "../linux/virtual-machine";
import { PythonTerminal } from "../python/python-terminal";
import { SqlPlayground } from "../sql/sql-playground";

type P<T extends keyof React.JSX.IntrinsicElements> = ComponentPropsWithoutRef<T>;

export const lessonComponents = {
  Scene,
  Say,
  Recap,
  Quiz,
  Guided,
  Practice,
  BitGrid,
  BitLab,
  Callout,
  Envelope,
  Log,
  Flashcards,
  Video,
  PythonTerminal,
  LinuxTerminal,
  VirtualMachine,
  SqlPlayground,
  p: (p: P<"p">) => <p {...p} className="max-w-[70ch] leading-relaxed" />,
  ul: (p: P<"ul">) => <ul {...p} className="grid max-w-[70ch] list-disc gap-1 pl-6" />,
  strong: (p: P<"strong">) => <strong {...p} className="font-extrabold" />,
  // Blocchi di codice (```python, ```sql, ```bash): sfondo scuro, carattere mono, scorrimento orizzontale invece di andare a capo.
  pre: (p: P<"pre">) => (
    <pre {...p} className="max-w-full overflow-x-auto rounded-md bg-deep p-4 font-mono text-sm leading-relaxed text-deep-fg [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit" />
  ),
  code: (p: P<"code">) => <code {...p} className="rounded bg-surface-muted px-1 py-0.5 font-mono text-[0.92em]" />,
  table: (p: P<"table">) => (
    <div className="overflow-x-auto">
      <table {...p} className="w-full border-collapse text-center font-mono" />
    </div>
  ),
  th: (p: P<"th">) => <th {...p} className="border border-border bg-surface-muted px-2 py-2" />,
  td: (p: P<"td">) => <td {...p} className="border border-border px-2 py-2" />,
};
