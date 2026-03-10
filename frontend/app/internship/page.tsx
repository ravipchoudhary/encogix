"use client";

import { useState } from "react";

const programs = [
  { id: "web", label: "Web Development", desc: "React, Next.js, TypeScript, and modern web stack." },
  { id: "software", label: "Software Development", desc: "Backend systems, APIs, and full-stack development." },
  { id: "uiux", label: "UI/UX Design", desc: "User research, wireframing, visual design, and prototyping." },
  { id: "marketing", label: "Digital Marketing", desc: "SEO, content marketing, analytics, and campaigns." },
];

export default function InternshipPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", internship_type: "web", message: "" });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("resume", file);
    try {
      const res = await fetch("/api/internships/apply", { method: "POST", body: fd });
      if (res.ok) {
        setStatus("ok");
        setForm({ name: "", email: "", phone: "", internship_type: "web", message: "" });
        setFile(null);
      } else setStatus("err");
    } catch {
      setStatus("err");
    }
  };

  return (
    <div className="section-padding">
      <div className="container-page max-w-4xl space-y-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-primary">
            Internship Programs
          </h1>
          <p className="mt-4 text-slate-600">
            Gain hands-on experience in technology with Encogix. We offer internships across development, design, and marketing.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {programs.map((p) => (
            <div key={p.id} className="card">
              <h2 className="font-semibold text-primary">{p.label}</h2>
              <p className="text-sm text-slate-600 mt-1">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="card-flat">
          <h2 className="text-xl font-semibold text-primary mb-4">Apply for an internship</h2>
          <form onSubmit={submit} className="form-group">
            <div>
              <label className="label-field">Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input-field"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="label-field">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="input-field"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="label-field">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="input-field"
                placeholder="+91 0000000000"
              />
            </div>
            <div>
              <label className="label-field">Internship type *</label>
              <select
                value={form.internship_type}
                onChange={(e) => setForm((f) => ({ ...f, internship_type: e.target.value }))}
                className="input-field"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Resume (PDF) *</label>
              <input
                required
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="file-input"
              />
            </div>
            <div>
              <label className="label-field">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                rows={3}
                className="input-field"
                placeholder="Tell us about your goals"
              />
            </div>
            <button type="submit" disabled={status === "sending"} className="btn-primary">
              {status === "sending" ? "Submitting…" : "Apply Now"}
            </button>
            {status === "ok" && <p className="text-green-600 text-sm">Application submitted successfully.</p>}
            {status === "err" && <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
