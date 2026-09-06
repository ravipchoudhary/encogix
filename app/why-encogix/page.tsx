import type { Metadata } from "next";
import Link from "next/link";
import PageHero, { CTASection } from "../../components/PageHero";
import { FAQSchema } from "../../components/JsonLd";
import { IconCheck, IconUsers, IconArrowRight, IconBrain, IconGlobe, IconWrench, IconTarget, IconHeart, IconZap } from "../../components/Icons";

export const metadata: Metadata = {
  title: "Why Encogix | Trusted Digital Product Partner",
  description: "Learn why businesses choose Encogix for custom software, websites, AI engineering, cloud transformation, and digital growth.",
};

const values = [
  { title: "Client-first execution", items: ["Business alignment before engineering", "Clear communication and transparent delivery", "Practical roadmap decisions that fit your goals"] },
  { title: "Product mindset", items: ["Build with user value and business impact in mind", "Prioritize measurable outcomes over vanity metrics", "Support scalable growth without rework"] },
  { title: "Technology depth", items: ["Modern stacks across frontend, backend, mobile, cloud, and AI", "Focus on maintainability, performance, and quality", "Ability to adapt to changing business demands"] },
  { title: "Reliable delivery", items: ["Agile processes and milestone visibility", "Testing and QA built into the workflow", "Support beyond launch for long-term stability"] },
];

const perks = [
  "Business-focused consulting and discovery",
  "Dedicated product and engineering support",
  "Flexible hiring and delivery models",
  "Performance, speed, and UX optimization",
  "Industry-aware implementation strategies",
  "Long-term partnership approach",
];

const faqs = [
  { question: "Why do clients choose Encogix?", answer: "Because we combine business understanding, technical execution, and designer-level thinking to build solutions that are useful, scalable, and easy to operate." },
  { question: "Do you work with startups and enterprises?", answer: "Yes. We support early-stage startups needing MVPs as well as established businesses looking for product modernization, automation, or dedicated talent." },
  { question: "How does Encogix work with client teams?", answer: "We integrate with your internal teams, maintain clear communication, and operate with practical project workflows built around your goals." },
];

export default function WhyEncogixPage() {
  return (
    <>
      <FAQSchema items={faqs} />
      <PageHero chip="Why businesses choose us" title="Why Encogix" subtitle="We help businesses turn ideas into digital products, better customer experiences, and scalable operations with a practical and hands-on approach.">
        <Link href="/contact" className="btn-primary inline-flex items-center gap-2">Book a Consultation <IconArrowRight className="w-4 h-4" /></Link>
        <Link href="/services" className="btn-outline">Explore Services</Link>
      </PageHero>

      <section className="section-padding">
        <div className="container-page grid gap-6 lg:grid-cols-4">
          {[
            { icon: IconTarget, title: "Vision", text: "Build digital systems that help businesses grow with clarity and momentum." },
            { icon: IconBrain, title: "Mission", text: "Deliver practical technology solutions with design quality, execution speed, and measurable value." },
            { icon: IconHeart, title: "Core Values", text: "Honesty, ownership, quality, learning, and long-term client trust." },
            { icon: IconUsers, title: "Approach", text: "Collaborative problem-solving with business awareness and engineering depth." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="card card-3d block-3d p-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center text-secondary mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-primary">{title}</h2>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-slate-50/60">
        <div className="container-page">
          <div className="mb-6">
            <span className="chip inline-flex mb-3">Why choose us</span>
            <h2 className="text-2xl font-bold text-primary">Our difference</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {values.map((group) => (
              <div key={group.title} className="card p-6">
                <h3 className="text-lg font-bold text-primary">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-slate-700"><IconCheck className="w-5 h-5 text-secondary mt-0.5" /> {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="card p-6 md:p-8">
              <span className="chip inline-flex mb-3">Development methodology</span>
              <h2 className="text-2xl font-bold text-primary">How we work</h2>
              <div className="mt-6 space-y-4">
                {[
                  "Discovery and requirement mapping",
                  "Business analysis and technical planning",
                  "Design sprints and UX validation",
                  "Agile development with regular milestone reviews",
                  "QA, deployment, and post-launch support",
                ].map((step, index) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold">{index + 1}</div>
                    <p className="text-slate-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-bold text-primary">By the numbers</h3>
              <div className="mt-5 space-y-4">
                {[
                  ["120+", "Projects delivered"],
                  ["80+", "Happy clients"],
                  ["5+", "Years of experience"],
                  ["24/7", "Support mindset"],
                ].map(([value, label]) => (
                  <div key={label} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                    <div className="text-2xl font-bold text-secondary">{value}</div>
                    <div className="text-sm text-slate-600">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50/60">
        <div className="container-page">
          <div className="mb-6">
            <span className="chip inline-flex mb-3">Technology stack</span>
            <h2 className="text-2xl font-bold text-primary">Tools and platforms we rely on</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["React", "Next.js", "Node.js", "Python", "Flutter", "AWS", "Azure", "OpenAI"].map((item) => (
              <div key={item} className="glass-card rounded-xl px-4 py-3 text-sm font-medium text-slate-700">{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="mb-6">
            <span className="chip inline-flex mb-3">Client trust</span>
            <h2 className="text-2xl font-bold text-primary">What sets Encogix apart</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {perks.map((item) => (
              <div key={item} className="card p-4 text-sm text-slate-700 flex gap-3"><IconZap className="w-5 h-5 text-secondary shrink-0 mt-0.5" /> {item}</div>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Let’s build something meaningful together" desc="Talk to Encogix and discover the right digital strategy, engineering, and delivery model for your business." />
    </>
  );
}
