import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { deleteCategory } from "@/lib/data";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await deleteCategory(id);
  revalidatePath("/");
  revalidatePath("/cases");
  revalidatePath("/admin/categories");
  return NextResponse.json({ ok: true });
}
