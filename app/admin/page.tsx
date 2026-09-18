import Link from "next/link";
import { countStories, listStories } from "@/lib/data";

export const metadata = { title: "Dashboard" };

export default async function AdminHome() {
  const [total, published, drafts, featured, recent] = await Promise.all([
    countStories(),
    countStories({ published: true }),
    countStories({ published: false }),
    countStories({ featured: true }),
    listStories({ sort: "updatedAt", limit: 6 }),
  ]);

  const stats = [
    { label: "All files", value: total },
    { label: "Published", value: published },
    { label: "Drafts", value: drafts },
    { label: "Featured", value: featured },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-crimson-text">Admin</p>
          <h1 className="mt-1 font-serif text-4xl">Dashboard</h1>
        </div>
        <Link href="/admin/cases/new" className="rounded-full bg-crimson px-4 py-2 text-sm text-white">
          New case
        </Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-line bg-card p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">{stat.label}</p>
            <p className="mt-2 font-serif text-4xl">{stat.value}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-12 font-serif text-2xl">Recent files</h2>
      <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-card">
        {recent.map((story) => (
          <Link
            key={story.id}
            href={`/admin/cases/${story.id}`}
            className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/5"
          >
            <div>
              <p className="font-medium">{story.title}</p>
              <p className="text-sm text-muted">
                {story.published ? "Published" : "Draft"}
                {story.category ? ` · ${story.category.name}` : ""}
              </p>
            </div>
            <span className="text-xs uppercase tracking-[0.16em] text-muted">Edit</span>
          </Link>
        ))}
        {recent.length === 0 ? <p className="px-5 py-8 text-muted">No cases yet.</p> : null}
      </div>
    </div>
  );
}
