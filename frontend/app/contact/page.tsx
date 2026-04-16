"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { IconMail, IconPhone, IconMapPin, IconSend } from "../../components/Icons";

const OfficeMap = dynamic(() => import("../../components/OfficeMap"), { ssr: false });

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    formData.append("access_key", "36fa8b83-2560-4e33-997a-78b0ed8eaa49");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus("ok");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("err");
      }
    } catch {
      setStatus("err");
    }
  };

  return (
    <div className="section-padding section-modern">
      <div className="container-page">
        <div className="mb-10 page-hero-modern">
          <span className="chip mb-4 inline-flex items-center gap-2"><IconMail className="w-4 h-4" /> Get in touch</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
            Contact Us
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl">
            Get in touch with our team. We&apos;re here to help you with your digital
            transformation journey. Reach out via email, phone, or visit our offices.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="card card-3d block-3d">
              <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><IconPhone className="w-5 h-5 text-secondary" /> Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <IconMail className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                  <p className="text-sm font-medium text-slate-700">Email</p>
                  <a href="mailto:contact@encogix.com" className="text-secondary hover:underline">
                    contact@encogix.com
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Phone</p>
                  <div className="flex flex-wrap gap-3">
                    <a href="tel:+919431607346" className="text-secondary hover:underline">+91 9431607346</a>
                    <a href="tel:+917633926879" className="text-secondary hover:underline">+91 7633926879</a>
                  </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IconMapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Noida Office</p>
                  <p className="text-slate-600 text-sm">
                    Gaur City Center, Greater Noida, Uttar Pradesh, 201318
                  </p>
                  <a
                    href="https://maps.google.com/?q=Gaur+City+Center+Greater+Noida+Uttar+Pradesh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary text-sm hover:underline mt-1 inline-block"
                  >
                    View on Map →
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Bihar Office</p>
                  <p className="text-slate-600 text-sm">
                    Near BM College, Rahika, Madhubani, Bihar, 847211
                  </p>
                  <a
                    href="https://maps.google.com/?q=BM+College+Rahika+Madhubani+Bihar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary text-sm hover:underline mt-1 inline-block"
                  >
                    View on Map →
                  </a>
                  </div>
                </div>
              </div>
            </div>

            <OfficeMap />
          </div>

          <div>
            <div className="card-flat card-flat-3d glass-card">
              <h2 className="text-lg font-semibold text-primary mb-4">Send us a Message</h2>
              <p className="text-sm text-slate-600 mb-4">
                Fill out your details and we will get back to you as soon as possible.
              </p>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    name="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                  <input
                    name="email"
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number (Optional)</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    placeholder="+91 0000000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
                  <textarea
                    name="message"
                    required
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    rows={4}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    placeholder="How can we help you?"
                  />
                </div>
                <button type="submit" disabled={status === "sending"} className="btn-primary w-full inline-flex items-center justify-center gap-2">
                  {status === "sending" ? "Sending…" : <>Send Message <IconSend className="w-4 h-4" /></>}
                </button>
                {status === "ok" && (
                  <p className="text-green-600 text-sm">Thank you! We&apos;ll get back to you soon.</p>
                )}
                {status === "err" && (
                  <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
