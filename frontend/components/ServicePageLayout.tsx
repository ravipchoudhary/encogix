import Link from "next/link";
import PageHero, { CTASection } from "./PageHero";
import { FAQSchema } from "./JsonLd";
import { IconCheck, IconArrowRight, IconGlobe, IconSmartphone, IconBriefcase, IconBrain, IconBarChart3, IconShoppingBag } from "./Icons";
import type { ServicePageData } from "../lib/services-data";

const ICON_MAP = {
  globe: IconGlobe,
  cart: IconShoppingBag,
  mobile: IconSmartphone,
  crm: IconBriefcase,
  ai: IconBrain,
  seo: IconBarChart3,
};

export default function ServicePageLayout({ service }: { service: ServicePageData }) {
  const Icon = ICON_MAP[service.icon as keyof typeof ICON_MAP] || IconGlobe;

  return (
    <>
      <FAQSchema items={service.faqs} />
      <PageHero
        chip={service.heroSubtitle}
        title={service.title}
        subtitle={service.intro}
      >
        <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
          Get Free Quote <IconArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/pricing" className="btn-outline">View Pricing</Link>
      </PageHero>

      <section className="section-padding">
        <div className="container-page grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="card card-3d block-3d">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center text-secondary">
                  <Icon className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-primary">What We Offer</h2>
              </div>
              <ul className="grid sm:grid-cols-2 gap-3">
                {service.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-slate-700">
                    <IconCheck className="w-5 h-5 text-secondary shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card card-3d block-3d">
              <h2 className="text-xl font-bold text-primary mb-4">Deliverables</h2>
              <ul className="space-y-2">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-secondary">✓</span> {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-primary">FAQs</h2>
              {service.faqs.map((faq) => (
                <div key={faq.question} className="card">
                  <h3 className="font-semibold text-primary">{faq.question}</h3>
                  <p className="text-sm text-slate-600 mt-2">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card card-3d block-3d sticky top-24 glass-card">
              <h3 className="font-bold text-primary text-lg">Quick Info</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500">Starting from</dt>
                  <dd className="text-2xl font-bold text-secondary">{service.pricingFrom}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Timeline</dt>
                  <dd className="font-semibold text-primary">{service.timeline}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Location</dt>
                  <dd className="text-slate-700">Noida · Greater Noida · Delhi NCR</dd>
                </div>
              </dl>
              <Link href="/contact" className="btn-primary w-full mt-6 text-center">Request Quote</Link>
              <a
                href={`https://wa.me/919431607346?text=${encodeURIComponent(`Hi, I need ${service.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full mt-3 text-center block"
              >
                WhatsApp Us
              </a>
            </div>
          </aside>
        </div>
      </section>

      <CTASection title={`Start your ${service.title} project`} />
    </>
  );
}
