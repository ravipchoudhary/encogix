import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const username = String(data?.username || "").trim();
    const password = String(data?.password || "");

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    const backend = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const response = await fetch(`${backend}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error: unknown) {
    return NextResponse.json({ message: "Login failed", error: error instanceof Error ? error.message : null }, { status: 500 });
  }
}
