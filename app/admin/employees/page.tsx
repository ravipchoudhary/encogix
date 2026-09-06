"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Employee {
  id: number;
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  dob: string | null;
  join_date: string | null;
  created_at: string;
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { Authorization: "Bearer " + token };
}

export default function AdminEmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; employee: Employee | null }>({ open: false, employee: null });
  const [form, setForm] = useState({ employee_id: "", name: "", email: "", phone: "", designation: "", password: "", dob: "", join_date: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => {
    fetch("/api/admin/employees", { headers: authHeaders() })
      .then((r) => {
        if (r.status === 401) { router.push("/admin/login"); return []; }
        return r.json();
      })
      .then(setEmployees)
      .catch(() => setEmployees([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) router.push("/admin/login");
    else load();
  }, [router]);

  const openAdd = () => {
    setForm({ employee_id: "", name: "", email: "", phone: "", designation: "", password: "", dob: "", join_date: "" });
    setModal({ open: true, employee: null });
    setMessage("");
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const url = modal.employee ? "/api/admin/employees/" + modal.employee.id : "/api/admin/employees";
    const method = modal.employee ? "PUT" : "POST";
    const body: Record<string, unknown> = { name: form.name, email: form.email, phone: form.phone, designation: form.designation, dob: form.dob || null, join_date: form.join_date || null };
    if (!modal.employee) body.employee_id = form.employee_id;
    if (form.password) body.password = form.password;
    try {
      const res = await fetch(url, { method, headers: { ...authHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) {
        setModal({ open: false, employee: null });
        load();
      } else setMessage(data.message || "Failed");
    } catch {
      setMessage("Error");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this employee?")) return;
    const res = await fetch("/api/admin/employees/" + id, { method: "DELETE", headers: authHeaders() });
    if (res.ok) load();
  };

  if (loading) return <div className="section-padding container-page"><p className="text-slate-500">Loading…</p></div>;

  return (
    <div className="section-padding container-page">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold text-primary">Employees</h1>
        <button onClick={openAdd} className="btn-primary">Add Employee</button>
      </div>
      {employees.length === 0 ? (
        <div className="card text-center py-12 text-slate-500">
          <p>No employees yet.</p>
          <button onClick={openAdd} className="btn-primary mt-3">Add Employee</button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-3 font-medium text-slate-700">#</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Employee ID</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Name</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Email</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Phone</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Designation</th>
                <th className="text-right py-3 px-3 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-3 px-3 text-slate-500">{e.id}</td>
                  <td className="py-3 px-3 font-medium text-primary">{e.employee_id}</td>
                  <td className="py-3 px-3">{e.name}</td>
                  <td className="py-3 px-3 text-sm">{e.email || "—"}</td>
                  <td className="py-3 px-3 text-sm">{e.phone || "—"}</td>
                  <td className="py-3 px-3">{e.designation || "—"}</td>
                  <td className="py-3 px-3 text-right">
                    <button onClick={() => { setForm({ ...e, employee_id: e.employee_id, password: "", dob: e.dob || "", join_date: e.join_date || "" }); setModal({ open: true, employee: e }); setMessage(""); }} className="text-secondary text-sm mr-2">Edit</button>
                    <button onClick={() => del(e.id)} className="text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" onClick={() => setModal({ open: false, employee: null })}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-primary mb-4">{modal.employee ? "Edit Employee" : "Add Employee"}</h2>
            <form onSubmit={save} className="form-group space-y-4">
              {!modal.employee && (
                <div>
                  <label className="label-field">Employee ID *</label>
                  <input required value={form.employee_id} onChange={(e) => setForm((f) => ({ ...f, employee_id: e.target.value }))} className="input-field" placeholder="e.g. EMP001" />
                </div>
              )}
              <div>
                <label className="label-field">Name *</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" placeholder="Full name" />
              </div>
              <div>
                <label className="label-field">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input-field" placeholder="email@example.com" />
              </div>
              <div>
                <label className="label-field">Phone</label>
                <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input-field" placeholder="+91 0000000000" />
              </div>
              <div>
                <label className="label-field">Designation</label>
                <input value={form.designation} onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))} className="input-field" placeholder="e.g. Developer" />
              </div>
              <div>
                <label className="label-field">Date of Birth</label>
                <input type="date" value={form.dob} onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="label-field">Join Date (Work Anniversary)</label>
                <input type="date" value={form.join_date} onChange={(e) => setForm((f) => ({ ...f, join_date: e.target.value }))} className="input-field" />
              </div>
              <div>
                <label className="label-field">Password {modal.employee ? "(leave empty to keep)" : "*"}</label>
                <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="input-field" placeholder="Min 6 chars" required={!modal.employee} />
              </div>
              {message && <p className="text-red-600 text-sm">{message}</p>}
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save"}</button>
                <button type="button" onClick={() => setModal({ open: false, employee: null })} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
