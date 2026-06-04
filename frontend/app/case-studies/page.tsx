import type { Metadata } from "next";
import Link from "next/link";
import PageHero, { CTASection } from "../../components/PageHero";
import { IconArrowRight, IconFolderKanban } from "../../components/Icons";
import { projectPath } from "../../lib/slug";

export const metadata: Metadata = {
  title: "Case Studies — Web, App & Software Projects | Encogix Technology",
  description: "Explore Encogix Technology case studies: ecommerce, CRM, healthcare apps & business websites delivered for clients in Noida & India.",
};

type ProjectItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  client: string;
  technologies: string;
  results?: string;
  slug: string;
};

const FALLBACK: ProjectItem[] = [
  { id: 1, title: "Ecommerce Fashion Platform", description: "Online store with 500+ products, Razorpay, and admin panel.", category: "Ecommerce", client: "Confidential Client", technologies: "Next.js, Node.js, PostgreSQL", results: "40% sales increase", slug: "ecommerce-fashion-retailer" },
  { id: 2, title: "CRM Lead Management", description: "Custom CRM with lead assignment and follow-up tracking.", category: "CRM", client: "Confidential Client", technologies: "React, Express", results: "35% faster response", slug: "crm-lead-management" },
  { id: 3, title: "Healthcare Booking App", description: "Appointment system with SMS reminders.", category: "Healthcare", client: "HealthFirst Clinics", technologies: "React Native", results: "60% fewer phone calls", slug: "healthcare-appointment-app" },
];

async function getProjects(): Promise<ProjectItem[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/projects`, { next: { revalidate: 60 } });
    if (res.ok) return res.json();
  } catch (_) {}
  return [];
}

export default async function CaseStudiesPage() {
  const raw = await getProjects();
  const projects: ProjectItem[] = raw.length > 0 ? raw : FALLBACK;

  return (
    <div>
      <PageHero
        chip="Real results"
        title="Case Studies"
        subtitle="See how Encogix Technology helps businesses grow with websites, ecommerce, mobile apps, and custom software."
      >
        <Link href="/portfolio" className="btn-outline inline-flex items-center gap-2">
          Full Portfolio <IconArrowRight className="w-4 h-4" />
        </Link>
      </PageHero>

      <section className="section-padding">
        <div className="container-page grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <article key={p.id} className="card card-3d block-3d flex flex-col">
              <div className="flex items-center gap-2 text-secondary mb-3">
                <IconFolderKanban className="w-5 h-5" />
                <span className="chip text-xs">{p.category}</span>
              </div>
              <h2 className="text-lg font-bold text-primary">{p.title}</h2>
              <p className="text-sm text-slate-600 mt-2 flex-1">{p.description}</p>
              <dl className="mt-4 space-y-1 text-xs text-slate-500">
                <div><dt className="inline font-medium text-slate-700">Client: </dt><dd className="inline">{p.client}</dd></div>
                <div><dt className="inline font-medium text-slate-700">Tech: </dt><dd className="inline">{p.technologies}</dd></div>
                {p.results && <div><dt className="inline font-medium text-emerald-700">Result: </dt><dd className="inline text-emerald-700">{p.results}</dd></div>}
              </dl>
              {p.slug && (
                <Link href={projectPath(p.slug, p.title)} className="mt-4 text-sm font-semibold text-secondary inline-flex items-center gap-1 hover:gap-2 transition-all">
                  Read case study <IconArrowRight className="w-4 h-4" />
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <CTASection title="Want results like these?" desc="Share your project idea and get a free consultation from our Noida team." />
    </div>
  );
}
