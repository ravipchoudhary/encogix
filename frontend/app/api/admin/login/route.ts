import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey_change_me";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const username = String(data?.username || "").trim();
    const password = String(data?.password || "");

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (!admin.active) {
      return NextResponse.json({ message: "Account is blocked" }, { status: 401 });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username, type: "admin" }, JWT_SECRET, {
      expiresIn: "8h",
    });

    return NextResponse.json({ token });
  } catch (error: unknown) {
    return NextResponse.json({ message: "Login failed", error: error instanceof Error ? error.message : null }, { status: 500 });
  }
}
