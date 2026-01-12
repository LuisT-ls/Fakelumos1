import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { AccessibilityProvider } from "@/components/accessibility-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";

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

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      <StructuredData locale={locale} />
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
  );
}
