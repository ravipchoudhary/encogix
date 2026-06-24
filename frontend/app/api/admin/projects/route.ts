import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdminToken } from "../../../../lib/server-admin-auth";
import { saveUploadedFile } from "../../../../lib/upload";
import { uniqueProjectSlug } from "../../../../lib/slug";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req.headers.get("authorization"))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const title = String(formData.get("title") || "");
    const description = String(formData.get("description") || "");
    const category = String(formData.get("category") || "");
    const client = String(formData.get("client") || "");
    const technologies = String(formData.get("technologies") || "");
    const project_url = String(formData.get("project_url") || "");
    const imageFile = formData.get("image");
    const image = await saveUploadedFile(imageFile instanceof File ? imageFile : null, "image");
    const slug = await uniqueProjectSlug(prisma, title);

    const project = await prisma.project.create({
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

    return NextResponse.json({ id: project.id, slug }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create project", error: error instanceof Error ? error.message : null },
      { status: 500 }
    );
  }
}
