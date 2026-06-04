import Link from "next/link";
import { IconArrowRight } from "./Icons";

interface PageHeroProps {
  chip?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageHero({ chip, title, subtitle, children }: PageHeroProps) {
  return (
    <section className="relative section-padding overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(56,189,248,0.12),transparent)]" />
      <div className="container-page relative">
        {chip && <span className="chip mb-4 inline-flex">{chip}</span>}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight max-w-4xl">{title}</h1>
        {subtitle && <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">{subtitle}</p>}
        {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function CTASection({ title, desc }: { title?: string; desc?: string }) {
  return (
    <section className="section-padding">
      <div className="container-page">
        <div className="glass-card block-3d rounded-3xl bg-gradient-to-br from-primary via-blue-900 to-primary p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold">{title || "Ready to start your project?"}</h2>
            <p className="mt-3 text-slate-200">{desc || "Get a free consultation and custom quote from our Noida team."}</p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link href="/contact" className="btn-primary bg-white text-primary hover:bg-slate-100 inline-flex items-center gap-2">
                Get Free Consultation <IconArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:+919431607346" className="rounded-xl border-2 border-white/80 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-all">
                Call +91 9431607346
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
