"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminAuthHeaders, getAdminToken, isTokenValid } from "../../../lib/auth";

interface Employee {
  id: number;
  name: string;
  employee_id: string;
}

interface Lead {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  status: string;
  source: string | null;
  notes: string | null;
  assignedEmployeeId: number | null;
  createdAt: string;
  assignedEmployee?: { id: number; name: string; employeeId: string } | null;
}

const STATUSES = ["new", "contacted", "qualified", "won", "lost"];

export default function AdminLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([
      fetch("/api/admin/leads", { headers: adminAuthHeaders() }),
      fetch("/api/admin/employees", { headers: adminAuthHeaders() }),
    ])
      .then(async ([lr, er]) => {
        if (lr.status === 401) {
          router.push("/admin/login");
          return;
        }
        const leadsData = await lr.json();
        const empData = er.ok ? await er.json() : [];
        setLeads(leadsData);
        setEmployees(empData);
      })
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isTokenValid(getAdminToken(), "admin")) {
      router.push("/admin/login");
      return;
    }
    load();
  }, [router]);

  const updateLead = async (id: number, data: { status?: string; assignedEmployeeId?: number | null; notes?: string }) => {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PUT",
      headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
      <h1 className="text-2xl font-semibold text-primary mb-6">Leads & Inquiries</h1>
      {leads.length === 0 ? (
        <div className="card text-center py-12 text-slate-500">
          <p>No leads yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-2 font-medium">Name</th>
                <th className="text-left py-3 px-2 font-medium">Contact</th>
                <th className="text-left py-3 px-2 font-medium">Source</th>
                <th className="text-left py-3 px-2 font-medium">Status</th>
                <th className="text-left py-3 px-2 font-medium">Assign</th>
                <th className="text-left py-3 px-2 font-medium">Message</th>
                <th className="text-left py-3 px-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 align-top">
                  <td className="py-3 px-2 font-medium">{l.name || "—"}</td>
                  <td className="py-3 px-2">
                    <a href={`mailto:${l.email}`} className="text-secondary block">{l.email}</a>
                    {l.phone}
                  </td>
                  <td className="py-3 px-2">{l.source || "contact"}</td>
                  <td className="py-3 px-2">
                    <select
                      className="input-field text-xs py-1"
                      value={l.status}
                      onChange={(e) => updateLead(l.id, { status: e.target.value })}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <select
                      className="input-field text-xs py-1"
                      value={l.assignedEmployeeId ?? ""}
                      onChange={(e) =>
                        updateLead(l.id, {
                          assignedEmployeeId: e.target.value ? parseInt(e.target.value, 10) : null,
                        })
                      }
                    >
                      <option value="">Unassigned</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.employee_id})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-2 max-w-xs truncate" title={l.message || ""}>{l.message || "—"}</td>
                  <td className="py-3 px-2 text-slate-500 whitespace-nowrap">
                    {l.createdAt ? new Date(l.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
