import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { TermsContent } from "./terms-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://fakelumos.vercel.app";

  const metaMap: Record<string, { title: string; description: string }> = {
    "pt-BR": {
      title: "Termos de Uso - Fake Lumos",
      description:
        "Termos de uso do Fake Lumos. Leia os termos e condições de uso da nossa plataforma de detecção de fake news.",
    },
    en: {
      title: "Terms of Use - Fake Lumos",
      description:
        "Fake Lumos terms of use. Read the terms and conditions for using our fake news detection platform.",
    },
    es: {
      title: "Términos de Uso - Fake Lumos",
      description:
        "Términos de uso de Fake Lumos. Lea los términos y condiciones para usar nuestra plataforma de detección de noticias falsas.",
    },
  };

  const meta = metaMap[locale] || metaMap["pt-BR"];

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/terms`,
      languages: {
        "pt-BR": `${baseUrl}/pt-BR/terms`,
        en: `${baseUrl}/en/terms`,
        es: `${baseUrl}/es/terms`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/${locale}/terms`,
      locale: locale === "pt-BR" ? "pt_BR" : locale === "en" ? "en_US" : "es_ES",
    },
  };
}

export default function TermsPage() {
  return <TermsContent />;
}
