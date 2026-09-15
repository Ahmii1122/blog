"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload } from "lucide-react";
import { PERSON_ROLES, STATUSES } from "@/lib/utils";
import { slugify } from "@/lib/slug";
import type {
  MediaInput,
  PersonInput,
  SourceInput,
  StoryInput,
  TimelineInput,
} from "@/lib/types";

type CategoryOption = { id: string; name: string };

type EditorStory = StoryInput & {
  id?: string;
  people: PersonInput[];
  timeline: TimelineInput[];
  sources: SourceInput[];
  media: MediaInput[];
};

const emptyPerson = (): PersonInput => ({ name: "", role: "other", photo: "", bio: "" });
const emptyEvent = (): TimelineInput => ({ date: "", title: "", description: "" });
const emptySource = (): SourceInput => ({ title: "", url: "" });

export function CaseEditor({
  caseId,
  categories,
  initial,
}: {
  caseId: string;
  categories: CategoryOption[];
  initial?: EditorStory;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtubeUrl ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [year, setYear] = useState(initial?.year ? String(initial.year) : "");
  const [status, setStatus] = useState(initial?.status ?? "unsolved");
  const [tags, setTags] = useState(initial?.tags ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [published, setPublished] = useState(Boolean(initial?.published));
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [people, setPeople] = useState<PersonInput[]>(initial?.people?.length ? initial.people : [emptyPerson()]);
  const [timeline, setTimeline] = useState<TimelineInput[]>(
    initial?.timeline?.length ? initial.timeline : [emptyEvent()],
  );
  const [sources, setSources] = useState<SourceInput[]>(
    initial?.sources?.length ? initial.sources : [emptySource()],
  );
  const [media, setMedia] = useState<MediaInput[]>(initial?.media ?? []);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState("");

  const payload = useMemo<StoryInput>(
    () => ({
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage || null,
      youtubeUrl: youtubeUrl || null,
      location: location || null,
      year: year ? Number(year) : null,
      status,
      tags,
      published,
      featured,
      categoryId: categoryId || null,
      people,
      timeline,
      sources,
      media,
    }),
    [
      title,
      slug,
      excerpt,
      content,
      coverImage,
      youtubeUrl,
      location,
      year,
      status,
      tags,
      published,
      featured,
      categoryId,
      people,
      timeline,
      sources,
      media,
    ],
  );

  async function uploadFile(file: File, label: string, kind: "cover" | "people" | "media") {
    setUploading(label);
    const form = new FormData();
    form.append("file", file);
    form.append("storyId", caseId);
    form.append("kind", kind);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    setUploading("");
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error || "Upload failed");
    }
    return (await res.json()) as { url: string; type: string };
  }

  async function save(nextPublished = published) {
    setError("");
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setPending(true);
    const body = { ...payload, id: caseId, published: nextPublished, slug: slug || slugify(title) };
    const url = initial?.id ? `/api/cases/${caseId}` : "/api/cases";
    const res = await fetch(url, {
      method: initial?.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setPending(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Could not save the case.");
      return;
    }
    const data = (await res.json()) as { id: string };
    router.push(`/admin/cases/${data.id}`);
    router.refresh();
  }

  async function remove() {
    if (!initial?.id) return;
    if (!confirm("Delete this case permanently?")) return;
    setPending(true);
    await fetch(`/api/cases/${caseId}`, { method: "DELETE" });
    router.push("/admin/cases");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-20">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-crimson">
            {initial?.id ? "Edit file" : "New file"}
          </p>
          <h1 className="mt-1 font-serif text-4xl">{title || "Untitled case"}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => save(false)}
            className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => save(true)}
            className="rounded-full bg-crimson px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {pending ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>
      {error ? <p className="text-sm text-crimson">{error}</p> : null}

      <section className="space-y-4 rounded-2xl border border-line bg-card p-5">
        <h2 className="font-serif text-2xl">Basics</h2>
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className="field"
          />
        </Field>
        <Field label="Slug">
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className="field"
          />
        </Field>
        <Field label="Excerpt">
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className="field" />
        </Field>
        <Field label="Written story (Markdown)">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16} className="field font-mono text-sm" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Location">
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="field" />
          </Field>
          <Field label="Year">
            <input value={year} onChange={(e) => setYear(e.target.value)} className="field" />
          </Field>
          <Field label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="field">
              {STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="field">
              <option value="">None</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Tags (comma separated)">
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="field" />
        </Field>
        <Field label="YouTube URL">
          <input
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="field"
          />
        </Field>
        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Published
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured on home
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-line bg-card p-5">
        <h2 className="font-serif text-2xl">Cover image</h2>
        <UploadButton
          label={uploading === "cover" ? "Uploading..." : "Upload cover"}
          accept="image/*"
          onFile={async (file) => {
            try {
              const uploaded = await uploadFile(file, "cover", "cover");
              setCoverImage(uploaded.url);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Upload failed");
            }
          }}
        />
        {coverImage ? (
          <div className="relative overflow-hidden rounded-xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt="" className="max-h-64 w-full object-cover" />
            <button type="button" className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs" onClick={() => setCoverImage("")}>
              Remove
            </button>
          </div>
        ) : null}
      </section>

      <Repeater
        title="People involved"
        onAdd={() => setPeople([...people, emptyPerson()])}
      >
        {people.map((person, index) => (
          <div key={index} className="grid gap-3 rounded-xl border border-line p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                placeholder="Name"
                value={person.name}
                onChange={(e) => {
                  const next = [...people];
                  next[index] = { ...person, name: e.target.value };
                  setPeople(next);
                }}
                className="field"
              />
              <select
                value={person.role}
                onChange={(e) => {
                  const next = [...people];
                  next[index] = { ...person, role: e.target.value };
                  setPeople(next);
                }}
                className="field"
              >
                {PERSON_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Short bio"
              value={person.bio}
              onChange={(e) => {
                const next = [...people];
                next[index] = { ...person, bio: e.target.value };
                setPeople(next);
              }}
              rows={2}
              className="field"
            />
            <div className="flex flex-wrap items-center gap-3">
              <UploadButton
                label={uploading === `person-${index}` ? "Uploading..." : "Photo"}
                accept="image/*"
                onFile={async (file) => {
                  try {
                    const uploaded = await uploadFile(file, `person-${index}`, "people");
                    const next = [...people];
                    next[index] = { ...person, photo: uploaded.url };
                    setPeople(next);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Upload failed");
                  }
                }}
              />
              {person.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={person.photo} alt="" className="h-16 w-16 rounded-lg object-cover" />
              ) : null}
              <button type="button" className="ml-auto text-muted hover:text-crimson" onClick={() => setPeople(people.filter((_, i) => i !== index))}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </Repeater>

      <Repeater title="Timeline" onAdd={() => setTimeline([...timeline, emptyEvent()])}>
        {timeline.map((event, index) => (
          <div key={index} className="grid gap-3 rounded-xl border border-line p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                placeholder="Date (e.g. 12 Oct 1994)"
                value={event.date}
                onChange={(e) => {
                  const next = [...timeline];
                  next[index] = { ...event, date: e.target.value };
                  setTimeline(next);
                }}
                className="field"
              />
              <input
                placeholder="Event title"
                value={event.title}
                onChange={(e) => {
                  const next = [...timeline];
                  next[index] = { ...event, title: e.target.value };
                  setTimeline(next);
                }}
                className="field"
              />
            </div>
            <textarea
              placeholder="What happened"
              value={event.description}
              onChange={(e) => {
                const next = [...timeline];
                next[index] = { ...event, description: e.target.value };
                setTimeline(next);
              }}
              rows={2}
              className="field"
            />
            <button type="button" className="ml-auto text-muted hover:text-crimson" onClick={() => setTimeline(timeline.filter((_, i) => i !== index))}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </Repeater>

      <section className="space-y-4 rounded-2xl border border-line bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Photos and videos</h2>
          <UploadButton
            label={uploading === "media" ? "Uploading..." : "Add file"}
            accept="image/*,video/mp4,video/webm,video/quicktime"
            onFile={async (file) => {
              try {
                const uploaded = await uploadFile(file, "media", "media");
                setMedia([...media, { path: uploaded.url, type: uploaded.type, caption: "" }]);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Upload failed");
              }
            }}
          />
        </div>
        <p className="text-sm text-muted">Upload stills or clips you have the right to use. Large videos are better as a YouTube embed.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {media.map((item, index) => (
            <div key={`${item.path}-${index}`} className="overflow-hidden rounded-xl border border-line">
              {item.type === "video" ? (
                <video src={item.path} className="h-40 w-full object-cover" controls />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.path} alt="" className="h-40 w-full object-cover" />
              )}
              <div className="flex gap-2 p-3">
                <input
                  placeholder="Caption"
                  value={item.caption}
                  onChange={(e) => {
                    const next = [...media];
                    next[index] = { ...item, caption: e.target.value };
                    setMedia(next);
                  }}
                  className="field"
                />
                <button type="button" className="text-muted hover:text-crimson" onClick={() => setMedia(media.filter((_, i) => i !== index))}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Repeater title="Sources" onAdd={() => setSources([...sources, emptySource()])}>
        {sources.map((source, index) => (
          <div key={index} className="grid gap-3 rounded-xl border border-line p-4 sm:grid-cols-[1fr_1fr_auto]">
            <input
              placeholder="Label"
              value={source.title}
              onChange={(e) => {
                const next = [...sources];
                next[index] = { ...source, title: e.target.value };
                setSources(next);
              }}
              className="field"
            />
            <input
              placeholder="https://"
              value={source.url}
              onChange={(e) => {
                const next = [...sources];
                next[index] = { ...source, url: e.target.value };
                setSources(next);
              }}
              className="field"
            />
            <button type="button" className="text-muted hover:text-crimson" onClick={() => setSources(sources.filter((_, i) => i !== index))}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </Repeater>

      {initial?.id ? (
        <button type="button" onClick={remove} className="text-sm text-muted hover:text-crimson">
          Delete this case
        </button>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm text-muted">
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function Repeater({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-line bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl">{title}</h2>
        <button type="button" onClick={onAdd} className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
          <Plus size={16} /> Add
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function UploadButton({
  label,
  accept,
  onFile,
}: {
  label: string;
  accept: string;
  onFile: (file: File) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-muted hover:text-foreground">
      <Upload size={14} />
      {label}
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
    </label>
  );
}
