"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function empAuthHeaders() {
  return { Authorization: "Bearer " + (typeof window !== "undefined" ? localStorage.getItem("employee_token") : "") };
}

export default function EmployeeLeavePage() {
  const router = useRouter();
  const [leaves, setLeaves] = useState<{ id: number; from_date: string; to_date: string; reason: string; status: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ from_date: "", to_date: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    fetch("/api/employee/leave", { headers: empAuthHeaders() })
      .then((r) => {
        if (r.status === 401) {
          router.replace("/employee/login");
          return [] as { id: number; from_date: string; to_date: string; reason: string; status: string; created_at: string }[];
        }
        return r.json();
      })
      .then(setLeaves)
      .catch(() => [])
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/employee/leave", { method: "POST", headers: { ...empAuthHeaders(), "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      setForm({ from_date: "", to_date: "", reason: "" });
      load();
    } else alert((await res.json()).message || "Failed");
    setSubmitting(false);
  };

  if (loading) return <div className="section-padding container-page"><p className="text-slate-500">Loading…</p></div>;

  return (
    <div className="section-padding container-page">
      <h1 className="text-2xl font-semibold text-primary mb-6">Leave Request</h1>
      <div className="card-flat max-w-md mb-8">
        <h2 className="font-semibold text-primary mb-4">Apply for Leave</h2>
        <form onSubmit={submit} className="form-group">
          <div><label className="label-field">From Date *</label><input type="date" required value={form.from_date} onChange={(e) => setForm((f) => ({ ...f, from_date: e.target.value }))} className="input-field" /></div>
          <div><label className="label-field">To Date *</label><input type="date" required value={form.to_date} onChange={(e) => setForm((f) => ({ ...f, to_date: e.target.value }))} className="input-field" /></div>
          <div><label className="label-field">Reason</label><textarea value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} className="input-field" rows={3} placeholder="Reason for leave" /></div>
          <button type="submit" disabled={submitting} className="btn-primary">{submitting ? "Submitting…" : "Submit Request"}</button>
        </form>
      </div>
      <h2 className="font-semibold text-primary mb-4">My Leave History</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left py-3 px-3 font-medium text-slate-700">From</th>
              <th className="text-left py-3 px-3 font-medium text-slate-700">To</th>
              <th className="text-left py-3 px-3 font-medium text-slate-700">Reason</th>
              <th className="text-left py-3 px-3 font-medium text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? <tr><td colSpan={4} className="py-8 text-center text-slate-500">No leave requests</td></tr> : leaves.map((l) => (
              <tr key={l.id} className="border-b border-slate-100">
                <td className="py-3 px-3">{l.from_date}</td>
                <td className="py-3 px-3">{l.to_date}</td>
                <td className="py-3 px-3 text-sm">{l.reason || "—"}</td>
                <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${l.status === "approved" ? "bg-green-100 text-green-700" : l.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{l.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
