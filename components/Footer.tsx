"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  if (pathname?.startsWith("/employee") && pathname !== "/employee/login") return null;
  if (pathname?.startsWith("/admin") && pathname !== "/admin/login") return null;

  return (
    <footer className="border-t border-slate-200/50 bg-gradient-to-br from-primary via-blue-900 to-primary text-white">
      <div className="container-page py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center mb-3">
              <img
                src="/logo.png"
                alt="Encogix Technology"
                className="h-10 w-auto max-w-[140px] object-contain brightness-0 invert"
                width={140}
                height={40}
              />
            </Link>
            <p className="text-slate-300 text-sm">
              Engineering Digital Innovation. Empowering businesses with cutting-edge
              IT solutions and digital transformation.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link href="/portfolio" className="hover:text-white transition">Portfolio</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/career" className="hover:text-white transition">Career</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Use</Link></li>
              <li><Link href="/employee/login" className="hover:text-white transition">Employee Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a href="mailto:contact@encogix.com" className="hover:text-white transition">
                  contact@encogix.com
                </a>
              </li>
              <li>
                <a href="tel:+919431607346" className="hover:text-white transition">+91 9431607346</a>
              </li>
              <li>
                <a href="tel:+917633926879" className="hover:text-white transition">+91 7633926879</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Offices</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <span className="block font-medium text-white/90">Noida</span>
                Gaur City Center, Greater Noida, Uttar Pradesh, 201318
              </li>
              <li className="pt-2">
                <span className="block font-medium text-white/90">Bihar</span>
                Near BM College, Rahika, Madhubani, Bihar, 847211
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 text-xs text-slate-400 border-t border-white/10 pt-8">
          <div>
            <p><span className="text-slate-300">GST:</span> Available on request</p>
            <p className="mt-1"><span className="text-slate-300">Registered:</span> Encogix Technology — IT Services, Noida</p>
          </div>
          <div>
            <a href="https://www.linkedin.com/company/encogix-technology" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a>
            <span className="mx-2">·</span>
            <a href="https://maps.google.com/?q=Gaur+City+Center+Greater+Noida" target="_blank" rel="noopener noreferrer" className="hover:text-white">Google Maps</a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© {currentYear} Encogix Technology. All rights reserved.</p>
          <p>Website Development · Noida · Greater Noida · Delhi NCR</p>
        </div>
      </div>
    </footer>
  );
}
