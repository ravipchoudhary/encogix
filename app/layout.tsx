import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import ChatbotWidget from "../components/ChatbotWidget";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StickyCTA from "../components/StickyCTA";
import { LocalBusinessSchema } from "../components/JsonLd";
import Script from "next/script";

const fontSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.encogix.com";

export const metadata: Metadata = {
  title: {
    default: "Encogix Technology | Web & Software Company in Noida",
    template: "%s | Encogix Technology",
  },
  description:
    "Web and software development company in Noida for websites, ecommerce, apps, CRM, AI and SEO. Get a free consultation from Encogix.",
  metadataBase: new URL(siteUrl),
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Encogix Technology",
    title: "Encogix Technology | IT Company in Noida",
    description:
      "Website development, mobile apps, custom software & digital marketing in Noida & Delhi NCR.",
  },
  twitter: { card: "summary_large_image" },
  keywords: [
    "website development company Noida",
    "software development Greater Noida",
    "web development Delhi NCR",
    "IT services Noida",
    "mobile app development",
    "ecommerce website",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontSans.variable}>
      <head>
        <LocalBusinessSchema />
      </head>
      <body className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyCTA />
        <ChatbotWidget />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}

