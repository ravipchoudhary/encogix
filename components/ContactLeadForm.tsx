"use client";

import { useState } from "react";

export function ContactLeadForm({
  title = "Let’s discuss your project",
  subtitle = "Tell us what you need and our team will connect with you.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          source: "service-page",
        }),
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      setStatus("Thanks! Our team will contact you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (_error) {
      setStatus("Something went wrong. Please call or WhatsApp us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding">
      <div className="container-page">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <div className="card card-3d block-3d p-8">
            <span className="chip mb-4 inline-flex">Request a callback</span>
            <h2 className="text-3xl font-bold text-primary">{title}</h2>
            <p className="mt-3 text-slate-600">{subtitle}</p>
            <div className="mt-6 space-y-4 text-sm text-slate-700">
              <p><strong className="text-primary">Phone:</strong> +91 9431607346</p>
              <p><strong className="text-primary">Email:</strong> contact@encogix.com</p>
              <p><strong className="text-primary">Availability:</strong> Mon–Sat, 9:00 AM to 7:00 PM</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card card-3d block-3d p-6 md:p-8">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-secondary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-secondary"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-secondary"
                  placeholder="+91 98xxx xxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Requirement</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-secondary"
                  placeholder="Tell us about your project goals, timeline, and scope..."
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? "Sending..." : "Send Enquiry"}
              </button>
              {status && <p className="text-sm text-secondary">{status}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
