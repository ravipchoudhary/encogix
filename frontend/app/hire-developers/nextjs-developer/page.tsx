import type { Metadata } from "next";
import StructuredPage from "../../../components/StructuredPage";

export const metadata: Metadata = {
  title: "Hire Next.js Developer | Encogix Technology",
  description: "Hire Next.js developers for SEO-ready web apps, marketing sites, dashboards, and scalable enterprise platforms.",
};

const sections = [
  { title: "Overview", items: ["Build Next.js applications with SSR, SSG, app router, and performance optimization", "Create scalable marketing sites, SaaS products, and internal business tools", "Improve SEO, page speed, security, and developer experience", "Integrate CMS, authentication, API routes, and deployment automation"] },
  { title: "Core Skills", items: ["Next.js, App Router, React Server Components", "TypeScript, Tailwind CSS, API routes", "SEO optimization, metadata, static generation", "Authentication and role-based access", "Deployment on Vercel, Docker, and cloud platforms"] },
  { title: "Experience Levels", items: ["Junior Next.js developer for feature implementation", "Mid-level engineer for product modules and API integration", "Senior engineer for architecture, performance, and optimization", "Lead for product architecture and team delivery"] },
  { title: "Hiring Models", items: ["Dedicated Next.js developer", "Team augmentation for existing teams", "Fixed-scope project builds", "Design-to-deploy product support"] },
  { title: "Development Process", items: ["Product review and technical planning", "Architecture and component planning", "Build sprints with QA verification", "Deployment, optimization, and post-launch support"] },
  { title: "Tech Stack", items: ["Next.js, React, TypeScript", "Tailwind CSS, Prisma, Node.js", "PostgreSQL, MongoDB, Firebase", "Vercel, AWS, Nginx, Docker"] },
  { title: "Industries", items: ["Digital agencies", "SaaS products", "Healthcare platforms", "Education portals", "Startup MVPs and growth products"] },
];

const faqs = [
  { question: "Why choose Next.js for your website or product?", answer: "Next.js gives you the best mix of SEO, performance, content delivery, and developer productivity for modern web products." },
  { question: "Do you support migration from another framework?", answer: "Yes, we can assess your current codebase and plan migration or rebuild work to improve speed, maintainability, and performance." },
];

export default function HireNextJsDeveloperPage() {
  return (
    <StructuredPage
      chip="Modern web engineering"
      title="Hire Next.js Developer"
      subtitle="Launch SEO-friendly, fast, and scalable digital products with experienced Next.js developers."
      breadcrumb={[{ label: "Hire Developers", href: "/hire-developers" }]}
      sections={sections}
      faqs={faqs}
      contactTitle="Build your Next.js product with expert support"
      contactSubtitle="Tell us what you’re building, your timeline, and your tech goals so we can match the right developer or team."
      ctaTitle="Need a Next.js developer now?"
      ctaDescription="Talk to our team and get a tailored recommendation for your web product or platform."
    />
  );
}
