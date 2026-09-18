import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteCategory } from "@/lib/data";
import { revalidatePublic } from "@/lib/cache";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await deleteCategory(id);
  revalidatePublic();
  return NextResponse.json({ ok: true });
}
