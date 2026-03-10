import Link from "next/link";

async function getHomeData() {
  // In a real app you might call the API here.
  return {
    stats: [
      { label: "Projects Delivered", value: "120+" },
      { label: "Global Clients", value: "40+" },
      { label: "Countries Served", value: "12" },
      { label: "Uptime SLA", value: "99.9%" },
    ],
    clients: ["NovaBank", "Skyline Retail", "HelioHealth", "BlueOrbit Cloud"],
  };
}

export default async function HomePage() {
  const { stats, clients } = await getHomeData();

  return (
    <div>
      {/* Hero */}
      <section className="relative section-padding overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(37,99,235,0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(56,189,248,0.06)_0%,_transparent_50%)]" />
        <div className="container-page relative grid gap-12 md:grid-cols-2 items-center">
          <div className="space-y-6 fade-in-up">
            <span className="chip">Engineering Digital Innovation</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary tracking-tight leading-tight">
              Transforming enterprises
              <br />
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">with intelligent technology.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl">
              Encogix Technology partners with global organizations to design,
              build, and scale secure digital platforms across cloud, web, and
              mobile.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Book a consultation
              </Link>
              <Link href="/portfolio" className="btn-outline">
                View our work
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {stats.map((item, i) => (
              <div
                key={item.label}
                className="card flex flex-col gap-1 fade-in-up group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:from-secondary group-hover:to-accent transition-all duration-300">
                  {item.value}
                </span>
                <span className="text-xs uppercase tracking-wider font-medium text-slate-500">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="section-padding">
        <div className="container-page space-y-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-primary">
                End-to-end digital services
              </h2>
              <p className="text-slate-600 max-w-2xl mt-2">
                From strategy to execution, Encogix delivers resilient
                platforms, cloud-native solutions, and delightful digital
                experiences.
              </p>
            </div>
            <Link href="/services" className="text-sm font-semibold text-secondary hover:text-accent transition-colors">
              View all services →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Software Development",
                desc: "Enterprise-grade applications with modern architectures and clean APIs.",
              },
              {
                title: "Cloud Solutions",
                desc: "Design, migrate, and optimize workloads across leading cloud providers.",
              },
              {
                title: "IT Consulting",
                desc: "Strategic advisory on modernization, security, and digital roadmaps.",
              },
            ].map((card) => (
              <div key={card.title} className="card group/card">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center mb-3 group-hover/card:from-secondary/30 group-hover/card:to-accent/30 transition-colors">
                  <span className="text-lg">💻</span>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2 group-hover/card:text-secondary transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology stack */}
      <section className="section-padding bg-gradient-to-b from-slate-50/50 to-white">
        <div className="container-page space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-primary">
            Technology stack
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="card">
              <h3 className="font-semibold text-primary mb-2">Frontend</h3>
              <p className="text-slate-600">
                React, Next.js, Tailwind CSS, TypeScript, micro frontends.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-primary mb-2">Backend</h3>
              <p className="text-slate-600">
                Node.js, Express, REST APIs, GraphQL, event-driven systems.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-primary mb-2">Cloud & Data</h3>
              <p className="text-slate-600">
                AWS, Azure, GCP, container platforms, managed databases.
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-primary mb-2">Intelligent Apps</h3>
              <p className="text-slate-600">
                AI-powered chatbots, recommendation engines, data pipelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="section-padding">
        <div className="container-page space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary">
              Featured projects
            </h2>
            <Link href="/portfolio" className="text-sm text-secondary">
              Explore portfolio →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card">
              <span className="chip mb-3">Fintech</span>
              <h3 className="font-semibold text-primary mb-1">
                Digital banking platform
              </h3>
              <p className="text-sm text-slate-600">
                Scalable cloud-native banking platform enabling instant account
                opening and real-time payments.
              </p>
            </div>
            <div className="card">
              <span className="chip mb-3">Healthcare</span>
              <h3 className="font-semibold text-primary mb-1">
                Patient engagement suite
              </h3>
              <p className="text-sm text-slate-600">
                Secure mobile and web apps improving patient communication and
                care coordination.
              </p>
            </div>
            <div className="card">
              <span className="chip mb-3">Retail</span>
              <h3 className="font-semibold text-primary mb-1">
                Omnichannel commerce
              </h3>
              <p className="text-sm text-slate-600">
                Unified ecommerce, in-store, and marketplace experiences for a
                global retailer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials & clients */}
      <section className="section-padding bg-slate-50">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary">
              Trusted by leaders worldwide
            </h2>
            <div className="space-y-4">
              <div className="card">
                <p className="text-sm text-slate-700">
                  “Encogix has been instrumental in our cloud transformation.
                  Their teams combine deep engineering expertise with a truly
                  consultative approach.”
                </p>
                <p className="mt-3 text-xs font-semibold text-slate-500">
                  CIO, Global Retail Group
                </p>
              </div>
              <div className="card">
                <p className="text-sm text-slate-700">
                  “From discovery to rollout, Encogix delivered a secure,
                  compliant, and beautifully designed digital experience for our
                  customers.”
                </p>
                <p className="mt-3 text-xs font-semibold text-slate-500">
                  Head of Digital, European Bank
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              Selected clients
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              {clients.map((client) => (
                <div
                  key={client}
                  className="rounded-xl border border-slate-100 bg-white py-4 px-3 text-center shadow-soft font-medium text-slate-700 hover:shadow-lg hover:border-secondary/20 transition-all duration-300"
                >
                  {client}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-blue-900 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold">
                Ready to engineer what&apos;s next?
              </h2>
              <p className="mt-2 text-sm text-slate-200 max-w-xl">
                Partner with Encogix Technology to design scalable, secure, and
                intelligent digital platforms tailored to your business.
              </p>
            </div>
            <div className="relative z-10 flex gap-3">
              <Link href="/contact" className="btn-primary bg-white text-primary hover:bg-slate-100 shadow-lg">
                Talk to our team
              </Link>
              <Link href="/career" className="rounded-full border-2 border-white/80 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-primary transition-all duration-300">
                Explore careers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

