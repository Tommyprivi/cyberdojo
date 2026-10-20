import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewNav } from "@/components/review/nav";
import { internalToolsEnabled } from "@/lib/internal";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/** Strumenti interni: tutto il centro di revisione si chiude in produzione. */
export default function ReviewLayout({ children }: LayoutProps<"/revisione">) {
  if (!internalToolsEnabled()) notFound();
  return (
    <div>
      <ReviewNav />
      {children}
    </div>
  );
}
