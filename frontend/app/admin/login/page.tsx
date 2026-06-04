"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.removeItem("employee_token");
        localStorage.setItem("admin_token", data.token);
        router.push("/admin/dashboard");
      } else {
        setErr(data.message || "Invalid credentials");
      }
    } catch {
      setErr("Login failed. Check server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-primary to-blue-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="Encogix" className="h-12 mx-auto brightness-0 invert mb-4" />
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-slate-300 text-sm mt-1">Secure access for administrators</p>
        </div>
        <form onSubmit={submit} className="glass-card rounded-2xl p-8 space-y-5 shadow-2xl">
          <div>
            <label className="label-field">Username</label>
            <input required value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" placeholder="Admin username" autoComplete="username" />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" autoComplete="current-password" />
          </div>
          {err && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{err}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Signing in…" : "Sign in to Dashboard"}
          </button>
          <Link href="/" className="block text-center text-sm text-slate-500 hover:text-secondary">← Back to website</Link>
        </form>
      </div>
    </div>
  );
}
