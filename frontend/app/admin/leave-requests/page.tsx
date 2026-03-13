"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LeaveRow {
  id: number;
  employee_id: string;
  name: string;
  designation: string;
  from_date: string;
  to_date: string;
  reason: string;
  status: string;
  created_at: string;
}

function authHeaders() {
  return { Authorization: "Bearer " + (typeof window !== "undefined" ? localStorage.getItem("admin_token") : "") };
}

export default function AdminLeaveRequestsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<LeaveRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/leave-requests", { headers: authHeaders() })
      .then((r) => (r.status === 401 ? router.push("/admin/login") || [] : r.json()))
      .then(setRows)
      .catch(() => [])
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) router.push("/admin/login");
    else load();
  }, [router]);

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch("/api/admin/leave-requests/" + id, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) load();
  };

  if (loading) return <div className="section-padding container-page"><p className="text-slate-500">Loading…</p></div>;

  return (
    <div className="section-padding container-page">
      <h1 className="text-2xl font-semibold text-primary mb-6">Leave Requests</h1>
      {rows.length === 0 ? (
        <div className="card text-center py-12 text-slate-500">No leave requests.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-3 font-medium text-slate-700">Employee</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Designation</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">From</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">To</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Reason</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Status</th>
                <th className="text-right py-3 px-3 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="py-3 px-3"><span className="font-medium">{r.name}</span><span className="text-slate-500 text-sm block">{r.employee_id}</span></td>
                  <td className="py-3 px-3">{r.designation || "—"}</td>
                  <td className="py-3 px-3">{r.from_date}</td>
                  <td className="py-3 px-3">{r.to_date}</td>
                  <td className="py-3 px-3 text-sm">{r.reason || "—"}</td>
                  <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${r.status === "approved" ? "bg-green-100 text-green-700" : r.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{r.status}</span></td>
                  <td className="py-3 px-3 text-right">
                    {r.status === "pending" && (
                      <>
                        <button onClick={() => updateStatus(r.id, "approved")} className="text-green-600 text-sm mr-2">Approve</button>
                        <button onClick={() => updateStatus(r.id, "rejected")} className="text-red-600 text-sm">Reject</button>
                      </>
                    )}
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
