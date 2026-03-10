"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  image: string | null;
  created_at: string;
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { Authorization: `Bearer ${token}` };
}

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; blog: Blog | null }>({ open: false, blog: null });
  const [form, setForm] = useState({ title: "", content: "", author: "" });
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then(setBlogs)
      .catch(() => setBlogs([]))
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
    setForm({ title: "", content: "", author: "" });
    setImage(null);
    setModal({ open: true, blog: null });
  };

  const openEdit = (blog: Blog) => {
    setForm({
      title: blog.title || "",
      content: blog.content || "",
      author: blog.author || "",
    });
    setImage(null);
    setModal({ open: true, blog });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("content", form.content);
    fd.append("author", form.author);
    if (image) fd.append("image", image);
    const url = modal.blog ? `/api/admin/blogs/${modal.blog.id}` : "/api/admin/blogs";
    const method = modal.blog ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: fd,
      });
      if (res.ok) {
        setModal({ open: false, blog: null });
        load();
      }
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this blog post?")) return;
    const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE", headers: authHeaders() });
    if (res.ok) load();
  };

  return (
    <div className="section-padding container-page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-primary">Manage Blogs</h1>
        <button onClick={openAdd} className="btn-primary">Add Blog</button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : blogs.length === 0 ? (
        <div className="card text-center py-12 text-slate-500">
          <p>No blog posts yet. Add your first post.</p>
          <button onClick={openAdd} className="btn-primary mt-3">Add Blog</button>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map((b) => (
            <div key={b.id} className="card flex items-center justify-between gap-4">
              {b.image && (
                <div className="w-20 h-14 shrink-0 rounded overflow-hidden bg-slate-100">
                  <img src={b.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-primary">{b.title}</h3>
                <p className="text-sm text-slate-500">{b.author} • {b.created_at ? new Date(b.created_at).toLocaleDateString() : ""}</p>
              </div>
              <div>
                <button onClick={() => openEdit(b)} className="text-secondary text-sm mr-3">Edit</button>
                <button onClick={() => del(b.id)} className="text-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={() => setModal({ open: false, blog: null })}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-primary mb-4">{modal.blog ? "Edit Blog" : "Add Blog"}</h2>
            <form onSubmit={save} className="form-group">
              <div>
                <label className="label-field">Title *</label>
                <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="input-field" placeholder="Blog title" />
              </div>
              <div>
                <label className="label-field">Author</label>
                <input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} className="input-field" placeholder="Author name" />
              </div>
              <div>
                <label className="label-field">Featured Image {modal.blog ? "(leave empty to keep current)" : ""}</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="file-input" />
              </div>
              <div>
                <label className="label-field">Content *</label>
                <textarea required value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={12} className="input-field" placeholder="Write your blog content..." />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save"}</button>
                <button type="button" onClick={() => setModal({ open: false, blog: null })} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
