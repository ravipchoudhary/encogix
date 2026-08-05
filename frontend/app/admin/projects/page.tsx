"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { projectPath, slugifyTitle } from "../../../lib/slug";

interface Project {
  id: number;
  slug: string | null;
  title: string;
  description: string;
  image: string | null;
  category: string | null;
  client: string | null;
  technologies: string | null;
  project_url: string | null;
  industry: string | null;
  results: string | null;
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
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    client: "",
    technologies: "",
    project_url: "",
    industry: "",
    results: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
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
    setForm({ title: "", description: "", category: "", client: "", technologies: "", project_url: "", industry: "", results: "" });
    setImage(null);
    setModal({ open: true, project: null });
  };

  const openEdit = (project: Project) => {
    setForm({
      title: project.title || "",
      description: project.description || "",
      category: project.category || "",
      client: project.client || "",
      technologies: project.technologies || "",
      project_url: project.project_url || "",
      industry: project.industry || "",
      results: project.results || "",
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
    fd.append("client", form.client);
    fd.append("technologies", form.technologies);
    fd.append("project_url", form.project_url);
    fd.append("industry", form.industry);
    fd.append("results", form.results);
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
              {p.client && <p className="text-xs text-slate-500 mt-1">Client: {p.client}</p>}
              <p className="text-sm text-slate-600 mt-2 line-clamp-2">{p.description}</p>
              <a href={projectPath(p.slug, p.title)} target="_blank" rel="noopener noreferrer" className="text-xs text-secondary mt-2 inline-block">
                View public page →
              </a>
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
                <label className="label-field">Title</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="input-field" placeholder="Project title" />
                {form.title.trim() && (
                  <p className="text-xs text-slate-500 mt-1">
                    URL: <span className="font-mono text-secondary">{projectPath(slugifyTitle(form.title), form.title)}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="label-field">Category</label>
                <input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="input-field" placeholder="e.g. Fintech, Healthcare" />
              </div>
              <div>
                <label className="label-field">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={6}
                  className="input-field"
                  placeholder="Full project overview. Use blank lines between paragraphs."
                />
              </div>
              <div>
                <label className="label-field">Client</label>
                <input value={form.client} onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))} className="input-field" placeholder="Client or company name" />
              </div>
              <div>
                <label className="label-field">Technologies</label>
                <input value={form.technologies} onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))} className="input-field" placeholder="React, Node.js, AWS (comma-separated)" />
              </div>
              <div>
                <label className="label-field">Industry</label>
                <input value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} className="input-field" placeholder="Fintech, Healthcare, SaaS" />
              </div>
              <div>
                <label className="label-field">Results</label>
                <textarea
                  value={form.results}
                  onChange={(e) => setForm((f) => ({ ...f, results: e.target.value }))}
                  rows={3}
                  className="input-field"
                  placeholder="Key outcomes or metrics from this project"
                />
              </div>
              <div>
                <label className="label-field">Live project URL</label>
                <input value={form.project_url} onChange={(e) => setForm((f) => ({ ...f, project_url: e.target.value }))} className="input-field" placeholder="https://example.com" />
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
