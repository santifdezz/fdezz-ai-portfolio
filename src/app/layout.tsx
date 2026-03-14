import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import { JsonSchema } from "@/components/JsonSchema";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "fdezz — AI Terminal Portfolio",
  description: "Interactive AI terminal portfolio. Data Engineer & Full-Stack Developer specializing in AI, Big Data, and Cloud Architecture.",
  keywords: ["Data Engineer", "Full Stack Developer", "AI", "Big Data", "Python", "TypeScript", "React", "Next.js"],
  authors: [
    {
      name: "Santiago Fernández",
      url: "https://fdezz.ai",
    },
  ],
  creator: "Santiago Fernández",
  publisher: "fdezz",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_ES"],
    url: "https://fdezz.ai",
    siteName: "fdezz — AI Terminal",
    title: "fdezz — AI Terminal Portfolio",
    description: "Interactive AI terminal portfolio showcasing projects, skills, and experience in Data Engineering and Full-Stack Development.",
    images: [
      {
        url: "https://fdezz.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "fdezz AI Terminal Portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "fdezz — AI Terminal Portfolio",
    description: "Interactive portfolio showcasing Data Engineering & Full-Stack Development projects",
    images: ["https://fdezz.ai/og-image.png"],
    creator: "@sfdezz",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "fdezz AI Terminal",
  },
  formatDetection: {
    email: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#0a0a0a]">
      <head>
        <JsonSchema />
      </head>
      <body className={`${jetbrainsMono.variable} font-mono antialiased bg-[#0a0a0a] text-[#e6f7ff] overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
