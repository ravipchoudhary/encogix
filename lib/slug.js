function slugifyTitle(title) {
  return String(title || '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'project';
}

async function uniqueProjectSlug(prisma, title, excludeId = null) {
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

module.exports = { slugifyTitle, uniqueProjectSlug };
