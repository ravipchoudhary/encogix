"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function empAuthHeaders() {
  return { Authorization: "Bearer " + (typeof window !== "undefined" ? localStorage.getItem("employee_token") : "") };
}

interface Profile {
  id: number;
  employee_id: string;
  name: string;
  username: string | null;
  email: string;
  phone: string;
  designation: string;
  dob: string | null;
  join_date: string | null;
  created_at: string;
}

interface Celebration {
  id: number;
  name: string;
  employee_id: string;
  dob?: string;
  join_date?: string;
}

export default function EmployeeProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", phone: "", dob: "" });
  const [saving, setSaving] = useState(false);
  const [celebrations, setCelebrations] = useState<{ birthdays: Celebration[]; anniversaries: Celebration[] }>({ birthdays: [], anniversaries: [] });
  const [greetModal, setGreetModal] = useState<{ emp: Celebration; occasion: string } | null>(null);
  const [greetMsg, setGreetMsg] = useState("");
  const [myGreetings, setMyGreetings] = useState<{ from_name: string; occasion: string; message: string; created_at: string }[]>([]);

  const load = () => {
    fetch("/api/employee/profile", { headers: empAuthHeaders() })
      .then((r) => {
        if (r.status === 401) router.replace("/employee/login");
        return r.json();
      })
      .then((d) => {
        setProfile(d);
        if (d) setForm({ username: d.username || "", email: d.email || "", phone: d.phone || "", dob: d.dob || "" });
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));

    fetch("/api/employee/celebrations", { headers: empAuthHeaders() })
      .then((r) => (r.ok ? r.json() : {}))
      .then(setCelebrations)
      .catch(() => {});

    fetch("/api/employee/greetings?to=me", { headers: empAuthHeaders() })
      .then((r) => (r.ok ? r.json() : []))
      .then(setMyGreetings)
      .catch(() => []);
  };

  useEffect(() => {
    load();
  }, [router]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/employee/profile", {
      method: "PUT",
      headers: { ...empAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setEditMode(false);
      load();
    }
    setSaving(false);
  };

  const sendGreet = async () => {
    if (!greetModal) return;
    const res = await fetch("/api/employee/greet", {
      method: "POST",
      headers: { ...empAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ to_employee_id: greetModal.emp.id, occasion: greetModal.occasion, message: greetMsg }),
    });
    if (res.ok) {
      setGreetModal(null);
      setGreetMsg("");
      load();
    }
  };


  if (loading || !profile) return <div className="section-padding container-page"><p className="text-slate-500">Loading…</p></div>;

  return (
    <div className="section-padding container-page max-w-4xl">
      <h1 className="text-2xl font-semibold text-primary mb-6">My Profile</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-flat">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-semibold text-primary">Personal Details</h2>
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="text-secondary text-sm font-medium">Edit</button>
              ) : (
                <button onClick={() => setEditMode(false)} className="text-slate-500 text-sm">Cancel</button>
              )}
            </div>
            {editMode ? (
              <form onSubmit={saveProfile} className="form-group">
                <div><label className="label-field">Username (for chat)</label><input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} className="input-field" placeholder="Display name in chat" /></div>
                <div><label className="label-field">Email *</label><input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input-field" required /></div>
                <div><label className="label-field">Phone</label><input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input-field" placeholder="+91 0000000000" /></div>
                <div><label className="label-field">Date of Birth</label><input type="date" value={form.dob} onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))} className="input-field" /></div>
                <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save"}</button>
              </form>
            ) : (
              <div className="space-y-4">
                <div><span className="text-sm text-slate-500 block">Employee ID</span><p className="font-medium">{profile.employee_id}</p></div>
                <div><span className="text-sm text-slate-500 block">Name</span><p className="font-medium">{profile.name}</p></div>
                <div><span className="text-sm text-slate-500 block">Username</span><p className="font-medium">{profile.username || "—"}</p></div>
                <div><span className="text-sm text-slate-500 block">Email</span><p className="font-medium">{profile.email || "—"}</p></div>
                <div><span className="text-sm text-slate-500 block">Phone</span><p className="font-medium">{profile.phone || "—"}</p></div>
                <div><span className="text-sm text-slate-500 block">Designation</span><p className="font-medium">{profile.designation || "—"}</p></div>
                <div><span className="text-sm text-slate-500 block">Date of Birth</span><p className="font-medium">{profile.dob ? new Date(profile.dob).toLocaleDateString() : "—"}</p></div>
                <div><span className="text-sm text-slate-500 block">Work Anniversary</span><p className="font-medium">{profile.join_date ? new Date(profile.join_date).toLocaleDateString() : "—"}</p></div>
              </div>
            )}
          </div>

          <div className="card-flat">
            <h2 className="font-semibold text-primary mb-4">🎂 Birthdays & Work Anniversaries</h2>
            <p className="text-sm text-slate-600 mb-4">Send wishes to colleagues celebrating today!</p>
            <div className="space-y-4">
              {celebrations.birthdays.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Birthdays Today</h3>
                  <div className="space-y-2">
                    {celebrations.birthdays.map((e) => (
                      <div key={e.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-pink-50">
                        <span className="font-medium">{e.name}</span>
                        <button onClick={() => setGreetModal({ emp: e, occasion: "birthday" })} className="text-sm text-secondary font-medium hover:underline">Send wish</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {celebrations.anniversaries.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Work Anniversaries Today</h3>
                  <div className="space-y-2">
                    {celebrations.anniversaries.map((e) => (
                      <div key={e.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-blue-50">
                        <span className="font-medium">{e.name}</span>
                        <button onClick={() => setGreetModal({ emp: e, occasion: "work_anniversary" })} className="text-sm text-secondary font-medium hover:underline">Send wish</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {celebrations.birthdays.length === 0 && celebrations.anniversaries.length === 0 && (
                <p className="text-slate-500 text-sm">No birthdays or work anniversaries today.</p>
              )}
            </div>
          </div>

          {myGreetings.length > 0 && (
            <div className="card-flat">
              <h2 className="font-semibold text-primary mb-4">Greetings for you</h2>
              <div className="space-y-3">
                {myGreetings.map((g, i) => (
                  <div key={i} className="py-2 px-3 rounded-lg bg-slate-50">
                    <p className="font-medium text-primary text-sm">{g.from_name} · {g.occasion === "birthday" ? "Birthday" : "Work Anniversary"}</p>
                    <p className="text-slate-700 mt-1">{g.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(g.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {greetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setGreetModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-primary mb-2">
              {greetModal.occasion === "birthday" ? "Birthday" : "Work Anniversary"} wish for {greetModal.emp.name}
            </h2>
            <textarea value={greetMsg} onChange={(e) => setGreetMsg(e.target.value)} className="input-field mt-2" rows={3} placeholder="Write your message..." />
            <div className="flex gap-2 mt-4">
              <button onClick={sendGreet} className="btn-primary">Send</button>
              <button onClick={() => setGreetModal(null)} className="btn-outline">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
