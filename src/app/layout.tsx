import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Santi | AI Developer & Engineer",
  description:
    "Interactive AI terminal portfolio. Explore projects, skills, and background through a cyberpunk-inspired interface.",
  keywords: [
    "portfolio",
    "developer",
    "AI engineer",
    "machine learning",
    "next.js",
    "terminal",
  ],
  authors: [{ name: "Santi" }],
  openGraph: {
    title: "Santi | AI Developer & Engineer",
    description:
      "Interactive AI terminal portfolio showcasing machine learning and full-stack development projects.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
