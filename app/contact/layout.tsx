import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Encogix Technology",
  description:
    "Get in touch with Encogix Technology for software development, cloud solutions, and digital transformation. Offices in Noida and Bihar.",
  openGraph: {
    title: "Contact Us | Encogix Technology",
    description: "Reach our team for consultations, partnerships, and project inquiries.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
