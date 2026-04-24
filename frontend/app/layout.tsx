import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import ChatbotWidget from "../components/ChatbotWidget";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Script from "next/script";

const fontSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Encogix Technology | Engineering Digital Innovation",
  description:
    "Encogix Technology is a global technology company delivering software development, cloud solutions, and digital innovation for enterprises.",
  metadataBase: new URL("https://www.encogix.example"), // adjust when deploying
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatbotWidget />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}

