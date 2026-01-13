import { NewsVerifier } from "@/components/news-verifier";
import { TipsSection } from "@/components/tips-section";
import { TutorialOverlay } from "@/components/tutorial-overlay";
import { TutorialExamples } from "@/components/tutorial-examples";
import { ContextualTips } from "@/components/contextual-tips";
import { SEOContent } from "@/components/seo-content";
import { StructuredData } from "@/components/structured-data";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://fakelumos.vercel.app";

  const metaMap: Record<string, { 
    title: string; 
    description: string;
    keywords: string[];
  }> = {
    "pt-BR": {
      title: "Verificador de Fake News Grátis | Detector de Notícias Falsas com IA",
      description:
        "Verificador de fake news gratuito e detector de notícias falsas usando inteligência artificial. Verifique a veracidade de notícias em segundos com nossa ferramenta de fact-checking online. Combata a desinformação com IA do Google Gemini.",
      keywords: [
        "verificador de fake news",
        "detector de fake news",
        "verificador de notícias falsas",
        "detector de notícias falsas",
        "verificação de fake news",
        "fact checking",
        "verificação de notícias",
        "detector de desinformação",
        "verificador de desinformação",
        "ferramenta de fact checking",
        "verificação de fatos",
        "checagem de fatos",
        "detector de mentiras",
        "verificador de mentiras",
        "fake news detector",
        "verificador de notícias online",
        "detector de notícias com IA",
        "verificador de notícias com inteligência artificial",
        "combate à desinformação",
        "ferramenta anti fake news",
      ],
    },
    en: {
      title: "Free Fake News Verifier | Fake News Detector with AI",
      description:
        "Free fake news verifier and fake news detector using artificial intelligence. Verify news veracity in seconds with our online fact-checking tool. Combat disinformation with Google Gemini AI.",
      keywords: [
        "fake news verifier",
        "fake news detector",
        "news verifier",
        "fact checker",
        "fact checking tool",
        "news verification",
        "disinformation detector",
        "misinformation detector",
        "online fact checker",
        "AI fact checker",
        "news veracity checker",
        "truth detector",
        "fake news checker",
        "news authenticity checker",
        "disinformation verifier",
        "misinformation verifier",
        "fact verification tool",
        "news credibility checker",
      ],
    },
    es: {
      title: "Verificador de Noticias Falsas Gratis | Detector de Fake News con IA",
      description:
        "Verificador de noticias falsas gratuito y detector de fake news usando inteligencia artificial. Verifica la veracidad de las noticias en segundos con nuestra herramienta de verificación de hechos online. Combate la desinformación con IA de Google Gemini.",
      keywords: [
        "verificador de fake news",
        "detector de fake news",
        "verificador de noticias falsas",
        "detector de noticias falsas",
        "verificación de fake news",
        "verificación de hechos",
        "fact checking",
        "detector de desinformación",
        "verificador de desinformación",
        "herramienta de verificación",
        "chequeo de hechos",
        "detector de mentiras",
        "verificador de mentiras",
        "verificador de noticias online",
        "detector de noticias con IA",
        "combate a la desinformación",
      ],
    },
  };
  
  const meta = metaMap[locale] || metaMap["pt-BR"];

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/${locale}`,
      type: "website",
      siteName: "Fake Lumos",
      images: [
        {
          url: `${baseUrl}/images/favicon/android-chrome-512x512.png`,
          width: 512,
          height: 512,
          alt: "Fake Lumos - Verificador de Fake News",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${baseUrl}/images/favicon/android-chrome-512x512.png`],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <StructuredData locale={locale} />
      <TutorialOverlay />
      <ContextualTips />
      <TutorialExamples />
      <NewsVerifier />
      <SEOContent />
      <TipsSection />
    </>
  );
}
