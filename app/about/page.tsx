import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconEye, IconHeart, IconQuote, IconTarget, IconUsers } from "../../components/Icons";

export const metadata: Metadata = {
  title: "About Encogix Technology | Our Journey Since 2023",
  description: "Learn how Encogix Technology grew from a focused technology team in 2023 to a digital engineering company with a Greater Noida branch and clients across India.",
  keywords: "Encogix Technology journey, IT company Greater Noida, software company Noida, about Encogix",
  alternates: { canonical: "/about" },
};

const milestones = [
  {
    year: "2023",
    title: "Encogix begins its journey",
    text: "Encogix Technology started with a clear goal: help businesses turn practical ideas into reliable websites, software, and digital systems.",
  },
  {
    year: "2024",
    title: "Building products and trust",
    text: "We expanded our capabilities across web development, ecommerce, mobile apps, CRM, and digital marketing while growing long-term client partnerships.",
  },
  {
    year: "2025",
    title: "Greater Noida branch opened",
    text: "To work more closely with businesses in the Delhi NCR region, Encogix opened a new branch at Gaur City Center, Greater Noida, Uttar Pradesh.",
  },
  {
    year: "2026",
    title: "Growing as a digital engineering partner",
    text: "Today, our team supports businesses with custom software, AI automation, cloud delivery, SEO, and dedicated development talent across India.",
  },
];

const values = [
  { title: "Mission", desc: "Make dependable technology accessible to growing businesses and turn digital investment into measurable progress.", Icon: IconTarget },
  { title: "Vision", desc: "Become a trusted engineering partner for ambitious teams building useful, secure, and sustainable digital products.", Icon: IconEye },
  { title: "Values", desc: "Stay honest, stay curious, take ownership, communicate clearly, and keep improving the quality of every delivery.", Icon: IconHeart },
];

export default function AboutPage() {
  return (
    <main className="section-padding section-modern">
      <div className="container-page space-y-16">
        <section className="page-hero-modern max-w-4xl">
          <span className="chip mb-4 inline-flex items-center gap-2"><IconTarget className="h-4 w-4" /> Our story</span>
          <h1 className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">Building useful digital products since 2023.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">Encogix Technology is a digital engineering company helping startups, growing businesses, and established teams build better websites, software, apps, and automated workflows.</p>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">We began with a small, focused team and have grown through client relationships, consistent delivery, and a belief that technology should make business simpler, faster, and more capable.</p>
        </section>

        <section aria-labelledby="journey-heading">
          <div className="mb-8 flex items-end justify-between gap-4"><div><span className="chip">2023 to today</span><h2 id="journey-heading" className="mt-4 text-3xl font-bold text-primary">Our journey</h2></div><span className="hidden text-sm text-slate-500 sm:block">Four milestones. One clear direction.</span></div>
          <div className="relative grid gap-5 md:grid-cols-4 md:gap-0 md:before:absolute md:before:left-0 md:before:right-0 md:before:top-7 md:before:h-px md:before:bg-slate-200">
            {milestones.map((milestone, index) => <article key={milestone.year} className="relative md:px-3 first:md:pl-0 last:md:pr-0"><div className="relative z-10 flex items-center gap-3 md:block"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-white bg-secondary text-sm font-bold text-white shadow-md shadow-blue-200">{milestone.year}</span><h3 className="text-lg font-semibold text-primary md:mt-5">{milestone.title}</h3></div><p className="mt-3 text-sm leading-6 text-slate-600 md:pr-5">{milestone.text}</p></article>)}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">{values.map((item, index) => <article key={item.title} className="card card-3d block-3d" style={{ animationDelay: `${index * 80}ms` } as React.CSSProperties}><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/20 to-accent/20 text-secondary"><item.Icon className="h-6 w-6" /></div><h2 className="mb-2 text-lg font-semibold text-primary">{item.title}</h2><p className="text-sm leading-6 text-slate-600">{item.desc}</p></article>)}</section>

        <section className="block-3d overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-900 to-primary p-8 text-white shadow-2xl shadow-primary/25 md:p-10"><div className="mb-6 flex items-center gap-2"><IconQuote className="h-6 w-6 text-white/60" /><h2 className="text-xl font-semibold">A note from our leadership</h2></div><div className="flex flex-col items-start gap-6 md:flex-row md:gap-8"><div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/20 text-3xl font-bold backdrop-blur-sm">RP</div><div><h3 className="text-lg font-semibold">Ravi P Choudhary</h3><p className="mt-1 text-sm text-white/80">Chief Executive Officer</p><div className="mt-6 space-y-4 text-base leading-relaxed text-white/95"><p>Encogix was built around a simple idea: businesses deserve technology that is clear, dependable, and connected to real outcomes.</p><p>Our Greater Noida branch strengthens our presence in Delhi NCR, while our team continues to work with clients across India. We are grateful to every client and team member who has shaped this journey since 2023.</p></div></div></div></section>

        <section><h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-primary"><IconUsers className="h-7 w-7 text-secondary" /> Encogix at a glance</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[{ label: "Journey started", value: "2023" }, { label: "Greater Noida branch", value: "2025" }, { label: "Core service areas", value: "6+" }, { label: "Client-first delivery", value: "100%" }].map(item => <div key={item.label} className="block-3d rounded-2xl border border-slate-100 bg-white px-5 py-6 text-center shadow-card"><div className="text-2xl font-bold text-primary">{item.value}</div><div className="mt-1 text-sm text-slate-500">{item.label}</div></div>)}</div></section>

        <section className="card card-3d block-3d py-12 text-center"><h2 className="text-xl font-semibold text-primary">Let&apos;s build the next chapter together.</h2><p className="mx-auto mt-2 max-w-xl text-slate-600">Tell us what you are building and our team will help you choose the right technology path.</p><Link href="/contact" className="btn-primary mt-4 inline-flex items-center gap-2">Start a conversation <IconArrowRight className="h-4 w-4" /></Link></section>
      </div>
    </main>
  );
}
