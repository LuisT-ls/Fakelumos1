"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { History } from "./history";
import { Loader2 } from "lucide-react";
import { VerificationResultDisplay } from "./verification-result";
import { ProgressIndicator } from "./progress-indicator";
import type { VerificationResult } from "@/lib/gemini-analysis";

export function NewsVerifier() {
  const t = useTranslations();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [hasRealtimeSearch, setHasRealtimeSearch] = useState(false);

  const handleVerify = async () => {
    if (!content.trim()) {
      setError(t("hero.errorEmpty"));
      return;
    }

    // Detectar se precisa de busca em tempo real (mesma lógica do backend)
    const isPost2022 = (text: string): boolean => {
      const regexAno = /\b(202[3-9]|20[3-9][0-9]|21[0-9][0-9])\b/;
      const palavrasChave = [
        "atualmente",
        "hoje",
        "neste ano",
        "últimas notícias",
        "recente",
        "agora",
        "nas últimas semanas",
        "nas últimas horas",
      ];
      if (regexAno.test(text.toLowerCase())) return true;
      if (palavrasChave.some((palavra) => text.toLowerCase().includes(palavra)))
        return true;
      return false;
    };

    setLoading(true);
    setError(null);
    setResult(null);
    setIsRateLimited(false);
    setHasRealtimeSearch(isPost2022(content));

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
        const errorData = await response.json();
        
        // Tratamento específico para rate limiting (429)
        if (response.status === 429 || errorData.errorCode === "RATE_LIMIT_EXCEEDED") {
          setIsRateLimited(true);
          // Não loga erro no console para rate limiting, pois é esperado
          throw new Error(t("hero.errorRateLimit"));
        }
        
        // Para outros erros, loga normalmente
        console.error("Erro na verificação:", errorData);
        throw new Error(errorData.error || t("hero.errorVerify"));
      }

      const verificationResult: VerificationResult = await response.json();
      setResult(verificationResult);

      // Salvar no histórico
      const history = JSON.parse(localStorage.getItem("verificationHistory") || "[]");
      const newEntry = {
        id: verificationResult.id,
        content: verificationResult.text,
        result: verificationResult,
        timestamp: verificationResult.timestamp,
      };
      history.unshift(newEntry);
      const limitedHistory = history.slice(0, 10);
      localStorage.setItem("verificationHistory", JSON.stringify(limitedHistory));
      
      // Disparar evento customizado para atualizar o histórico
      if (typeof window !== "undefined") {
        const event = new CustomEvent("customStorageChange");
        window.dispatchEvent(event);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("hero.errorVerify");
      setError(errorMessage);
      
      // Se não for rate limit, limpa o flag
      if (!isRateLimited && !errorMessage.includes("quota")) {
        setIsRateLimited(false);
      }
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
            className="textarea-scrollbar mb-4 min-h-[200px] w-full rounded-md border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
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
            <div className={`mt-4 rounded-md p-4 text-sm ${
              isRateLimited 
                ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400" 
                : "bg-destructive/10 text-destructive"
            }`}>
              <div className="flex items-start gap-2">
                <span>{error}</span>
              </div>
              {isRateLimited && (
                <p className="mt-2 text-xs opacity-80">
                  {t("hero.rateLimitTip")}
                </p>
              )}
            </div>
          )}

          <ProgressIndicator isActive={loading} hasRealtimeSearch={hasRealtimeSearch} />

          {result && <VerificationResultDisplay result={result} />}
        </div>

        <History />
      </div>
    </div>
  );
}
