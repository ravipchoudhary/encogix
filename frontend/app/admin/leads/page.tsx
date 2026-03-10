"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { Authorization: `Bearer ${token}` };
}

export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/leads", { headers: authHeaders() })
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return [];
        }
        return r.json();
      })
      .then(setLeads)
      .catch(() => setLeads([]))
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

  if (loading) {
    return (
      <div className="section-padding container-page">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="section-padding container-page">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-primary">Contact Leads</h1>
      </div>
      {leads.length === 0 ? (
        <div className="card text-center py-12 text-slate-500">
          <p>No leads yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-3 font-medium text-slate-700">#</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Name</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Email</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Phone</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Message</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-3 px-3 text-sm text-slate-500">{l.id}</td>
                  <td className="py-3 px-3 font-medium text-primary">{l.name}</td>
                  <td className="py-3 px-3">
                    <a href={`mailto:${l.email}`} className="text-secondary hover:underline">{l.email}</a>
                  </td>
                  <td className="py-3 px-3">{l.phone || "—"}</td>
                  <td className="py-3 px-3 text-sm text-slate-600 max-w-xs truncate" title={l.message}>{l.message || "—"}</td>
                  <td className="py-3 px-3 text-sm text-slate-500">{l.created_at ? new Date(l.created_at).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
