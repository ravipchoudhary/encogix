import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "../../../lib/mysql";


export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const website = typeof data.website === "string" ? data.website.trim() : "";
    const message = [
      website ? `Website: ${website}` : "",
      typeof data.message === "string" ? data.message : "Free website audit request",
    ]
      .filter(Boolean)
      .join("\n");

    await prisma.contact.create({
      data: {
        name: typeof data.name === "string" ? data.name : null,
        email: typeof data.email === "string" ? data.email : null,
        phone: typeof data.phone === "string" ? data.phone : null,
        message,
        source: "website-audit",
        status: "new",
      },
    });
    return NextResponse.json({ message: "Audit request received" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to submit audit request", error: error instanceof Error ? error.message : null }, { status: 500 });
  }
}

