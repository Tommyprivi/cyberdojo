import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const FlameIcon = (p: P) => (
  <svg {...base} {...p}><path d="M12 3c1 3-3 5-3 9a4 4 0 0 0 8 0c0-2-1-3-1-5 2 1 4 3.5 4 6.5a8 8 0 0 1-16 0C4 9 9 7 12 3Z" /></svg>
);
export const BoltIcon = (p: P) => (
  <svg {...base} {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>
);
export const BeltIcon = (p: P) => (
  <svg {...base} {...p}><path d="M3 9h18v6H3zM10 9v6M14 9v6M7 15l-2 6M17 15l2 6" /></svg>
);
export const LockIcon = (p: P) => (
  <svg {...base} {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
export const CheckIcon = (p: P) => (
  <svg {...base} {...p}><path d="m5 12 5 5L20 7" /></svg>
);
export const PlayIcon = (p: P) => (
  <svg {...base} {...p}><path d="M7 4v16l13-8z" fill="currentColor" /></svg>
);
export const MapIcon = (p: P) => (
  <svg {...base} {...p}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2ZM9 4v14M15 6v14" /></svg>
);
export const DumbbellIcon = (p: P) => (
  <svg {...base} {...p}><path d="M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12" /></svg>
);
export const BookIcon = (p: P) => (
  <svg {...base} {...p}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5ZM8 7h7" /></svg>
);
export const TargetIcon = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>
);
export const BulbIcon = (p: P) => (
  <svg {...base} {...p}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" /></svg>
);
