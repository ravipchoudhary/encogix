import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "../../../../../lib/mysql";
import { verifyAdminToken } from "../../../../../lib/server-admin-auth";
import { saveUploadedFile } from "../../../../../lib/upload";
import { uniqueProjectSlug } from "../../../../../lib/slug";


export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  if (!verifyAdminToken(req.headers.get("authorization"))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (!id) return NextResponse.json({ message: "Invalid project id" }, { status: 400 });

  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ message: "Project not found" }, { status: 404 });

    const formData = await req.formData();
    const title = String(formData.get("title") || "");
    const description = String(formData.get("description") || "");
    const category = String(formData.get("category") || "");
    const client = String(formData.get("client") || "");
    const technologies = String(formData.get("technologies") || "");
    const project_url = String(formData.get("project_url") || "");
    const imageFile = formData.get("image");
    const uploaded = await saveUploadedFile(imageFile instanceof File ? imageFile : null, "image");
    const image = uploaded ?? existing.image;
    const slug = await uniqueProjectSlug(prisma, title, id);

    await prisma.project.update({
      where: { id },
      data: {
        title: title || null,
        description: description || null,
        image,
        category: category || null,
        client: client || null,
        technologies: technologies || null,
        projectUrl: project_url || null,
        slug,
      },
    });

    return NextResponse.json({ message: "Project updated", slug });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update project", error: error instanceof Error ? error.message : null },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  if (!verifyAdminToken(req.headers.get("authorization"))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (!id) return NextResponse.json({ message: "Invalid project id" }, { status: 400 });

  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete project", error: error instanceof Error ? error.message : null },
      { status: 500 }
    );
  }
}
