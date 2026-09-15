import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { deleteStory, getStoryById, updateStory } from "@/lib/data";
import { deleteCaseFolder } from "@/lib/storage";
import { resolveStorySlug, storyScalars } from "@/lib/story-save";
import type { StoryInput } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

function revalidateStory(slug: string) {
  revalidatePath("/");
  revalidatePath("/cases");
  revalidatePath(`/cases/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/cases");
}

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getStoryById(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const input = (await request.json()) as StoryInput;
  if (!input.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = await resolveStorySlug(input.title, input.slug, id);
  const data = storyScalars(input, slug, existing.published);
  const payload = { ...data } as Record<string, unknown>;
  if (payload.publishedAt === undefined) delete payload.publishedAt;

  await updateStory(id, payload);
  revalidateStory(existing.slug);
  if (slug !== existing.slug) revalidateStory(slug);

  return NextResponse.json({ id, slug });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getStoryById(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await deleteStory(id);
  await deleteCaseFolder(id);
  revalidateStory(existing.slug);
  return NextResponse.json({ ok: true });
}
