import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gmail → WhatsApp Automation",
  description:
    "Bridge Gmail with WhatsApp to deliver automated notifications from incoming emails."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
