"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/job-applications", label: "Job Applications" },
  { href: "/admin/internship-applications", label: "Internship Applications" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/admins", label: "Manage Admins" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthReady(true);
      return;
    }
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    setAuthReady(true);
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-primary text-white flex flex-col">
        <div className="p-4 border-b border-white/10">
          <Link href="/admin/dashboard" className="font-semibold">Encogix Admin</Link>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-lg text-sm ${
                pathname === item.href
                  ? "bg-white/20"
                  : "hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-white/10">
          <Link href="/" className="block px-3 py-2 text-sm hover:bg-white/10 rounded-lg">
            ← Back to site
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("admin_token");
              router.push("/admin/login");
            }}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-red-500/20 rounded-lg"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
