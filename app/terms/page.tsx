import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | Encogix Technology",
  description: "Terms of Use for Encogix Technology website, including service eligibility and legal disclaimers in India.",
};

export default function TermsPage() {
  return (
    <div className="section-padding container-page prose prose-slate max-w-4xl">
      <h1>Terms of Use</h1>
      <p>Welcome to Encogix Technology. By using our website, you agree to these Terms of Use. Please read them carefully.</p>

      <h2>Use of the Website</h2>
      <p>You may use this website for lawful purposes only. You must not use it to transmit any material that is unlawful, harmful, or offensive.</p>

      <h2>Project and Service Information</h2>
      <p>All project descriptions, pricing, and service details are indicative and subject to change. Actual scope, fees, and timelines will be agreed upon in a separate engagement contract.</p>

      <h2>Intellectual Property</h2>
      <p>All content, logos, and trademarks on this website belong to Encogix Technology or our licensors. You may not reproduce or use our intellectual property without permission.</p>

      <h2>Disclaimers</h2>
      <p>We make no warranties about the accuracy, reliability, or completeness of the website content. We are not liable for any losses arising from your use of the website.</p>

      <h2>Limitation of Liability</h2>
      <p>Encogix Technology shall not be liable for indirect, incidental, or consequential damages arising from use of the website or any services described therein.</p>

      <h2>Applicable Law</h2>
      <p>These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of competent courts in India.</p>

      <h2>Contact</h2>
      <p>Questions about these Terms of Use can be addressed to <a href="mailto:contact@encogix.com">contact@encogix.com</a>.</p>

      <p>Return to <Link href="/">home</Link> or read our <Link href="/privacy-policy">Privacy Policy</Link>.</p>
    </div>
  );
}
