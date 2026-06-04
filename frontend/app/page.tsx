import type { Metadata } from "next";
import Link from "next/link";
import HomeSections from "../components/HomeSections";
import ProcessSection from "../components/ProcessSection";
import {
  IconCode2, IconCloud, IconBriefcase, IconLayout, IconDatabase, IconBrain,
  IconQuote, IconArrowRight, IconZap, IconFolderKanban, IconMapPin, IconUsers,
  IconGlobe, IconSmartphone, IconBarChart3,
} from "../components/Icons";

export const metadata: Metadata = {
  title: "Website & Software Development Company in Noida | Encogix Technology",
  description: "Encogix Technology — premium website development, ecommerce, mobile apps, CRM, AI & SEO in Noida, Greater Noida & Delhi NCR. 120+ projects. Free consultation.",
};

async function getHomeData() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  let projects: Array<{ title: string; description: string | null; category: string | null; client: string | null; technologies: string | null; slug: string | null }> = [];
  let testimonials: Array<{ name: string; company: string | null; designation: string | null; rating: number; text: string }> = [];
  try {
    const [pRes, tRes] = await Promise.all([
      fetch(`${base}/api/projects`, { next: { revalidate: 60 } }),
      fetch(`${base}/api/testimonials`, { next: { revalidate: 60 } }),
    ]);
    if (pRes.ok) projects = (await pRes.json()).slice(0, 3);
    if (tRes.ok) testimonials = await tRes.json();
  } catch (_) {}
  return {
    clients: ["RetailKart", "HealthFirst", "EduLearn", "ManufactureHub", "PropTech", "FinServe"],
    projects,
    testimonials,
  };
}

const statsData = [
  { label: "Projects Delivered", value: "120+", Icon: IconLayout },
  { label: "Happy Clients", value: "80+", Icon: IconUsers },
  { label: "Years Experience", value: "5+", Icon: IconMapPin },
  { label: "Noida & NCR", value: "Local", Icon: IconZap },
];

export default async function HomePage() {
  const { clients, projects, testimonials } = await getHomeData();
  const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "919431607346";

  return (
    <div>
      {/* Hero */}
      <section className="relative section-padding overflow-hidden bg-gradient-to-br from-slate-50/90 via-white to-blue-50/70">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(56,189,248,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.1)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(56,189,248,0.08)_0%,_transparent_50%)]" />
        <div className="container-page relative grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6 fade-in-up">
            <span className="chip inline-flex items-center gap-2">
              <IconZap className="w-4 h-4" />
              Website & Software Development — Noida · Greater Noida · Delhi NCR
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary tracking-tight leading-tight">
              Grow your business with
              <br />
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">websites, apps & digital marketing.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl">
              Encogix Technology builds high-converting websites, ecommerce stores, mobile apps, CRM systems, and SEO campaigns for startups and enterprises across Noida and India.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                Get Free Consultation
                <IconArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Encogix, I need help with my website/project.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2"
              >
                WhatsApp Us
              </a>
              <a href="tel:+919431607346" className="btn-outline inline-flex items-center gap-2">
                Call Now
              </a>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 text-xs text-slate-500">
              <span className="chip">GST Registered</span>
              <span className="chip">5+ Years</span>
              <span className="chip">120+ Projects</span>
              <span className="chip">Free Audit</span>
            </div>
          </div>
          <div className="hero-3d-wrapper fade-in-up md:justify-self-end">
            <div className="hero-3d-stack relative h-72 w-full max-w-sm mx-auto">
              <div className="shape-3d-float absolute -top-8 -right-10 w-24 h-24 rounded-3xl bg-gradient-to-br from-secondary/50 to-accent/40 blur-2xl opacity-80" />
              <div className="shape-3d-float absolute -bottom-10 -left-8 w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-400/35 to-blue-500/35 blur-3xl opacity-80" />
              <div className="hero-3d-card hero-3d-layer-3" aria-hidden="true" />
              <div className="hero-3d-card hero-3d-layer-2" aria-hidden="true" />
              <div className="hero-3d-card hero-3d-layer-1">
                <div className="hero-3d-orbit" aria-hidden="true" />
                <div className="hero-3d-grid" aria-hidden="true" />
                <div className="hero-3d-content">
                  <div className="space-y-3">
                    <div className="hero-3d-pill flex items-center gap-2">
                      <IconZap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Real-time delivery metrics</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-200/80 mb-1">Encogix Delivery Control Center</p>
                      <p className="text-sm text-slate-100 max-w-xs">
                        Monitor uptime, releases, and global workloads on a single intelligent dashboard.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <p className="hero-3d-metric">
                        Uptime last 12 months
                        <br />
                        <strong className="text-emerald-300">99.9%</strong>
                      </p>
                    </div>
                    <div className="hero-3d-avatars">
                      <span>EN</span>
                      <span>CX</span>
                      <span>AI</span>
                    </div>
                  </div>
                  <div className="hero-3d-floating-metric flex items-center gap-2">
                    <IconZap className="w-4 h-4 text-amber-400" />
                    <span>Avg. deployment under 10 min</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {statsData.map((item, i) => (
                <div key={item.label} className="card card-3d block-3d flex flex-col gap-1 group">
                  <div className="flex items-center gap-2 text-secondary mb-1">
                    <item.Icon className="w-5 h-5 icon-wrap-3d" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:from-secondary group-hover:to-accent transition-all duration-300">
                    {item.value}
                  </span>
                  <span className="text-xs uppercase tracking-wider font-medium text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="section-padding section-modern">
        <div className="container-page space-y-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-primary flex items-center gap-2">
                <IconCode2 className="w-8 h-8 text-secondary" />
                End-to-end digital services
              </h2>
              <p className="text-base sm:text-lg text-slate-600 max-w-3xl mt-3">
                Encogix offers complete digital services from planning to launch. We design, build and support web, mobile and cloud solutions that are fast, secure, user-friendly and tailored to your business goals.
              </p>
            </div>
            <Link href="/services" className="text-sm sm:text-base font-semibold text-secondary hover:text-accent transition-colors inline-flex items-center gap-1">
              View all services <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid gap-7 md:grid-cols-3">
            {[
              { title: "Website Development", desc: "Business websites that load fast, rank on Google, and turn visitors into leads.", Icon: IconGlobe },
              { title: "Ecommerce Development", desc: "Online stores with secure payments, inventory, and sales-focused design.", Icon: IconCloud },
              { title: "Mobile App Development", desc: "Android & iOS apps for customer engagement and internal operations.", Icon: IconSmartphone },
              { title: "CRM & Custom Software", desc: "Lead tracking, dashboards, and workflows built for your team.", Icon: IconCode2 },
              { title: "AI Chatbot & Automation", desc: "WhatsApp bots and smart automation to save time and capture leads 24/7.", Icon: IconBrain },
              { title: "SEO & Digital Marketing", desc: "Local SEO in Noida, content, ads, and measurable growth.", Icon: IconBarChart3 },
            ].map((card) => (
              <div key={card.title} className="card card-3d block-3d group/card py-7">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/15 to-accent/15 flex items-center justify-center mb-5 text-secondary group-hover/card:from-secondary/25 group-hover/card:to-accent/25 transition-colors icon-wrap-3d">
                  <card.Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-primary mb-2 group-hover/card:text-secondary transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology stack */}
      <section className="section-padding section-modern bg-gradient-to-b from-slate-50/50 to-white">
        <div className="container-page space-y-8">
          <h2 className="text-3xl sm:text-4xl font-semibold text-primary flex items-center gap-2">
            <IconDatabase className="w-8 h-8 text-secondary" />
            Technology stack
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl">
            We use a modern, battle-tested stack across frontend, backend, cloud, and intelligent services to ship reliable products.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-base">
            {[
              { title: "Frontend", desc: "React, Next.js, Tailwind CSS, TypeScript, micro frontends.", Icon: IconLayout },
              { title: "Backend", desc: "Node.js, Express, REST APIs, GraphQL, event-driven systems.", Icon: IconCode2 },
              { title: "Cloud & Data", desc: "AWS, Azure, GCP, container platforms, managed databases.", Icon: IconCloud },
              { title: "Intelligent Apps", desc: "AI-powered chatbots, recommendation engines, data pipelines.", Icon: IconBrain },
            ].map((item) => (
              <div key={item.title} className="card card-3d block-3d py-6">
                <div className="flex items-center gap-2 mb-3 text-secondary">
                  <item.Icon className="w-6 h-6" />
                  <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="section-padding section-modern">
        <div className="container-page space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center gap-2">
              <IconFolderKanban className="w-8 h-8 text-secondary" />
              Featured projects
            </h2>
            <Link href="/portfolio" className="text-sm font-semibold text-secondary inline-flex items-center gap-1">
              Explore portfolio <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {(projects.length > 0 ? projects : [
              { title: "Ecommerce Platform", description: "Fashion retailer online store with Razorpay & admin panel.", category: "Ecommerce", client: "Confidential Client", technologies: "Next.js, Node.js", slug: null },
              { title: "CRM & Lead System", description: "Sales CRM with lead assignment and follow-up tracking.", category: "Software", client: "Confidential Client", technologies: "React, PostgreSQL", slug: null },
              { title: "Healthcare Booking App", description: "Appointment booking with SMS reminders.", category: "Healthcare", client: "HealthFirst Clinics", technologies: "React Native", slug: null },
            ]).map((item) => (
              <div key={item.title} className="card card-3d block-3d">
                {item.category && <span className="chip mb-3">{item.category}</span>}
                <h3 className="font-semibold text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
                {item.client && <p className="text-xs text-slate-500 mt-2">Client: {item.client}</p>}
                {item.technologies && <p className="text-xs text-secondary mt-1">{item.technologies}</p>}
                {item.slug && (
                  <Link href={`/portfolio/${item.slug}`} className="text-sm text-secondary mt-3 inline-flex items-center gap-1">
                    View case study <IconArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials & clients */}
      <section className="section-padding bg-gradient-to-b from-slate-50/80 to-white">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary flex items-center gap-2">
              <IconQuote className="w-8 h-8 text-secondary" />
              Trusted by leaders worldwide
            </h2>
            <div className="space-y-4">
              {(testimonials.length > 0 ? testimonials : [
                { text: "Encogix built our ecommerce site on time. Sales increased significantly after launch.", name: "Rahul Sharma", company: "RetailKart India", designation: "Founder", rating: 5 },
                { text: "Professional team, clear communication, and strong SEO results in Noida.", name: "Priya Mehta", company: "Confidential Client", designation: "Operations Head", rating: 5 },
              ]).map((t, i) => (
                <div key={i} className="card card-3d block-3d">
                  <IconQuote className="w-8 h-8 text-secondary/40 mb-2" />
                  <p className="text-sm text-amber-500">{"★".repeat(t.rating || 5)}</p>
                  <p className="text-sm text-slate-700 mt-2">{t.text}</p>
                  <p className="mt-3 text-xs font-semibold text-slate-500">
                    {t.name}{t.designation ? `, ${t.designation}` : ""}{t.company ? ` — ${t.company}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide flex items-center gap-2">
              <IconUsers className="w-5 h-5" /> Selected clients
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              {clients.map((client) => (
                <div key={client} className="rounded-xl border border-slate-100 bg-white py-4 px-3 text-center shadow-card font-medium text-slate-700 card-flat-3d hover:border-secondary/20 flex items-center justify-center">
                  {client}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProcessSection />
      <HomeSections />

      {/* CTA */}
      <section className="section-padding section-modern">
        <div className="container-page">
          <div className="block-3d relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-900 to-primary p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-2xl shadow-primary/30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <IconZap className="w-8 h-8 text-amber-300" />
                Ready to engineer what&apos;s next?
              </h2>
              <p className="mt-2 text-sm text-slate-200 max-w-xl">
                Partner with Encogix Technology to design scalable, secure, and intelligent digital platforms tailored to your business.
              </p>
            </div>
            <div className="relative z-10 flex gap-3">
              <Link href="/contact" className="btn-primary bg-white text-primary hover:bg-slate-100 shadow-lg inline-flex items-center gap-2">
                Talk to our team <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/career" className="rounded-xl border-2 border-white/80 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-primary transition-all duration-300 inline-flex items-center gap-2">
                Explore careers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
