import type { Metadata } from "next";
import StructuredPage from "../../../components/StructuredPage";

export const metadata: Metadata = {
  title: "Hire Full Stack Developer | Encogix Technology",
  description: "Hire full stack developers for end-to-end product builds across frontend, backend, database, APIs, and deployment architecture.",
};

const sections = [
  { title: "Overview", items: ["Own end-to-end application development across frontend, backend, database, and deployment", "Deliver MVPs, internal tools, and business platforms with speed and quality", "Handle API logic, UI implementation, integrations, and testing efficiently", "Ensure your product stays maintainable as it grows"] },
  { title: "Skills", items: ["React, Next.js, Node.js, Express, TypeScript", "Database design, API design, authentication", "Cloud deployment, infrastructure basics, CI/CD", "Performance tuning and business workflow optimization", "Testing, debugging, and maintenance support"] },
  { title: "Experience Levels", items: ["Junior full stack developer for feature development", "Mid-level developer for end-to-end product modules", "Senior developer for architecture and initiative ownership", "Lead full-stack engineer for roadmap and delivery support"] },
  { title: "Hiring Models", items: ["Dedicated full stack developer", "Product team extension", "MVP and prototype development", "Bespoke project delivery"] },
  { title: "Development Process", items: ["Product and requirement review", "Architecture and sprint planning", "Feature/QA cycles and integration", "Launch, support, and iterative improvement"] },
  { title: "Tech Stack", items: ["Next.js, React, Node.js, TypeScript", "PostgreSQL, MongoDB, Prisma", "AWS, Docker, Vercel, CI/CD", "GitHub, testing frameworks, monitoring tools"] },
  { title: "Industries", items: ["SaaS products", "Healthcare platforms", "Education portals", "E-commerce systems", "Startup MVPs and business tools"] },
];

const faqs = [
  { question: "When should I hire a full stack developer?", answer: "If you need a product built end-to-end with faster execution, clearer ownership, and direct communication for the full product lifecycle." },
  { question: "Can a full stack developer work with a design or existing team?", answer: "Yes. They can plug into an existing team, handle frontend/backend tasks, and participate in agile delivery workflows." },
];

export default function HireFullStackDeveloperPage() {
  return (
    <StructuredPage
      chip="Product engineering"
      title="Hire Full Stack Developer"
      subtitle="Get a versatile engineer who can manage both the visible product and the underlying systems behind it."
      breadcrumb={[{ label: "Hire Developers", href: "/hire-developers" }]}
      sections={sections}
      faqs={faqs}
      contactTitle="Build your product with one expert engineer"
      contactSubtitle="Tell us about your product idea, existing stack, and delivery timeline so we can recommend the right developer engagement model."
      ctaTitle="Scale faster with a full stack partner"
      ctaDescription="Simplify product delivery with one engineer or a small team that owns the complete build from UI to deployment."
    />
  );
}
