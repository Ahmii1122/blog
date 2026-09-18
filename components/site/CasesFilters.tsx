"use client";

import { useEffect, useState } from "react";
import type { CategoryRecord } from "@/lib/data";
import { STATUSES } from "@/lib/utils";

type Filters = {
  q: string;
  category: string;
  status: string;
};

function readFilters(): Filters {
  const params = new URLSearchParams(window.location.search);
  return {
    q: params.get("q")?.trim() ?? "",
    category: params.get("category") ?? "",
    status: params.get("status") ?? "",
  };
}

function writeFilters(next: Filters) {
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.category) params.set("category", next.category);
  if (next.status) params.set("status", next.status);
  const query = params.toString();
  window.history.replaceState(null, "", query ? `/cases?${query}` : "/cases");
}

function applyToGrid(filters: Filters) {
  const cards = document.querySelectorAll<HTMLElement>("[data-case-card]");
  const needle = filters.q.toLowerCase();
  let visible = 0;

  cards.forEach((card) => {
    const statusOk = !filters.status || card.dataset.status === filters.status;
    const categoryOk = !filters.category || card.dataset.category === filters.category;
    const searchOk = !needle || (card.dataset.text ?? "").includes(needle);
    const show = statusOk && categoryOk && searchOk;
    card.hidden = !show;
    if (show) visible += 1;
  });

  const empty = document.querySelector<HTMLElement>("[data-case-empty]");
  if (empty) empty.hidden = visible > 0;
}

export function CasesFilters({ categories }: { categories: CategoryRecord[] }) {
  const [filters, setFilters] = useState<Filters>({ q: "", category: "", status: "" });
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const next = readFilters();
    setFilters(next);
    setDraft(next.q);
    applyToGrid(next);
  }, []);

  function apply(next: Filters) {
    setFilters(next);
    writeFilters(next);
    applyToGrid(next);
  }

  const typeCategories = categories.filter(
    (item) => !STATUSES.some((statusItem) => statusItem.value === item.slug),
  );

  return (
    <>
      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          apply({ ...filters, q: draft.trim() });
        }}
      >
        <input
          name="q"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Search titles, places, tags..."
          className="h-11 flex-1 rounded-full border border-line bg-card px-4 text-sm"
        />
        <button className="h-11 rounded-full bg-crimson px-5 text-sm font-medium text-white">
          Search
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => apply({ ...filters, category: "", status: "" })}
          className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em] ${!filters.category && !filters.status ? "border-crimson text-foreground" : "border-line text-muted"}`}
        >
          All
        </button>
        {STATUSES.map((item) => (
          <button
            type="button"
            key={item.value}
            onClick={() => apply({ ...filters, status: item.value, category: "" })}
            className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em] ${filters.status === item.value ? "border-crimson text-foreground" : "border-line text-muted"}`}
          >
            {item.label}
          </button>
        ))}
        {typeCategories.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => apply({ ...filters, category: item.slug, status: "" })}
            className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.16em] ${filters.category === item.slug ? "border-crimson text-foreground" : "border-line text-muted"}`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </>
  );
}
