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
        localStorage.setItem("employee_token", data.token);
        router.push("/employee/dashboard");
      } else {
        setErr(data.message || "Invalid credentials");
      }
    } catch {
      setErr("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/5 to-secondary/10 section-modern">
      <div className="card-flat card-flat-3d glass-card w-full max-w-sm">
        <h1 className="text-xl font-semibold text-primary mb-2">Employee Login</h1>
        <p className="text-sm text-slate-600 mb-4">Use your Employee ID and password</p>
        <form onSubmit={submit} className="form-group">
          <div>
            <label className="label-field">Employee ID</label>
            <input
              required
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="input-field"
              placeholder="e.g. EMP001"
            />
          </div>
          <div>
            <label className="label-field">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <Link href="/" className="block mt-4 text-center text-sm text-slate-500 hover:text-secondary">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
