import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificate Verification | Encogix Technology",
  description: "Verify an Encogix Technology internship or training certificate using its certificate number.",
  alternates: { canonical: "/certificate-verification" },
};

export default function CertificateVerificationLayout({ children }: { children: React.ReactNode }) { return children; }
