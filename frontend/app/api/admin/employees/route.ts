import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey_change_me";

function verifyAdmin(authHeader: string | null) {
  if (!authHeader) return false;
  const token = authHeader.split(" ")[1];
  if (!token) return false;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { type?: string };
    return payload.type === "admin";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!verifyAdmin(auth)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        phone: true,
        designation: true,
        dob: true,
        joinDate: true,
        createdAt: true,
      },
      orderBy: { id: "asc" },
    });
    const normalized = employees.map((emp: typeof employees[0]) => ({
      id: emp.id,
      employee_id: emp.employeeId,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      designation: emp.designation,
      dob: emp.dob,
      join_date: emp.joinDate,
      created_at: emp.createdAt,
    }));
    return NextResponse.json(normalized);
  } catch (error: unknown) {
    return NextResponse.json({ message: "Failed to fetch employees", error: error instanceof Error ? error.message : null }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!verifyAdmin(auth)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const employee_id = String(body.employee_id || "").trim();
    const name = String(body.name || "").trim();
    const email = body.email ? String(body.email).trim() : "";
    const phone = body.phone ? String(body.phone).trim() : "";
    const designation = body.designation ? String(body.designation).trim() : "";
    const password = String(body.password || "");
    const dob = body.dob || null;
    const join_date = body.join_date || null;

    if (!employee_id || !name || !password) {
      return NextResponse.json({ message: "Employee ID, name and password required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    const exists = await prisma.employee.findUnique({ where: { employeeId: employee_id } });
    if (exists) return NextResponse.json({ message: "Employee ID already exists" }, { status: 400 });

    const hash = bcrypt.hashSync(password, 10);
    const employee = await prisma.employee.create({
      data: {
        employeeId: employee_id,
        name,
        email,
        phone,
        designation,
        password: hash,
        dob: dob || null,
        joinDate: join_date || null,
      },
    });

    return NextResponse.json({ id: employee.id, message: "Employee created" }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ message: "Failed to create employee", error: error instanceof Error ? error.message : null }, { status: 500 });
  }
}
