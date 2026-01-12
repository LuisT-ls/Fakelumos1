"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Calendar, Search, AlertTriangle, Image } from "lucide-react";

export function TipsSection() {
  const t = useTranslations();

  const tips = [
    {
      key: "verifySource",
      icon: CheckCircle2,
    },
    {
      key: "analyzeDate",
      icon: Calendar,
    },
    {
      key: "searchOtherSources",
      icon: Search,
    },
    {
      key: "identifyWarningSigns",
      icon: AlertTriangle,
    },
    {
      key: "verifyMedia",
      icon: Image,
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-bold">{t("tips.title")}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.key}
                className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Icon className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">{t(`tips.${tip.key}.title`)}</h3>
                </div>
                <p className="text-muted-foreground">{t(`tips.${tip.key}.description`)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
