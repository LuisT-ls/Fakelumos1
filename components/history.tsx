"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle, AlertTriangle, Trash2 } from "lucide-react";
import { ConfirmDialog } from "./confirm-dialog";
import type { VerificationResult } from "@/lib/gemini-analysis";

interface HistoryEntry {
  id: number;
  content: string;
  result: VerificationResult;
  timestamp: string;
}

export function History() {
  const t = useTranslations();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("verificationHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("verificationHistory");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    };

    // Atualizar quando o histórico mudar (mesmo na mesma aba)
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("customStorageChange", handleStorageChange);
    
    // Polling para garantir atualização
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("customStorageChange", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem("verificationHistory");
    setHistory([]);
    
    // Disparar evento para atualizar outros componentes
    if (typeof window !== "undefined") {
      const event = new CustomEvent("customStorageChange");
      window.dispatchEvent(event);
    }
  };

  if (history.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold">{t("history.title")}</h2>
        <p className="text-muted-foreground">{t("history.empty")}</p>
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleClearHistory}
        title={t("history.clearConfirm.title")}
        message={t("history.clearConfirm.message")}
        confirmText={t("history.clearConfirm.confirm")}
        cancelText={t("history.clearConfirm.cancel")}
        variant="danger"
      />
      
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t("history.title")}</h2>
          <button
            onClick={() => setShowConfirmDialog(true)}
            className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
            aria-label={t("history.clear")}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">{t("history.clear")}</span>
          </button>
        </div>
      <div className="space-y-4">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="rounded-md border bg-background p-4 transition-colors hover:bg-accent/50"
          >
            <div className="mb-2 flex items-start justify-between gap-4">
              <p className="flex-1 text-sm">{entry.content}</p>
              <div className="flex items-center gap-2">
                {entry.result.geminiAnalysis.classificacao ===
                "Comprovadamente Verdadeiro" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : entry.result.geminiAnalysis.classificacao ===
                  "Comprovadamente Falso" ? (
                  <XCircle className="h-5 w-5 text-destructive" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {entry.result.geminiAnalysis.classificacao}
              </span>
              <span className="text-muted-foreground">
                {t("history.confidence")}:{" "}
                {Math.round(entry.result.geminiAnalysis.score * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
