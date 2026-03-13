import Link from "next/link";
import { IconCode2, IconGlobe, IconSmartphone, IconCloud, IconBriefcase, IconBrain, IconBarChart3, IconArrowRight, IconWrench } from "../../components/Icons";

const services = [
  { title: "Software Development", desc: "Enterprise-grade applications with modern architectures, clean APIs, and scalable backend systems.", Icon: IconCode2 },
  { title: "Web Development", desc: "Responsive, performant web applications using React, Next.js, and modern frontend frameworks.", Icon: IconGlobe },
  { title: "Android App Development", desc: "Native Android apps built with Kotlin and Java for performance, security, and engaging experiences.", Icon: IconSmartphone },
  { title: "iOS App Development", desc: "Native iOS apps for iPhone and iPad using Swift, delivering smooth and intuitive experiences.", Icon: IconSmartphone },
  { title: "AI & Machine Learning", desc: "Smart AI solutions, ML models, predictive analytics, and intelligent automation.", Icon: IconBrain },
  { title: "Mobile App Development", desc: "Cross-platform mobile apps with React Native or Flutter for unified codebase.", Icon: IconSmartphone },
  { title: "Digital Marketing", desc: "Data-driven campaigns, SEO, content strategy, and analytics to grow digital presence.", Icon: IconBarChart3 },
  { title: "Cloud Solutions", desc: "Design, migrate, and optimize workloads across AWS, Azure, and GCP.", Icon: IconCloud },
  { title: "IT Consulting", desc: "Strategic advisory on modernization, security, architecture, and digital roadmaps.", Icon: IconBriefcase },
];

export default function ServicesPage() {
  return (
    <div className="section-padding section-modern">
      <div className="container-page space-y-16">
        <div className="page-hero-modern">
          <span className="chip mb-4 inline-flex items-center gap-2">
            <IconWrench className="w-4 h-4" /> What we offer
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
            Our Services
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl">
            Encogix Technology delivers end-to-end digital solutions for enterprises—from strategy and design to implementation and support.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="card card-3d block-3d group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center mb-4 text-secondary group-hover:from-secondary/30 group-hover:to-accent/30 transition-colors icon-wrap-3d">
                <s.Icon className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition-colors">{s.title}</h2>
              <p className="text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="block-3d rounded-3xl bg-gradient-to-br from-primary via-blue-800 to-blue-900 text-white text-center py-14 px-8 shadow-2xl shadow-blue-900/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-xl font-bold flex items-center justify-center gap-2">
              <IconWrench className="w-6 h-6 text-amber-300" /> Need a custom solution?
            </h2>
            <p className="mt-2 text-slate-200">Let&apos;s discuss how we can help.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 mt-4 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-primary shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Contact us <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
