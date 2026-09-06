import type { Metadata } from "next";
import StructuredPage from "../../../components/StructuredPage";

export const metadata: Metadata = {
  title: "Hire React Developer | Encogix Technology",
  description: "Hire expert React developers for interactive UIs, SPA apps, dashboards, component libraries, and scalable frontends.",
};

const sections = [
  { title: "Overview", items: ["Build responsive interfaces with React, TypeScript, and component-driven architecture", "Create scalable SPA and dashboard experiences for web products", "Integrate APIs, state management, performance tuning, and accessibility", "Support design systems, maintainable frontend code, and UX improvements"] },
  { title: "Core Skills", items: ["React.js, Next.js, TypeScript, JavaScript", "Redux, Zustand, Context API, React Query", "REST APIs, GraphQL integration", "Component architecture and design systems", "Performance optimization and SEO-friendly rendering"] },
  { title: "Experience Levels", items: ["Junior React developer for UI tasks and feature delivery", "Mid-level developer for full feature ownership", "Senior React engineer for architecture, performance, and mentoring", "Lead frontend engineer for product strategy and team coordination"] },
  { title: "Hiring Models", items: ["Dedicated React developer", "Team augmentation", "Fixed-scope sprint delivery", "Full frontend squad with design support"] },
  { title: "Development Process", items: ["Discovery and UX alignment", "Wireframes and component planning", "Sprint-based build and QA", "Release, performance tuning, and support"] },
  { title: "Tech Stack", items: ["React, Next.js, Tailwind CSS, Material UI", "Node.js backend integration", "Prisma, Firebase, PostgreSQL", "GitHub, Jira, Vercel, AWS"] },
  { title: "Industries", items: ["SaaS platforms", "FinTech dashboards", "Healthcare portals", "Real estate CRM", "Retail and ecommerce experiences"] },
];

const faqs = [
  { question: "What can a React developer help us deliver?", answer: "They can build advanced dashboards, web apps, admin panels, ecommerce frontends, and customer-facing experiences with clean, reusable code." },
  { question: "Do you support UI/UX integration?", answer: "Yes, our developers work closely with design systems and can implement Figma-based UIs with responsiveness and accessibility." },
];

export default function HireReactDeveloperPage() {
  return (
    <StructuredPage
      chip="Frontend engineering"
      title="Hire React Developer"
      subtitle="Work with senior React engineers to build polished, high-performance web experiences for your business.
"
      breadcrumb={[{ label: "Hire Developers", href: "/hire-developers" }]}
      quickActions={[{ label: "Book a Tech Call", href: "/contact" }]}
      sections={sections}
      faqs={faqs}
      contactTitle="Discuss your React project"
      contactSubtitle="Tell us your product goals, deadlines, and frontend challenges and we’ll recommend the best-fit developer model."
      ctaTitle="Need a React expert fast?"
      ctaDescription="Speak with our engineering team and get a tailored hiring recommendation within 24 hours."
    />
  );
}
