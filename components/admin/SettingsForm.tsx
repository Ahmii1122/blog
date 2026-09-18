"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/settings";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setSaved(false);
    setError("");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setPending(false);
    if (!res.ok) {
      setError("Could not save settings.");
      return;
    }
    setSaved(true);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4">
      <p className="text-[11px] uppercase tracking-[0.24em] text-crimson-text">Site</p>
      <h1 className="font-serif text-4xl">Settings</h1>
      <label className="block text-sm text-muted">
        Site name
        <input
          className="field mt-1"
          value={form.siteName}
          onChange={(e) => setForm({ ...form, siteName: e.target.value })}
        />
      </label>
      <label className="block text-sm text-muted">
        Tagline
        <input
          className="field mt-1"
          value={form.tagline}
          onChange={(e) => setForm({ ...form, tagline: e.target.value })}
        />
      </label>
      <label className="block text-sm text-muted">
        YouTube channel URL
        <input
          className="field mt-1"
          value={form.youtubeChannelUrl}
          onChange={(e) => setForm({ ...form, youtubeChannelUrl: e.target.value })}
        />
      </label>
      <label className="block text-sm text-muted">
        About (Markdown)
        <textarea
          rows={10}
          className="field mt-1"
          value={form.about}
          onChange={(e) => setForm({ ...form, about: e.target.value })}
        />
      </label>
      {error ? <p className="text-sm text-crimson-text">{error}</p> : null}
      {saved ? <p className="text-sm text-emerald-400">Saved.</p> : null}
      <button disabled={pending} className="rounded-full bg-crimson px-5 py-2 text-sm text-white">
        {pending ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}
