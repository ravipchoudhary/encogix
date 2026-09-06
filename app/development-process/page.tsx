import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "../../components/PageHero";
import { IconArrowRight, IconCheck, IconCode2, IconLayout, IconBrain, IconWrench, IconCloud, IconCalendar } from "../../components/Icons";

export const metadata: Metadata = {
  title: "Development Process | Encogix Technology",
  description: "See how Encogix handles requirement gathering, business analysis, design, development, QA, deployment, maintenance, and support.",
};

const steps = [
  { title: "Requirement Gathering", description: "We understand your goals, user needs, target market, and success metrics before the build begins.", icon: IconCalendar },
  { title: "Business Analysis", description: "We map workflows, define scope, validate assumptions, and shape a practical product strategy.", icon: IconBrain },
  { title: "UI/UX Design", description: "We design intuitive, conversion-ready user journeys and interfaces aligned to your brand and product goals.", icon: IconLayout },
  { title: "Development", description: "Our engineering team implements the system using the right stack, architecture, and sprint plan.", icon: IconCode2 },
  { title: "QA Testing", description: "We validate functionality, responsiveness, quality, and edge cases before release.", icon: IconCheck },
  { title: "Deployment", description: "We release your product securely, monitor initial performance, and support launch readiness.", icon: IconCloud },
  { title: "Maintenance", description: "We continue improvements, updates, and optimization as your business and product evolve.", icon: IconWrench },
  { title: "Support", description: "We stay available for technical support, issue resolution, and long-term product stability.", icon: IconArrowRight },
];

export default function DevelopmentProcessPage() {
  return (
    <>
      <PageHero chip="Clear workflow" title="Development Process" subtitle="Our delivery framework keeps every project transparent, efficient, and aligned with your business goals.">
        <Link href="/contact" className="btn-primary inline-flex items-center gap-2">Start a Project <IconArrowRight className="w-4 h-4" /></Link>
        <Link href="/services" className="btn-outline">View Services</Link>
      </PageHero>

      <section className="section-padding">
        <div className="container-page">
          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-200" />
            <div className="space-y-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLeft = index % 2 === 0;
                return (
                  <div key={step.title} className={`relative flex ${isLeft ? "lg:justify-start" : "lg:justify-end"}`}>
                    <div className="w-full lg:w-[45%]">
                      <div className="card card-3d block-3d p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center text-secondary">
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="chip inline-flex">0{index + 1}</span>
                        </div>
                        <h2 className="text-xl font-bold text-primary">{step.title}</h2>
                        <p className="mt-2 text-slate-600 text-sm">{step.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
