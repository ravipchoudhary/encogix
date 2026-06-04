"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SITE } from "../lib/site-config";

interface ChatMessage {
  from: "user" | "bot";
  text: string;
}

type Mode = "menu" | "chat" | "lead";

const QUICK_REPLIES = [
  "Website Development",
  "Ecommerce Website",
  "Mobile App",
  "CRM Software",
  "AI Chatbot",
  "SEO Services",
  "Pricing",
  "Contact Details",
];

const SERVICE_CATEGORIES = [
  { label: "🌐 Website", query: "Tell me about website development and pricing" },
  { label: "🛒 Ecommerce", query: "Ecommerce website development details" },
  { label: "📱 Mobile App", query: "Mobile app development services" },
  { label: "💼 CRM", query: "CRM and custom software development" },
  { label: "🤖 AI Solutions", query: "AI chatbot and automation solutions" },
  { label: "📈 SEO", query: "SEO and digital marketing packages" },
];

export default function ChatbotWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("menu");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [leadStep, setLeadStep] = useState(0);
  const [lead, setLead] = useState({ name: "", phone: "", service: "", budget: "" });
  const [submitting, setSubmitting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, mode, leadStep]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          from: "bot",
          text: "Namaste! 👋 Welcome to Encogix Technology.\n\nI'm your digital assistant. Ask about websites, apps, CRM, AI, SEO, pricing, or get a free quote.",
        },
      ]);
    }
  }, [open, messages.length]);

  if (pathname?.startsWith("/employee") || pathname?.startsWith("/admin")) return null;

  const askBot = async (text: string) => {
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "bot", text: data.reply || "Our team will contact you shortly." }]);
    } catch {
      setMessages((prev) => [...prev, { from: "bot", text: "Our team will contact you shortly. Call +91 9431607346." }]);
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    if (mode === "chat") askBot(text);
  };

  const submitLead = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lead.name,
          phone: lead.phone,
          email: "",
          message: `Service: ${lead.service}\nBudget: ${lead.budget}`,
          source: "chatbot-lead",
        }),
      });
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: `Thank you, ${lead.name}! 🎉 Our team will contact you at ${lead.phone} within 24 hours.` },
      ]);
      setMode("chat");
      setLeadStep(0);
      setLead({ name: "", phone: "", service: "", budget: "" });
    } catch {
      setMessages((prev) => [...prev, { from: "bot", text: "Something went wrong. Please WhatsApp us or call +91 9431607346." }]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeadInput = (text: string) => {
    setInput("");
    if (leadStep === 0) {
      setLead((l) => ({ ...l, name: text }));
      setLeadStep(1);
      setMessages((prev) => [...prev, { from: "user", text }, { from: "bot", text: "Great! What is your phone number?" }]);
    } else if (leadStep === 1) {
      setLead((l) => ({ ...l, phone: text }));
      setLeadStep(2);
      setMessages((prev) => [...prev, { from: "user", text }, { from: "bot", text: "Which service do you need?" }]);
    } else if (leadStep === 2) {
      setLead((l) => ({ ...l, service: text }));
      setLeadStep(3);
      setMessages((prev) => [...prev, { from: "user", text }, { from: "bot", text: "What is your approximate budget?" }]);
    } else if (leadStep === 3) {
      const updated = { ...lead, budget: text };
      setLead(updated);
      setMessages((prev) => [...prev, { from: "user", text }]);
      submitLead();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = input.trim();
      if (!text) return;
      if (mode === "lead") handleLeadInput(text);
      else handleSend();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`chatbot-fab fixed bottom-6 right-4 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-xl shadow-blue-500/30 hover:scale-105 transition-all duration-300 md:bottom-8 md:right-6 ${open ? "scale-95" : ""}`}
        aria-label={open ? "Close chat" : "Open chat assistant"}
      >
        {open ? (
          <svg className="w-6 h-6 m-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <>
            <span className="relative flex h-12 w-12 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/20" />
              <svg className="w-6 h-6 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </span>
            <span className="hidden sm:inline pr-4 text-sm font-semibold">Chat with us</span>
          </>
        )}
      </button>

      <div
        className={`chatbot-panel fixed bottom-24 right-4 z-50 w-[min(100vw-2rem,400px)] flex flex-col rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right md:bottom-28 md:right-6 ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-primary to-blue-800 text-white">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">E</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Encogix Assistant</p>
            <p className="text-xs text-white/70">Online · Replies instantly</p>
          </div>
        </div>

        <div className="flex-1 max-h-[340px] overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50/50 to-white">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-2xl px-3.5 py-2.5 max-w-[88%] text-sm leading-relaxed whitespace-pre-wrap ${
                m.from === "user" ? "bg-secondary text-white rounded-br-md" : "bg-white border border-slate-100 text-slate-800 shadow-sm rounded-bl-md"
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {mode === "menu" && (
            <div className="space-y-3 pt-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Quick actions</p>
              <div className="grid grid-cols-2 gap-2">
                {SERVICE_CATEGORIES.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => { setMode("chat"); askBot(c.query); }}
                    className="text-left text-xs px-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-secondary hover:bg-blue-50/50 transition-all"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => { setMode("lead"); setLeadStep(0); setMessages((prev) => [...prev, { from: "bot", text: "Let's capture your details for a free quote. What is your name?" }]); }}
                className="w-full text-sm font-semibold py-2.5 rounded-xl bg-secondary text-white hover:bg-blue-700 transition-colors"
              >
                Get Free Quote
              </button>
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hi Encogix, I need help with a project.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl border-2 border-[#25D366] text-[#128C7E] hover:bg-green-50 transition-colors"
              >
                Continue on WhatsApp
              </a>
            </div>
          )}

          {mode === "chat" && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {QUICK_REPLIES.map((q) => (
                <button key={q} type="button" onClick={() => askBot(q)} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-secondary hover:text-white text-slate-700 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {(mode === "chat" || mode === "lead") && (
          <div className="border-t border-slate-200 p-3 flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={submitting}
              placeholder={mode === "lead" ? (leadStep === 0 ? "Your name" : leadStep === 1 ? "Phone number" : leadStep === 2 ? "Service required" : "Budget") : "Type your question…"}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
            />
            <button
              type="button"
              onClick={() => { const t = input.trim(); if (!t) return; mode === "lead" ? handleLeadInput(t) : handleSend(); }}
              disabled={!input.trim() || submitting}
              className="rounded-xl bg-secondary text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </div>
        )}

        {mode !== "menu" && (
          <div className="px-3 pb-3 bg-white">
            <button type="button" onClick={() => setMode("menu")} className="text-xs text-secondary hover:underline">
              ← Back to menu
            </button>
          </div>
        )}
      </div>
    </>
  );
}
