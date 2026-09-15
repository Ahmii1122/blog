import { uniqueSlug } from "@/lib/slug";
import { slugTaken } from "@/lib/data";
import type { StoryInput } from "@/lib/types";

export function nestedFromInput(input: StoryInput) {
  return {
    people: (input.people ?? [])
      .filter((person) => person.name.trim())
      .map((person, index) => ({
        name: person.name.trim(),
        role: person.role || "other",
        photo: person.photo || null,
        bio: person.bio ?? "",
        order: person.order ?? index,
      })),
    timeline: (input.timeline ?? [])
      .filter((event) => event.title.trim())
      .map((event, index) => ({
        date: event.date ?? "",
        title: event.title.trim(),
        description: event.description ?? "",
        order: event.order ?? index,
      })),
    sources: (input.sources ?? [])
      .filter((source) => source.title.trim())
      .map((source, index) => ({
        title: source.title.trim(),
        url: source.url ?? "",
        order: source.order ?? index,
      })),
    media: (input.media ?? [])
      .filter((item) => item.path)
      .map((item, index) => ({
        type: item.type || "image",
        path: item.path,
        caption: item.caption ?? "",
        order: item.order ?? index,
      })),
  };
}

export async function resolveStorySlug(title: string, requested?: string, excludeId?: string) {
  const base = requested?.trim() || title;
  return uniqueSlug(base, (slug) => slugTaken(slug, excludeId));
}

export function storyScalars(input: StoryInput, slug: string, wasPublished: boolean) {
  const published = Boolean(input.published);
  return {
    title: input.title.trim(),
    slug,
    excerpt: input.excerpt ?? "",
    content: input.content ?? "",
    coverImage: input.coverImage || null,
    youtubeUrl: input.youtubeUrl || null,
    location: input.location || null,
    year:
      input.year == null || String(input.year).trim() === ""
        ? null
        : Number.isFinite(Number(input.year))
          ? Number(input.year)
          : null,
    status: input.status || "unsolved",
    tags: input.tags ?? "",
    published,
    featured: Boolean(input.featured),
    categoryId: input.categoryId || null,
    ...nestedFromInput(input),
    publishedAt: published ? (wasPublished ? undefined : new Date()) : null,
  };
}
