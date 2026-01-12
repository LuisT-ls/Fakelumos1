import { useTranslations } from "next-intl";

export default function HowItWorksPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">{t("howItWorks.title")}</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p>{t("howItWorks.description")}</p>
          <p className="mt-4">
            O sistema analisa o conteúdo da notícia utilizando modelos de linguagem
            avançados do Google Gemini, verificando padrões, fontes, contexto e
            consistência para determinar a veracidade da informação.
          </p>
        </div>
      </div>
    </div>
  );
}
