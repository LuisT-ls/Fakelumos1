"use client";

import { useTranslations } from "next-intl";

/**
 * Componente de conteúdo otimizado para SEO
 * Renderiza conteúdo rico em palavras-chave de forma natural
 */
export function SEOContent() {
  const t = useTranslations();

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold mb-6">
            {t("seo.content.title")}
          </h2>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg">
              {t("seo.content.paragraph1")}
            </p>
            
            <p>
              {t("seo.content.paragraph2")}
            </p>
            
            <h3 className="text-2xl font-semibold mt-8 mb-4 text-foreground">
              {t("seo.content.subtitle1")}
            </h3>
            
            <p>
              {t("seo.content.paragraph3")}
            </p>
            
            <h3 className="text-2xl font-semibold mt-8 mb-4 text-foreground">
              {t("seo.content.subtitle2")}
            </h3>
            
            <p>
              {t("seo.content.paragraph4")}
            </p>
            
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t("seo.content.feature1")}</li>
              <li>{t("seo.content.feature2")}</li>
              <li>{t("seo.content.feature3")}</li>
              <li>{t("seo.content.feature4")}</li>
              <li>{t("seo.content.feature5")}</li>
            </ul>
            
            <p className="mt-6">
              {t("seo.content.paragraph5")}
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
