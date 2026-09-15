import { listCategoriesWithCounts } from "@/lib/data";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const categories = await listCategoriesWithCounts();
  return <CategoryManager initial={categories} />;
}
