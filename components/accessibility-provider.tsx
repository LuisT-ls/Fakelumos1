"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ContrastMode = "normal" | "high" | "blackYellow" | "yellowBlack";
type TextSpacing = "normal" | "medium" | "large";

interface AccessibilityContextType {
  // Contraste
  contrastMode: ContrastMode;
  setContrastMode: (mode: ContrastMode) => void;
  
  // Fonte
  fontSize: number;
  setFontSize: (size: number) => void;
  
  // Espaçamento
  textSpacing: TextSpacing;
  setTextSpacing: (spacing: TextSpacing) => void;
  
  // Toggles
  highlightLinks: boolean;
  setHighlightLinks: (value: boolean) => void;
  dyslexiaFont: boolean;
  setDyslexiaFont: (value: boolean) => void;
  reduceAnimations: boolean;
  setReduceAnimations: (value: boolean) => void;
  enlargedCursor: boolean;
  setEnlargedCursor: (value: boolean) => void;
  
  // Legacy (para compatibilidade)
  highContrast: boolean;
  increaseFont: () => void;
  decreaseFont: () => void;
  toggleContrast: () => void;
  
  // Reset
  resetSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [contrastMode, setContrastMode] = useState<ContrastMode>("normal");
  const [fontSize, setFontSizeState] = useState(16);
  const [textSpacing, setTextSpacing] = useState<TextSpacing>("normal");
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [enlargedCursor, setEnlargedCursor] = useState(false);

  // Carregar do localStorage
  useEffect(() => {
    const stored = {
      contrastMode: localStorage.getItem("contrastMode") as ContrastMode,
      fontSize: localStorage.getItem("fontSize"),
      textSpacing: localStorage.getItem("textSpacing") as TextSpacing,
      highlightLinks: localStorage.getItem("highlightLinks"),
      dyslexiaFont: localStorage.getItem("dyslexiaFont"),
      reduceAnimations: localStorage.getItem("reduceAnimations"),
      enlargedCursor: localStorage.getItem("enlargedCursor"),
    };

    if (stored.contrastMode) setContrastMode(stored.contrastMode);
    if (stored.fontSize) setFontSizeState(Number(stored.fontSize));
    if (stored.textSpacing) setTextSpacing(stored.textSpacing);
    if (stored.highlightLinks === "true") setHighlightLinks(true);
    if (stored.dyslexiaFont === "true") setDyslexiaFont(true);
    if (stored.reduceAnimations === "true") setReduceAnimations(true);
    if (stored.enlargedCursor === "true") setEnlargedCursor(true);
  }, []);

  // Aplicar fontSize
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem("fontSize", fontSize.toString());
  }, [fontSize]);

  // Aplicar contraste
  useEffect(() => {
    document.documentElement.classList.remove(
      "high-contrast",
      "contrast-black-yellow",
      "contrast-yellow-black"
    );
    
    if (contrastMode === "high") {
      document.documentElement.classList.add("high-contrast");
    } else if (contrastMode === "blackYellow") {
      document.documentElement.classList.add("contrast-black-yellow");
    } else if (contrastMode === "yellowBlack") {
      document.documentElement.classList.add("contrast-yellow-black");
    }
    
    localStorage.setItem("contrastMode", contrastMode);
  }, [contrastMode]);

  // Aplicar espaçamento de texto
  useEffect(() => {
    document.documentElement.classList.remove(
      "spacing-normal",
      "spacing-medium",
      "spacing-large"
    );
    document.documentElement.classList.add(`spacing-${textSpacing}`);
    localStorage.setItem("textSpacing", textSpacing);
  }, [textSpacing]);

  // Aplicar highlight links
  useEffect(() => {
    if (highlightLinks) {
      document.documentElement.classList.add("highlight-links");
    } else {
      document.documentElement.classList.remove("highlight-links");
    }
    localStorage.setItem("highlightLinks", highlightLinks.toString());
  }, [highlightLinks]);

  // Aplicar fonte para dislexia
  useEffect(() => {
    if (dyslexiaFont) {
      document.documentElement.classList.add("dyslexia-font");
    } else {
      document.documentElement.classList.remove("dyslexia-font");
    }
    localStorage.setItem("dyslexiaFont", dyslexiaFont.toString());
  }, [dyslexiaFont]);

  // Aplicar reduzir animações
  useEffect(() => {
    if (reduceAnimations) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
    localStorage.setItem("reduceAnimations", reduceAnimations.toString());
  }, [reduceAnimations]);

  // Aplicar cursor ampliado
  useEffect(() => {
    if (enlargedCursor) {
      document.documentElement.classList.add("enlarged-cursor");
    } else {
      document.documentElement.classList.remove("enlarged-cursor");
    }
    localStorage.setItem("enlargedCursor", enlargedCursor.toString());
  }, [enlargedCursor]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Alt+C - Alternar Contraste
      if (e.ctrlKey && e.altKey && e.key === "c") {
        e.preventDefault();
        setContrastMode((prev) => {
          if (prev === "normal") return "high";
          if (prev === "high") return "blackYellow";
          if (prev === "blackYellow") return "yellowBlack";
          return "normal";
        });
      }

      // Ctrl+Alt+F - Alternar Fonte para Dislexia
      if (e.ctrlKey && e.altKey && e.key === "f") {
        e.preventDefault();
        setDyslexiaFont((prev) => !prev);
      }

      // Ctrl+Alt++ - Aumentar Fonte
      if (e.ctrlKey && e.altKey && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        setFontSizeState((prev) => Math.min(prev + 2, 24));
      }

      // Ctrl+Alt+- - Diminuir Fonte
      if (e.ctrlKey && e.altKey && e.key === "-") {
        e.preventDefault();
        setFontSizeState((prev) => Math.max(prev - 2, 12));
      }

      // Ctrl+Alt+0 - Resetar Fonte
      if (e.ctrlKey && e.altKey && e.key === "0") {
        e.preventDefault();
        setFontSizeState(16);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setContrastMode, setDyslexiaFont]);

  const setFontSize = (size: number) => {
    setFontSizeState(size);
  };

  const increaseFont = () => {
    setFontSizeState((prev) => Math.min(prev + 2, 24));
  };

  const decreaseFont = () => {
    setFontSizeState((prev) => Math.max(prev - 2, 12));
  };

  const toggleContrast = () => {
    setContrastMode((prev) => (prev === "normal" ? "high" : "normal"));
  };

  const resetSettings = () => {
    setContrastMode("normal");
    setFontSizeState(16);
    setTextSpacing("normal");
    setHighlightLinks(false);
    setDyslexiaFont(false);
    setReduceAnimations(false);
    setEnlargedCursor(false);
    
    localStorage.removeItem("contrastMode");
    localStorage.removeItem("fontSize");
    localStorage.removeItem("textSpacing");
    localStorage.removeItem("highlightLinks");
    localStorage.removeItem("dyslexiaFont");
    localStorage.removeItem("reduceAnimations");
    localStorage.removeItem("enlargedCursor");
  };

  return (
    <AccessibilityContext.Provider
      value={{
        contrastMode,
        setContrastMode,
        fontSize,
        setFontSize,
        textSpacing,
        setTextSpacing,
        highlightLinks,
        setHighlightLinks,
        dyslexiaFont,
        setDyslexiaFont,
        reduceAnimations,
        setReduceAnimations,
        enlargedCursor,
        setEnlargedCursor,
        highContrast: contrastMode === "high",
        increaseFont,
        decreaseFont,
        toggleContrast,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
}
