import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
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
  if (!verifyAdminToken(authHeader)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      include: { assignedEmployee: { select: { id: true, name: true, employeeId: true } } },
    });

    const leads = rows.map((lead: typeof rows[0]) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      assignedEmployeeId: lead.assignedEmployeeId,
      createdAt: lead.createdAt,
      assignedEmployee: lead.assignedEmployee
        ? {
            id: lead.assignedEmployee.id,
            name: lead.assignedEmployee.name,
            employeeId: lead.assignedEmployee.employeeId,
          }
        : null,
    }));

    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch leads", error: error instanceof Error ? error.message : null }, { status: 500 });
  }
}
