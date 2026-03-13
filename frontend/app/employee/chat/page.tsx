"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

function empAuthHeaders() {
  return { Authorization: "Bearer " + (typeof window !== "undefined" ? localStorage.getItem("employee_token") : "") };
}

interface ChatMsg {
  id: number;
  username: string;
  message: string;
  created_at: string;
}

export default function EmployeeChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [username, setUsername] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = () => {
    fetch("/api/employee/chat", { headers: empAuthHeaders() })
      .then((r) => (r.status === 401 ? router.replace("/employee/login") || [] : r.json()))
      .then(setMessages)
      .catch(() => [])
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [router]);

  useEffect(() => {
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const u = username.trim();
    const msg = input.trim();
    if (!u || !msg) {
      alert("Enter your username and message");
      return;
    }
    const res = await fetch("/api/employee/chat", {
      method: "POST",
      headers: { ...empAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ username: u, message: msg }),
    });
    if (res.ok) {
      setInput("");
      load();
    } else alert((await res.json()).message || "Failed to send");
  };

  if (loading) return <div className="section-padding container-page"><p className="text-slate-500">Loading…</p></div>;

  return (
    <div className="section-padding container-page flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-semibold text-primary mb-4">Live Chat</h1>
      <p className="text-sm text-slate-600 mb-4">Enter your username to chat. Messages are visible to all employees.</p>
      <div className="flex-1 card-flat flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-primary text-sm">{m.username}</span>
                  <span className="text-xs text-slate-400">{new Date(m.created_at).toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-700 bg-slate-100 rounded-lg px-3 py-2 inline-block max-w-full">{m.message}</p>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-slate-200 p-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            className="input-field sm:w-32"
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message..."
            className="input-field flex-1"
          />
          <button onClick={send} className="btn-primary">Send</button>
        </div>
      </div>
    </div>
  );
}
