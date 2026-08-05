"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminAuthHeaders, getAdminToken, isTokenValid } from "../../../lib/auth";

interface Testimonial {
  id: number;
  name: string;
  company: string | null;
  designation: string | null;
  rating: number;
  text: string;
  active: boolean;
  sortOrder: number;
}

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/testimonials", { headers: adminAuthHeaders() })
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return [];
        }
        return res.json();
      })
      .then((data) => setTestimonials(data || []))
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isTokenValid(getAdminToken(), "admin")) {
      router.push("/admin/login");
      return;
    }
    load();
  }, [router]);

  const update = async (id: number, data: { active?: boolean; sortOrder?: number }) => {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PUT",
      headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "DELETE",
      headers: adminAuthHeaders(),
    });
    load();
  };

  if (loading) {
    return (
      <div className="section-padding container-page">
        <p className="text-slate-500">Loading testimonials…</p>
      </div>
    );
  }

  return (
    <div className="section-padding container-page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Testimonials</h1>
          <p className="text-sm text-slate-600">Approve, sort, or remove customer reviews shown on the website.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-3 px-3 font-medium">Name</th>
              <th className="text-left py-3 px-3 font-medium">Company / Role</th>
              <th className="text-left py-3 px-3 font-medium">Rating</th>
              <th className="text-left py-3 px-3 font-medium">Text</th>
              <th className="text-left py-3 px-3 font-medium">Visible</th>
              <th className="text-left py-3 px-3 font-medium">Sort</th>
              <th className="text-left py-3 px-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 align-top">
                <td className="py-3 px-3 font-medium">{item.name}</td>
                <td className="py-3 px-3 text-slate-600">
                  {item.company || "—"}
                  {item.designation ? ` · ${item.designation}` : ""}
                </td>
                <td className="py-3 px-3">{item.rating}★</td>
                <td className="py-3 px-3 max-w-xl truncate" title={item.text}>{item.text}</td>
                <td className="py-3 px-3">
                  <button
                    onClick={() => update(item.id, { active: !item.active })}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${item.active ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {item.active ? "Approved" : "Pending"}
                  </button>
                </td>
                <td className="py-3 px-3">
                  <input
                    type="number"
                    value={item.sortOrder}
                    className="input-field w-24 text-xs"
                    onChange={(e) => update(item.id, { sortOrder: Number(e.target.value) })}
                  />
                </td>
                <td className="py-3 px-3">
                  <button onClick={() => remove(item.id)} className="text-sm text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
