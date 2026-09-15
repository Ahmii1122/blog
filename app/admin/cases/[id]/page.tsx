import { notFound } from "next/navigation";
import { getStoryById, listCategories } from "@/lib/data";
import { CaseEditor } from "@/components/admin/CaseEditor";

type Params = { params: Promise<{ id: string }> };

export const metadata = { title: "Edit case" };

export default async function EditCasePage({ params }: Params) {
  const { id } = await params;
  const [story, categories] = await Promise.all([getStoryById(id), listCategories()]);

  if (!story) notFound();

  return (
    <CaseEditor
      caseId={story.id}
      categories={categories}
      initial={{
        id: story.id,
        title: story.title,
        slug: story.slug,
        excerpt: story.excerpt,
        content: story.content,
        coverImage: story.coverImage,
        youtubeUrl: story.youtubeUrl,
        location: story.location,
        year: story.year,
        status: story.status,
        tags: story.tags,
        published: story.published,
        featured: story.featured,
        categoryId: story.categoryId,
        people: story.people ?? [],
        timeline: story.timeline ?? [],
        sources: story.sources ?? [],
        media: story.media ?? [],
      }}
    />
  );
}
