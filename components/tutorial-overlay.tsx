"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { X, ChevronRight, ChevronLeft, Sparkles, FileText, Search, CheckCircle2 } from "lucide-react";
import { useTutorial } from "./tutorial-provider";

interface TutorialStep {
  target: string; // ID ou classe do elemento
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
  icon: React.ReactNode;
}

export function TutorialOverlay() {
  const t = useTranslations();
  const {
    isTutorialActive,
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
  } = useTutorial();

  const steps: TutorialStep[] = [
    {
      target: "tutorial-textarea",
      title: t("tutorial.step1.title"),
      description: t("tutorial.step1.description"),
      position: "bottom",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      target: "tutorial-button",
      title: t("tutorial.step2.title"),
      description: t("tutorial.step2.description"),
      position: "top",
      icon: <Sparkles className="h-5 w-5" />,
    },
    {
      target: "tutorial-progress",
      title: t("tutorial.step3.title"),
      description: t("tutorial.step3.description"),
      position: "bottom",
      icon: <Search className="h-5 w-5" />,
    },
    {
      target: "tutorial-result",
      title: t("tutorial.step4.title"),
      description: t("tutorial.step4.description"),
      position: "top",
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    {
      target: "tutorial-history",
      title: t("tutorial.step5.title"),
      description: t("tutorial.step5.description"),
      position: "top",
      icon: <FileText className="h-5 w-5" />,
    },
  ];

  if (!isTutorialActive) {
    return null;
  }

  const currentStepData = steps[currentStep];
  if (!currentStepData) {
    return null;
  }

  // Encontrar o elemento alvo
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const element = document.querySelector(`[data-tutorial="${currentStepData.target}"]`) as HTMLElement;
    
    if (!element) {
      // Se o elemento não existir, avançar para o próximo passo após um delay
      if (currentStep < totalSteps - 1) {
        const timer = setTimeout(() => nextStep(), 500);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => completeTutorial(), 500);
        return () => clearTimeout(timer);
      }
    }

    setTargetElement(element);
    
    // Scroll para o elemento
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    
    // Aguardar scroll completar antes de calcular posição
    const timer = setTimeout(() => {
      const newRect = element.getBoundingClientRect();
      setRect(newRect);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentStep, currentStepData.target, totalSteps, nextStep, completeTutorial]);

  if (!targetElement || !rect) {
    return null;
  }

  const scrollY = window.scrollY || window.pageYOffset;
  const scrollX = window.scrollX || window.pageXOffset;

  // Calcular posição do tooltip baseado na posição do elemento
  const getTooltipPosition = () => {
    const spacing = 20;
    switch (currentStepData.position) {
      case "top":
        return {
          top: rect.top + scrollY - spacing,
          left: rect.left + scrollX + rect.width / 2,
          transform: "translate(-50%, -100%)",
        };
      case "bottom":
        return {
          top: rect.bottom + scrollY + spacing,
          left: rect.left + scrollX + rect.width / 2,
          transform: "translate(-50%, 0)",
        };
      case "left":
        return {
          top: rect.top + scrollY + rect.height / 2,
          left: rect.left + scrollX - spacing,
          transform: "translate(-100%, -50%)",
        };
      case "right":
        return {
          top: rect.top + scrollY + rect.height / 2,
          left: rect.right + scrollX + spacing,
          transform: "translate(0, -50%)",
        };
      default:
        return {
          top: rect.bottom + scrollY + spacing,
          left: rect.left + scrollX + rect.width / 2,
          transform: "translate(-50%, 0)",
        };
    }
  };

  const tooltipPosition = getTooltipPosition();

  // Scroll para o elemento se necessário
  useEffect(() => {
    targetElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentStep, targetElement]);

  return (
    <>
      {/* Overlay escuro */}
      <div
        className="fixed inset-0 z-50 bg-black/60 transition-opacity"
        onClick={skipTutorial}
        aria-hidden="true"
      />

      {/* Highlight do elemento */}
      {rect && (
        <div
          className="fixed z-50 rounded-lg border-4 border-primary shadow-2xl shadow-primary/50 transition-all pointer-events-none"
          style={{
            top: rect.top + scrollY - 8,
            left: rect.left + scrollX - 8,
            width: rect.width + 16,
            height: rect.height + 16,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="fixed z-50 w-full max-w-sm rounded-lg border bg-card p-6 shadow-2xl"
        style={tooltipPosition}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {currentStepData.icon}
            <div>
              <h3 className="text-lg font-bold">{currentStepData.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("tutorial.stepIndicator", { current: currentStep + 1, total: totalSteps })}
              </p>
            </div>
          </div>
          <button
            onClick={skipTutorial}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={t("tutorial.skip")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          {currentStepData.description}
        </p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={previousStep}
                className="flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
                {t("tutorial.previous")}
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={skipTutorial}
              className="rounded-md border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              {t("tutorial.skip")}
            </button>
            <button
              onClick={currentStep === totalSteps - 1 ? completeTutorial : nextStep}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {currentStep === totalSteps - 1 ? t("tutorial.finish") : t("tutorial.next")}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook para adicionar atributos de tutorial aos elementos
export function useTutorialTarget(target: string) {
  return {
    "data-tutorial": target,
  };
}
