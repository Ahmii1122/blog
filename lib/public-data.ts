import { unstable_cache } from "next/cache";
import { PUBLIC_CACHE_TAG } from "@/lib/cache";
import {
  getStoryBySlug,
  listCategoriesWithCounts,
  listStories,
  type CategoryRecord,
  type StoryRecord,
} from "@/lib/data";

export type PublicStory = Omit<StoryRecord, "publishedAt" | "updatedAt"> & {
  publishedAt: string | null;
  updatedAt?: string;
};

export type PublicStoryCard = Pick<
  PublicStory,
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "coverImage"
  | "year"
  | "location"
  | "status"
  | "tags"
  | "featured"
  | "categoryId"
  | "category"
  | "publishedAt"
>;

function serializeStory(story: StoryRecord): PublicStory {
  return {
    ...story,
    publishedAt: story.publishedAt ? new Date(story.publishedAt).toISOString() : null,
    updatedAt: story.updatedAt ? new Date(story.updatedAt).toISOString() : undefined,
  };
}

function serializeCard(story: StoryRecord): PublicStoryCard {
  return {
    id: story.id,
    slug: story.slug,
    title: story.title,
    excerpt: story.excerpt,
    coverImage: story.coverImage,
    year: story.year,
    location: story.location,
    status: story.status,
    tags: story.tags,
    featured: story.featured,
    categoryId: story.categoryId,
    category: story.category,
    publishedAt: story.publishedAt ? new Date(story.publishedAt).toISOString() : null,
  };
}

export const getCachedPublicCatalog = unstable_cache(
  async (): Promise<{ stories: PublicStoryCard[]; categories: CategoryRecord[] }> => {
    const [stories, categories] = await Promise.all([
      listStories({ published: true, sort: "publishedAt", cardsOnly: true }),
      listCategoriesWithCounts(true),
    ]);
    return {
      stories: stories.map(serializeCard),
      categories,
    };
  },
  ["public-catalog"],
  { revalidate: 60, tags: [PUBLIC_CACHE_TAG] },
);

export const getCachedStoryBySlug = unstable_cache(
  async (slug: string): Promise<PublicStory | null> => {
    const story = await getStoryBySlug(slug);
    if (!story || !story.published) return null;
    return serializeStory(story);
  },
  ["public-story"],
  { revalidate: 60, tags: [PUBLIC_CACHE_TAG] },
);
