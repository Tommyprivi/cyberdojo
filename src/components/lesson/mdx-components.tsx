import type { ComponentPropsWithoutRef } from "react";
import { BitLab } from "./bit-lab";
import { BitGrid, Callout, Envelope, Log } from "./bits";
import { Recap, Say, Scene } from "./blocks";
import { Flashcards } from "./flashcards";
import { Guided } from "./guided";
import { Practice } from "./practice";
import { Quiz } from "./quiz";
import { Video } from "./video";

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
  p: (p: P<"p">) => <p {...p} className="leading-relaxed" />,
  ul: (p: P<"ul">) => <ul {...p} className="grid list-disc gap-1 pl-6" />,
  strong: (p: P<"strong">) => <strong {...p} className="font-extrabold" />,
  table: (p: P<"table">) => (
    <div className="overflow-x-auto">
      <table {...p} className="w-full border-collapse text-center font-mono" />
    </div>
  ),
  th: (p: P<"th">) => <th {...p} className="border border-border bg-surface-muted px-2 py-2" />,
  td: (p: P<"td">) => <td {...p} className="border border-border px-2 py-2" />,
};
