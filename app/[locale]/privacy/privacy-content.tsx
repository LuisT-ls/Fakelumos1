"use client";

import { useTranslations } from "next-intl";

export function PrivacyContent() {
  const t = useTranslations("privacy");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold">{t("title")}</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">{t("section1.title")}</h2>
            <p className="mb-4 text-muted-foreground">{t("section1.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">{t("section2.title")}</h2>
            <p className="mb-4 text-muted-foreground">{t("section2.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">{t("section3.title")}</h2>
            <p className="mb-4 text-muted-foreground">{t("section3.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">{t("section4.title")}</h2>
            <p className="mb-4 text-muted-foreground">{t("section4.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">{t("section5.title")}</h2>
            <p className="mb-4 text-muted-foreground">{t("section5.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">{t("section6.title")}</h2>
            <p className="mb-4 text-muted-foreground">{t("section6.content")}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">{t("section7.title")}</h2>
            <p className="mb-4 text-muted-foreground">{t("section7.content")}</p>
          </section>

          <section className="mb-8">
            <p className="text-sm text-muted-foreground">{t("lastUpdated")}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
