"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

function authHeaders() {
  return { Authorization: "Bearer " + (typeof window !== "undefined" ? localStorage.getItem("admin_token") : "") };
}

export default function AdminAnnouncementsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const r = await fetch("/api/admin/announcements", {
        headers: authHeaders(),
      });
  
      if (r.status === 401) {
        router.push("/admin/login");
        return;
      }
  
      const data = await r.json();
      setItems(data);
    } catch (err) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) router.push("/admin/login");
    else load();
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ title: "", content: "" });
      setModal(false);
      load();
    }
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete this announcement?")) return;
    const res = await fetch("/api/admin/announcements/" + id, { method: "DELETE", headers: authHeaders() });
    if (res.ok) load();
  };

  if (loading) return <div className="section-padding container-page"><p className="text-slate-500">Loading…</p></div>;

  return (
    <div className="section-padding container-page">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold text-primary">Announcements</h1>
        <button onClick={() => setModal(true)} className="btn-primary">Add Announcement</button>
      </div>
      {items.length === 0 ? (
        <div className="card text-center py-12 text-slate-500">
          <p>No announcements. Add one for employees to see.</p>
          <button onClick={() => setModal(true)} className="btn-primary mt-3">Add Announcement</button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((a) => (
            <div key={a.id} className="card-flat flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-primary">{a.title}</h3>
                <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{a.content}</p>
                <p className="text-xs text-slate-400 mt-2">{new Date(a.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => del(a.id)} className="text-red-600 text-sm">Delete</button>
            </div>
          ))}
        </div>
      )}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-primary mb-4">Add Announcement</h2>
            <form onSubmit={submit} className="form-group">
              <div><label className="label-field">Title *</label><input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="input-field" /></div>
              <div><label className="label-field">Content</label><textarea value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} className="input-field" rows={4} /></div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save"}</button>
                <button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
