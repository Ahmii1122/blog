import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStoryBySlug } from "@/lib/data";
import { splitTags, youtubeEmbedUrl } from "@/lib/youtube";
import { roleLabel } from "@/lib/utils";
import { ArrowLeft, User } from "lucide-react";
import { MarkdownBody } from "@/components/site/MarkdownBody";
import { StatusBadge } from "@/components/site/StatusBadge";
import { YouTubeEmbed } from "@/components/site/YouTubeEmbed";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story || !story.published) return { title: "Case not found" };
  return { title: story.title, description: story.excerpt || undefined };
}

export default async function CasePage({ params }: Params) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story || !story.published) notFound();

  const embed = youtubeEmbedUrl(story.youtubeUrl);
  const tags = splitTags(story.tags);
  const videos = story.media.filter((item) => item.type === "video");
  const images = story.media.filter((item) => item.type !== "video");
  const sections = [
    { id: "story", label: "Story" },
    story.people.length ? { id: "people", label: "People" } : null,
    story.timeline.length ? { id: "timeline", label: "Timeline" } : null,
    videos.length || images.length || embed ? { id: "evidence", label: "Evidence" } : null,
    story.sources.length ? { id: "sources", label: "Sources" } : null,
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <article>
      <header className="relative min-h-[52vh] overflow-hidden">
        {story.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={story.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(211,18,42,0.2),transparent_55%),#070708]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/25" />
        <div className="relative mx-auto flex min-h-[52vh] max-w-6xl flex-col justify-end px-5 pb-12 pt-24">
          <Link
            href="/cases"
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-black/70 px-3.5 py-1.5 text-xs uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-md hover:bg-black/85"
          >
            <ArrowLeft size={14} />
            All cases
          </Link>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <StatusBadge status={story.status} />
            {story.category ? (
              <Link href={`/cases?category=${story.category.slug}`} className="text-sm text-muted hover:text-foreground">
                {story.category.name}
              </Link>
            ) : null}
          </div>
          <h1 className="max-w-4xl font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl">
            {story.title}
          </h1>
          {story.excerpt ? (
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#c9c3b6]">{story.excerpt}</p>
          ) : null}
          <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-muted">Year</dt>
              <dd className="mt-1">{story.year ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-muted">Location</dt>
              <dd className="mt-1">{story.location || "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-muted">Status</dt>
              <dd className="mt-1 capitalize">{story.status}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-2 text-sm">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="block text-muted hover:text-crimson-text">
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-16">
          <section id="story">
            <p className="mb-4 text-[11px] uppercase tracking-[0.24em] text-crimson-text">The file</p>
            {story.content ? (
              <MarkdownBody content={story.content} />
            ) : (
              <p className="text-muted">The written story has not been added yet.</p>
            )}
            {tags.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </section>

          {story.people.length > 0 ? (
            <section id="people">
              <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-crimson-text">People involved</p>
              <h2 className="font-serif text-3xl">The names in the file</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {story.people.map((person, index) => (
                  <article key={`${person.name}-${index}`} className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card">
                    {person.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={person.photo} alt="" className="h-56 w-full shrink-0 object-cover" />
                    ) : (
                      <div className="grid h-56 w-full shrink-0 place-items-center bg-card-2 text-muted">
                        <User className="h-16 w-16" strokeWidth={1.25} />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-amber">{roleLabel(person.role)}</p>
                      <h3 className="mt-1 font-serif text-2xl">{person.name}</h3>
                      {person.bio ? <p className="mt-2 text-sm leading-6 text-muted">{person.bio}</p> : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {story.timeline.length > 0 ? (
            <section id="timeline">
              <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-crimson-text">Timeline</p>
              <h2 className="font-serif text-3xl">How it unfolded</h2>
              <ol className="mt-8 space-y-0">
                {story.timeline.map((event, index) => (
                  <li key={`${event.title}-${index}`} className="grid grid-cols-[20px_1fr] gap-4">
                    <div className="flex flex-col items-center">
                      <span className="mt-1 h-3 w-3 rounded-full bg-crimson" />
                      {index < story.timeline.length - 1 ? (
                        <span className="w-px flex-1 bg-line" />
                      ) : null}
                    </div>
                    <div className="pb-8">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted">{event.date}</p>
                      <h3 className="mt-1 font-serif text-xl">{event.title}</h3>
                      {event.description ? (
                        <p className="mt-2 text-sm leading-6 text-muted">{event.description}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {embed || videos.length || images.length ? (
            <section id="evidence">
              <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-crimson-text">Evidence</p>
              <h2 className="font-serif text-3xl">Video and stills</h2>
              <div className="mt-8 space-y-6">
                {embed ? <YouTubeEmbed src={embed} /> : null}
                {videos.map((item, index) => (
                  <figure key={`${item.path}-${index}`} className="overflow-hidden rounded-2xl border border-line bg-black">
                    <video src={item.path} controls className="w-full" />
                    {item.caption ? (
                      <figcaption className="border-t border-line bg-card px-4 py-3 text-sm text-muted">
                        {item.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
                {images.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {images.map((item, index) => (
                      <figure key={`${item.path}-${index}`} className="overflow-hidden rounded-2xl border border-line bg-card">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.path} alt={item.caption || ""} className="w-full object-cover" />
                        {item.caption ? (
                          <figcaption className="px-4 py-3 text-sm text-muted">{item.caption}</figcaption>
                        ) : null}
                      </figure>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {story.sources.length > 0 ? (
            <section id="sources">
              <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-crimson-text">Sources</p>
              <h2 className="font-serif text-3xl">Further reading</h2>
              <ul className="mt-6 space-y-3">
                {story.sources.map((source, index) => (
                  <li key={`${source.title}-${index}`}>
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-foreground underline decoration-crimson/50 underline-offset-4 hover:text-crimson-text"
                      >
                        {source.title}
                      </a>
                    ) : (
                      <span>{source.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </article>
  );
}
