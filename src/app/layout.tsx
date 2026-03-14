import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "fdezz — AI Terminal",
  description: "Developer portfolio with an interactive AI terminal interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#0a0a0a]">
      <body className={`${jetbrainsMono.variable} font-mono antialiased bg-[#0a0a0a] text-[#e6f7ff] overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
