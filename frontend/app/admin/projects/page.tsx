"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string | null;
  category: string | null;
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { Authorization: `Bearer ${token}` };
}

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; project: Project | null }>({ open: false, project: null });
  const [form, setForm] = useState({ title: "", description: "", category: "" });
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => setProjects([]))
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
    setForm({ title: "", description: "", category: "" });
    setImage(null);
    setModal({ open: true, project: null });
  };

  const openEdit = (project: Project) => {
    setForm({
      title: project.title || "",
      description: project.description || "",
      category: project.category || "",
    });
    setImage(null);
    setModal({ open: true, project });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("category", form.category);
    if (image) fd.append("image", image);
    const url = modal.project ? `/api/admin/projects/${modal.project.id}` : "/api/admin/projects";
    const method = modal.project ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: fd,
      });
      if (res.ok) {
        setModal({ open: false, project: null });
        load();
      }
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE", headers: authHeaders() });
    if (res.ok) load();
  };

  return (
    <div className="section-padding container-page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-primary">Manage Projects</h1>
        <button onClick={openAdd} className="btn-primary">Add Project</button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : projects.length === 0 ? (
        <div className="card text-center py-12 text-slate-500">
          <p>No projects yet. Add your first project.</p>
          <button onClick={openAdd} className="btn-primary mt-3">Add Project</button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="card">
              {p.image && (
                <div className="h-32 -mx-6 -mt-6 mb-3 rounded-t-xl overflow-hidden bg-slate-100">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="font-medium text-primary">{p.title}</h3>
              {p.category && <span className="chip text-xs mt-1">{p.category}</span>}
              <p className="text-sm text-slate-600 mt-2 line-clamp-2">{p.description}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => openEdit(p)} className="text-secondary text-sm">Edit</button>
                <button onClick={() => del(p.id)} className="text-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={() => setModal({ open: false, project: null })}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 my-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-primary mb-4">{modal.project ? "Edit Project" : "Add Project"}</h2>
            <form onSubmit={save} className="form-group">
              <div>
                <label className="label-field">Title *</label>
                <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="input-field" placeholder="Project title" />
              </div>
              <div>
                <label className="label-field">Category</label>
                <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="input-field" placeholder="e.g. Fintech, Healthcare" />
              </div>
              <div>
                <label className="label-field">Description *</label>
                <textarea required value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} className="input-field" placeholder="Project description" />
              </div>
              <div>
                <label className="label-field">Image {modal.project ? "(leave empty to keep current)" : ""}</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="file-input" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save"}</button>
                <button type="button" onClick={() => setModal({ open: false, project: null })} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
