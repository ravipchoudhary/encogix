import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdminToken } from "../../../../lib/server-admin-auth";
import { saveUploadedFile } from "../../../../lib/upload";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req.headers.get("authorization"))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const title = String(formData.get("title") || "");
    const content = String(formData.get("content") || "");
    const author = String(formData.get("author") || "");
    const imageFile = formData.get("image");
    const image = await saveUploadedFile(imageFile instanceof File ? imageFile : null, "image");

    const blog = await prisma.blog.create({
      data: { title, content, author, image },
    });

    return NextResponse.json({ id: blog.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create blog", error: error instanceof Error ? error.message : null },
      { status: 500 }
    );
  }
}
