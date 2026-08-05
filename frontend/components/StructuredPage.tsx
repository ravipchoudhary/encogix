import Link from "next/link";
import PageHero, { CTASection } from "./PageHero";
import { FAQSchema } from "./JsonLd";
import { ContactLeadForm } from "./ContactLeadForm";
import { IconArrowRight, IconCheck } from "./Icons";

export type StructuredSection = {
  title: string;
  description?: string;
  items: string[];
};

export type StructuredPageProps = {
  chip: string;
  title: string;
  subtitle: string;
  breadcrumb?: { label: string; href: string }[];
  quickActions?: { label: string; href: string; variant?: "primary" | "outline" }[];
  sections: StructuredSection[];
  faqs: { question: string; answer: string }[];
  contactTitle?: string;
  contactSubtitle?: string;
  ctaTitle?: string;
  ctaDescription?: string;
};

export default function StructuredPage({
  chip,
  title,
  subtitle,
  breadcrumb = [],
  quickActions = [],
  sections,
  faqs,
  contactTitle,
  contactSubtitle,
  ctaTitle,
  ctaDescription,
}: StructuredPageProps) {
  return (
    <>
      <FAQSchema items={faqs} />

      <PageHero chip={chip} title={title} subtitle={subtitle}>
        {quickActions.length > 0 ? (
          quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={action.variant === "outline" ? "btn-outline" : "btn-primary inline-flex items-center gap-2"}
            >
              {action.label}
              {action.variant !== "outline" && <IconArrowRight className="w-4 h-4" />}
            </Link>
          ))
        ) : (
          <>
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              Free Consultation <IconArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/services" className="btn-outline">View Services</Link>
          </>
        )}
      </PageHero>

      <section className="section-padding pt-0 -mt-3">
        <div className="container-page">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-secondary">Home</Link>
            {breadcrumb.length > 0 && <span>/</span>}
            {breadcrumb.map((item, index) => (
              <span key={item.href} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                <Link href={item.href} className="hover:text-secondary">{item.label}</Link>
              </span>
            ))}
            <span>/</span>
            <span className="text-slate-700 font-medium">{title}</span>
          </nav>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page space-y-8">
          {sections.map((section, index) => (
            <div key={section.title} className="card card-3d block-3d p-6 md:p-8">
              <div className="mb-5">
                <span className="chip inline-flex mb-3">0{index + 1}</span>
                <h2 className="text-2xl font-bold text-primary">{section.title}</h2>
                {section.description && <p className="mt-2 text-slate-600">{section.description}</p>}
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-700">
                    <IconCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-slate-50/60">
        <div className="container-page">
          <div className="mb-6">
            <span className="chip inline-flex mb-3">Frequently Asked Questions</span>
            <h2 className="text-2xl font-bold text-primary">Answers to common questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="card p-5 md:p-6">
                <h3 className="font-semibold text-primary">{faq.question}</h3>
                <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactLeadForm title={contactTitle || "Tell us about your requirement"} subtitle={contactSubtitle || "Share your goals and our team will reach out with a tailored recommendation."} />
      <CTASection title={ctaTitle || "Ready to move faster?"} desc={ctaDescription || "Let’s build a stronger digital foundation for your business."} />
    </>
  );
}
