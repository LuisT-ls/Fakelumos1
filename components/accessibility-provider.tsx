"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AccessibilityContextType {
  fontSize: number;
  highContrast: boolean;
  increaseFont: () => void;
  decreaseFont: () => void;
  toggleContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const storedFontSize = localStorage.getItem("fontSize");
    const storedContrast = localStorage.getItem("highContrast");
    if (storedFontSize) {
      setFontSize(Number(storedFontSize));
    }
    if (storedContrast === "true") {
      setHighContrast(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem("fontSize", fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    localStorage.setItem("highContrast", highContrast.toString());
  }, [highContrast]);

  const increaseFont = () => {
    setFontSize((prev) => Math.min(prev + 2, 24));
  };

  const decreaseFont = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  const toggleContrast = () => {
    setHighContrast((prev) => !prev);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        highContrast,
        increaseFont,
        decreaseFont,
        toggleContrast,
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
