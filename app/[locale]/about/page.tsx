import { Metadata } from "next";
import { AboutContent } from "./about-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://fakelumos.vercel.app";

  const metaMap: Record<string, { title: string; description: string }> = {
    "pt-BR": {
      title: "Sobre o Projeto - Fake Lumos",
      description:
        "Conheça a missão, visão e história do Fake Lumos. Projeto desenvolvido na UFBA para combater desinformação usando inteligência artificial.",
    },
    en: {
      title: "About the Project - Fake Lumos",
      description:
        "Learn about Fake Lumos mission, vision and history. Project developed at UFBA to combat disinformation using artificial intelligence.",
    },
    es: {
      title: "Acerca del Proyecto - Fake Lumos",
      description:
        "Conoce la misión, visión e historia de Fake Lumos. Proyecto desarrollado en la UFBA para combatir la desinformación usando inteligencia artificial.",
    },
  };
  
  const meta = metaMap[locale] || metaMap["pt-BR"];

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/${locale}/about`,
    },
  };
}

export default function AboutPage() {
  return <AboutContent />;
}
