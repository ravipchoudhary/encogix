import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Encogix Technology - Engineering Digital Innovation",
  description:
    "Encogix Technology is a trusted IT partner delivering software development, cloud solutions, and digital innovation. Meet our CEO Ravi P Choudhary and discover our mission to empower businesses with cutting-edge technology.",
  keywords:
    "Encogix Technology, about us, IT company, software development, digital transformation, CEO Ravi P Choudhary",
  openGraph: {
    title: "About Us | Encogix Technology",
    description:
      "Encogix Technology - Engineering secure, scalable digital platforms. Led by CEO Ravi P Choudhary.",
  },
};

export default function AboutPage() {
  return (
    <div className="section-padding">
      <div className="container-page space-y-12">
        <section>
          <span className="chip mb-4 inline-block">Who we are</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
            About Encogix Technology
          </h1>
          <p className="mt-4 text-slate-600 max-w-3xl text-lg">
            Encogix Technology is a trusted partner in digital transformation, specializing
            in software development, web solutions, cloud services, and AI-driven applications.
            We help businesses turn bold ideas into scalable, secure, and intelligent digital
            products.
          </p>
          <p className="mt-4 text-slate-600 max-w-3xl">
            Founded with a vision to democratize cutting-edge technology, we combine
            engineering excellence with a client-first approach—delivering solutions that
            drive growth, enhance productivity, and create lasting competitive advantages.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="card">
            <h2 className="text-lg font-semibold text-primary mb-2">Mission</h2>
            <p className="text-sm text-slate-600">
              To empower businesses with innovative technology solutions that drive
              measurable results, enhance productivity, and create sustainable
              competitive advantages in the digital era.
            </p>
          </div>
          <div className="card">
            <h2 className="text-lg font-semibold text-primary mb-2">Vision</h2>
            <p className="text-sm text-slate-600">
              To be recognized globally as a leader in creating smart, sustainable, and
              impactful digital solutions that transform how businesses operate and
              compete in the modern marketplace.
            </p>
          </div>
          <div className="card">
            <h2 className="text-lg font-semibold text-primary mb-2">Values</h2>
            <p className="text-sm text-slate-600">
              We prioritize innovation, integrity, customer-first approach, and
              excellence in delivery. Our agility and continuous learning keep us
              ahead of industry trends.
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-primary text-white p-8 md:p-10 overflow-visible">
          <h2 className="text-xl font-semibold mb-6">Message from CEO</h2>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="shrink-0">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold text-white">
                RP
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white">Ravi P Choudhary</h3>
              <p className="text-sm text-white/80 mt-1">Chief Executive Officer</p>
              <div className="mt-6 space-y-4 text-white/95 text-base leading-relaxed">
                <p>
                  At Encogix Technology, we believe technology should empower, not overwhelm.
                  Every line of code we write, every solution we build, is driven by one goal:
                  to help your business thrive in a digital-first world.
                </p>
                <p>
                  We are not just developers—we are your partners in innovation. Whether you are
                  a startup with a bold idea or an enterprise ready to scale, we are here to
                  engineer the future with you.
                </p>
                <p>
                  Thank you for considering Encogix. Let us build something extraordinary together.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-primary mb-6">Company at a Glance</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Happy Clients", value: "120+" },
              { label: "Projects Completed", value: "250+" },
              { label: "Team Members", value: "50+" },
              { label: "Client Satisfaction", value: "98%" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-100 bg-white px-5 py-6 shadow-sm text-center"
              >
                <div className="text-2xl font-semibold text-primary">{item.value}</div>
                <div className="mt-1 text-sm text-slate-500">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card text-center py-10">
          <h2 className="text-xl font-semibold text-primary">Ready to Transform Your Business?</h2>
          <p className="mt-2 text-slate-600 max-w-xl mx-auto">
            Let&apos;s build something extraordinary together. Get in touch with our team.
          </p>
          <Link href="/contact" className="btn-primary mt-4 inline-block">
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  );
}
