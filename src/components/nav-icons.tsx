import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const UserIcon = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></svg>
);
export const ChevronLeftIcon = (p: P) => (
  <svg {...base} {...p}><path d="m15 5-7 7 7 7" /></svg>
);
export const ChevronRightIcon = (p: P) => (
  <svg {...base} {...p}><path d="m9 5 7 7-7 7" /></svg>
);
export const ChevronDownIcon = (p: P) => (
  <svg {...base} {...p}><path d="m5 9 7 7 7-7" /></svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const LogOutIcon = (p: P) => (
  <svg {...base} {...p}><path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H9" /></svg>
);
