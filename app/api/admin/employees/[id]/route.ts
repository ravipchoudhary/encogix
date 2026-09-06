import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "../../../../../lib/mysql";
import bcrypt from "bcryptjs";
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
    return NextResponse.json({ message: "Invalid employee id" }, { status: 400 });
  }

  try {
    const data = await req.json();
    const updatePayload: Record<string, unknown> = {};

    if (typeof data.employee_id === "string") updatePayload.employeeId = data.employee_id.trim();
    if (typeof data.name === "string") updatePayload.name = data.name.trim();
    if (typeof data.email === "string") updatePayload.email = data.email.trim();
    if (typeof data.phone === "string") updatePayload.phone = data.phone.trim();
    if (typeof data.designation === "string") updatePayload.designation = data.designation.trim();
    if (typeof data.dob === "string") updatePayload.dob = data.dob || null;
    if (typeof data.join_date === "string") updatePayload.joinDate = data.join_date || null;
    if (typeof data.password === "string" && data.password.trim()) {
      updatePayload.password = bcrypt.hashSync(data.password, 10);
    }

    await prisma.employee.update({ where: { id }, data: updatePayload });
    return NextResponse.json({ message: "Employee updated" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update employee", error: error instanceof Error ? error.message : null }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const authHeader = req.headers.get("authorization");
  if (!verifyAdminToken(authHeader)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (!id) {
    return NextResponse.json({ message: "Invalid employee id" }, { status: 400 });
  }

  try {
    await prisma.employee.delete({ where: { id } });
    return NextResponse.json({ message: "Employee deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete employee", error: error instanceof Error ? error.message : null }, { status: 500 });
  }
}
