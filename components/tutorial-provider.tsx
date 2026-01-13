"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface TutorialContextType {
  isTutorialActive: boolean;
  currentStep: number;
  totalSteps: number;
  startTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  showExamples: boolean;
  toggleExamples: () => void;
  showContextualTips: boolean;
  toggleContextualTips: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showExamples, setShowExamples] = useState(false);
  const [showContextualTips, setShowContextualTips] = useState(true);

  const totalSteps = 5; // Número de etapas do tutorial

  // Verificar se o usuário já completou o tutorial
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasCompletedTutorial = localStorage.getItem("tutorialCompleted") === "true";
      const hasSeenTutorial = localStorage.getItem("tutorialSeen") === "true";
      
      // Se nunca viu o tutorial, mostrar automaticamente após 2 segundos
      if (!hasSeenTutorial && !hasCompletedTutorial) {
        const timer = setTimeout(() => {
          setIsTutorialActive(true);
          localStorage.setItem("tutorialSeen", "true");
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const startTutorial = () => {
    setIsTutorialActive(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    setIsTutorialActive(false);
    localStorage.setItem("tutorialCompleted", "true");
  };

  const completeTutorial = () => {
    setIsTutorialActive(false);
    setCurrentStep(0);
    localStorage.setItem("tutorialCompleted", "true");
  };

  const toggleExamples = () => {
    setShowExamples(!showExamples);
  };

  const toggleContextualTips = () => {
    setShowContextualTips(!showContextualTips);
    localStorage.setItem("contextualTipsEnabled", (!showContextualTips).toString());
  };

  // Carregar preferências de dicas contextuais
  useEffect(() => {
    if (typeof window !== "undefined") {
      const tipsEnabled = localStorage.getItem("contextualTipsEnabled");
      if (tipsEnabled !== null) {
        setShowContextualTips(tipsEnabled === "true");
      }
    }
  }, []);

  return (
    <TutorialContext.Provider
      value={{
        isTutorialActive,
        currentStep,
        totalSteps,
        startTutorial,
        nextStep,
        previousStep,
        skipTutorial,
        completeTutorial,
        showExamples,
        toggleExamples,
        showContextualTips,
        toggleContextualTips,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
}
