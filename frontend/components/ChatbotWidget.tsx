"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const SERVICE_DETAILS: Record<string, string> = {
  "Software Development":
    "We build enterprise-grade applications with modern architectures, clean APIs, and scalable backend systems. Our stack includes Node.js, Python, .NET, and more. We follow Agile methodology and ensure clean code, testing, and documentation. Typical delivery: 8–16 weeks depending on scope.",
  "Web Development":
    "We create responsive, performant web apps using React, Next.js, Vue, and modern frontend frameworks. From corporate sites to complex web apps, we deliver SEO-friendly, fast-loading solutions. We also handle CMS integration (WordPress, Strapi) and e-commerce platforms.",
  "Android App Development":
    "Native Android apps built with Kotlin and Java for performance, security, and great UX. We deliver apps for Play Store, follow Material Design, and ensure compatibility across devices. Services include architecture design, development, testing, and Play Store submission.",
  "iOS App Development":
    "Native iOS apps for iPhone and iPad using Swift. We build intuitive, App Store–ready apps with modern UI/UX. Our process includes design, development, testing, and App Store deployment support.",
  "AI & Machine Learning":
    "We offer AI/ML solutions: predictive analytics, NLP, computer vision, recommendation engines, and process automation. We use TensorFlow, PyTorch, and cloud AI (AWS, GCP). Ideal for data-driven decision-making and intelligent automation.",
  "Mobile App Development":
    "Cross-platform apps with React Native or Flutter—single codebase for iOS and Android. Faster delivery, lower cost, native-like performance. We handle full lifecycle: design, dev, testing, and store deployment.",
  "Digital Marketing":
    "Data-driven campaigns, SEO, content strategy, PPC, social media marketing, and analytics. We help you grow traffic, leads, and conversions. Services include keyword research, content creation, and performance tracking.",
  "Cloud Solutions":
    "We design, migrate, and optimize workloads on AWS, Azure, and GCP. Services: cloud architecture, migration, DevOps, containerization (Docker, Kubernetes), and managed cloud support.",
  "IT Consulting":
    "Strategic advisory on tech stack, architecture, security, and digital roadmaps. We help with vendor selection, cost optimization, and modernization strategies.",
};

const SERVICE_OPTIONS = Object.keys(SERVICE_DETAILS);

interface ChatMessage {
  from: "user" | "bot";
  text: string;
}

export default function ChatbotWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "" });
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (autoOpened) return;
    const timer = setTimeout(() => {
      setOpen(true);
      setAutoOpened(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [autoOpened]);

  useEffect(() => {
    if (open && step === 0 && messages.length === 0) {
      setMessages([
        { from: "bot", text: "Welcome to Encogix Technology! 👋 We're glad you're here." },
        { from: "bot", text: "What is your name?" },
      ]);
    }
  }, [open, step, messages.length]);

  const findService = (text: string) => {
    const lower = text.toLowerCase().trim();
    for (const s of SERVICE_OPTIONS) {
      if (lower.includes(s.toLowerCase()) || s.toLowerCase().includes(lower)) return s;
    }
    if (lower.includes("software") || lower.includes("web") || lower.includes("android") || lower.includes("ios") || lower.includes("ai") || lower.includes("mobile") || lower.includes("marketing") || lower.includes("cloud") || lower.includes("consulting")) {
      const map: Record<string, string> = { software: "Software Development", web: "Web Development", android: "Android App Development", ios: "iOS App Development", "ai": "AI & Machine Learning", ml: "AI & Machine Learning", mobile: "Mobile App Development", marketing: "Digital Marketing", cloud: "Cloud Solutions", consulting: "IT Consulting" };
      for (const [k, v] of Object.entries(map)) {
        if (lower.includes(k)) return v;
      }
    }
    return null;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setInput("");
    setMessages((prev) => [...prev, { from: "user", text }]);

    if (step === 0) {
      setForm((f) => ({ ...f, name: text }));
      setMessages((prev) => [...prev, { from: "bot", text: `Nice to meet you, ${text}! What is your phone number?` }]);
      setStep(1);
    } else if (step === 1) {
      setForm((f) => ({ ...f, phone: text }));
      setMessages((prev) => [...prev, { from: "bot", text: "What is your email address?" }]);
      setStep(2);
    } else if (step === 2) {
      setForm((f) => ({ ...f, email: text }));
      setMessages((prev) => [...prev, { from: "bot", text: "What work do you need? Please type or select a service." }]);
      setStep(3);
    } else if (step === 3) {
      const matched = findService(text);
      const finalService = matched || text;
      setForm((f) => ({ ...f, service: finalService }));

      setSubmitting(true);
      try {
        const fd = new FormData();
        fd.append("access_key", "36fa8b83-2560-4e33-997a-78b0ed8eaa49");
        fd.append("name", form.name);
        fd.append("email", form.email || text);
        fd.append("phone", form.phone);
        fd.append("subject", "New lead from chatbot");
        fd.append("message", `Service interest: ${finalService}`);
        fd.append("source", "Chatbot");

        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: fd,
        });
      } catch (_) {}

      const detail = typeof finalService === "string" && SERVICE_DETAILS[finalService]
        ? SERVICE_DETAILS[finalService]
        : "We will get back to you with full details soon. Our team will contact you shortly.";

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: `Thank you, ${form.name}! Here are the full details about ${typeof finalService === "string" ? finalService : "your requirement"}:` },
        { from: "bot", text: detail },
        { from: "bot", text: `We will also reach you at ${form.phone} and ${form.email || text}. For more, email us at contact@encogix.com.` },
      ]);
      setStep(4);
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (pathname?.startsWith("/employee")) return null;
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-secondary to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chatbot"
      >
        💬
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-white text-sm font-medium">
            <span>Encogix Assistant</span>
            <button onClick={() => setOpen(false)} className="text-xs text-white/80 hover:text-white">✕</button>
          </div>
          <div className="flex-1 max-h-[380px] overflow-y-auto p-4 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-2xl px-3 py-2 max-w-[85%] text-sm ${m.from === "user" ? "bg-secondary text-white" : "bg-slate-100 text-slate-800"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {step === 3 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SERVICE_OPTIONS.slice(0, 6).map((s) => (
                  <button key={s} onClick={() => { setInput(s); }} className="text-xs px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700">
                    {s}
                  </button>
                ))}
              </div>
            )}
            {submitting && <div className="text-xs text-slate-400">Please wait…</div>}
          </div>
          {step < 4 && (
            <div className="border-t border-slate-200 px-3 py-2 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={step === 0 ? "Your name" : step === 1 ? "Phone number" : step === 2 ? "Email address" : "Type your requirement"}
                className="flex-1 rounded-full border-2 border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
              />
              <button onClick={handleSend} disabled={!input.trim()} className="rounded-full bg-secondary text-white px-4 py-2.5 text-sm font-semibold shadow-md disabled:opacity-50 hover:bg-blue-700 transition-colors">
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
