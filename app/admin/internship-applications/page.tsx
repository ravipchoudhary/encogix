"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface InternshipApp {
  id: number;
  name: string;
  email: string;
  phone: string;
  internship_type: string;
  college: string;
  course: string;
  resume: string;
  message: string;
  created_at: string;
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { Authorization: `Bearer ${token}` };
}

export default function AdminInternshipApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<InternshipApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<InternshipApp | null>(null);

  const load = () => {
    fetch("/api/admin/internship-applications", { headers: authHeaders() })
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return [];
        }
        return r.json();
      })
      .then(setApplications)
      .catch(() => setApplications([]))
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
        <h1 className="text-2xl font-semibold text-primary">Internship Applications</h1>
      </div>
      {applications.length === 0 ? (
        <div className="card text-center py-12 text-slate-500">
          <p>No internship applications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
            <div
              key={a.id}
              className="card cursor-pointer hover:border-secondary/30"
              onClick={() => setSelected(a)}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-primary">{a.name}</h3>
                  <p className="text-sm text-slate-500">{a.email}</p>
                  <p className="text-sm text-slate-600 mt-1">{a.internship_type || "—"} • {a.college || "—"}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{a.created_at ? new Date(a.created_at).toLocaleDateString() : ""}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-primary">Application Details</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <p><span className="font-medium text-slate-600">Name:</span> {selected.name}</p>
              <p><span className="font-medium text-slate-600">Email:</span> <a href={`mailto:${selected.email}`} className="text-secondary">{selected.email}</a></p>
              <p><span className="font-medium text-slate-600">Phone:</span> {selected.phone || "—"}</p>
              <p><span className="font-medium text-slate-600">Area of Interest:</span> {selected.internship_type || "—"}</p>
              <p><span className="font-medium text-slate-600">College:</span> {selected.college || "—"}</p>
              <p><span className="font-medium text-slate-600">Course:</span> {selected.course || "—"}</p>
              {selected.resume && (
                <p>
                  <span className="font-medium text-slate-600">Resume:</span>{" "}
                  <a href={selected.resume} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">View/Download</a>
                </p>
              )}
              <p><span className="font-medium text-slate-600">Message:</span> {selected.message || "—"}</p>
              <p className="text-slate-500 text-xs">{selected.created_at ? new Date(selected.created_at).toLocaleString() : ""}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
