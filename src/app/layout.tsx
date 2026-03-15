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
  title: "sfseoane — AI Terminal Portfolio",
  description: "Interactive AI terminal portfolio. Data Engineer & Full-Stack Developer specializing in AI, Big Data, and Cloud Architecture.",
  keywords: ["Data Engineer", "Full Stack Developer", "AI", "Big Data", "Python", "TypeScript", "React", "Next.js"],
  authors: [
    {
      name: "Santiago Fernández",
      url: "https://sfseoane.es",
    },
  ],
  creator: "Santiago Fernández",
  publisher: "sfseoane",
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
    url: "https://sfseoane.es",
    siteName: "sfseoane — AI Terminal",
    title: "sfseoane — AI Terminal Portfolio",
    description: "Interactive AI terminal portfolio showcasing projects, skills, and experience in Data Engineering and Full-Stack Development.",
    images: [
      {
        url: "https://sfseoane.es/og-image.svg",
        width: 1200,
        height: 630,
        alt: "sfseoane AI Terminal Portfolio",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "sfseoane — AI Terminal Portfolio",
    description: "Interactive portfolio showcasing Data Engineering & Full-Stack Development projects",
    images: ["https://sfseoane.es/og-image.svg"],
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
        <script defer data-domain="sfseoane.es" src="https://plausible.io/js/script.js" />
      </head>
      <body className={`${jetbrainsMono.variable} font-mono antialiased bg-[#0a0a0a] text-[#e6f7ff] overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
