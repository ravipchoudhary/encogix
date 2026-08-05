import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import PageHero, { CTASection } from "../../components/PageHero";
import { SERVICES } from "../../lib/services-data";
import { SERVICE_LINKS } from "../../lib/site-config";
import { IconArrowRight, IconGlobe, IconSmartphone, IconBriefcase, IconBrain, IconBarChart3, IconShoppingBag } from "../../components/Icons";

export const metadata: Metadata = {
  title: "IT Services — Website, App, CRM, AI & SEO in Noida | Encogix",
  description: "Complete IT services in Noida & Delhi NCR: website development, ecommerce, mobile apps, CRM, AI chatbots, SEO & digital marketing.",
};

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  globe: IconGlobe,
  cart: IconShoppingBag,
  mobile: IconSmartphone,
  crm: IconBriefcase,
  ai: IconBrain,
  seo: IconBarChart3,
};

export default function ServicesPage() {
  const serviceList = Object.values(SERVICES);
  const extraServiceLinks = SERVICE_LINKS.filter(
    (link) => !serviceList.some((service) => `/services/${service.slug}` === link.href)
  );

  return (
    <>
      <PageHero
        chip="Noida · Greater Noida · Delhi NCR"
        title="Our Services"
        subtitle="End-to-end digital solutions — from your first website to enterprise CRM, AI automation, and SEO growth."
      >
        <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
          Free Consultation <IconArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/pricing" className="btn-outline">View Pricing</Link>
      </PageHero>

      <section className="section-padding">
        <div className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {serviceList.map((s) => {
            const Icon = ICONS[s.icon] || IconGlobe;
            return (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="card card-3d block-3d group flex flex-col"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center mb-4 text-secondary group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors">{s.title}</h2>
                <p className="text-sm text-slate-600 mt-2 flex-1 leading-relaxed">{s.intro}</p>
                <p className="text-sm font-semibold text-secondary mt-4 inline-flex items-center gap-1">
                  From {s.pricingFrom} <IconArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section-padding bg-slate-50/50">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-primary mb-6">Also Available</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {extraServiceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="glass-card rounded-3xl px-4 py-5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
