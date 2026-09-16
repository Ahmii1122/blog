import Link from "next/link";
import { getSettings } from "@/lib/settings";

export async function SiteHeader() {
  const settings = await getSettings();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-sm bg-crimson text-[11px] font-semibold tracking-[0.2em] text-white">
            CC
          </span>
          <span className="font-serif text-xl tracking-tight text-foreground group-hover:text-crimson">
            {settings.siteName}
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <Link href="/cases" className="hover:text-foreground">
            Cases
          </Link>
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          {settings.youtubeChannelUrl ? (
            <a
              href={settings.youtubeChannelUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              YouTube
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

export async function SiteFooter() {
  const settings = await getSettings();
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="font-serif text-base text-foreground">{settings.siteName}</p>
        <p>{settings.tagline}</p>
      </div>
    </footer>
  );
}
