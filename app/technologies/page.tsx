import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../../components/PageHero";
import { IconArrowRight } from "../../components/Icons";

export const metadata: Metadata = {
  title: "Technology Stack | Encogix Technology",
  description: "Explore modern frontend, backend, mobile, database, cloud, and AI technologies used by Encogix to build digital products.",
};

const groups = [
  {
    title: "Frontend",
    items: [
      { name: "React", description: "Component-driven UI development for fast, scalable interfaces.", experience: "5+ years", useCase: "SPAs, dashboards, admin panels" },
      { name: "Next.js", description: "SEO-friendly web apps with SSR, SSG, and production-ready structure.", experience: "4+ years", useCase: "Marketing sites, SaaS products" },
      { name: "Angular", description: "Enterprise-grade frontend frameworks for structured application builds.", experience: "3+ years", useCase: "Large app ecosystems" },
      { name: "Vue", description: "Flexible and lightweight frontend development for progressive web products.", experience: "3+ years", useCase: "Interactive UI experiences" },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Node.js", description: "Scalable event-driven backend for APIs, services, and web apps.", experience: "5+ years", useCase: "Real-time systems and APIs" },
      { name: "Python", description: "Flexible backend and automation stack for data and AI-based products.", experience: "5+ years", useCase: "Automation and analytics" },
      { name: "PHP", description: "Strong option for CMS, business apps, and legacy modernization.", experience: "4+ years", useCase: "Business platforms" },
      { name: ".NET", description: "Enterprise platform development for secure and scalable solutions.", experience: "3+ years", useCase: "Business software" },
    ],
  },
  {
    title: "Mobile",
    items: [
      { name: "Flutter", description: "Cross-platform mobile app development with beautiful, fast interfaces.", experience: "4+ years", useCase: "Business and consumer apps" },
      { name: "React Native", description: "Native-like cross-platform experience for business and startup apps.", experience: "4+ years", useCase: "Hybrid mobile solutions" },
      { name: "Kotlin", description: "Modern Android development for robust mobile experiences.", experience: "3+ years", useCase: "Android native apps" },
      { name: "Swift", description: "High-quality iOS development for premium mobile experiences.", experience: "3+ years", useCase: "iPhone app experiences" },
    ],
  },
  {
    title: "Database",
    items: [
      { name: "PostgreSQL", description: "Reliable relational database for structured data and transactional systems.", experience: "5+ years", useCase: "Enterprise data and analytics" },
      { name: "MySQL", description: "Proven relational database for web apps and content-heavy systems.", experience: "5+ years", useCase: "Business apps and CMS" },
      { name: "MongoDB", description: "Flexible document database for agile and scale-focused application design.", experience: "4+ years", useCase: "Product and user data stores" },
      { name: "Firebase", description: "Realtime and mobile-first backend services for modern apps.", experience: "3+ years", useCase: "App backend and notifications" },
    ],
  },
  {
    title: "Cloud",
    items: [
      { name: "AWS", description: "Cloud infrastructure for secure, scalable, and resilient applications.", experience: "5+ years", useCase: "Production hosting and workloads" },
      { name: "Azure", description: "Enterprise cloud strategy for managed hosting and data workloads.", experience: "4+ years", useCase: "Hybrid enterprise systems" },
      { name: "GCP", description: "Modern infrastructure and data services for analytics and cloud products.", experience: "3+ years", useCase: "Data-heavy workloads" },
    ],
  },
  {
    title: "AI",
    items: [
      { name: "OpenAI", description: "AI integrations for assistants, automation, and conversational experiences.", experience: "3+ years", useCase: "Chatbots and copilots" },
      { name: "LangChain", description: "Framework for AI workflows, retrieval, and orchestration pipelines.", experience: "2+ years", useCase: "Agentic AI systems" },
      { name: "TensorFlow", description: "Deep learning framework for model development and AI experimentation.", experience: "3+ years", useCase: "ML and vision systems" },
      { name: "PyTorch", description: "Flexible research and production-ready deep learning tooling.", experience: "3+ years", useCase: "ML and research systems" },
    ],
  },
];

export default function TechnologiesPage() {
  return (
    <>
      <PageHero chip="Technology stack" title="Technologies" subtitle="We build with modern, reliable, and scalable technologies chosen to match business goals, product complexity, and performance needs.">
        <Link href="/contact" className="btn-primary inline-flex items-center gap-2">Get a Tech Consultation <IconArrowRight className="w-4 h-4" /></Link>
        <Link href="/services" className="btn-outline">Explore Services</Link>
      </PageHero>

      <section className="section-padding">
        <div className="container-page space-y-10">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-2xl font-bold text-primary mb-5">{group.title}</h2>
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
                {group.items.map((item) => (
                  <div key={item.name} className="card card-3d block-3d p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-lg font-bold text-primary">{item.name}</h3>
                      <span className="chip inline-flex text-[10px]">{item.experience}</span>
                    </div>
                    <p className="text-sm text-slate-600">{item.description}</p>
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">Use cases</p>
                      <p className="mt-2 text-sm font-medium text-slate-700">{item.useCase}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
