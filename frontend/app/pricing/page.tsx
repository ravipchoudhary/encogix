import type { Metadata } from "next";
import Link from "next/link";
import PageHero, { CTASection } from "../../components/PageHero";
import { FAQSchema } from "../../components/JsonLd";
import { IconCheck, IconArrowRight } from "../../components/Icons";

export const metadata: Metadata = {
  title: "Pricing — Website, App & Software Development Packages | Encogix",
  description: "Transparent pricing for website development, ecommerce, mobile apps, CRM, AI & SEO in Noida. Starting from ₹15,000. Free consultation.",
};

const plans = [
  {
    name: "Starter Website",
    from: "₹15,000",
    desc: "Perfect for small businesses & startups",
    features: ["Up to 5 pages", "Mobile responsive", "Contact form", "WhatsApp button", "Basic SEO", "1 month support"],
  },
  {
    name: "Business Website",
    from: "₹35,000",
    desc: "Dynamic site with blog & admin",
    features: ["10+ pages", "Blog section", "Admin panel", "Local SEO setup", "Google Analytics", "2 months support"],
    popular: true,
  },
  {
    name: "Ecommerce Store",
    from: "₹75,000",
    desc: "Full online store with payments",
    features: ["Product catalog", "Cart & checkout", "Razorpay gateway", "Order management", "Inventory panel", "3 months support"],
  },
  {
    name: "Mobile App",
    from: "Custom",
    desc: "Android, iOS or hybrid apps",
    features: ["UI/UX design", "App development", "Backend API", "Push notifications", "Store submission help", "Maintenance plans"],
  },
  {
    name: "CRM / Software",
    from: "₹1,50,000",
    desc: "Custom business software",
    features: ["Lead management", "Role-based access", "Reports & analytics", "WhatsApp integration", "Training included", "Dedicated support"],
  },
  {
    name: "SEO & Marketing",
    from: "₹8,000/mo",
    desc: "Monthly growth packages",
    features: ["On-page SEO", "Local SEO Noida/NCR", "Google Business", "Content strategy", "Monthly reports", "Social media support"],
  },
];

const faqs = [
  { question: "Are there hidden costs?", answer: "No. We provide clear quotes upfront with milestone-based payments." },
  { question: "Do you offer EMI or installments?", answer: "Yes, for larger projects we offer milestone-based payment schedules." },
  { question: "Is hosting included?", answer: "Hosting & domain can be included or managed separately from ₹3,000/month." },
];

export default function PricingPage() {
  return (
    <>
      <FAQSchema items={faqs} />
      <PageHero
        chip="Transparent pricing"
        title="Pricing & Packages"
        subtitle="Affordable IT solutions for businesses in Noida, Greater Noida & Delhi NCR. All packages include free consultation."
      />

      <section className="section-padding">
        <div className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={`card card-3d block-3d relative ${plan.popular ? "ring-2 ring-secondary shadow-lg" : ""}`}>
              {plan.popular && <span className="absolute -top-3 right-4 chip text-xs bg-secondary text-white border-0">Most Popular</span>}
              <h2 className="text-xl font-bold text-primary">{plan.name}</h2>
              <p className="text-sm text-slate-500 mt-1">{plan.desc}</p>
              <p className="text-3xl font-bold text-secondary mt-4">{plan.from}</p>
              <ul className="mt-5 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-slate-600">
                    <IconCheck className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className={`w-full mt-6 text-center block py-2.5 rounded-xl text-sm font-semibold transition-all ${plan.popular ? "btn-primary" : "btn-outline"}`}>
                Get Quote
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-slate-50/50">
        <div className="container-page max-w-3xl">
          <h2 className="text-2xl font-bold text-primary mb-6">Pricing FAQs</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.question} className="card">
                <h3 className="font-semibold text-primary">{f.question}</h3>
                <p className="text-sm text-slate-600 mt-2">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Not sure which package fits?" desc="Tell us your requirements — we'll recommend the best option within your budget." />
    </>
  );
}
