import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";
import { JsonSchema } from "@/components/JsonSchema";
import { OG_IMAGE_URL, SITE_URL } from "@/lib/site";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const newsreader = Newsreader({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "Santiago Fernández | Data Scientist, founder of Makineo",
  description: "Data Scientist at Qaleon and founder of Makineo, a platform for Spain's electronic music scene. Real pipelines, real numbers, plus an AI assistant behind ⌘K.",
  keywords: ["Data Scientist", "Founder", "Makineo", "Full Stack Developer", "AI", "Big Data", "Python", "TypeScript", "React", "Next.js"],
  authors: [
    {
      name: "Santiago Fernández",
      url: SITE_URL,
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
    url: SITE_URL,
    siteName: "Santiago Fernández",
    title: "Santiago Fernández | Data Scientist, founder of Makineo",
    description: "Data Scientist at Qaleon and founder of Makineo (900+ upcoming experiences). Real pipelines, real numbers, in production.",
    images: [
      {
        // PNG, not SVG — Twitter/Facebook/LinkedIn don't render SVG previews.
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "sfseoane AI Terminal Portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Santiago Fernández | Data Scientist, founder of Makineo",
    description: "Data Scientist at Qaleon and founder of Makineo. Real pipelines, real numbers.",
    images: [OG_IMAGE_URL],
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
    // Default locale is Spanish (see Terminal's useLocalStorage default);
    // kept in sync client-side as the user switches language.
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* The opening title plays once per session for people. A repeat visit, a crawler or an automated browser (screenshots, Lighthouse) skips it before first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{var n=navigator,b=n.webdriver||/bot|crawl|spider|lighthouse|headless|prerender|preview/i.test(n.userAgent);if(b||sessionStorage.getItem('intro'))document.documentElement.dataset.intro='done';else sessionStorage.setItem('intro','1')}catch(e){}",
          }}
        />
        <JsonSchema />
        <script defer data-domain="sfseoane.es" src="https://plausible.io/js/script.js" />
      </head>
      <body className={`${plexMono.variable} ${plexSans.variable} ${newsreader.variable} font-mono antialiased`}>
        {children}
      </body>
    </html>
  );
}
