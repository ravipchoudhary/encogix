import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Encogix Technology",
  description: "Privacy Policy for Encogix Technology. Learn how we collect, use, and protect personal information in India.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="section-padding container-page prose prose-slate max-w-4xl">
      <h1>Privacy Policy</h1>
      <p>Encogix Technology takes your privacy seriously. This Privacy Policy explains how we collect, use, share, and protect your personal data when you visit our website or contact us.</p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Contact information such as name, email address, phone number, and company details when you submit a form.</li>
        <li>Project details, service interests, and messages that you voluntarily provide.</li>
        <li>Technical data such as IP address, browser type, device information, and website usage through cookies and analytics.</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To respond to inquiries, send quotations, and manage project discussions.</li>
        <li>To provide customer support, service updates, and important notices.</li>
        <li>To improve our website, services, and marketing communications.</li>
        <li>To comply with applicable laws and protect our legal rights.</li>
      </ul>

      <h2>Cookies and Tracking</h2>
      <p>We may use cookies, web beacons, and similar technologies to provide and improve our website. You can manage cookies through your browser settings.</p>

      <h2>Data Sharing</h2>
      <p>We do not sell your personal data. We may share information with service providers, partners, or authorities where required by law, including the Information Technology Act, 2000 and its rules.</p>

      <h2>Your Rights</h2>
      <p>You have the right to request access, correction, or deletion of your personal information. To exercise these rights, contact us using the details below.</p>

      <h2>Legal Compliance</h2>
      <p>We operate under the laws of India and follow applicable privacy regulations, including the Information Technology Act and related rules.</p>

      <h2>Contact Us</h2>
      <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:contact@encogix.com">contact@encogix.com</a> or call +91 9431607346.</p>

      <p>Return to <Link href="/">home</Link> or visit our <Link href="/terms">Terms of Use</Link>.</p>
    </div>
  );
}
