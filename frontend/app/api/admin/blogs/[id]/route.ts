import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdminToken } from "../../../../../lib/server-admin-auth";
import { saveUploadedFile } from "../../../../../lib/upload";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  if (!verifyAdminToken(req.headers.get("authorization"))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (!id) return NextResponse.json({ message: "Invalid blog id" }, { status: 400 });

  try {
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ message: "Blog not found" }, { status: 404 });

    const formData = await req.formData();
    const title = String(formData.get("title") || "");
    const content = String(formData.get("content") || "");
    const author = String(formData.get("author") || "");
    const imageFile = formData.get("image");
    const uploaded = await saveUploadedFile(imageFile instanceof File ? imageFile : null, "image");
    const image = uploaded ?? existing.image;

    await prisma.blog.update({
      where: { id },
      data: { title, content, author, image },
    });

    return NextResponse.json({ message: "Blog updated" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update blog", error: error instanceof Error ? error.message : null },
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
  if (!id) return NextResponse.json({ message: "Invalid blog id" }, { status: 400 });

  try {
    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ message: "Blog deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete blog", error: error instanceof Error ? error.message : null },
      { status: 500 }
    );
  }
}
