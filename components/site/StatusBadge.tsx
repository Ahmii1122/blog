import { statusLabel } from "@/lib/utils";

const tones: Record<string, string> = {
  solved: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  unsolved: "border-crimson/40 bg-crimson/10 text-rose-200",
  ongoing: "border-amber/40 bg-amber/10 text-amber-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-[0.18em] ${tones[status] ?? "border-line text-muted"}`}
    >
      {statusLabel(status)}
    </span>
  );
}
