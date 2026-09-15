"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  _count: { stories: number };
};

export function CategoryManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Could not create category");
      return;
    }
    setName("");
    setDescription("");
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this category? Cases will keep their other fields.")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-[11px] uppercase tracking-[0.24em] text-crimson">Taxonomy</p>
      <h1 className="mt-1 font-serif text-4xl">Categories</h1>
      <form onSubmit={create} className="mt-8 space-y-3 rounded-2xl border border-line bg-card p-5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="field"
          required
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
          className="field"
        />
        {error ? <p className="text-sm text-crimson">{error}</p> : null}
        <button className="rounded-full bg-crimson px-4 py-2 text-sm text-white">Add category</button>
      </form>
      <div className="mt-8 divide-y divide-line rounded-2xl border border-line">
        {initial.map((category) => (
          <div key={category.id} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p>{category.name}</p>
              <p className="text-sm text-muted">
                {category.slug} · {category._count.stories} cases
              </p>
            </div>
            <button onClick={() => remove(category.id)} className="text-sm text-muted hover:text-crimson">
              Delete
            </button>
          </div>
        ))}
        {initial.length === 0 ? <p className="px-5 py-8 text-muted">No categories yet.</p> : null}
      </div>
    </div>
  );
}
