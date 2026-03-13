"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLocation } from "../../../lib/geo";

function empAuthHeaders() {
  return { Authorization: "Bearer " + (typeof window !== "undefined" ? localStorage.getItem("employee_token") : "") };
}

export default function EmployeeAttendancePage() {
  const router = useRouter();
  const [today, setToday] = useState<{ punch_in: string | null; punch_out: string | null; punch_in_location?: string | null; punch_out_location?: string | null } | null>(null);
  const [attendance, setAttendance] = useState<{ date: string; punch_in: string; punch_out: string | null; punch_in_location?: string | null; punch_out_location?: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/employee/today", { headers: empAuthHeaders() }).then((r) => r.status === 401 ? router.replace("/employee/login") || null : r.json()).then(setToday);
    fetch("/api/employee/attendance", { headers: empAuthHeaders() })
      .then((r) => (r.status === 401 ? [] : r.json()))
      .then(setAttendance)
      .catch(() => [])
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [router]);

  const punchIn = async () => {
    const loc = await getLocation();
    const body = loc ? JSON.stringify({ latitude: loc.latitude, longitude: loc.longitude }) : "{}";
    const res = await fetch("/api/employee/punch-in", { method: "POST", headers: { ...empAuthHeaders(), "Content-Type": "application/json" }, body });
    if (res.ok) load(); else alert((await res.json()).message || "Failed");
  };
  const punchOut = async () => {
    const loc = await getLocation();
    const body = loc ? JSON.stringify({ latitude: loc.latitude, longitude: loc.longitude }) : "{}";
    const res = await fetch("/api/employee/punch-out", { method: "POST", headers: { ...empAuthHeaders(), "Content-Type": "application/json" }, body });
    if (res.ok) load(); else alert((await res.json()).message || "Failed");
  };

  if (loading) return <div className="section-padding container-page"><p className="text-slate-500">Loading…</p></div>;

  const canPunchIn = !today?.punch_in;
  const canPunchOut = today?.punch_in && !today?.punch_out;

  return (
    <div className="section-padding container-page">
      <h1 className="text-2xl font-semibold text-primary mb-6">Attendance</h1>
      <div className="card-flat mb-8 text-center py-8">
        <h2 className="text-lg font-semibold text-primary mb-2">Today</h2>
        <p className="text-sm text-slate-500 mb-4">{new Date().toLocaleDateString("en-IN", { weekday: "long", date: "numeric", month: "long", year: "numeric" })}</p>
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <div className="px-6 py-3 rounded-xl bg-slate-100">
            <p className="text-xs text-slate-500">Punch In</p>
            <p className="font-mono font-semibold">{today?.punch_in ? new Date(today.punch_in).toLocaleTimeString() : "—"}</p>
          </div>
          <div className="px-6 py-3 rounded-xl bg-slate-100">
            <p className="text-xs text-slate-500">Punch Out</p>
            <p className="font-mono font-semibold">{today?.punch_out ? new Date(today.punch_out).toLocaleTimeString() : "—"}</p>
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <button onClick={punchIn} disabled={!canPunchIn} className="btn-primary disabled:opacity-50">Punch In</button>
          <button onClick={punchOut} disabled={!canPunchOut} className="btn-outline disabled:opacity-50">Punch Out</button>
        </div>
      </div>
      <h2 className="font-semibold text-primary mb-4">Last 30 Days</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left py-3 px-3 font-medium text-slate-700">Date</th>
              <th className="text-left py-3 px-3 font-medium text-slate-700">Punch In</th>
              <th className="text-left py-3 px-3 font-medium text-slate-700">Punch Out</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? <tr><td colSpan={3} className="py-8 text-center text-slate-500">No records</td></tr> : attendance.map((a) => (
              <tr key={a.date} className="border-b border-slate-100">
                <td className="py-3 px-3">{new Date(a.date).toLocaleDateString()}</td>
                <td className="py-3 px-3 font-mono text-sm">{a.punch_in ? new Date(a.punch_in).toLocaleTimeString() : "—"}{a.punch_in_location && <><br /><span className="text-xs text-slate-500" title={a.punch_in_location}>📍 {a.punch_in_location}</span></>}</td>
                <td className="py-3 px-3 font-mono text-sm">{a.punch_out ? new Date(a.punch_out).toLocaleTimeString() : "—"}{a.punch_out_location && <><br /><span className="text-xs text-slate-500" title={a.punch_out_location}>📍 {a.punch_out_location}</span></>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
