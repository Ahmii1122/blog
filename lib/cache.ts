import { revalidatePath, revalidateTag } from "next/cache";

export const PUBLIC_CACHE_TAG = "public";

export function revalidatePublic(slug?: string) {
  revalidateTag(PUBLIC_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/cases");
  revalidatePath("/about");
  if (slug) revalidatePath(`/cases/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/cases");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/settings");
}
