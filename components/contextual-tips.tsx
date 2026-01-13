"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Info, X } from "lucide-react";
import { useTutorial } from "./tutorial-provider";

interface ContextualTip {
  id: string;
  condition: () => boolean;
  message: string;
  position: "top" | "bottom";
  delay?: number;
}

export function ContextualTips() {
  const t = useTranslations();
  const { showContextualTips } = useTutorial();
  const [activeTip, setActiveTip] = useState<ContextualTip | null>(null);
  const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());
  const dismissedTipsRef = useRef<Set<string>>(new Set());
  const activeTipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeTipRef = useRef<ContextualTip | null>(null);

  // Carregar dicas dispensadas apenas uma vez na montagem
  useEffect(() => {
    const stored = localStorage.getItem("dismissedContextualTips");
    if (stored) {
      const parsed = new Set(JSON.parse(stored));
      setDismissedTips(parsed);
      dismissedTipsRef.current = parsed;
    }
  }, []);

  // Sincronizar refs quando estados mudarem
  useEffect(() => {
    dismissedTipsRef.current = dismissedTips;
  }, [dismissedTips]);

  useEffect(() => {
    activeTipRef.current = activeTip;
  }, [activeTip]);

  const tips: ContextualTip[] = useMemo(() => [
    {
      id: "tip-empty-input",
      condition: () => {
        const textarea = document.querySelector("textarea");
        return textarea !== null && textarea.value.trim() === "";
      },
      message: t("tutorial.contextualTips.emptyInput"),
      position: "bottom",
      delay: 3000,
    },
    {
      id: "tip-short-text",
      condition: () => {
        const textarea = document.querySelector("textarea");
        return (
          textarea !== null &&
          textarea.value.trim().length > 0 &&
          textarea.value.trim().length < 50
        );
      },
      message: t("tutorial.contextualTips.shortText"),
      position: "bottom",
      delay: 2000,
    },
    {
      id: "tip-first-verification",
      condition: () => {
        const history = localStorage.getItem("verificationHistory");
        return history === null || JSON.parse(history).length === 0;
      },
      message: t("tutorial.contextualTips.firstVerification"),
      position: "top",
      delay: 1000,
    },
  ], [t]);

  const checkTips = useCallback(() => {
    if (!showContextualTips) {
      return;
    }

    // Se já há uma dica ativa, não verificar novamente
    if (activeTipRef.current) {
      return;
    }

    // Limpar timer anterior se existir
    if (activeTipTimerRef.current) {
      clearTimeout(activeTipTimerRef.current);
      activeTipTimerRef.current = null;
    }

    const currentDismissed = dismissedTipsRef.current;

    // Verificar se todas as dicas foram dispensadas
    if (currentDismissed.size >= tips.length) {
      return;
    }

    // Encontrar a primeira dica que deve ser mostrada
    for (const tip of tips) {
      if (currentDismissed.has(tip.id)) {
        continue; // Dica já foi dispensada
      }

      if (tip.condition()) {
        activeTipTimerRef.current = setTimeout(() => {
          setActiveTip(tip);
        }, tip.delay || 0);
        break; // Mostrar apenas uma dica por vez
      }
    }
  }, [showContextualTips, tips]);

  useEffect(() => {
    if (!showContextualTips) {
      setActiveTip(null);
      if (activeTipTimerRef.current) {
        clearTimeout(activeTipTimerRef.current);
        activeTipTimerRef.current = null;
      }
      return;
    }

    const interval = setInterval(checkTips, 2000);
    checkTips(); // Verificar imediatamente

    return () => {
      clearInterval(interval);
      if (activeTipTimerRef.current) {
        clearTimeout(activeTipTimerRef.current);
        activeTipTimerRef.current = null;
      }
    };
  }, [showContextualTips, checkTips]);

  const handleDismiss = useCallback((tipId: string) => {
    setActiveTip(null);
    
    // Limpar timer se existir
    if (activeTipTimerRef.current) {
      clearTimeout(activeTipTimerRef.current);
      activeTipTimerRef.current = null;
    }
    
    setDismissedTips((prev) => {
      const newDismissed = new Set(prev);
      newDismissed.add(tipId);
      dismissedTipsRef.current = newDismissed;
      localStorage.setItem("dismissedContextualTips", JSON.stringify(Array.from(newDismissed)));
      return newDismissed;
    });
  }, []);

  if (!showContextualTips || !activeTip) {
    return null;
  }

  return (
    <div
      className={`fixed left-1/2 z-40 -translate-x-1/2 transform transition-all ${
        activeTip.position === "top" ? "top-4" : "bottom-4"
      }`}
    >
      <div className="flex items-start gap-3 rounded-lg border bg-card p-4 shadow-lg">
        <Info className="h-5 w-5 flex-shrink-0 text-primary" />
        <div className="flex-1">
          <p className="text-sm text-foreground">{activeTip.message}</p>
        </div>
        <button
          onClick={() => handleDismiss(activeTip.id)}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={t("tutorial.contextualTips.dismiss")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
