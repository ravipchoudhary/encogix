"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SERVICE_LINKS } from "../lib/site-config";

const navItems = [
  { href: "/", label: "Home" },
  {
    label: "Services",
    href: "/services",
    children: SERVICE_LINKS,
  },
  {
    label: "Company",
    href: "/about",
    children: [
      { href: "/about", label: "About Us" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/case-studies", label: "Case Studies" },
      { href: "/blog", label: "Blog" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  { href: "/career", label: "Careers" },
  { href: "/internship", label: "Internship" },
  { href: "/payment", label: "Payment" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  if (pathname?.startsWith("/employee") && pathname !== "/employee/login") return null;
  if (pathname?.startsWith("/admin") && pathname !== "/admin/login") return null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100/80 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="container-page flex h-16 lg:h-[4.25rem] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="Encogix Technology" className="h-11 w-auto max-w-[150px] object-contain" width={150} height={44} />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {navItems.map((item) =>
            "children" in item ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${pathname?.startsWith(item.href) && item.href !== "/" ? "text-secondary bg-blue-50" : "text-slate-600 hover:text-secondary hover:bg-slate-50"}`}
                >
                  {item.label} ▾
                </Link>
                {openDropdown === item.label && (
                  <div className="absolute left-0 top-full pt-1 z-50">
                    <div className={`rounded-xl border border-slate-100 bg-white shadow-xl py-2 ${item.label === "Services" ? "min-w-[240px] grid grid-cols-1" : "min-w-[180px]"}`}>
                      {item.children?.map((c) => (
                        <Link key={c.href} href={c.href} className="block px-4 py-2.5 text-slate-600 hover:bg-blue-50 hover:text-secondary font-medium text-sm">
                          {c.label}
                        </Link>
                      ))}
                      {item.label === "Services" && (
                        <Link href="/services" className="block px-4 py-2.5 text-secondary font-semibold text-sm border-t border-slate-100 mt-1">
                          View all services →
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${pathname === item.href ? "text-secondary bg-blue-50" : "text-slate-600 hover:text-secondary hover:bg-slate-50"}`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <a href="tel:+919431607346" className="text-sm font-medium text-slate-600 hover:text-secondary px-2">Call</a>
          <Link href="/contact" className="btn-primary text-sm py-2.5 px-5">Free Consultation</Link>
        </div>

        <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 max-h-[70vh] overflow-y-auto space-y-1">
          {navItems.map((item) =>
            "children" in item ? (
              <div key={item.label}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide px-2 py-2">{item.label}</p>
                {item.children?.map((c) => (
                  <Link key={c.href} href={c.href} onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 text-sm text-slate-600 hover:text-secondary rounded-lg hover:bg-slate-50">
                    {c.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg">
                {item.label}
              </Link>
            )
          )}
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="btn-primary w-full mt-3 text-center">Free Consultation</Link>
        </div>
      )}
    </header>
  );
}
