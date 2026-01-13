"use client";

import { useTranslations } from "next-intl";
import { Lightbulb, X, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useTutorial } from "./tutorial-provider";

interface Example {
  id: string;
  title: string;
  content: string;
  description: string;
  category: "fake" | "true" | "partial";
}

export function TutorialExamples() {
  const t = useTranslations();
  const { showExamples, toggleExamples } = useTutorial();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const examples: Example[] = [
    {
      id: "example-1",
      title: t("tutorial.examples.example1.title"),
      content: t("tutorial.examples.example1.content"),
      description: t("tutorial.examples.example1.description"),
      category: "fake",
    },
    {
      id: "example-2",
      title: t("tutorial.examples.example2.title"),
      content: t("tutorial.examples.example2.content"),
      description: t("tutorial.examples.example2.description"),
      category: "true",
    },
    {
      id: "example-3",
      title: t("tutorial.examples.example3.title"),
      content: t("tutorial.examples.example3.content"),
      description: t("tutorial.examples.example3.description"),
      category: "partial",
    },
  ];

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  if (!showExamples) {
    return (
      <button
        onClick={toggleExamples}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl sm:right-4"
        aria-label={t("tutorial.showExamples")}
      >
        <Lightbulb className="h-4 w-4" />
        <span className="hidden sm:inline">{t("tutorial.showExamples")}</span>
      </button>
    );
  }

  return (
    <>
      {/* Overlay para fechar ao clicar fora */}
      <div
        className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
        onClick={toggleExamples}
        aria-hidden="true"
      />
      
      {/* Modal de exemplos */}
      <div className="fixed inset-4 z-40 flex w-full max-w-md flex-col rounded-lg border bg-card shadow-2xl sm:inset-y-4 sm:left-auto sm:right-4 sm:max-h-[calc(100vh-2rem)]">
        {/* Cabeçalho fixo */}
        <div className="flex-shrink-0 border-b p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">{t("tutorial.examples.title")}</h3>
            </div>
            <button
              onClick={toggleExamples}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={t("tutorial.closeExamples")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground">
            {t("tutorial.examples.description")}
          </p>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto p-4 pt-4 sm:p-6">
          <div className="space-y-3">
            {examples.map((example) => (
              <div
                key={example.id}
                className="rounded-md border bg-background p-4 transition-colors hover:bg-muted/50"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{example.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {example.description}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                      example.category === "fake"
                        ? "bg-red-500/10 text-red-600 dark:text-red-400"
                        : example.category === "true"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {example.category === "fake"
                      ? t("tutorial.examples.category.fake")
                      : example.category === "true"
                      ? t("tutorial.examples.category.true")
                      : t("tutorial.examples.category.partial")}
                  </span>
                </div>
                <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">
                  {example.content}
                </p>
                <button
                  onClick={() => handleCopy(example.content, example.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  {copiedId === example.id ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {t("tutorial.examples.copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      {t("tutorial.examples.copy")}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            {t("tutorial.examples.footer")}
          </p>
        </div>
      </div>
    </>
  );
}
