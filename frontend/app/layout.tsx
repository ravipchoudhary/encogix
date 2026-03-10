import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ChatbotWidget from "../components/ChatbotWidget";
import Header from "../components/Header";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Encogix Technology | Engineering Digital Innovation",
  description:
    "Encogix Technology is a global technology company delivering software development, cloud solutions, and digital innovation for enterprises.",
  metadataBase: new URL("https://www.encogix.example"), // adjust when deploying
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatbotWidget />
      </body>
    </html>
  );
}

