import { TipsSection } from "@/components/tips-section";
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
      title: "Dicas para Identificar Fake News - Fake Lumos",
      description:
        "Aprenda a identificar fake news com nossas dicas essenciais: verifique a fonte, analise a data, pesquise em outras fontes e identifique sinais de alerta.",
    },
    en: {
      title: "Tips to Identify Fake News - Fake Lumos",
      description:
        "Learn to identify fake news with our essential tips: verify the source, analyze the date, search other sources, and identify warning signs.",
    },
    es: {
      title: "Consejos para Identificar Noticias Falsas - Fake Lumos",
      description:
        "Aprende a identificar noticias falsas con nuestros consejos esenciales: verifica la fuente, analiza la fecha, busca en otras fuentes e identifica señales de alerta.",
    },
  };
  
  const meta = metaMap[locale] || metaMap["pt-BR"];

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/${locale}/tips`,
    },
  };
}

export default function TipsPage() {
  return <TipsSection />;
}
