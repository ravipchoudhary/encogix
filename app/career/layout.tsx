import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers and Jobs in Noida | Encogix Technology",
  description: "Explore software, web, app, AI and digital marketing careers at Encogix Technology in Noida and Greater Noida.",
  alternates: { canonical: "/career" },
};

export default function CareerLayout({ children }: { children: React.ReactNode }) { return children; }
