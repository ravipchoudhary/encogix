"use client";

import { useState } from "react";
import { IconMail, IconPhone, IconMapPin, IconSend } from "../../components/Icons";

const offices = [
  {
    city: "Noida",
    address: "Gaur City Center, Greater Noida, Uttar Pradesh, 201318",
  },
  {
    city: "Bihar",
    address: "Near BM College, Rahika, Madhubani, Bihar, 847211",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact" }),
      });
      if (res.ok) {
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
      <div className="container-page space-y-10">
        <div className="page-hero-modern">
          <span className="chip mb-4 inline-flex items-center gap-2">
            <IconMail className="w-4 h-4" /> Get in touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary flex items-center gap-2">
            <IconMail className="w-8 h-8 text-secondary" /> Contact Us
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl">
            Have a project in mind or need expert guidance? Send us a message and our team will get back to you shortly.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="card card-3d block-3d space-y-5">
              <h2 className="text-lg font-semibold text-primary">Contact information</h2>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <IconMail className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <a href="mailto:contact@encogix.com" className="hover:text-secondary transition-colors">
                    contact@encogix.com
                  </a>
                </li>
                <li className="flex gap-3">
                  <IconPhone className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <a href="tel:+919431607346" className="block hover:text-secondary transition-colors">
                      +91 9431607346
                    </a>
                    <a href="tel:+917633926879" className="block hover:text-secondary transition-colors">
                      +91 7633926879
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {offices.map((office) => (
              <div key={office.city} className="card card-3d block-3d">
                <div className="flex gap-3">
                  <IconMapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-primary">{office.city} office</h3>
                    <p className="text-sm text-slate-600 mt-1">{office.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <div className="card-flat card-flat-3d glass-card block-3d">
              <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                <IconSend className="w-6 h-6 text-secondary" /> Send a message
              </h2>
              <form onSubmit={submit} className="form-group">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label-field">Name *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="input-field"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="label-field">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="input-field"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="label-field">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="input-field"
                    placeholder="+91 ..."
                  />
                </div>
                <div>
                  <label className="label-field">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="input-field"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>
                <button type="submit" disabled={status === "sending"} className="btn-primary inline-flex items-center gap-2">
                  <IconSend className="w-4 h-4" />
                  {status === "sending" ? "Sending…" : "Submit"}
                </button>
                {status === "ok" && (
                  <p className="text-sm text-green-600">Thank you! Your message has been received. We will contact you soon.</p>
                )}
                {status === "err" && (
                  <p className="text-sm text-red-600">Something went wrong. Please try again or email us at contact@encogix.com.</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
