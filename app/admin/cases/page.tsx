import Link from "next/link";
import { listStories } from "@/lib/data";
import { StatusBadge } from "@/components/site/StatusBadge";

export const metadata = { title: "Cases" };

export default async function AdminCasesPage() {
  const stories = await listStories({ sort: "updatedAt" });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-crimson">Library</p>
          <h1 className="mt-1 font-serif text-4xl">Cases</h1>
        </div>
        <Link href="/admin/cases/new" className="rounded-full bg-crimson px-4 py-2 text-sm text-white">
          New case
        </Link>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-xs uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Visibility</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => (
              <tr key={story.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <p>{story.title}</p>
                  <p className="text-xs text-muted">{story.category?.name ?? "Uncategorized"}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={story.status} />
                </td>
                <td className="hidden px-4 py-3 text-muted sm:table-cell">
                  {story.published ? "Published" : "Draft"}
                  {story.featured ? " · Featured" : ""}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/cases/${story.id}`} className="text-crimson">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {stories.length === 0 ? <p className="px-4 py-8 text-muted">No cases yet.</p> : null}
      </div>
    </div>
  );
}
