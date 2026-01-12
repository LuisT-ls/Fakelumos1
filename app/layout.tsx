import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fakelumos.vercel.app'),
  title: {
    default: "Fake Lumos - Detector de Fake News com IA",
    template: "%s | Fake Lumos",
  },
  description: "Verifique a veracidade de notícias usando inteligência artificial do Google Gemini. Detecte fake news em segundos com nossa ferramenta gratuita de fact-checking.",
  keywords: [
    "fake news",
    "detector de fake news",
    "verificação de notícias",
    "fact checking",
    "inteligência artificial",
    "IA",
    "desinformação",
    "verificação de fatos",
    "notícias falsas",
    "combate à desinformação",
  ],
  authors: [{ name: "Fake Lumos", url: "https://fakelumos.vercel.app" }],
  creator: "Luís Teixeira",
  publisher: "Fake Lumos",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: ["en_US", "es_ES"],
    url: "https://fakelumos.vercel.app",
    siteName: "Fake Lumos",
    title: "Fake Lumos - Detector de Fake News com IA",
    description: "Verifique a veracidade de notícias usando inteligência artificial do Google Gemini. Detecte fake news em segundos.",
    images: [
      {
        url: "/images/favicon/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Fake Lumos Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fake Lumos - Detector de Fake News com IA",
    description: "Verifique a veracidade de notícias usando inteligência artificial. Detecte fake news em segundos.",
    images: ["/images/favicon/android-chrome-512x512.png"],
  },
  verification: {
    google: "googlefe86f56001f67d03",
  },
  alternates: {
    canonical: "https://fakelumos.vercel.app",
    languages: {
      "pt-BR": "https://fakelumos.vercel.app/pt-BR",
      "en": "https://fakelumos.vercel.app/en",
      "es": "https://fakelumos.vercel.app/es",
    },
  },
  icons: {
    icon: [
      { url: "/images/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/images/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/images/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/images/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/images/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
