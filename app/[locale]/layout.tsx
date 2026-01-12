import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { AccessibilityProvider } from "@/components/accessibility-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://fakelumos.vercel.app";

  const localeMap: Record<string, any> = {
    "pt-BR": {
      title: "Fake Lumos - Detector de Fake News com IA",
      description:
        "Verifique a veracidade de notícias usando inteligência artificial do Google Gemini. Detecte fake news em segundos com nossa ferramenta gratuita de fact-checking.",
    },
    en: {
      title: "Fake Lumos - Fake News Detector with AI",
      description:
        "Verify the veracity of news using Google Gemini artificial intelligence. Detect fake news in seconds with our free fact-checking tool.",
    },
    es: {
      title: "Fake Lumos - Detector de Noticias Falsas con IA",
      description:
        "Verifica la veracidad de las noticias usando inteligencia artificial de Google Gemini. Detecta noticias falsas en segundos con nuestra herramienta gratuita de verificación de hechos.",
    },
  };

  const meta = localeMap[locale] || localeMap["pt-BR"];

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        "pt-BR": `${baseUrl}/pt-BR`,
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/${locale}`,
      locale: locale === "pt-BR" ? "pt_BR" : locale === "en" ? "en_US" : "es_ES",
      alternateLocale: ["pt_BR", "en_US", "es_ES"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const baseUrl = "https://fakelumos.vercel.app";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fake Lumos",
    url: baseUrl,
    logo: `${baseUrl}/images/favicon/android-chrome-512x512.png`,
    description:
      locale === "pt-BR"
        ? "Detector de fake news usando inteligência artificial do Google Gemini"
        : locale === "en"
        ? "Fake news detector using Google Gemini artificial intelligence"
        : "Detector de noticias falsas usando inteligencia artificial de Google Gemini",
    sameAs: [baseUrl],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Fake Lumos",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: locale === "pt-BR" ? "pt-BR" : locale === "en" ? "en" : "es",
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Fake Lumos",
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
    description:
      locale === "pt-BR"
        ? "Ferramenta gratuita para verificação de notícias usando IA"
        : locale === "en"
        ? "Free tool for news verification using AI"
        : "Herramienta gratuita para verificación de noticias usando IA",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider>
          <AccessibilityProvider>
            <div className="flex min-h-screen flex-col">
              <Nav />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AccessibilityProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </>
  );
}
