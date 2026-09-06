import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "../../../../lib/mysql";


function mapProject(p: {
  id: number;
  slug: string | null;
  title: string | null;
  description: string | null;
  image: string | null;
  category: string | null;
  client: string | null;
  technologies: string | null;
  projectUrl: string | null;
  industry: string | null;
  results: string | null;
}) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    image: p.image,
    category: p.category,
    client: p.client,
    technologies: p.technologies,
    project_url: p.projectUrl,
    industry: p.industry,
    results: p.results,
  };
}

export async function GET(_req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const params = await context.params;
  const slug = decodeURIComponent(params.slug);

  try {
    const project = await prisma.project.findFirst({ where: { slug } });
    if (!project) return NextResponse.json({ message: "Project not found" }, { status: 404 });
    return NextResponse.json(mapProject(project));
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch project", error: error instanceof Error ? error.message : null },
      { status: 500 }
    );
  }
}
