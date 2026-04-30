import { HowItWorksSection } from "@/components/how-it-works-section";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://fakelumos.vercel.app";

  const metaMap: Record<string, { title: string; description: string }> = {
    "pt-BR": {
      title: "Como Funciona - Fake Lumos",
      description:
        "Saiba como nossa ferramenta de detecção de fake news funciona usando inteligência artificial do Google Gemini para analisar e verificar notícias.",
    },
    en: {
      title: "How It Works - Fake Lumos",
      description:
        "Learn how our fake news detection tool works using Google Gemini artificial intelligence to analyze and verify news.",
    },
    es: {
      title: "Cómo Funciona - Fake Lumos",
      description:
        "Aprende cómo funciona nuestra herramienta de detección de noticias falsas usando inteligencia artificial de Google Gemini para analizar y verificar noticias.",
    },
  };
  
  const meta = metaMap[locale] || metaMap["pt-BR"];

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/${locale}/how-it-works`,
    },
  };
}

export default function HowItWorksPage() {
  return <HowItWorksSection />;
}

