import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "../../../../../lib/mysql";
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

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const authHeader = req.headers.get("authorization");
  if (!verifyAdminToken(authHeader)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (!id) {
    return NextResponse.json({ message: "Invalid lead id" }, { status: 400 });
  }

  try {
    const data = await req.json();
    const updatePayload: Record<string, unknown> = {};

    if (typeof data.status === "string") updatePayload.status = data.status;
    if (data.assignedEmployeeId !== undefined) updatePayload.assignedEmployeeId = data.assignedEmployeeId ? Number(data.assignedEmployeeId) : null;
    if (typeof data.notes === "string") updatePayload.notes = data.notes;

    await prisma.contact.update({ where: { id }, data: updatePayload });
    return NextResponse.json({ message: "Lead updated" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update lead", error: error instanceof Error ? error.message : null }, { status: 500 });
  }
}
