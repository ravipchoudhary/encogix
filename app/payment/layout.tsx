import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Online Payment | Encogix Technology",
  description: "Make a secure online payment to Encogix Technology using Cashfree.",
  robots: { index: false, follow: false },
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) { return children; }
