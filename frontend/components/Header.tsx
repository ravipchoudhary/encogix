"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  {
    label: "About",
    href: "/about",
    children: [
      { href: "/about", label: "About Us" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/blog", label: "Blog" },
      { href: "/internship", label: "Internship" },
    ],
  },
  { href: "/services", label: "Services" },
  { href: "/career", label: "Career" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

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
          {navItems.map((item) =>
            "children" in item ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Link href={item.href} className="hover:text-secondary font-medium transition-colors">
                  {item.label}
                </Link>
                {dropdownOpen && (
                  <div className="absolute left-0 top-full pt-1">
                    <div className="rounded-xl border border-slate-100 bg-white shadow-lg py-1 min-w-[160px]">
                      {item.children.map((c) => (
                        <Link key={c.href} href={c.href} className="block px-4 py-2 text-slate-600 hover:bg-slate-50 hover:text-secondary font-medium">
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="hover:text-secondary font-medium transition-colors">
                {item.label}
              </Link>
            )
          )}
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
          {navItems.map((item) =>
            "children" in item ? (
              <div key={item.label}>
                <button onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)} className="flex items-center justify-between w-full py-2 text-sm text-slate-600 hover:text-primary font-medium">
                  {item.label}
                  <span className="text-slate-400">{mobileDropdownOpen ? "▲" : "▼"}</span>
                </button>
                {mobileDropdownOpen && (
                  <div className="pl-4 border-l-2 border-slate-100 space-y-1">
                    {item.children.map((c) => (
                      <Link key={c.href} href={c.href} onClick={() => { setMobileOpen(false); setMobileDropdownOpen(false); }} className="block py-2 text-sm text-slate-600 hover:text-primary">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-slate-600 hover:text-primary">
                {item.label}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
}
