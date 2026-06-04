"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/employee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: employeeId.trim(), password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.removeItem("admin_token");
        localStorage.setItem("employee_token", data.token);
        router.push("/employee/dashboard");
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="Encogix" className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary">Employee Portal</h1>
          <p className="text-slate-600 text-sm mt-1">Sign in with your Employee ID</p>
        </div>
        <form onSubmit={submit} className="card rounded-2xl p-8 space-y-5 shadow-xl border-slate-200/80">
          <div>
            <label className="label-field">Employee ID</label>
            <input required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input-field" placeholder="e.g. EMP001" autoComplete="username" />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" autoComplete="current-password" />
          </div>
          {err && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{err}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <Link href="/" className="block text-center text-sm text-slate-500 hover:text-secondary">← Back to website</Link>
        </form>
      </div>
    </div>
  );
}
