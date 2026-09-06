"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminAuthHeaders, getAdminToken, isTokenValid } from "../../../lib/auth";

const STAT_ICONS: Record<string, string> = {
  "Total Leads": "📋",
  "Job Applications": "💼",
  "Internship Applications": "🎓",
  "Blog Posts": "📝",
  "Projects": "🚀",
  "Employees": "👥",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isTokenValid(getAdminToken(), "admin")) {
      router.push("/admin/login");
      return;
    }
    fetch("/api/admin/stats", { headers: adminAuthHeaders() })
      .then((r) => {
        if (r.status === 401) { router.push("/admin/login"); return null; }
        return r.json();
      })
      .then((data) => data && setStats(data))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading || !stats) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading dashboard…</div>
      </div>
    );
  }

  const cards = [
    { label: "Total Leads", value: stats.totalLeads, href: "/admin/leads" },
    { label: "Job Applications", value: stats.totalJobApplications, href: "/admin/job-applications" },
    { label: "Internship Applications", value: stats.totalInternshipApplications, href: "/admin/internship-applications" },
    { label: "Blog Posts", value: stats.totalBlogPosts, href: "/admin/blogs" },
    { label: "Projects", value: stats.totalProjects, href: "/admin/projects" },
    { label: "Employees", value: stats.totalEmployees ?? 0, href: "/admin/employees" },
  ];

  const quickLinks = [
    { href: "/admin/leads", label: "Leads & Inquiries", color: "bg-blue-600" },
    { href: "/admin/employees", label: "Employees", color: "bg-violet-600" },
    { href: "/admin/projects", label: "Portfolio", color: "bg-emerald-600" },
    { href: "/admin/blogs", label: "Blogs", color: "bg-amber-600" },
    { href: "/admin/jobs", label: "Jobs", color: "bg-rose-600" },
    { href: "/admin/announcements", label: "Announcements", color: "bg-cyan-600" },
  ];

  return (
    <div className="section-padding bg-slate-50/50 min-h-screen">
      <div className="container-page space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back — manage your business from here.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {cards.map((c) => (
            <Link key={c.label} href={c.href} className="admin-stat-card block hover:-translate-y-1 transition-transform">
              <span className="text-2xl">{STAT_ICONS[c.label]}</span>
              <div className="text-3xl font-bold text-primary mt-2">{c.value}</div>
              <div className="text-sm text-slate-500 mt-1">{c.label}</div>
            </Link>
          ))}
        </div>

        <div className="card">
          <h2 className="font-bold text-primary mb-4">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((l) => (
              <Link key={l.href} href={l.href} className={`${l.color} text-white rounded-xl px-4 py-3 text-sm font-semibold hover:opacity-90 transition-opacity text-center`}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <h3 className="font-semibold text-primary mb-2">Recent activity</h3>
            <p className="text-sm text-slate-600">Check leads and applications for new inquiries from website, chatbot, and contact forms.</p>
            <Link href="/admin/leads" className="text-sm text-secondary font-medium mt-3 inline-block hover:underline">View all leads →</Link>
          </div>
          <div className="card">
            <h3 className="font-semibold text-primary mb-2">Website</h3>
            <p className="text-sm text-slate-600">Manage portfolio projects and blog posts shown on encogix.com.</p>
            <Link href="/" target="_blank" className="text-sm text-secondary font-medium mt-3 inline-block hover:underline">View live site →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
