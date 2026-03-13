"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/employees", label: "Employees" },
  { href: "/admin/attendance", label: "Attendance" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/job-applications", label: "Job Applications" },
  { href: "/admin/internship-applications", label: "Internship Applications" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/leave-requests", label: "Leave Requests" },
  { href: "/admin/admins", label: "Manage Admins" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authReady, setAuthReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  if (pathname === "/admin/login") return <>{children}</>;
  if (!authReady) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-500">Loading…</p></div>;

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.replace("/admin/login");
  };

  const topNav = navItems.slice(0, 6);
  const moreNav = navItems.slice(6);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/admin/dashboard" className="font-bold text-primary text-lg shrink-0">Encogix Admin</Link>

            <nav className="hidden lg:flex items-center gap-1">
              {topNav.map((item) => (
                <Link key={item.href} href={item.href} className={`px-3 py-2 rounded-lg text-sm font-medium ${pathname === item.href ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                  {item.label}
                </Link>
              ))}
              <div className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
                <button className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${dropdownOpen || moreNav.some((i) => pathname === i.href) ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                  More ▾
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 py-1 bg-white rounded-lg shadow-lg border border-slate-200 min-w-[180px] z-50">
                    {moreNav.map((item) => (
                      <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Link href="/" className="text-sm text-slate-600 hover:text-secondary">← Site</Link>
              <button onClick={logout} className="px-4 py-2 text-sm font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200">Logout</button>
            </div>

            <div className="lg:hidden flex items-center gap-2">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Menu">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-200 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-2 rounded-lg text-sm font-medium ${pathname === item.href ? "bg-primary text-white" : "text-slate-600"}`}>
                  {item.label}
                </Link>
              ))}
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-600">← Back to site</Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm font-medium text-red-700">Logout</button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
