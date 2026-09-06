"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AttendanceRow {
  id: number;
  employee_id: string;
  date: string;
  punch_in: string;
  punch_out: string | null;
  name: string;
  designation: string;
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { Authorization: `Bearer ${token}` };
}

export default function AdminAttendancePage() {
  const router = useRouter();
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/attendance", { headers: authHeaders() })
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return [];
        }
        return r.json();
      })
      .then(setRows)
      .catch(() => setRows([]))
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
      <h1 className="text-2xl font-semibold text-primary mb-6">Attendance</h1>
      {rows.length === 0 ? (
        <div className="card text-center py-12 text-slate-500">
          <p>No attendance records yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-3 px-3 font-medium text-slate-700">Date</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Employee ID</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Name</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Designation</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Punch In</th>
                <th className="text-left py-3 px-3 font-medium text-slate-700">Punch Out</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-3 px-3">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="py-3 px-3 font-medium">{r.employee_id}</td>
                  <td className="py-3 px-3">{r.name}</td>
                  <td className="py-3 px-3 text-slate-600">{r.designation || "—"}</td>
                  <td className="py-3 px-3 font-mono text-sm">{r.punch_in ? new Date(r.punch_in).toLocaleTimeString() : "—"}</td>
                  <td className="py-3 px-3 font-mono text-sm">{r.punch_out ? new Date(r.punch_out).toLocaleTimeString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
