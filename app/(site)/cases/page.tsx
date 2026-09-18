import { getCachedPublicCatalog } from "@/lib/public-data";
import { CaseCard } from "@/components/site/CaseCard";
import { CasesFilters } from "@/components/site/CasesFilters";

export const metadata = {
  title: "Cases",
};

export const revalidate = 60;
export const dynamic = "force-static";

export default async function CasesPage() {
  const { stories, categories } = await getCachedPublicCatalog();

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-[11px] uppercase tracking-[0.24em] text-crimson-text">Archive</p>
      <h1 className="mt-2 font-serif text-5xl tracking-tight">All case files</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Search the written stories, pick a filter, then open a file.
      </p>

      <CasesFilters categories={categories} />

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story, index) => (
          <div
            key={story.id}
            data-case-card
            data-status={story.status}
            data-category={story.category?.slug ?? ""}
            data-text={`${story.title} ${story.excerpt} ${story.tags} ${story.location ?? ""}`.toLowerCase()}
          >
            <CaseCard
              slug={story.slug}
              title={story.title}
              excerpt={story.excerpt}
              coverImage={story.coverImage}
              year={story.year}
              location={story.location}
              status={story.status}
              categoryName={story.category?.name}
              priority={index < 3}
            />
          </div>
        ))}
      </div>
      <p data-case-empty hidden className="mt-12 text-muted">
        No published cases match those filters.
      </p>
    </div>
  );
}
