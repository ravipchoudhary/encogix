"use client";

import { useEffect, useState, useRef } from "react";

function empAuthHeaders() {
  return { Authorization: "Bearer " + (typeof window !== "undefined" ? localStorage.getItem("employee_token") : "") };
}

interface ChatMsg {
  id: number;
  username: string;
  message: string;
  created_at: string;
}

export default function EmployeeChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [username, setUsername] = useState("");
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = () => {
    fetch("/api/employee/chat", { headers: empAuthHeaders() })
      .then((r) => (r.ok ? r.json() : []))
      .then(setMessages)
      .catch(() => []);
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const u = username.trim();
    const msg = input.trim();
    if (!u || !msg) return;
    const res = await fetch("/api/employee/chat", {
      method: "POST",
      headers: { ...empAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ username: u, message: msg }),
    });
    if (res.ok) {
      setInput("");
      load();
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-primary text-white">
          <span className="font-semibold">Live Chat</span>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((m) => (
              <div key={m.id}>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-primary text-sm">{m.username}</span>
                  <span className="text-xs text-slate-400">{new Date(m.created_at).toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-700 bg-slate-100 rounded-lg px-3 py-2 mt-0.5">{m.message}</p>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-slate-200 p-4 space-y-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
            className="input-field"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message..."
              className="input-field flex-1"
            />
            <button onClick={send} className="btn-primary shrink-0">Send</button>
          </div>
        </div>
      </div>
    </>
  );
}
