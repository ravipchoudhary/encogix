"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminAuthHeaders } from "../../../lib/auth";

export default function InternshipSettingsPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/internship-payment-settings", { headers: adminAuthHeaders() })
      .then((response) => {
        if (response.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return response.json();
      })
      .then((data) => data && setAmount(String(data.amount || "")))
      .catch(() => setStatus("Unable to load payment amount."));
  }, [router]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/internship-payment-settings", {
        method: "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save payment amount");
      setAmount(String(data.amount));
      setStatus("Internship payment updated successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save payment amount.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section-padding container-page max-w-2xl">
      <div className="card">
        <h1 className="text-2xl font-semibold text-primary">Internship Payment</h1>
        <p className="text-sm text-slate-600 mt-2">Set the amount applicants must pay before registration.</p>
        <form onSubmit={save} className="mt-6 space-y-4">
          <div>
            <label htmlFor="internship-fee" className="label-field">Registration payment (INR)</label>
            <input
              id="internship-fee"
              type="number"
              min="1"
              step="0.01"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="input-field"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save Payment Amount"}
          </button>
          {status && <p className="text-sm text-slate-600">{status}</p>}
        </form>
      </div>
    </div>
  );
}
