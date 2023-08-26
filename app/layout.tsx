import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ottomon | Chat with code, videos, and docs",
  description:
    "Elevate your data apps with seamless, production-ready chat integration. Effortlessly ingest, personalize, and deploy using just a single line of code.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/logo.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
