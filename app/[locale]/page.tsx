import { NewsVerifier } from "@/components/news-verifier";
import { TipsSection } from "@/components/tips-section";
import { TutorialOverlay } from "@/components/tutorial-overlay";
import { TutorialExamples } from "@/components/tutorial-examples";
import { ContextualTips } from "@/components/contextual-tips";
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
      title: "Detector de Fake News com IA | Fake Lumos",
      description:
        "Verifique a veracidade de notícias em segundos usando inteligência artificial do Google Gemini. Ferramenta gratuita de fact-checking para combater desinformação.",
    },
    en: {
      title: "Fake News Detector with AI | Fake Lumos",
      description:
        "Verify the veracity of news in seconds using Google Gemini artificial intelligence. Free fact-checking tool to combat disinformation.",
    },
    es: {
      title: "Detector de Noticias Falsas con IA | Fake Lumos",
      description:
        "Verifica la veracidad de las noticias en segundos usando inteligencia artificial de Google Gemini. Herramienta gratuita de verificación de hechos para combatir la desinformación.",
    },
  };
  
  const meta = metaMap[locale] || metaMap["pt-BR"];

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/${locale}`,
    },
  };
}

export default function HomePage() {
  return (
    <>
      <TutorialOverlay />
      <ContextualTips />
      <TutorialExamples />
      <NewsVerifier />
      <TipsSection />
    </>
  );
}
