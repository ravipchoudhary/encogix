"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function empAuthHeaders() {
  return { Authorization: "Bearer " + (typeof window !== "undefined" ? localStorage.getItem("employee_token") : "") };
}

export default function EmployeeAnnouncementsPage() {
  const router = useRouter();
  const [items, setItems] = useState<{ id: number; title: string; content: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/employee/announcements", { headers: empAuthHeaders() })
      .then((r) => (r.status === 401 ? router.replace("/employee/login") || [] : r.json()))
      .then(setItems)
      .catch(() => [])
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="section-padding container-page"><p className="text-slate-500">Loading…</p></div>;

  return (
    <div className="section-padding container-page">
      <h1 className="text-2xl font-semibold text-primary mb-6">Announcements</h1>
      {items.length === 0 ? (
        <div className="card text-center py-12 text-slate-500">No announcements yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map((a) => (
            <div key={a.id} className="card-flat">
              <h3 className="font-semibold text-primary">{a.title}</h3>
              <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{a.content}</p>
              <p className="text-xs text-slate-400 mt-2">{new Date(a.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
