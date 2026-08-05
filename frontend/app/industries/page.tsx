import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../../components/PageHero";
import { IconArrowRight } from "../../components/Icons";

export const metadata: Metadata = {
  title: "Industry Solutions | Encogix Technology",
  description: "Healthcare, education, real estate, fintech, retail, manufacturing, logistics, travel, e-commerce, and startup solutions.",
};

const industries = [
  {
    title: "Healthcare",
    challenges: ["Patient management complexity", "Appointment and record workflows", "Data privacy and integration needs"],
    solutions: ["Clinic & hospital portals", "Secure patient systems", "EMR-ready integrations", "Digital appointment workflows"],
    stack: ["React", "Node.js", "PostgreSQL", "HIPAA-aware architecture"],
    example: "Digital patient intake and appointment management platform",
  },
  {
    title: "Education",
    challenges: ["Student engagement gaps", "Manual administration", "Online learning management needs"],
    solutions: ["Learning portals", "Student onboarding platforms", "Admissions and LMS workflows", "Reporting tools"],
    stack: ["Next.js", "Python", "MongoDB", "Cloud hosting"],
    example: "University portal and admissions management system",
  },
  {
    title: "Real Estate",
    challenges: ["Lead tracking complexity", "Property listing and CRM needs", "Broker coordination workflows"],
    solutions: ["CRM systems", "Property listing portals", "Lead funnels and automation", "Customer engagement tools"],
    stack: ["React", "Node.js", "Firebase", "Maps and lead tracking"],
    example: "Property listing and buyer inquiry management portal",
  },
  {
    title: "FinTech",
    challenges: ["Security and compliance requirements", "Workflow automation", "Trust and operational transparency"],
    solutions: ["Secure dashboards", "KYC and onboarding workflows", "Finance automation", "Risk and reporting tools"],
    stack: ["Python", ".NET", "PostgreSQL", "AWS"],
    example: "Loan and investment customer portal with reporting",
  },
  {
    title: "Retail",
    challenges: ["Customer retention", "Inventory visibility", "Multi-channel experience management"],
    solutions: ["Ecommerce platforms", "CRM campaigns", "Inventory dashboards", "Customer analytics"],
    stack: ["React", "Node.js", "MongoDB", "Razorpay"],
    example: "Omnichannel retail storefront and CRM dashboard",
  },
  {
    title: "Manufacturing",
    challenges: ["Operations visibility", "Tracking and production workflows", "Maintenance and quality management"],
    solutions: ["ERP modules", "Production dashboards", "Inventory and maintenance tools", "Workflow automation"],
    stack: ["Python", "React", "PostgreSQL", "Cloud integrations"],
    example: "Production monitoring dashboard and maintenance workflow tool",
  },
  {
    title: "Logistics",
    challenges: ["Route and delivery visibility", "Tracking and operations complexity", "Fleet coordination"],
    solutions: ["Fleet management dashboards", "Tracking and reporting systems", "Order management tools", "Delivery optimization workflows"],
    stack: ["Node.js", "React", "MongoDB", "Maps integration"],
    example: "Dispatch and delivery performance dashboard",
  },
  {
    title: "Travel",
    challenges: ["Booking management", "Customer experience personalization", "Multi-platform operations"],
    solutions: ["Travel portals", "Booking workflows", "Customer support bots", "Operational dashboards"],
    stack: ["Next.js", "Python", "MongoDB", "AI chat support"],
    example: "Travel booking portal with AI-assisted support",
  },
  {
    title: "E-commerce",
    challenges: ["Conversion optimization", "Product discovery", "Order management and customer support"],
    solutions: ["Storefront development", "Cart and payment integration", "Inventory dashboards", "Customer journeys"],
    stack: ["Next.js", "React", "Node.js", "Razorpay"],
    example: "Multi-category ecommerce storefront with dashboard analytics",
  },
  {
    title: "Startups",
    challenges: ["Time-to-market pressure", "Budget limits", "Need for agility and product learning"],
    solutions: ["MVP development", "Lean product strategy", "Rapid iteration support", "Scalable product architecture"],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Cloud deployment"],
    example: "Startup MVP and product iteration platform",
  },
];

export default function IndustriesPage() {
  return (
    <>
      <PageHero chip="Industry solutions" title="Industries" subtitle="We tailor technology strategy and product execution to the real problems and growth opportunities in each industry.">
        <Link href="/contact" className="btn-primary inline-flex items-center gap-2">Tell Us About Your Industry <IconArrowRight className="w-4 h-4" /></Link>
        <Link href="/services" className="btn-outline">View Services</Link>
      </PageHero>

      <section className="section-padding">
        <div className="container-page grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {industries.map((industry) => (
            <div key={industry.title} className="card card-3d block-3d p-6">
              <h2 className="text-xl font-bold text-primary">{industry.title}</h2>
              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Challenges</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {industry.challenges.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Solutions</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {industry.solutions.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {industry.stack.map((tech) => (
                      <span key={tech} className="chip inline-flex text-[10px]">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Case example</p>
                  <p className="text-sm text-slate-700">{industry.example}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
