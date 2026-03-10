"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<{
    totalLeads: number;
    totalJobApplications: number;
    totalInternshipApplications: number;
    totalBlogPosts: number;
    totalProjects: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((data) => data && setStats(data))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading || !stats) {
    return (
      <div className="section-padding container-page">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  const cards = [
    { label: "Total Leads", value: stats.totalLeads },
    { label: "Job Applications", value: stats.totalJobApplications },
    { label: "Internship Applications", value: stats.totalInternshipApplications },
    { label: "Blog Posts", value: stats.totalBlogPosts },
    { label: "Projects", value: stats.totalProjects },
  ];

  const cardLinks: Record<string, string> = {
    "Total Leads": "/admin/leads",
    "Job Applications": "/admin/job-applications",
    "Internship Applications": "/admin/internship-applications",
  };

  return (
    <div className="section-padding">
      <div className="container-page space-y-8">
        <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c) => {
            const href = cardLinks[c.label];
            const content = (
              <>
                <div className="text-2xl font-semibold text-primary">{c.value}</div>
                <div className="text-sm text-slate-500">{c.label}</div>
              </>
            );
            return href ? (
              <Link key={c.label} href={href} className="card block hover:border-secondary/30">
                {content}
              </Link>
            ) : (
              <div key={c.label} className="card">{content}</div>
            );
          })}
        </div>

        <div className="card">
          <h2 className="font-semibold text-primary mb-4">Manage content</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/leads" className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-blue-600">
              Leads
            </Link>
            <Link href="/admin/job-applications" className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-blue-600">
              Job Applications
            </Link>
            <Link href="/admin/internship-applications" className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-blue-600">
              Internship Applications
            </Link>
            <Link href="/admin/jobs" className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-blue-600">
              Jobs
            </Link>
            <Link href="/admin/blogs" className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-blue-600">
              Blogs
            </Link>
            <Link href="/admin/projects" className="px-4 py-2 bg-secondary text-white rounded-lg text-sm font-medium hover:bg-blue-600">
              Projects
            </Link>
            <Link href="/admin/admins" className="px-4 py-2 border-2 border-secondary text-secondary rounded-lg text-sm font-medium hover:bg-secondary hover:text-white">
              Manage Admins
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
