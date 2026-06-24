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

export async function uniqueProjectSlug(
  prisma: { project: { findFirst: (args: { where: Record<string, unknown> }) => Promise<{ id: number } | null> } },
  title: string,
  excludeId: number | null = null
): Promise<string> {
  const base = slugifyTitle(title);
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await prisma.project.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (!existing) return slug;
    slug = `${base}-${++n}`;
  }
}
