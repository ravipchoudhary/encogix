"use client";

import Link from "next/link";
import { useState } from "react";
import { FAQSchema } from "./JsonLd";
import { IconArrowRight, IconCheck, IconZap } from "./Icons";

const faqItems = [
  {
    question: "How much does a business website cost in Noida?",
    answer:
      "Encogix website packages typically start from ₹15,000 for basic business sites and scale based on pages, ecommerce features, and custom integrations. Contact us for a free quote.",
  },
  {
    question: "Do you provide website development in Greater Noida and Delhi NCR?",
    answer:
      "Yes. We serve clients across Noida, Greater Noida, Delhi NCR, and pan-India with on-site meetings available at our Greater Noida office.",
  },
  {
    question: "How long does it take to build a website or mobile app?",
    answer:
      "A standard business website takes 2–4 weeks. Ecommerce and custom software projects vary from 4–12+ weeks depending on scope.",
  },
  {
    question: "Do you offer SEO and digital marketing services?",
    answer:
      "Yes. We provide local SEO, Google Business optimization, content marketing, paid ads setup, and monthly growth packages.",
  },
  {
    question: "Can you integrate payment gateway and CRM?",
    answer:
      "Absolutely. We integrate Razorpay, WhatsApp automation, custom CRM, lead tracking, and third-party APIs as per your workflow.",
  },
];

const pricingPlans = [
  { name: "Starter Website", from: "₹15,000", features: ["5 pages", "Mobile responsive", "Contact form", "Basic SEO"] },
  { name: "Business Website", from: "₹35,000", features: ["10+ pages", "Blog", "WhatsApp CTA", "Local SEO setup"], popular: true },
  { name: "Ecommerce", from: "₹75,000", features: ["Product catalog", "Payment gateway", "Admin panel", "Order management"] },
  { name: "Custom Software", from: "₹1,50,000", features: ["CRM / ERP", "Role-based access", "API integrations", "Dedicated support"] },
];

export default function HomeSections() {
  const [auditForm, setAuditForm] = useState({ name: "", email: "", phone: "", website: "" });
  const [auditStatus, setAuditStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const submitAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuditStatus("sending");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...auditForm, message: "Free website audit request from homepage" }),
      });
      setAuditStatus(res.ok ? "ok" : "err");
      if (res.ok) setAuditForm({ name: "", email: "", phone: "", website: "" });
    } catch {
      setAuditStatus("err");
    }
  };

  return (
    <>
      <FAQSchema items={faqItems} />

      {/* Why Choose */}
      <section className="section-padding section-modern bg-white">
        <div className="container-page">
          <h2 className="text-3xl font-bold text-primary mb-3">Why Choose Encogix Technology</h2>
          <p className="text-slate-600 max-w-2xl mb-10">
            A trusted IT partner for startups and enterprises in Noida & Delhi NCR — delivering websites, apps, and software that drive real business growth.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "5+ Years Experience", desc: "Proven delivery across retail, healthcare, education & B2B." },
              { title: "120+ Projects", desc: "Websites, ecommerce, CRM & mobile apps shipped on time." },
              { title: "Local Noida Team", desc: "Face-to-face support at Greater Noida office." },
              { title: "Transparent Pricing", desc: "Clear quotes, no hidden costs, milestone-based delivery." },
            ].map((item) => (
              <div key={item.title} className="card card-3d block-3d">
                <IconCheck className="w-8 h-8 text-secondary mb-3" />
                <h3 className="font-semibold text-primary">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section-padding section-modern">
        <div className="container-page">
          <h2 className="text-3xl font-bold text-primary mb-6">Industries We Serve</h2>
          <div className="flex flex-wrap gap-3">
            {["Retail & Ecommerce", "Healthcare", "Education", "Real Estate", "Manufacturing", "Finance", "Hospitality", "Startups & SMEs"].map((ind) => (
              <span key={ind} className="chip">{ind}</span>
            ))}
          </div>
          <p className="mt-6 text-slate-600 text-sm">
            Website Development Company in Noida · Software Development Company in Greater Noida · Web Development Company in Delhi NCR · IT Services Company in Noida
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-slate-50/50">
        <div className="container-page">
          <h2 className="text-3xl font-bold text-primary mb-2">Pricing — Starting From</h2>
          <p className="text-slate-600 mb-10">Flexible packages for every business size. Custom quotes available.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`card card-3d block-3d relative ${plan.popular ? "ring-2 ring-secondary" : ""}`}>
                {plan.popular && <span className="absolute -top-3 right-4 chip text-xs">Popular</span>}
                <h3 className="font-semibold text-primary">{plan.name}</h3>
                <p className="text-2xl font-bold text-secondary mt-2">{plan.from}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2"><IconCheck className="w-4 h-4 text-secondary shrink-0" />{f}</li>
                  ))}
                </ul>
                <Link href="/pricing" className="btn-outline w-full mt-6 text-center text-sm">View all pricing</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free audit */}
      <section className="section-padding section-modern" id="free-audit">
        <div className="container-page grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="chip mb-4 inline-flex items-center gap-2"><IconZap className="w-4 h-4" /> Free offer</span>
            <h2 className="text-3xl font-bold text-primary">Free Website Audit</h2>
            <p className="mt-3 text-slate-600">
              Get a quick review of your site speed, SEO, mobile UX, and conversion opportunities — no obligation.
            </p>
          </div>
          <form onSubmit={submitAudit} className="card card-3d space-y-4">
            <input required placeholder="Your name" className="input-field" value={auditForm.name} onChange={(e) => setAuditForm({ ...auditForm, name: e.target.value })} />
            <input required type="email" placeholder="Email" className="input-field" value={auditForm.email} onChange={(e) => setAuditForm({ ...auditForm, email: e.target.value })} />
            <input required placeholder="Phone" className="input-field" value={auditForm.phone} onChange={(e) => setAuditForm({ ...auditForm, phone: e.target.value })} />
            <input placeholder="Website URL (optional)" className="input-field" value={auditForm.website} onChange={(e) => setAuditForm({ ...auditForm, website: e.target.value })} />
            <button type="submit" disabled={auditStatus === "sending"} className="btn-primary w-full">
              {auditStatus === "sending" ? "Submitting…" : "Get Free Audit"}
            </button>
            {auditStatus === "ok" && <p className="text-green-600 text-sm">Thank you! We will contact you shortly.</p>}
            {auditStatus === "err" && <p className="text-red-600 text-sm">Something went wrong. Please try again or call us.</p>}
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-slate-50/50">
        <div className="container-page max-w-3xl">
          <h2 className="text-3xl font-bold text-primary mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  type="button"
                  className="w-full text-left px-5 py-4 font-semibold text-primary flex justify-between items-center"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {item.question}
                  <span>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <p className="px-5 pb-4 text-slate-600 text-sm">{item.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding section-modern">
        <div className="container-page text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-primary">Meet Our Founder</h2>
          <p className="mt-4 text-slate-600">
            Encogix Technology was founded with a mission to help Indian businesses grow through affordable, high-quality digital solutions — from local shops in Noida to growing brands across India.
          </p>
          <Link href="/about" className="btn-outline inline-flex items-center gap-2 mt-6">
            About Encogix <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
