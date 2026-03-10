"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/career", label: "Career" },
  { href: "/internship", label: "Internship" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-md shadow-soft">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Encogix Technology"
            className="h-12 w-auto max-w-[140px] object-contain object-left"
            loading="eager"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">Engineering Digital Innovation</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-secondary font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="ml-4 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-secondary hover:text-secondary transition"
          >
            Admin
          </Link>
        </nav>
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm text-slate-600 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/admin/login" className="block py-2 text-sm text-slate-600 hover:text-primary" onClick={() => setMobileOpen(false)}>
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}
