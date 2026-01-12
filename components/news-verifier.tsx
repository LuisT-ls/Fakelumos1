"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { History } from "./history";
import { Loader2 } from "lucide-react";

export interface VerificationResult {
  isFake: boolean;
  confidence: number;
  explanation: string;
  reasons: string[];
}

export function NewsVerifier() {
  const t = useTranslations();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!content.trim()) {
      setError(t("hero.errorEmpty"));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const locale = window.location.pathname.split("/")[1] || "pt-BR";
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, locale }),
      });

      if (!response.ok) {
        throw new Error(t("hero.errorVerify"));
      }

      const verificationResult = await response.json();
      setResult(verificationResult);

      // Salvar no histórico
      const history = JSON.parse(localStorage.getItem("verificationHistory") || "[]");
      const newEntry = {
        id: Date.now(),
        content: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
        result: verificationResult,
        timestamp: new Date().toISOString(),
      };
      history.unshift(newEntry);
      const limitedHistory = history.slice(0, 10);
      localStorage.setItem("verificationHistory", JSON.stringify(limitedHistory));
      
      // Disparar evento customizado para atualizar o histórico
      window.dispatchEvent(new Event("customStorageChange"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("hero.errorVerify"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">{t("hero.title")}</h1>
          <p className="text-muted-foreground">{t("hero.subtitle")}</p>
        </div>

        <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("hero.inputPlaceholder")}
            className="mb-4 min-h-[200px] w-full rounded-md border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={loading}
          />
          <button
            onClick={handleVerify}
            disabled={loading || !content.trim()}
            className="w-full rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("hero.verifying")}
              </span>
            ) : (
              t("hero.verifyButton")
            )}
          </button>

          {error && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6 rounded-md border p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {result.isFake ? t("history.fake") : t("history.true")}
                </h3>
                <span className="text-sm text-muted-foreground">
                  {t("history.confidence")}: {result.confidence}%
                </span>
              </div>
              <p className="mb-4 text-sm">{result.explanation}</p>
              {result.reasons.length > 0 && (
                <div>
                  <h4 className="mb-2 font-medium">{t("hero.reasons")}</h4>
                  <ul className="list-disc space-y-1 pl-6 text-sm">
                    {result.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <History />
      </div>
    </div>
  );
}
