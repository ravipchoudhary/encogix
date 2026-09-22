import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technology Internship Programs | Encogix Technology",
  description: "Apply for web development, software, Android, UI design, data science, machine learning, digital marketing and HR internships.",
  alternates: { canonical: "/internship" },
};

export default function InternshipLayout({ children }: { children: React.ReactNode }) { return children; }
