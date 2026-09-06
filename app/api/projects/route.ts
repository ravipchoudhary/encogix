import { NextResponse } from "next/server";
import { db as prisma } from "../../../lib/mysql";


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

export async function GET() {
  try {
    const rows = await prisma.project.findMany({ orderBy: { id: "desc" } });
    return NextResponse.json(rows.map(mapProject));
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch projects", error: error instanceof Error ? error.message : null },
      { status: 500 }
    );
  }
}

