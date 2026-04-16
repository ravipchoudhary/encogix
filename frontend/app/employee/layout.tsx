"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/employee/dashboard", label: "Dashboard" },
  { href: "/employee/attendance", label: "Attendance" },
  { href: "/employee/profile", label: "My Profile" },
  { href: "/employee/leave", label: "Leave Request" },
  { href: "/employee/announcements", label: "Announcements" },
  { href: "/employee/chat", label: "Chat" },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/employee/login") {
      setReady(true);
      return;
    }
    if (!localStorage.getItem("employee_token")) {
      router.replace("/employee/login");
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (pathname === "/employee/login") return <>{children}</>;
  if (!ready) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-500">Loading…</p></div>;

  const logout = () => {
    localStorage.removeItem("employee_token");
    router.replace("/employee/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/employee/dashboard" className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-primary text-lg">Employee Portal</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${pathname === item.href ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/" className="text-sm text-slate-600 hover:text-secondary">← Site</Link>
              <button onClick={logout} className="px-4 py-2 text-sm font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200">
                Logout
              </button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <Link href="/employee/chat" className="p-2 rounded-lg hover:bg-slate-100" aria-label="Chat">
                <span className="text-xl">💬</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Menu">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 py-4 space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-2 rounded-lg text-sm font-medium ${pathname === item.href ? "bg-primary text-white" : "text-slate-600"}`}>
                  {item.label}
                </Link>
              ))}
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-sm text-slate-600">← Back to site</Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm font-medium text-red-700">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
