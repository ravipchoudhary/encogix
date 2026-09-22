import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio and Case Studies | Encogix Technology",
  description: "Explore websites, ecommerce platforms, mobile apps, CRM systems and custom software delivered by Encogix Technology.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) { return children; }
