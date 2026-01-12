import { Metadata } from "next";
import { PrivacyContent } from "./privacy-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://fakelumos.vercel.app";

  const metaMap: Record<string, { title: string; description: string }> = {
    "pt-BR": {
      title: "Política de Privacidade - Fake Lumos",
      description:
        "Política de privacidade do Fake Lumos. Saiba como protegemos seus dados pessoais e informações.",
    },
    en: {
      title: "Privacy Policy - Fake Lumos",
      description:
        "Fake Lumos privacy policy. Learn how we protect your personal data and information.",
    },
    es: {
      title: "Política de Privacidad - Fake Lumos",
      description:
        "Política de privacidad de Fake Lumos. Conozca cómo protegemos sus datos personales e información.",
    },
  };

  const meta = metaMap[locale] || metaMap["pt-BR"];

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/privacy`,
      languages: {
        "pt-BR": `${baseUrl}/pt-BR/privacy`,
        en: `${baseUrl}/en/privacy`,
        es: `${baseUrl}/es/privacy`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/${locale}/privacy`,
      locale: locale === "pt-BR" ? "pt_BR" : locale === "en" ? "en_US" : "es_ES",
    },
  };
}

export default function PrivacyPage() {
  return <PrivacyContent />;
}
