import { randomUUID } from "crypto";
import { listCategories } from "@/lib/data";
import { CaseEditor } from "@/components/admin/CaseEditor";

export const metadata = { title: "New case" };

export default async function NewCasePage() {
  const categories = await listCategories();
  return <CaseEditor caseId={randomUUID()} categories={categories} />;
}
