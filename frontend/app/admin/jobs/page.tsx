"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Job {
  id: number;
  title: string;
  location: string;
  experience: string;
  description: string;
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { Authorization: `Bearer ${token}` };
}

export default function AdminJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; job: Job | null }>({ open: false, job: null });
  const [form, setForm] = useState({ title: "", location: "", experience: "", description: "" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    load();
  }, [router]);

  const openAdd = () => {
    setForm({ title: "", location: "", experience: "", description: "" });
    setModal({ open: true, job: null });
  };

  const openEdit = (job: Job) => {
    setForm({
      title: job.title || "",
      location: job.location || "",
      experience: job.experience || "",
      description: job.description || "",
    });
    setModal({ open: true, job });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = modal.job ? `/api/admin/jobs/${modal.job.id}` : "/api/admin/jobs";
    const method = modal.job ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setModal({ open: false, job: null });
        load();
      }
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this job?")) return;
    const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE", headers: authHeaders() });
    if (res.ok) load();
  };

  return (
    <div className="section-padding container-page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-primary">Manage Jobs</h1>
        <button onClick={openAdd} className="btn-primary">Add Job</button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : jobs.length === 0 ? (
        <div className="card text-center py-12 text-slate-500">
          <p>No jobs yet. Add your first job.</p>
          <button onClick={openAdd} className="btn-primary mt-3">Add Job</button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-2 font-medium text-slate-700">Title</th>
                <th className="text-left py-3 px-2 font-medium text-slate-700">Location</th>
                <th className="text-left py-3 px-2 font-medium text-slate-700">Experience</th>
                <th className="text-right py-3 px-2 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-b border-slate-100">
                  <td className="py-3 px-2">{j.title}</td>
                  <td className="py-3 px-2">{j.location || "—"}</td>
                  <td className="py-3 px-2">{j.experience || "—"}</td>
                  <td className="py-3 px-2 text-right">
                    <button onClick={() => openEdit(j)} className="text-secondary text-sm mr-2">Edit</button>
                    <button onClick={() => del(j.id)} className="text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModal({ open: false, job: null })}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-primary mb-4">{modal.job ? "Edit Job" : "Add Job"}</h2>
            <form onSubmit={save} className="form-group">
              <div>
                <label className="label-field">Title *</label>
                <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="input-field" placeholder="Job title" />
              </div>
              <div>
                <label className="label-field">Location</label>
                <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="input-field" placeholder="e.g. Noida, Remote" />
              </div>
              <div>
                <label className="label-field">Experience</label>
                <input value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} className="input-field" placeholder="e.g. 2-5 years" />
              </div>
              <div>
                <label className="label-field">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} className="input-field" placeholder="Job description and requirements" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save"}</button>
                <button type="button" onClick={() => setModal({ open: false, job: null })} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
