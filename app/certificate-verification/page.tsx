"use client";

import { useState } from "react";

interface CertificateResult {
  valid: boolean;
  certificate_number?: string;
  candidate_name?: string;
  course?: string | null;
  issue_date?: string | null;
  details?: string | null;
  message?: string;
}

export default function CertificateVerificationPage() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState<CertificateResult | null>(null);
  const [loading, setLoading] = useState(false);

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`/api/certificates/verify?number=${encodeURIComponent(number.trim())}`);
      setResult(await response.json());
    } catch {
      setResult({ valid: false, message: "Unable to verify certificate right now." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-padding section-modern min-h-[70vh]">
      <div className="container-page max-w-2xl">
        <div className="page-hero-modern text-center mb-8">
          <span className="chip mb-4 inline-flex">Certificate Verification</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">Verify a certificate</h1>
          <p className="mt-3 text-slate-600">Enter the certificate number to check whether it is valid.</p>
        </div>

        <form onSubmit={verify} className="card card-3d space-y-4">
          <label htmlFor="certificate-number" className="label-field">Certificate number</label>
          <input
            id="certificate-number"
            required
            value={number}
            onChange={(event) => setNumber(event.target.value.toUpperCase())}
            className="input-field font-mono uppercase"
            placeholder="EX-CERT-2026-0001"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Checking…" : "Verify Certificate"}
          </button>
        </form>

        {result && (
          <div className={`mt-6 card border-2 ${result.valid ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
            {result.valid ? (
              <div className="space-y-3">
                <p className="text-emerald-700 font-semibold">Valid certificate</p>
                <p><span className="font-medium">Candidate:</span> {result.candidate_name}</p>
                <p><span className="font-medium">Certificate number:</span> {result.certificate_number}</p>
                {result.course && <p><span className="font-medium">Course:</span> {result.course}</p>}
                {result.issue_date && <p><span className="font-medium">Issue date:</span> {String(result.issue_date).slice(0, 10)}</p>}
                {result.details && <p className="whitespace-pre-line"><span className="font-medium">Details:</span> {result.details}</p>}
              </div>
            ) : (
              <p className="text-red-700">{result.message || "Invalid certificate number."}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
