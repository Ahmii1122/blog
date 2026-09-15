import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { MarkdownBody } from "@/components/site/MarkdownBody";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-[11px] uppercase tracking-[0.24em] text-crimson">The channel</p>
      <h1 className="mt-2 font-serif text-5xl tracking-tight">{settings.siteName}</h1>
      <p className="mt-4 text-lg text-muted">{settings.tagline}</p>
      <div className="mt-10">
        <MarkdownBody content={settings.about} />
      </div>
      {settings.youtubeChannelUrl ? (
        <a
          href={settings.youtubeChannelUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-flex rounded-full bg-crimson px-5 py-2.5 text-sm font-medium text-white"
        >
          Watch on YouTube
        </a>
      ) : null}
    </div>
  );
}
