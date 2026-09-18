import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { getCachedPublicCatalog } from "@/lib/public-data";
import { CaseCard } from "@/components/site/CaseCard";
import { CoverImage } from "@/components/site/CoverImage";
import { StatusBadge } from "@/components/site/StatusBadge";
import { STATUSES } from "@/lib/utils";

export const revalidate = 60;
export const dynamic = "force-static";

export default async function HomePage() {
  const settings = await getSettings();
  const { stories, categories } = await getCachedPublicCatalog();
  const featured = stories.find((story) => story.featured) ?? stories[0] ?? null;
  const latest = stories.slice(0, 6);
  const typeCategories = categories.filter(
    (item) => !STATUSES.some((statusItem) => statusItem.value === item.slug),
  );

  const rest =
    latest.length <= 1 ? latest : latest.filter((story) => story.id !== featured?.id);

  return (
    <div>
      <section className="relative min-h-[78vh] overflow-hidden">
        {featured?.coverImage ? (
          <div className="absolute inset-0">
            <CoverImage
              src={featured.coverImage}
              alt=""
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(211,18,42,0.22),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(212,160,23,0.08),transparent_40%),#070708]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/30" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28">
          <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-crimson-text">
            {settings.siteName} · Case archive
          </p>
          {featured ? (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <StatusBadge status={featured.status} />
                <span className="text-sm text-muted">
                  {[featured.category?.name, featured.year, featured.location]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
              <h1 className="max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-7xl">
                {featured.title}
              </h1>
              {featured.excerpt ? (
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[#c9c3b6]">
                  {featured.excerpt}
                </p>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/cases/${featured.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-crimson px-5 py-2.5 text-sm font-medium text-white hover:bg-crimson-dim"
                >
                  Open the case file <ArrowRight size={16} />
                </Link>
                <Link
                  href="/cases"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm hover:border-foreground"
                >
                  All cases
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-7xl">
                {settings.siteName}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#c9c3b6]">
                {settings.tagline}
              </p>
              <p className="mt-4 max-w-xl text-muted">
                No published cases yet.
              </p>
            </>
          )}
        </div>
      </section>

      {typeCategories.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 py-12">
          <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-muted">
            Browse by file type
          </p>
          <div className="flex flex-wrap gap-2">
            {typeCategories.map((category) => (
              <Link
                key={category.id}
                href={`/cases?category=${category.slug}`}
                className="rounded-full border border-line px-4 py-2 text-sm text-muted hover:border-crimson hover:text-foreground"
              >
                {category.name}
                <span className="ml-2 text-xs text-muted">
                  {category._count?.stories ?? 0}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-crimson-text">Latest files</p>
            <h2 className="mt-2 font-serif text-4xl">The archive</h2>
          </div>
          <Link href="/cases" className="text-sm text-muted hover:text-foreground">
            View all
          </Link>
        </div>
        {rest.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((story, index) => (
              <CaseCard
                key={story.id}
                slug={story.slug}
                title={story.title}
                excerpt={story.excerpt}
                coverImage={story.coverImage}
                year={story.year}
                location={story.location}
                status={story.status}
                categoryName={story.category?.name}
                priority={index < 2}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted">More cases will appear here as they are published.</p>
        )}
      </section>

      {settings.youtubeChannelUrl ? (
        <section className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-16 sm:flex-row sm:items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-amber">On the channel</p>
              <h2 className="mt-2 font-serif text-4xl">Watch the explained cuts</h2>
              <p className="mt-3 max-w-xl text-muted">
                The videos stay lean. The written files on this site hold the rest of the case.
              </p>
            </div>
            <a
              href={settings.youtubeChannelUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
            >
              Open YouTube
            </a>
          </div>
        </section>
      ) : null}
    </div>
  );
}
