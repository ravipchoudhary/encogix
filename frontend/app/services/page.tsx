import Link from "next/link";

const services = [
  {
    title: "Software Development",
    desc: "Enterprise-grade applications with modern architectures, clean APIs, and scalable backend systems.",
    icon: "💻",
  },
  {
    title: "Web Development",
    desc: "Responsive, performant web applications using React, Next.js, and modern frontend frameworks.",
    icon: "🌐",
  },
  {
    title: "Android App Development",
    desc: "Native Android apps built with Kotlin and Java for performance, security, and engaging user experiences.",
    icon: "🤖",
  },
  {
    title: "iOS App Development",
    desc: "Native iOS apps for iPhone and iPad using Swift, delivering smooth and intuitive experiences.",
    icon: "🍎",
  },
  {
    title: "AI & Machine Learning",
    desc: "Smart AI solutions, ML models, predictive analytics, and intelligent automation for data-driven decisions.",
    icon: "🧠",
  },
  {
    title: "Mobile App Development",
    desc: "Cross-platform mobile apps for iOS and Android with React Native or Flutter for unified codebase.",
    icon: "📱",
  },
  {
    title: "Digital Marketing",
    desc: "Data-driven campaigns, SEO, content strategy, and analytics to grow your digital presence.",
    icon: "📈",
  },
  {
    title: "Cloud Solutions",
    desc: "Design, migrate, and optimize workloads across AWS, Azure, and GCP.",
    icon: "☁️",
  },
  {
    title: "IT Consulting",
    desc: "Strategic advisory on modernization, security, architecture, and digital roadmaps.",
    icon: "🎯",
  },
];

export default function ServicesPage() {
  return (
    <div className="section-padding">
      <div className="container-page space-y-12">
        <div>
          <span className="chip mb-4 inline-block">What we offer</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
            Our Services
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl">
            Encogix Technology delivers end-to-end digital solutions for enterprises—from strategy and design to implementation and support.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="card group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/15 to-accent/15 flex items-center justify-center text-2xl mb-4 group-hover:from-secondary/25 group-hover:to-accent/25 transition-colors">
                {s.icon}
              </div>
              <h2 className="text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition-colors">{s.title}</h2>
              <p className="text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-primary to-blue-900 text-white text-center py-14 px-8 shadow-2xl">
          <h2 className="text-xl font-bold">Need a custom solution?</h2>
          <p className="mt-2 text-slate-200">Let&apos;s discuss how we can help.</p>
          <Link href="/contact" className="inline-block mt-4 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
