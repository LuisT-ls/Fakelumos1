"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Circle, Loader2, Search, FileText, Sparkles } from "lucide-react";

export type ProgressStep = 
  | "validating"
  | "analyzing"
  | "searching"
  | "adjusting"
  | "generating"
  | "complete";

interface ProgressIndicatorProps {
  isActive: boolean;
  hasRealtimeSearch?: boolean;
}

interface StepConfig {
  key: ProgressStep;
  icon: React.ReactNode;
  labelKey: string;
  estimatedDuration: number; // em milissegundos
}

export function ProgressIndicator({ isActive, hasRealtimeSearch = false }: ProgressIndicatorProps) {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState<ProgressStep>("validating");
  const [progress, setProgress] = useState(0);

  const steps: StepConfig[] = useMemo(() => [
    {
      key: "validating",
      icon: <FileText className="h-4 w-4" />,
      labelKey: "progress.validating",
      estimatedDuration: 500,
    },
    {
      key: "analyzing",
      icon: <Sparkles className="h-4 w-4" />,
      labelKey: "progress.analyzing",
      estimatedDuration: hasRealtimeSearch ? 8000 : 10000,
    },
    ...(hasRealtimeSearch
      ? [
          {
            key: "searching" as ProgressStep,
            icon: <Search className="h-4 w-4" />,
            labelKey: "progress.searching",
            estimatedDuration: 3000,
          },
          {
            key: "adjusting" as ProgressStep,
            icon: <FileText className="h-4 w-4" />,
            labelKey: "progress.adjusting",
            estimatedDuration: 2000,
          },
        ]
      : []),
    {
      key: "generating",
      icon: <FileText className="h-4 w-4" />,
      labelKey: "progress.generating",
      estimatedDuration: 1000,
    },
  ], [hasRealtimeSearch]);

  useEffect(() => {
    if (!isActive) {
      setCurrentStep("validating");
      setProgress(0);
      return;
    }

    let stepIndex = 0;
    let accumulatedTime = 0;
    const totalDuration = steps.reduce((sum, step) => sum + step.estimatedDuration, 0);
    const timers: NodeJS.Timeout[] = [];

    const updateProgress = () => {
      if (stepIndex >= steps.length) {
        setCurrentStep("complete");
        setProgress(100);
        return;
      }

      const currentStepConfig = steps[stepIndex];
      setCurrentStep(currentStepConfig.key);

      // Atualizar progresso baseado no tempo decorrido
      const progressPercent = Math.min(
        (accumulatedTime / totalDuration) * 100,
        95 // Nunca chega a 100% até completar
      );
      setProgress(progressPercent);

      // Avançar para próximo passo após a duração estimada
      const timer = setTimeout(() => {
        accumulatedTime += currentStepConfig.estimatedDuration;
        stepIndex++;
        updateProgress();
      }, currentStepConfig.estimatedDuration);

      timers.push(timer);
    };

    updateProgress();

    // Cleanup: limpar todos os timers quando o componente desmontar ou isActive mudar
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [isActive, steps]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4 rounded-lg border bg-card p-4 shadow-sm">
      {/* Barra de progresso */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            {t("progress.title")}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Etapas */}
      <div className="space-y-2">
        {steps.map((step, index) => {
          const isActiveStep = step.key === currentStep;
          const isCompleted = steps.findIndex((s) => s.key === currentStep) > index;
          const isPending = steps.findIndex((s) => s.key === currentStep) < index;

          return (
            <div
              key={step.key}
              className={`flex items-center gap-3 rounded-md p-2 transition-colors ${
                isActiveStep
                  ? "bg-primary/10 text-primary"
                  : isCompleted
                  ? "text-muted-foreground"
                  : "text-muted-foreground/50"
              }`}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : isActiveStep ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              <div className="flex items-center gap-2">
                {step.icon}
                <span className="text-sm font-medium">
                  {t(step.labelKey)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
