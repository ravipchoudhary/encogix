"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

function empAuthHeaders() {
  return { Authorization: "Bearer " + (typeof window !== "undefined" ? localStorage.getItem("employee_token") : "") };
}

interface Employee {
  id: number;
  employee_id: string;
  name: string;
}

interface Participant {
  employee_id: number;
  name: string;
}

interface Conversation {
  id: number;
  type: "dm" | "group";
  name: string;
  participants: Participant[];
  last_message?: string;
  last_at?: string;
}

interface Message {
  id: number;
  from_employee_id: number;
  from_name: string;
  message: string;
  created_at: string;
}

export default function EmployeeChatPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [profile, setProfile] = useState<{ id: number; name: string } | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState<"none" | "dm" | "group">("none");
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [dmTarget, setDmTarget] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadProfile = () => {
    fetch("/api/employee/profile", { headers: empAuthHeaders() })
      .then((r) => (r.status === 401 ? null : r.json()))
      .then((p) => p && setProfile({ id: p.id, name: p.name }));
  };

  const loadConversations = () => {
    fetch("/api/employee/chat/conversations", { headers: empAuthHeaders() })
      .then((r) => {
        if (r.status === 401) {
          router.replace("/employee/login");
          return [] as Conversation[];
        }
        return r.json();
      })
      .then(setConversations)
      .catch(() => []);
  };

  const loadEmployees = () => {
    fetch("/api/employee/chat/employees", { headers: empAuthHeaders() })
      .then((r) => (r.ok ? r.json() : []))
      .then(setEmployees)
      .catch(() => []);
  };

  const loadMessages = (cid: number) => {
    fetch(`/api/employee/chat/conversations/${cid}`, { headers: empAuthHeaders() })
      .then((r) => {
        if (r.status === 401) router.replace("/employee/login");
        return r.ok ? r.json() : null;
      })
      .then((data) => {
        if (data) {
          setSelected({ id: data.id, type: data.type, name: data.name, participants: data.participants });
          setMessages(data.messages || []);
        }
      });
  };

  useEffect(() => {
    loadProfile();
    loadConversations();
    loadEmployees();
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const id = setInterval(loadConversations, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (selected) {
      const id = setInterval(() => loadMessages(selected.id), 3000);
      return () => clearInterval(id);
    }
  }, [selected?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startDm = async () => {
    if (!dmTarget) return;
    const res = await fetch("/api/employee/chat/conversations", {
      method: "POST",
      headers: { ...empAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ type: "dm", other_employee_id: dmTarget }),
    });
    let data: any = {};
    try {
      data = await res.json();
    } catch {}
    if (!res.ok) {
      alert(data?.message || "Failed");
      return;
    }
    const convoId = data?.id;
    setShowNew("none");
    setDmTarget(null);
    loadConversations();
    if (convoId) loadMessages(convoId);
  };

  const createGroup = async () => {
    if (!newGroupName.trim() || selectedEmployees.length === 0) {
      alert("Enter group name and select at least one member");
      return;
    }
    const res = await fetch("/api/employee/chat/conversations", {
      method: "POST",
      headers: { ...empAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ type: "group", name: newGroupName.trim(), employee_ids: selectedEmployees }),
    });
    let data: any = {};
    try {
      data = await res.json();
    } catch {}
    if (!res.ok) {
      alert(data?.message || "Failed");
      return;
    }
    const convoId = data?.id;
    setShowNew("none");
    setNewGroupName("");
    setSelectedEmployees([]);
    loadConversations();
    if (convoId) loadMessages(convoId);
  };

  const send = async () => {
    const msg = input.trim();
    if (!msg || !selected) return;
    const res = await fetch(`/api/employee/chat/conversations/${selected.id}/messages`, {
      method: "POST",
      headers: { ...empAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });
    if (res.ok) {
      const data = await res.json();
      setMessages((prev) => [...prev, { ...data, from_name: profile?.name || "You" }]);
      setInput("");
      loadConversations();
    } else {
      alert((await res.json()).message || "Failed to send");
    }
  };

  const toggleEmployee = (id: number) => {
    setSelectedEmployees((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };

  if (loading) return <div className="section-padding container-page"><p className="text-slate-500">Loading…</p></div>;

  return (
    <div className="section-padding container-page flex flex-col h-[calc(100vh-6rem)]">
      <h1 className="text-2xl font-semibold text-primary mb-4">Live Chat</h1>
      <div className="flex-1 flex gap-4 min-h-0 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="w-72 sm:w-80 flex flex-col border-r border-slate-200 bg-slate-50">
          <div className="p-3 flex gap-2">
            <button
              onClick={() => setShowNew(showNew === "dm" ? "none" : "dm")}
              className="flex-1 py-2 px-3 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90"
            >
              New DM
            </button>
            <button
              onClick={() => setShowNew(showNew === "group" ? "none" : "group")}
              className="flex-1 py-2 px-3 text-sm font-medium rounded-lg bg-secondary text-white hover:bg-secondary/90"
            >
              New Group
            </button>
          </div>
          {showNew === "dm" && (
            <div className="px-3 pb-3 space-y-2">
              <p className="text-xs text-slate-500">Select employee</p>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {employees.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setDmTarget(e.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${dmTarget === e.id ? "bg-primary text-white" : "bg-white hover:bg-slate-100"}`}
                  >
                    {e.name}
                  </button>
                ))}
              </div>
              <button onClick={startDm} disabled={!dmTarget} className="btn-primary w-full text-sm py-2 disabled:opacity-50">
                Start Chat
              </button>
            </div>
          )}
          {showNew === "group" && (
            <div className="px-3 pb-3 space-y-2">
              <input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Group name"
                className="input-field text-sm w-full"
              />
              <p className="text-xs text-slate-500">Select members</p>
              <div className="max-h-24 overflow-y-auto space-y-1">
                {employees.map((e) => (
                  <label key={e.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedEmployees.includes(e.id)} onChange={() => toggleEmployee(e.id)} />
                    <span className="text-sm">{e.name}</span>
                  </label>
                ))}
              </div>
              <button onClick={createGroup} disabled={!newGroupName.trim() || selectedEmployees.length === 0} className="btn-primary w-full text-sm py-2 disabled:opacity-50">
                Create Group
              </button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-slate-500 text-sm p-4 text-center">No conversations yet. Start a DM or create a group.</p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => loadMessages(c.id)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-white ${selected?.id === c.id ? "bg-white border-l-4 border-l-primary" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                      {c.type === "dm" ? c.name.charAt(0) : "👥"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 truncate">{c.name}</p>
                      {c.last_message && <p className="text-xs text-slate-500 truncate">{c.last_message}</p>}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          {selected ? (
            <>
              <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                  {selected.type === "dm" ? selected.name.charAt(0) : "👥"}
                </span>
                <div>
                  <p className="font-semibold text-slate-800">{selected.name}</p>
                  {selected.type === "group" && <p className="text-xs text-slate-500">{selected.participants.length} members</p>}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from_employee_id === profile?.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${m.from_employee_id === profile?.id ? "bg-primary text-white" : "bg-slate-100 text-slate-800"}`}>
                      {m.from_employee_id !== profile?.id && (selected?.type === "group") && (
                        <p className="text-xs font-medium text-primary mb-0.5">{m.from_name}</p>
                      )}
                      <p className="text-sm">{m.message}</p>
                      <p className={`text-[10px] mt-1 ${m.from_employee_id === profile?.id ? "text-white/80" : "text-slate-400"}`}>
                        {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="p-4 border-t border-slate-200 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                  placeholder="Type a message..."
                  className="input-field flex-1"
                />
                <button onClick={send} className="btn-primary shrink-0">Send</button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <p>Select a conversation or start a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
