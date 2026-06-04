"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { employeeAuthHeaders, getEmployeeToken, isTokenValid } from "../../../lib/auth";

interface Lead {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  status: string;
  notes: string | null;
  source: string | null;
  createdAt: string;
}

const STATUSES = ["new", "contacted", "qualified", "won", "lost"];

export default function EmployeeLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/employee/leads", { headers: employeeAuthHeaders() })
      .then((r) => {
        if (r.status === 401) {
          router.push("/employee/login");
          return [];
        }
        return r.json();
      })
      .then(setLeads)
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isTokenValid(getEmployeeToken(), "employee")) {
      router.push("/employee/login");
      return;
    }
    load();
  }, [router]);

  const updateLead = async (id: number, status: string, notes: string) => {
    await fetch(`/api/employee/leads/${id}`, {
      method: "PUT",
      headers: { ...employeeAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    load();
  };

  if (loading) {
    return (
      <div className="section-padding container-page">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="section-padding container-page">
      <h1 className="text-2xl font-semibold text-primary mb-6">My Assigned Leads</h1>
      {leads.length === 0 ? (
        <div className="card text-center py-12 text-slate-500">
          <p>No leads assigned yet. Contact your admin.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((l) => (
            <div key={l.id} className="card space-y-3">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-semibold text-primary">{l.name || "—"}</p>
                  <p className="text-sm text-slate-500">{l.email} · {l.phone || "—"}</p>
                  {l.source && <span className="chip text-xs mt-1">{l.source}</span>}
                </div>
                <select
                  className="input-field w-auto text-sm"
                  value={l.status}
                  onChange={(e) => updateLead(l.id, e.target.value, l.notes || "")}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-slate-600">{l.message}</p>
              <textarea
                className="input-field text-sm"
                rows={2}
                placeholder="Follow-up notes…"
                defaultValue={l.notes || ""}
                onBlur={(e) => updateLead(l.id, l.status, e.target.value)}
              />
              <p className="text-xs text-slate-400">
                {l.createdAt ? new Date(l.createdAt).toLocaleString() : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
