import Link from "next/link";
import { IconCode2, IconCloud, IconBriefcase, IconLayout, IconDatabase, IconBrain, IconLandmark, IconHeartPulse, IconShoppingBag, IconQuote, IconArrowRight, IconZap, IconFolderKanban, IconMapPin, IconUsers } from "../components/Icons";

async function getHomeData() {
  return {
    clients: ["NovaBank", "Skyline Retail", "HelioHealth", "BlueOrbit Cloud"],
  };
}

const statsData = [
  { label: "Projects Delivered", value: "120+", Icon: IconLayout },
  { label: "Global Clients", value: "40+", Icon: IconUsers },
  { label: "Countries Served", value: "12", Icon: IconMapPin },
  { label: "Uptime SLA", value: "99.9%", Icon: IconZap },
];

export default async function HomePage() {
  const { clients } = await getHomeData();

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
              Engineering Digital Innovation
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary tracking-tight leading-tight">
              Transforming enterprises
              <br />
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">with intelligent technology.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl">
              Encogix Technology partners with global organizations to design,
              build, and scale secure digital platforms across cloud, web, and mobile.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                Book a consultation
                <IconArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/portfolio" className="btn-outline inline-flex items-center gap-2">
                View our work
              </Link>
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
              {
                title: "Software Development",
                desc: "We develop custom software products and internal tools using modern architectures, clean APIs and quality coding standards so your business workflows stay reliable, easy to extend and simple to maintain over time.",
                Icon: IconCode2,
              },
              {
                title: "Cloud Solutions",
                desc: "Our engineers design cloud architectures, handle migrations and fine-tune performance across AWS, Azure or other providers to reduce downtime, cut infrastructure costs and keep your applications highly available and secure.",
                Icon: IconCloud,
              },
              {
                title: "IT Consulting",
                desc: "We advise on technology strategy, modernization and security so you can choose the right platforms, plan realistic roadmaps, avoid unnecessary spending and align every digital initiative with clear business outcomes.",
                Icon: IconBriefcase,
              },
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
            {[
              { chip: "Fintech", title: "Digital banking platform", desc: "Scalable cloud-native banking platform enabling instant account opening and real-time payments.", Icon: IconLandmark },
              { chip: "Healthcare", title: "Patient engagement suite", desc: "Secure mobile and web apps improving patient communication and care coordination.", Icon: IconHeartPulse },
              { chip: "Retail", title: "Omnichannel commerce", desc: "Unified ecommerce, in-store, and marketplace experiences for a global retailer.", Icon: IconShoppingBag },
            ].map((item) => (
              <div key={item.title} className="card card-3d block-3d">
                <span className="chip mb-3 inline-flex items-center gap-1">
                  <item.Icon className="w-3.5 h-3.5" /> {item.chip}
                </span>
                <h3 className="font-semibold text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
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
              {[
                { quote: "Encogix has been instrumental in our cloud transformation. Their teams combine deep engineering expertise with a truly consultative approach.", author: "CIO, Global Retail Group" },
                { quote: "From discovery to rollout, Encogix delivered a secure, compliant, and beautifully designed digital experience for our customers.", author: "Head of Digital, European Bank" },
              ].map((t, i) => (
                <div key={i} className="card card-3d block-3d">
                  <IconQuote className="w-8 h-8 text-secondary/40 mb-2" />
                  <p className="text-sm text-slate-700">{t.quote}</p>
                  <p className="mt-3 text-xs font-semibold text-slate-500">{t.author}</p>
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
