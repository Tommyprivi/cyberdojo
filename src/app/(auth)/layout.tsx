import { SiteHeader } from "@/components/site-header";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader wide />
      <main className="mx-auto w-full max-w-6xl flex-1 px-0 pb-12 sm:px-4 sm:pt-6 lg:px-8 lg:pt-10">{children}</main>
    </>
  );
}
