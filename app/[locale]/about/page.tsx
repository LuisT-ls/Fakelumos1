import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">{t("about.title")}</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p>{t("about.description")}</p>
          <p className="mt-4">{t("footer.aboutDescription")}</p>
        </div>
      </div>
    </div>
  );
}
