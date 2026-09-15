import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { createCategory } from "@/lib/data";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/cases");
  revalidatePath("/admin/categories");
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { name?: string; description?: string };
  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const category = await createCategory(name, body.description?.trim() ?? "");
  revalidate();
  return NextResponse.json(category);
}
