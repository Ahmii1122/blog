import { connectMongo } from "@/lib/mongo";
import { Category, Setting, Story } from "@/lib/models";
import { uniqueSlug } from "@/lib/slug";
import type { StoryInput } from "@/lib/types";

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  _count?: { stories: number };
};

export type StoryRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  youtubeUrl: string | null;
  location: string | null;
  year: number | null;
  status: string;
  tags: string;
  published: boolean;
  featured: boolean;
  categoryId: string | null;
  category?: CategoryRecord | null;
  people: NonNullable<StoryInput["people"]>;
  timeline: NonNullable<StoryInput["timeline"]>;
  sources: NonNullable<StoryInput["sources"]>;
  media: NonNullable<StoryInput["media"]>;
  publishedAt: Date | null;
  updatedAt?: Date;
};

function mapCategory(doc: { _id: string; name: string; slug: string; description?: string }): CategoryRecord {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    description: doc.description ?? "",
  };
}

function mapStory(doc: Record<string, unknown>): StoryRecord {
  const categoryRaw = doc.categoryId;
  const category =
    categoryRaw && typeof categoryRaw === "object"
      ? mapCategory(categoryRaw as { _id: string; name: string; slug: string; description?: string })
      : null;

  return {
    id: String(doc._id),
    slug: String(doc.slug ?? ""),
    title: String(doc.title ?? ""),
    excerpt: String(doc.excerpt ?? ""),
    content: String(doc.content ?? ""),
    coverImage: (doc.coverImage as string | null) ?? null,
    youtubeUrl: (doc.youtubeUrl as string | null) ?? null,
    location: (doc.location as string | null) ?? null,
    year: (doc.year as number | null) ?? null,
    status: String(doc.status ?? "unsolved"),
    tags: String(doc.tags ?? ""),
    published: Boolean(doc.published),
    featured: Boolean(doc.featured),
    categoryId: category ? category.id : ((doc.categoryId as string | null) ?? null),
    category,
    people: ((doc.people as NonNullable<StoryInput["people"]>) ?? []),
    timeline: ((doc.timeline as NonNullable<StoryInput["timeline"]>) ?? []),
    sources: ((doc.sources as NonNullable<StoryInput["sources"]>) ?? []),
    media: ((doc.media as NonNullable<StoryInput["media"]>) ?? []),
    publishedAt: (doc.publishedAt as Date | null) ?? null,
    updatedAt: doc.updatedAt as Date | undefined,
  };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function listCategories() {
  await connectMongo();
  const rows = await Category.find().sort({ name: 1 }).lean();
  return rows.map((row) => mapCategory(row as { _id: string; name: string; slug: string; description?: string }));
}

export async function listCategoriesWithCounts(publishedOnly = false) {
  await connectMongo();
  const [rows, counts] = await Promise.all([
    Category.find().sort({ name: 1 }).lean(),
    Story.aggregate([
      ...(publishedOnly ? [{ $match: { published: true } }] : []),
      { $group: { _id: "$categoryId", n: { $sum: 1 } } },
    ]),
  ]);
  const map = Object.fromEntries(counts.map((item: { _id: string | null; n: number }) => [String(item._id ?? ""), item.n]));
  return rows.map((row) => {
    const category = mapCategory(row as { _id: string; name: string; slug: string; description?: string });
    return { ...category, _count: { stories: map[category.id] ?? 0 } };
  });
}

export async function getCategoryBySlug(slug: string) {
  await connectMongo();
  const row = await Category.findOne({ slug }).lean();
  return row
    ? mapCategory(row as { _id: string; name: string; slug: string; description?: string })
    : null;
}

export async function createCategory(name: string, description: string) {
  await connectMongo();
  let slug = await uniqueSlug(name, async (value) => Boolean(await Category.exists({ slug: value })));
  const created = await Category.create({ name, slug, description });
  return mapCategory({
    _id: String(created._id),
    name: created.name as string,
    slug: created.slug as string,
    description: (created.description as string) ?? "",
  });
}

export async function deleteCategory(id: string) {
  await connectMongo();
  await Story.updateMany({ categoryId: id }, { $set: { categoryId: null } });
  await Category.findByIdAndDelete(id);
}

export async function getStoryById(id: string) {
  await connectMongo();
  const row = await Story.findById(id).populate("categoryId").lean();
  return row ? mapStory(row as Record<string, unknown>) : null;
}

export async function getStoryBySlug(slug: string) {
  await connectMongo();
  const row = await Story.findOne({ slug }).populate("categoryId").lean();
  return row ? mapStory(row as Record<string, unknown>) : null;
}

export async function listStories(options?: {
  published?: boolean;
  featured?: boolean;
  status?: string;
  categoryId?: string | null;
  search?: string;
  sort?: "publishedAt" | "updatedAt";
  limit?: number;
}) {
  await connectMongo();
  const filter: Record<string, unknown> = {};
  if (typeof options?.published === "boolean") filter.published = options.published;
  if (typeof options?.featured === "boolean") filter.featured = options.featured;
  if (options?.status) filter.status = options.status;
  if (options?.categoryId) filter.categoryId = options.categoryId;
  if (options?.search) {
    const rx = new RegExp(escapeRegex(options.search), "i");
    filter.$or = [{ title: rx }, { excerpt: rx }, { tags: rx }, { location: rx }];
  }

  const sortField = options?.sort === "updatedAt" ? "updatedAt" : "publishedAt";
  let query = Story.find(filter).populate("categoryId").sort({ [sortField]: -1 });
  if (options?.limit) query = query.limit(options.limit);
  const rows = await query.lean();
  return rows.map((row) => mapStory(row as Record<string, unknown>));
}

export async function countStories(filter: Record<string, unknown> = {}) {
  await connectMongo();
  return Story.countDocuments(filter);
}

export async function createStory(id: string | undefined, data: Record<string, unknown>) {
  await connectMongo();
  const created = await Story.create(id ? { _id: id, ...data } : data);
  return mapStory(created.toObject() as Record<string, unknown>);
}

export async function updateStory(id: string, data: Record<string, unknown>) {
  await connectMongo();
  const updated = await Story.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
  return updated ? mapStory(updated as Record<string, unknown>) : null;
}

export async function deleteStory(id: string) {
  await connectMongo();
  await Story.findByIdAndDelete(id);
}

export async function slugTaken(slug: string, excludeId?: string) {
  await connectMongo();
  const existing = await Story.findOne({ slug }).lean();
  if (!existing) return false;
  return String(existing._id) !== excludeId;
}

export async function getSettingRows() {
  await connectMongo();
  const rows = await Setting.find().lean();
  return rows.map((row) => ({
    key: String((row as { key?: string }).key ?? ""),
    value: String((row as { value?: string }).value ?? ""),
  }));
}

export async function upsertSetting(key: string, value: string) {
  await connectMongo();
  await Setting.findOneAndUpdate({ key }, { $set: { value } }, { upsert: true });
}
