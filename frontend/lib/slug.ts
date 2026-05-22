export function slugifyTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || "project";
}

export function projectPath(slug: string | null | undefined, title: string): string {
  const s = slug?.trim() || slugifyTitle(title);
  return `/portfolio/${encodeURIComponent(s)}`;
}
