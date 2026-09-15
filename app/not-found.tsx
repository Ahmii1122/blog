import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site/Chrome";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
        <p className="text-[11px] uppercase tracking-[0.24em] text-crimson">404</p>
        <h1 className="mt-2 font-serif text-5xl">File not found</h1>
        <p className="mt-3 text-muted">That case is missing, unpublished, or the link is wrong.</p>
        <Link href="/cases" className="mt-8 rounded-full bg-crimson px-5 py-2.5 text-sm text-white">
          Back to the archive
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
}
