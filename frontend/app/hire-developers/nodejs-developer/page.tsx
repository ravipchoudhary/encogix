import type { Metadata } from "next";
import StructuredPage from "../../../components/StructuredPage";

export const metadata: Metadata = {
  title: "Hire Node.js Developer | Encogix Technology",
  description: "Hire Node.js developers for APIs, SaaS backend systems, microservices, real-time features, and web platform engineering.",
};

const sections = [
  { title: "Overview", items: ["Build secure, scalable backend APIs and server-side systems", "Deliver event-driven and real-time solutions with Node.js", "Implement authentication, workflows, queues, and integrations", "Support business critical services with clean architecture and monitoring"] },
  { title: "Core Skills", items: ["Node.js, Express, NestJS, REST APIs", "WebSockets, event-driven architecture", "PostgreSQL, MongoDB, Redis", "JWT security, auth flows, role-based access", "Performance optimization and server monitoring"] },
  { title: "Experience Levels", items: ["Junior backend developer for APIs and CRUD modules", "Mid-level engineer for business workflows and integrations", "Senior backend engineer for architecture and scaling", "Backend lead for platform engineering and performance planning"] },
  { title: "Hiring Models", items: ["Dedicated Node.js developer", "Backend team extension", "API modernization projects", "Product engineering support"] },
  { title: "Development Process", items: ["API and flow analysis", "Architecture and implementation planning", "Build and integration sprints", "Testing, security review, deployment, and maintenance"] },
  { title: "Tech Stack", items: ["Node.js, Express, NestJS", "PostgreSQL, Redis, MongoDB", "Docker, Kubernetes, AWS", "Nginx, CI/CD, GitHub Actions"] },
  { title: "Industries", items: ["FinTech platforms", "Logistics systems", "Healthcare APIs", "SaaS products", "Marketplace and commerce apps"] },
];

const faqs = [
  { question: "Can you help build APIs from scratch?", answer: "Yes. We can design, implement, and scale APIs for internal tools, customer-facing apps, and enterprise systems." },
  { question: "Do you support real-time features?", answer: "Yes, we implement WebSockets, queues, notification systems, and event-based workflows whenever needed." },
];

export default function HireNodeJsDeveloperPage() {
  return (
    <StructuredPage
      chip="Backend engineering"
      title="Hire Node.js Developer"
      subtitle="Build secure and scalable backend systems with Node.js professionals who understand performance, integrations, and growth-ready architecture."
      breadcrumb={[{ label: "Hire Developers", href: "/hire-developers" }]}
      sections={sections}
      faqs={faqs}
      contactTitle="Need a Node.js backend expert?"
      contactSubtitle="Let us know your API, data, and deployment requirements and we’ll connect you with the right backend engineer."
      ctaTitle="Scale your backend with confidence"
      ctaDescription="From MVP APIs to enterprise platform services, we help you build a dependable backend foundation."
    />
  );
}
