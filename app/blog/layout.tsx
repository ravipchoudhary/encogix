import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technology and Business Insights | Encogix Blog",
  description: "Read practical insights on web development, software, AI, cloud, SEO and digital transformation from Encogix Technology.",
  alternates: { canonical: "/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) { return children; }
