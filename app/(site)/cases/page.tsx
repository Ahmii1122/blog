import { getCategoryBySlug, listCategories, listStories } from "@/lib/data";
import { CaseCard } from "@/components/site/CaseCard";
import { STATUSES } from "@/lib/utils";
import Link from "next/link";

type Search = Promise<{ q?: string; category?: string; status?: string }>;

export const metadata = {
  title: "Cases",
};

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const categorySlug = params.category ?? "";
  const status = params.status ?? "";

  const categories = await listCategories();
  const category = categorySlug ? await getCategoryBySlug(categorySlug) : null;
  const stories =
    categorySlug && !category
      ? []
      : await listStories({
          published: true,
          status: status || undefined,
          categoryId: category?.id,
          search: q || undefined,
          sort: "publishedAt",
        });

  function href(next: Record<string, string>) {
    const merged = { q, category: categorySlug, status, ...next };
    const usp = new URLSearchParams();
    Object.entries(merged).forEach(([key, value]) => {
      if (value) usp.set(key, value);
    });
    const s = usp.toString();
    return s ? `/cases?${s}` : "/cases";
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-[11px] uppercase tracking-[0.24em] text-crimson">Archive</p>
      <h1 className="mt-2 font-serif text-5xl tracking-tight">All case files</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Search the written stories, filter by status or type, then open a file.
      </p>

      <form className="mt-8 flex flex-col gap-3 sm:flex-row" action="/cases">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search titles, places, tags..."
          className="h-11 flex-1 rounded-full border border-line bg-card px-4 text-sm"
        />
        {categorySlug ? <input type="hidden" name="category" value={categorySlug} /> : null}
        {status ? <input type="hidden" name="status" value={status} /> : null}
        <button className="h-11 rounded-full bg-crimson px-5 text-sm font-medium text-white">
          Search
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={href({ category: "" })}
          className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em] ${!categorySlug ? "border-crimson text-foreground" : "border-line text-muted"}`}
        >
          All types
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={href({ category: category.slug })}
            className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em] ${categorySlug === category.slug ? "border-crimson text-foreground" : "border-line text-muted"}`}
          >
            {category.name}
          </Link>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={href({ status: "" })}
          className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em] ${!status ? "border-amber text-foreground" : "border-line text-muted"}`}
        >
          Any status
        </Link>
        {STATUSES.map((item) => (
          <Link
            key={item.value}
            href={href({ status: item.value })}
            className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em] ${status === item.value ? "border-amber text-foreground" : "border-line text-muted"}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <CaseCard
            key={story.id}
            slug={story.slug}
            title={story.title}
            excerpt={story.excerpt}
            coverImage={story.coverImage}
            year={story.year}
            location={story.location}
            status={story.status}
            categoryName={story.category?.name}
          />
        ))}
      </div>
      {stories.length === 0 ? (
        <p className="mt-12 text-muted">No published cases match those filters.</p>
      ) : null}
    </div>
  );
}
