import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "../../../../lib/mysql";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey_change_me";

function verifyAdminToken(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { type?: string };
    return payload.type === "admin" ? payload : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const payload = verifyAdminToken(authHeader);
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalLeads = await prisma.contact.count();
    const totalJobApplications = await prisma.jobApplication.count();
    const totalInternshipApplications = await prisma.internshipApplication.count();
    const totalBlogPosts = await prisma.blog.count();
    const totalProjects = await prisma.project.count();
    const totalEmployees = await prisma.employee.count();

    return NextResponse.json({
      totalLeads,
      totalJobApplications,
      totalInternshipApplications,
      totalBlogPosts,
      totalProjects,
      totalEmployees,
    });
  } catch (error: unknown) {
    return NextResponse.json({ message: "Failed to load stats", error: error instanceof Error ? error.message : null }, { status: 500 });
  }
}

