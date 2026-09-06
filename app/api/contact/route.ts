import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "../../../lib/mysql";


export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await prisma.contact.create({
      data: {
        name: typeof data.name === "string" ? data.name : null,
        email: typeof data.email === "string" ? data.email : null,
        phone: typeof data.phone === "string" ? data.phone : null,
        message: typeof data.message === "string" ? data.message : null,
        source: typeof data.source === "string" ? data.source : "contact",
        status: "new",
      },
    });
    return NextResponse.json({ message: "Contact submission received" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to save contact", error: error instanceof Error ? error.message : null }, { status: 500 });
  }
}

