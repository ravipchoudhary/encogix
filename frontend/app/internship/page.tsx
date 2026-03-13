"use client";

import { useState } from "react";
import { IconGraduationCap, IconSend } from "../../components/Icons";

const areasOfInterest = [
  { id: "web", label: "Web Development" },
  { id: "software", label: "Software Development" },
  { id: "android", label: "Android Development" },
  { id: "ui", label: "UI Designing" },
  { id: "data_science", label: "Data Science" },
  { id: "data_analyst", label: "Data Analyst" },
  { id: "python", label: "Python Programming" },
  { id: "java", label: "Java Programming" },
  { id: "machine_learning", label: "Machine Learning" },
  { id: "digital_marketing", label: "Digital Marketing" },
  { id: "hr", label: "HR / Human Resources" },
  { id: "other", label: "Other" },
];

const programCards = [
  { id: "web", label: "Web Development", desc: "React, Next.js, TypeScript, and modern web stack." },
  { id: "software", label: "Software Development", desc: "Backend systems, APIs, and full-stack development." },
  { id: "android", label: "Android Development", desc: "Native Android apps with Kotlin/Java." },
  { id: "ui", label: "UI Designing", desc: "User research, wireframing, visual design, and prototyping." },
  { id: "data_science", label: "Data Science", desc: "Data analysis, ML models, and insights." },
  { id: "machine_learning", label: "Machine Learning", desc: "AI/ML algorithms and implementations." },
  { id: "digital_marketing", label: "Digital Marketing", desc: "SEO, content marketing, social media, and campaigns." },
  { id: "hr", label: "HR / Human Resources", desc: "Recruitment, employee relations, and HR operations." },
];

const courseTypes = [
  "B.Tech", "B.E.", "MCA", "BCA", "B.Sc (IT/CS)", "M.Sc (IT/CS)", "BBA", "MBA", "B.Com", "Other",
];

export default function InternshipPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", internship_type: "web", other_interest: "",
    college: "", course: "", message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData();
    const finalType = form.internship_type === "other"
      ? (form.other_interest?.trim() || "Other")
      : (areasOfInterest.find((a) => a.id === form.internship_type)?.label || form.internship_type);
    fd.append("internship_type", finalType);
    fd.append("name", form.name);
    fd.append("email", form.email);
    if (form.phone) fd.append("phone", form.phone);
    if (form.college) fd.append("college", form.college);
    if (form.course) fd.append("course", form.course);
    if (form.message) fd.append("message", form.message);
    if (file) fd.append("resume", file);
    try {
      const res = await fetch("/api/internships/apply", { method: "POST", body: fd });
      if (res.ok) {
        setStatus("ok");
        setForm({ name: "", email: "", phone: "", internship_type: "web", other_interest: "", college: "", course: "", message: "" });
        setFile(null);
      } else setStatus("err");
    } catch {
      setStatus("err");
    }
  };

  return (
    <div className="section-padding section-modern">
      <div className="container-page max-w-4xl space-y-10">
        <div className="page-hero-modern">
          <span className="chip mb-4 inline-flex items-center gap-2"><IconGraduationCap className="w-4 h-4" /> Learn & Grow</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary flex items-center gap-2">
            <IconGraduationCap className="w-8 h-8 text-secondary" /> Internship Programs
          </h1>
          <p className="mt-4 text-slate-600">
            Gain hands-on experience with Encogix. We offer internships in Web Development, Software Development, Android, UI Design, Data Science, Machine Learning, Digital Marketing, HR, and more.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programCards.map((p) => (
            <div key={p.id} className="card">
              <h2 className="font-semibold text-primary">{p.label}</h2>
              <p className="text-sm text-slate-600 mt-1">{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="card-flat card-flat-3d glass-card block-3d">
          <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2"><IconSend className="w-6 h-6 text-secondary" /> Apply for an internship</h2>
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
              <label className="label-field">Area of Interest *</label>
              <select
                value={form.internship_type}
                onChange={(e) => setForm((f) => ({ ...f, internship_type: e.target.value }))}
                className="input-field"
              >
                {areasOfInterest.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              {form.internship_type === "other" && (
                <input
                  required
                  value={form.other_interest}
                  onChange={(e) => setForm((f) => ({ ...f, other_interest: e.target.value }))}
                  className="input-field mt-2"
                  placeholder="Specify your area of interest"
                />
              )}
            </div>
            <div>
              <label className="label-field">College / University Name *</label>
              <input
                required
                value={form.college}
                onChange={(e) => setForm((f) => ({ ...f, college: e.target.value }))}
                className="input-field"
                placeholder="e.g. XYZ College of Engineering"
              />
            </div>
            <div>
              <label className="label-field">Course / Degree *</label>
              <select
                required
                value={form.course}
                onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
                className="input-field"
              >
                <option value="">Select course type</option>
                {courseTypes.map((c) => (
                  <option key={c} value={c}>{c}</option>
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
