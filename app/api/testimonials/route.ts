import { NextResponse } from "next/server";
import { db as prisma } from "../../../lib/mysql";


function mapTestimonial(t: {
  id: number;
  name: string;
  company: string | null;
  designation: string | null;
  rating: number;
  text: string;
  active: boolean;
  sortOrder: number;
}) {
  return {
    id: t.id,
    name: t.name,
    company: t.company,
    designation: t.designation,
    rating: t.rating,
    text: t.text,
    sort_order: t.sortOrder,
  };
}

export async function GET() {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(rows.map(mapTestimonial));
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch testimonials", error: error instanceof Error ? error.message : null },
      { status: 500 }
    );
  }
}

