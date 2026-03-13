import type { Metadata } from "next";
import Link from "next/link";
import { IconTarget, IconEye, IconHeart, IconQuote, IconUsers, IconArrowRight } from "../../components/Icons";

export const metadata: Metadata = {
  title: "About Us | Encogix Technology - Engineering Digital Innovation",
  description:
    "Encogix Technology is a trusted IT partner delivering software development, cloud solutions, and digital innovation. Meet our CEO Ravi P Choudhary.",
  keywords: "Encogix Technology, about us, IT company, software development, digital transformation",
  openGraph: {
    title: "About Us | Encogix Technology",
    description: "Encogix Technology - Engineering secure, scalable digital platforms. Led by CEO Ravi P Choudhary.",
  },
};

export default function AboutPage() {
  return (
    <div className="section-padding section-modern">
      <div className="container-page space-y-16">
        <section className="page-hero-modern">
          <span className="chip mb-4 inline-flex items-center gap-2">
            <IconTarget className="w-4 h-4" /> Who we are
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
            About Encogix Technology
          </h1>
          <p className="mt-4 text-slate-600 max-w-3xl text-lg">
            Encogix Technology is a trusted partner in digital transformation, specializing
            in software development, web solutions, cloud services, and AI-driven applications.
            We help businesses turn bold ideas into scalable, secure, and intelligent digital products.
          </p>
          <p className="mt-4 text-slate-600 max-w-3xl">
            Founded with a vision to democratize cutting-edge technology, we combine
            engineering excellence with a client-first approach—delivering solutions that
            drive growth, enhance productivity, and create lasting competitive advantages.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Mission", desc: "To empower businesses with innovative technology solutions that drive measurable results, enhance productivity, and create sustainable competitive advantages.", Icon: IconTarget },
            { title: "Vision", desc: "To be recognized globally as a leader in creating smart, sustainable, and impactful digital solutions that transform how businesses operate.", Icon: IconEye },
            { title: "Values", desc: "We prioritize innovation, integrity, customer-first approach, and excellence in delivery. Our agility and continuous learning keep us ahead.", Icon: IconHeart },
          ].map((item, i) => (
            <div key={item.title} className="card card-3d block-3d float-in" style={{ animationDelay: `${i * 80}ms` } as React.CSSProperties}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center mb-4 text-secondary icon-wrap-3d">
                <item.Icon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-primary mb-2">{item.title}</h2>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="block-3d rounded-3xl bg-gradient-to-br from-primary via-blue-900 to-primary text-white p-8 md:p-10 overflow-hidden shadow-2xl shadow-primary/25">
          <div className="flex items-center gap-2 mb-6">
            <IconQuote className="w-6 h-6 text-white/60" />
            <h2 className="text-xl font-semibold">Message from CEO</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold backdrop-blur-sm border border-white/20">
                RP
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white">Ravi P Choudhary</h3>
              <p className="text-sm text-white/80 mt-1">Chief Executive Officer</p>
              <div className="mt-6 space-y-4 text-white/95 text-base leading-relaxed">
                <p>At Encogix Technology, we believe technology should empower, not overwhelm. Every line of code we write, every solution we build, is driven by one goal: to help your business thrive in a digital-first world.</p>
                <p>We are not just developers—we are your partners in innovation. Whether you are a startup with a bold idea or an enterprise ready to scale, we are here to engineer the future with you.</p>
                <p>Thank you for considering Encogix. Let us build something extraordinary together.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
            <IconUsers className="w-7 h-7 text-secondary" /> Company at a Glance
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Happy Clients", value: "120+" },
              { label: "Projects Completed", value: "250+" },
              { label: "Team Members", value: "50+" },
              { label: "Client Satisfaction", value: "98%" },
            ].map((item, i) => (
              <div key={item.label} className="block-3d rounded-2xl border border-slate-100 bg-white px-5 py-6 shadow-card text-center card-flat-3d float-in" style={{ animationDelay: `${i * 80}ms` } as React.CSSProperties}>
                <div className="text-2xl font-bold text-primary">{item.value}</div>
                <div className="mt-1 text-sm text-slate-500">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card card-3d block-3d text-center py-12">
          <h2 className="text-xl font-semibold text-primary">Ready to Transform Your Business?</h2>
          <p className="mt-2 text-slate-600 max-w-xl mx-auto">
            Let&apos;s build something extraordinary together. Get in touch with our team.
          </p>
          <Link href="/contact" className="btn-primary mt-4 inline-flex items-center gap-2">
            Contact Us <IconArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
