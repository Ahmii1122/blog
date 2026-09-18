import Link from "next/link";
import { StatusBadge } from "./StatusBadge";

type CaseCardProps = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string | null;
  year?: number | null;
  location?: string | null;
  status: string;
  categoryName?: string | null;
};

export function CaseCard({
  slug,
  title,
  excerpt,
  coverImage,
  year,
  location,
  status,
  categoryName,
}: CaseCardProps) {
  return (
    <Link
      href={`/cases/${slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition hover:border-crimson/50"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-card-2">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_top_right,rgba(211,18,42,0.28),transparent_42%),linear-gradient(180deg,#16161c,#070708)] p-5">
            <p className="font-serif text-2xl text-white/80">{title}</p>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge status={status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
          {[categoryName, year, location].filter(Boolean).join(" · ")}
        </p>
        <h3 className="font-serif text-2xl leading-tight tracking-tight group-hover:text-crimson-text">
          {title}
        </h3>
        {excerpt ? (
          <p className="line-clamp-3 text-sm leading-6 text-muted">{excerpt}</p>
        ) : null}
      </div>
    </Link>
  );
}
