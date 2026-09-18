import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createStory } from "@/lib/data";
import { revalidatePublic } from "@/lib/cache";
import { resolveStorySlug, storyScalars } from "@/lib/story-save";
import type { StoryInput } from "@/lib/types";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = (await request.json()) as StoryInput & { id?: string };
  if (!input.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = await resolveStorySlug(input.title, input.slug);
  const data = storyScalars(input, slug, false);
  const story = await createStory(input.id, {
    ...data,
    publishedAt: data.published ? new Date() : null,
  });
  revalidatePublic(story.slug);

  return NextResponse.json({ id: story.id, slug: story.slug });
}
