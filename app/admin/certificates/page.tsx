"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminAuthHeaders, isTokenValid, getAdminToken } from "../../../lib/auth";

interface Certificate {
  id: number;
  certificateNumber: string;
  candidateName: string;
  course: string | null;
  issueDate: string | null;
  details: string | null;
  active: boolean;
}

const emptyForm = { certificate_number: "", candidate_name: "", course: "", issue_date: "", details: "" };

export default function AdminCertificatesPage() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => {
    fetch("/api/admin/certificates", { headers: adminAuthHeaders() })
      .then((response) => response.json())
      .then((data) => setCertificates(Array.isArray(data) ? data : []))
      .catch(() => setCertificates([]));
  };

  useEffect(() => {
    if (!isTokenValid(getAdminToken(), "admin")) {
      router.push("/admin/login");
      return;
    }
    load();
  }, [router]);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create certificate");
      setForm(emptyForm);
      setMessage("Certificate added successfully.");
      load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create certificate");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this certificate?")) return;
    const response = await fetch(`/api/admin/certificates/${id}`, { method: "DELETE", headers: adminAuthHeaders() });
    if (response.ok) load();
  };

  return (
    <div className="section-padding container-page space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Certificate Verification</h1>
        <p className="text-sm text-slate-600 mt-1">Add candidate certificates that visitors can verify publicly.</p>
      </div>

      <form onSubmit={create} className="card grid gap-4 md:grid-cols-2">
        <div>
          <label className="label-field">Certificate number *</label>
          <input required value={form.certificate_number} onChange={(event) => setForm({ ...form, certificate_number: event.target.value.toUpperCase() })} className="input-field font-mono" placeholder="EX-CERT-2026-0001" />
        </div>
        <div>
          <label className="label-field">Candidate name *</label>
          <input required value={form.candidate_name} onChange={(event) => setForm({ ...form, candidate_name: event.target.value })} className="input-field" placeholder="Candidate full name" />
        </div>
        <div>
          <label className="label-field">Course / program</label>
          <input value={form.course} onChange={(event) => setForm({ ...form, course: event.target.value })} className="input-field" placeholder="Web Development Internship" />
        </div>
        <div>
          <label className="label-field">Issue date</label>
          <input type="date" value={form.issue_date} onChange={(event) => setForm({ ...form, issue_date: event.target.value })} className="input-field" />
        </div>
        <div className="md:col-span-2">
          <label className="label-field">Additional details</label>
          <textarea rows={3} value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} className="input-field" placeholder="Optional certificate details" />
        </div>
        <div className="md:col-span-2 flex items-center gap-4">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : "Add Certificate"}</button>
          {message && <p className="text-sm text-slate-600">{message}</p>}
        </div>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-200 text-left"><th className="py-3 pr-4">Certificate No.</th><th className="py-3 pr-4">Candidate</th><th className="py-3 pr-4">Course</th><th className="py-3">Action</th></tr></thead>
          <tbody>
            {certificates.map((certificate) => (
              <tr key={certificate.id} className="border-b border-slate-100">
                <td className="py-3 pr-4 font-mono">{certificate.certificateNumber}</td>
                <td className="py-3 pr-4">{certificate.candidateName}</td>
                <td className="py-3 pr-4">{certificate.course || "—"}</td>
                <td className="py-3"><button onClick={() => remove(certificate.id)} className="text-red-600">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {certificates.length === 0 && <p className="text-sm text-slate-500 py-4">No certificates added yet.</p>}
      </div>
    </div>
  );
}
