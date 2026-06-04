"use client";

import { useState } from "react";
import {
  IconSearch, IconLayout, IconCode2, IconCheck, IconZap, IconWrench,
} from "./Icons";

const STEPS = [
  {
    num: 1,
    title: "Discovery & Requirement Analysis",
    desc: "We understand your business goals, target audience, features, and budget through detailed consultation.",
    Icon: IconSearch,
    color: "from-blue-500 to-cyan-400",
  },
  {
    num: 2,
    title: "UI/UX Planning",
    desc: "Wireframes, user flows, and modern UI design aligned with your brand and conversion goals.",
    Icon: IconLayout,
    color: "from-violet-500 to-purple-400",
  },
  {
    num: 3,
    title: "Development",
    desc: "Agile development with clean code, regular updates, and milestone-based delivery.",
    Icon: IconCode2,
    color: "from-emerald-500 to-teal-400",
  },
  {
    num: 4,
    title: "Testing & Quality Check",
    desc: "Cross-browser, mobile, performance, and security testing before launch.",
    Icon: IconCheck,
    color: "from-amber-500 to-orange-400",
  },
  {
    num: 5,
    title: "Deployment",
    desc: "Live deployment with domain, hosting, SSL, and analytics setup.",
    Icon: IconZap,
    color: "from-rose-500 to-pink-400",
  },
  {
    num: 6,
    title: "Support & Maintenance",
    desc: "Ongoing updates, speed optimization, security patches, and dedicated support.",
    Icon: IconWrench,
    color: "from-indigo-500 to-blue-400",
  },
];

export default function ProcessSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="section-padding section-modern bg-gradient-to-b from-slate-50/80 to-white overflow-hidden">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="chip mb-4 inline-flex">How we work</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">Our Process</h2>
          <p className="mt-3 text-slate-600">
            A proven 6-step workflow that delivers premium websites, apps, and software on time.
          </p>
        </div>

        {/* Desktop timeline */}
        <div className="hidden lg:block relative mb-12">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-secondary/20 via-secondary to-secondary/20 -translate-y-1/2 rounded-full" />
          <div className="grid grid-cols-6 gap-4 relative">
            {STEPS.map((step, i) => (
              <button
                key={step.num}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="flex flex-col items-center group"
              >
                <div
                  className={`process-3d-node w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${step.color} shadow-lg transition-all duration-300 ${
                    active === i ? "scale-110 process-3d-active" : "opacity-80 group-hover:scale-105"
                  }`}
                >
                  <step.Icon className="w-6 h-6" />
                </div>
                <span className="mt-3 text-xs font-semibold text-slate-500">Step {step.num}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              onMouseEnter={() => setActive(i)}
              className={`process-3d-card card block-3d relative overflow-hidden transition-all duration-500 ${
                active === i ? "ring-2 ring-secondary/40 shadow-xl -translate-y-1" : ""
              }`}
            >
              <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${step.color} opacity-20 blur-2xl`} />
              <div className="flex items-start gap-4 relative">
                <div className={`process-3d-icon shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${step.color} shadow-md`}>
                  <step.Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-secondary">STEP {step.num}</span>
                  <h3 className="text-lg font-semibold text-primary mt-1">{step.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
