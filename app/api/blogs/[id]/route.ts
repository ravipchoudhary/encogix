import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "../../../../lib/mysql";


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
    createdAt: b.createdAt,
  };
}

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = parseInt(params.id, 10);
  if (!id) return NextResponse.json({ message: "Invalid blog id" }, { status: 400 });

  try {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    return NextResponse.json(mapBlog(blog));
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch blog", error: error instanceof Error ? error.message : null },
      { status: 500 }
    );
  }
}
