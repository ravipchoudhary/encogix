import type { Metadata } from "next";
import StructuredPage from "../../components/StructuredPage";

export const metadata: Metadata = {
  title: "Security & Compliance Services | Encogix Technology",
  description: "Security assessment, penetration testing, secure development, data protection, GDPR, ISO compliance, vulnerability assessment, and monitoring.",
};

const sections = [
  { title: "Security Assessment", items: ["Application and infrastructure security review", "Risk assessment for web, mobile, and cloud systems", "Security posture evaluation across environments", "Recommendations for resilient architecture and controls"] },
  { title: "Penetration Testing", items: ["Simulated attack testing for applications and services", "Authentication, authorization, and API validation", "Vulnerability identification and exploit analysis", "Actionable remediation guidance and security priorities"] },
  { title: "Secure Development", items: ["Secure coding best practices and architecture reviews", "Input validation, auth, session, and logging hardening", "Threat modeling and secure SDLC guidance", "Development workflows aligned to security standards"] },
  { title: "Data Protection", items: ["Encryption strategy and secrets management", "Data retention and privacy safeguards", "PII handling best practices", "Compliance-focused data lifecycle controls"] },
  { title: "GDPR", items: ["Privacy and consent review", "Data processing and retention alignment", "User rights support and policy guidance", "Security control recommendations for compliance readiness"] },
  { title: "ISO Compliance", items: ["Policy, process, and control recommendations", "Documentation support for security standards", "Risk and control mapping for audits", "Process improvement for audit readiness"] },
  { title: "Vulnerability Assessment", items: ["Scanning, validation, and remediation prioritization", "Third-party and dependency review", "Patch planning and oversight", "Ongoing issue tracking and action plans"] },
  { title: "Security Monitoring", items: ["Security logging and alert configuration", "Incident detection and response support", "Environment monitoring and health checks", "Operational security governance and dashboards"] },
];

const faqs = [
  { question: "Do you support compliance-related engineering work?", answer: "Yes. We help with technical controls, documentation, secure development practices, and architecture decisions that support compliance efforts." },
  { question: "Can security be built into a new product from the start?", answer: "Yes. We recommend secure architecture, coding standards, and testing practices from discovery through release." },
  { question: "Do you handle both web and cloud security?", answer: "Yes. We review application security, cloud config, user access control, and operating environment risks as part of the assessment." },
];

export default function SecurityCompliancePage() {
  return (
    <StructuredPage
      chip="Protect what matters"
      title="Security & Compliance"
      subtitle="Strengthen your digital systems with proactive security planning, testing, governance, and compliance support that fits modern product delivery."
      breadcrumb={[{ label: "Services", href: "/services" }]}
      sections={sections}
      faqs={faqs}
      contactTitle="Assess your security readiness"
      contactSubtitle="Tell us about your systems, compliance needs, and current risks so we can suggest the right security and compliance measures."
      ctaTitle="Reduce risk before it becomes a problem"
      ctaDescription="Invest in secure development and compliance-driven systems that protect your users, data, and reputation."
    />
  );
}
