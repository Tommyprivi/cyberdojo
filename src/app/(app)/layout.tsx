import { BottomNav } from "@/components/bottom-nav";
import { SiteHeader } from "@/components/site-header";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-4">{children}</div>
      <BottomNav />
    </>
  );
}
