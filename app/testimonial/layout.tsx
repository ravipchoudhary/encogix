import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Client Testimonial | Encogix Technology",
  description: "Share your experience with Encogix Technology. Testimonials are reviewed before appearing on the website.",
  alternates: { canonical: "/testimonial" },
};

export default function TestimonialLayout({ children }: { children: React.ReactNode }) { return children; }
