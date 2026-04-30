"use client";

import { useTranslations } from "next-intl";
import { ClipboardList, BrainCircuit, Globe, BarChart3, Cpu, AlertCircle } from "lucide-react";

const stepIcons = [ClipboardList, BrainCircuit, Globe, BarChart3];

export function HowItWorksSection() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as Array<{
    number: string;
    title: string;
    description: string;
  }>;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">{t("title")}</h1>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Steps */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-semibold">{t("stepsTitle")}</h2>
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = stepIcons[index] ?? ClipboardList;
              return (
                <div
                  key={step.number}
                  className="flex gap-5 rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-primary">
                      {t("step")} {step.number}
                    </span>
                    <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Technology */}
        <section className="mb-10 rounded-xl border bg-card p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <Cpu className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">{t("technologyTitle")}</h2>
          </div>
          <p className="text-muted-foreground">{t("technologyDescription")}</p>
        </section>

        {/* Limitations */}
        <section className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-8">
          <div className="mb-4 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-semibold">{t("limitationsTitle")}</h2>
          </div>
          <p className="text-muted-foreground">{t("limitationsDescription")}</p>
        </section>
      </div>
    </div>
  );
}
