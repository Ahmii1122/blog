export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>,
) {
  const root = slugify(base) || "case";
  let slug = root;
  let n = 2;
  while (await exists(slug)) {
    slug = `${root}-${n}`;
    n += 1;
  }
  return slug;
}
