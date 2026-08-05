"use client";

import { useState } from "react";

export default function TestimonialPage() {
  const [form, setForm] = useState({ name: "", company: "", designation: "", rating: "5", text: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          designation: form.designation,
          rating: Number(form.rating),
          text: form.text,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("success");
      setForm({ name: "", company: "", designation: "", rating: "5", text: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="section-padding container-page">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <p className="chip mb-4 inline-flex">Client Review</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">Share your experience</h1>
          <p className="mt-3 text-slate-600">Send your testimonial to Encogix and it will appear on the website after admin approval.</p>
        </div>

        <form onSubmit={submit} className="card card-3d block-3d p-8 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="input-field"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="label-field">Company</label>
              <input
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="input-field"
                placeholder="Company name"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Designation</label>
              <input
                value={form.designation}
                onChange={(e) => handleChange("designation", e.target.value)}
                className="input-field"
                placeholder="Your role"
              />
            </div>
            <div>
              <label className="label-field">Rating</label>
              <select
                value={form.rating}
                onChange={(e) => handleChange("rating", e.target.value)}
                className="input-field"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>{value} stars</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label-field">Testimonial *</label>
            <textarea
              required
              rows={6}
              value={form.text}
              onChange={(e) => handleChange("text", e.target.value)}
              className="input-field"
              placeholder="Write your review here"
            />
          </div>

          <button type="submit" disabled={status === "sending"} className="btn-primary w-full">
            {status === "sending" ? "Sending…" : "Submit Testimonial"}
          </button>

          {status === "success" && (
            <p className="text-sm text-emerald-600">Thank you! Your testimonial has been submitted for review.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600">Something went wrong. Please try again later.</p>
          )}
        </form>
      </div>
    </div>
  );
}
