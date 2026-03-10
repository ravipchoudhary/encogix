"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Admin {
  id: number;
  username: string;
  active: number;
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { Authorization: `Bearer ${token}` };
}

export default function AdminAdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "err">("idle");
  const [message, setMessage] = useState("");
  const [changeModal, setChangeModal] = useState<{ admin: Admin; newPassword: string; confirmPassword: string } | null>(null);

  const load = () => {
    fetch("/api/admin/list-admins", { headers: authHeaders() })
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return [];
        }
        return r.json();
      })
      .then(setAdmins)
      .catch(() => setAdmins([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    load();
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setMessage("");
    if (!username.trim() || !password) {
      setMessage("Username and password required");
      setStatus("err");
      return;
    }
    if (username.trim().length < 3) {
      setMessage("Username must be at least 3 characters");
      setStatus("err");
      return;
    }
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setStatus("err");
      return;
    }
    try {
      const res = await fetch("/api/admin/create-admin", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("New admin created successfully.");
        setUsername("");
        setPassword("");
        load();
      } else {
        setStatus("err");
        setMessage(data.message || "Failed to create admin");
      }
    } catch {
      setStatus("err");
      setMessage("Something went wrong");
    }
  };

  const block = async (id: number) => {
    if (!confirm("Block this admin? They won't be able to login.")) return;
    const res = await fetch(`/api/admin/admins/${id}/block`, { method: "PUT", headers: authHeaders() });
    if (res.ok) load();
  };
  const unblock = async (id: number) => {
    const res = await fetch(`/api/admin/admins/${id}/unblock`, { method: "PUT", headers: authHeaders() });
    if (res.ok) load();
  };
  const del = async (id: number) => {
    if (!confirm("Delete this admin permanently?")) return;
    const res = await fetch(`/api/admin/admins/${id}`, { method: "DELETE", headers: authHeaders() });
    if (res.ok) load();
  };

  const openChangePassword = (admin: Admin) => {
    setChangeModal({ admin, newPassword: "", confirmPassword: "" });
  };
  const changePassword = async () => {
    if (!changeModal) return;
    const { admin, newPassword, confirmPassword } = changeModal;
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const res = await fetch(`/api/admin/admins/${admin.id}/change-password`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });
    if (res.ok) {
      setChangeModal(null);
      alert("Password changed successfully");
    } else {
      const data = await res.json();
      alert(data.message || "Failed to change password");
    }
  };

  if (loading) {
    return (
      <div className="section-padding container-page">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="section-padding container-page">
      <h1 className="text-2xl font-semibold text-primary mb-6">Manage Admins</h1>

      <div className="card-flat max-w-md mb-8">
        <h2 className="font-semibold text-primary mb-3">Create New Admin</h2>
        <p className="text-sm text-slate-600 mb-4">
          Username min 3 chars, password min 6 chars.
        </p>
        <form onSubmit={submit} className="form-group">
          <div>
            <label className="label-field">Username *</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" placeholder="New admin username" />
          </div>
          <div>
            <label className="label-field">Password *</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="Min 6 characters" />
          </div>
          {status === "success" && <p className="text-green-600 text-sm">{message}</p>}
          {status === "err" && <p className="text-red-600 text-sm">{message}</p>}
          <button type="submit" className="btn-primary">Create Admin</button>
        </form>
      </div>

      <div>
        <h2 className="font-semibold text-primary mb-4">All Admins</h2>
        {admins.length === 0 ? (
          <div className="card text-center py-8 text-slate-500">No admins found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-3 font-medium text-slate-700">#</th>
                  <th className="text-left py-3 px-3 font-medium text-slate-700">Username</th>
                  <th className="text-left py-3 px-3 font-medium text-slate-700">Status</th>
                  <th className="text-right py-3 px-3 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-3 px-3 text-slate-500">{a.id}</td>
                    <td className="py-3 px-3 font-medium text-primary">{a.username}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${a.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {a.active ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {a.active ? (
                        <button onClick={() => block(a.id)} className="text-amber-600 text-sm hover:underline mr-2">Block</button>
                      ) : (
                        <button onClick={() => unblock(a.id)} className="text-green-600 text-sm hover:underline mr-2">Unblock</button>
                      )}
                      <button onClick={() => del(a.id)} className="text-red-600 text-sm hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {changeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setChangeModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-primary mb-2">Change Password</h2>
            <p className="text-sm text-slate-600 mb-4">New password for <strong>{changeModal.admin.username}</strong></p>
            <div className="form-group">
              <label className="label-field">New Password *</label>
              <input
                type="password"
                value={changeModal.newPassword}
                onChange={(e) => setChangeModal((m) => m ? { ...m, newPassword: e.target.value } : m)}
                className="input-field"
                placeholder="Min 6 characters"
              />
              <label className="label-field">Confirm Password *</label>
              <input
                type="password"
                value={changeModal.confirmPassword}
                onChange={(e) => setChangeModal((m) => m ? { ...m, confirmPassword: e.target.value } : m)}
                className="input-field"
                placeholder="Re-enter password"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={changePassword} className="btn-primary">Update Password</button>
              <button onClick={() => setChangeModal(null)} className="btn-outline">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
