"use client";

import { useState } from "react";

interface Job {
  id: number;
  title: string;
}

export default function JobApplyModal({
  job,
  onClose,
}: {
  job: Job;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", current_company: "", current_salary: "", expected_salary: "",
    experience: "", notice_period: "", message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("phone", form.phone);
    fd.append("current_company", form.current_company);
    fd.append("current_salary", form.current_salary);
    fd.append("expected_salary", form.expected_salary);
    fd.append("experience", form.experience);
    fd.append("notice_period", form.notice_period);
    fd.append("message", form.message + `\n[Applying for: ${job.title} (ID: ${job.id})]`);
    if (file) fd.append("resume", file);
    try {
      const res = await fetch("/api/jobs/apply", { method: "POST", body: fd });
      if (res.ok) {
        setStatus("ok");
        setTimeout(onClose, 1500);
      } else setStatus("err");
    } catch {
      setStatus("err");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 card-flat-3d" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-primary">Apply for {job.title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <form onSubmit={submit} className="form-group">
          <div>
            <label className="label-field">Name *</label>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" placeholder="Your full name" />
          </div>
          <div>
            <label className="label-field">Email *</label>
            <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input-field" placeholder="your@email.com" />
          </div>
          <div>
            <label className="label-field">Phone *</label>
            <input required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input-field" placeholder="+91 0000000000" />
          </div>
          <div>
            <label className="label-field">Current Company *</label>
            <input required value={form.current_company} onChange={(e) => setForm((f) => ({ ...f, current_company: e.target.value }))} className="input-field" placeholder="Company name (or Fresher)" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Current Salary (₹/LPA)</label>
              <input type="text" value={form.current_salary} onChange={(e) => setForm((f) => ({ ...f, current_salary: e.target.value }))} className="input-field" placeholder="e.g. 5 LPA" />
            </div>
            <div>
              <label className="label-field">Expected Salary (₹/LPA) *</label>
              <input required value={form.expected_salary} onChange={(e) => setForm((f) => ({ ...f, expected_salary: e.target.value }))} className="input-field" placeholder="e.g. 8 LPA" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Total Experience *</label>
              <input required value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} className="input-field" placeholder="e.g. 3 years" />
            </div>
            <div>
              <label className="label-field">Notice Period *</label>
              <select required value={form.notice_period} onChange={(e) => setForm((f) => ({ ...f, notice_period: e.target.value }))} className="input-field">
                <option value="">Select</option>
                <option value="Immediate">Immediate</option>
                <option value="15 days">15 days</option>
                <option value="1 month">1 month</option>
                <option value="2 months">2 months</option>
                <option value="3 months">3 months</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Resume *</label>
            <input required type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="file-input" />
          </div>
          <div>
            <label className="label-field">Message</label>
            <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={3} className="input-field" placeholder="Brief cover letter (optional)" />
          </div>
          <button type="submit" disabled={status === "sending"} className="btn-primary w-full">
            {status === "sending" ? "Submitting…" : "Submit Application"}
          </button>
          {status === "ok" && <p className="text-green-600 text-sm">Application submitted successfully.</p>}
          {status === "err" && <p className="text-red-600 text-sm">Something went wrong. Try again.</p>}
        </form>
      </div>
    </div>
  );
}
