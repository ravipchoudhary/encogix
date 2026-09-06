import { NextResponse } from "next/server";
import { db as prisma } from "../../../lib/mysql";


function mapBlog(b: {
  id: number;
  title: string | null;
  content: string | null;
  author: string | null;
  image: string | null;
  createdAt: Date;
}) {
  return {
    id: b.id,
    title: b.title,
    content: b.content,
    author: b.author,
    image: b.image,
    created_at: b.createdAt,
  };
}

export async function GET() {
  try {
    const rows = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(rows.map(mapBlog));
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch blogs", error: error instanceof Error ? error.message : null },
      { status: 500 }
    );
  }
}

