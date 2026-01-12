"use client";

import { useTranslations } from "next-intl";
import { X, RotateCcw } from "lucide-react";
import { useAccessibility } from "./accessibility-provider";
import { useEffect, useState } from "react";

interface AccessibilitySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccessibilitySidebar({
  isOpen,
  onClose,
}: AccessibilitySidebarProps) {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);
  const {
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
    resetSettings,
  } = useAccessibility();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Não bloquear scroll do body - permitir scroll unificado
  useEffect(() => {
    // Não bloqueia o scroll, permite scroll normal do site
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return (
    <>
      {/* Overlay - cobre todo o site, permite scroll do conteúdo */}
      <div
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className="fixed right-0 top-0 z-[101] h-screen w-full max-w-md shadow-2xl ring-2 ring-primary/20 transition-transform sm:w-96"
        style={{
          backgroundColor: 'hsl(var(--card))',
          opacity: 1,
        }}
      >
        <div
          className="flex h-full flex-col"
          style={{
            backgroundColor: 'hsl(var(--card))',
            opacity: 1,
          }}
        >
          {/* Header */}
          <div
            className="flex shrink-0 items-center justify-between border-b p-4"
            style={{
              backgroundColor: 'hsl(var(--card))',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                {t("accessibility.title")}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 hover:bg-accent"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content - sem scroll interno, usa scroll do body */}
          <div className="flex-1 p-4">
            <div className="space-y-6">
              {/* Contraste */}
              <div>
                <label className="mb-3 block text-sm font-medium">
                  {t("accessibility.contrast.label")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "normal", label: t("accessibility.contrast.normal") },
                    {
                      value: "high",
                      label: t("accessibility.contrast.high"),
                    },
                    {
                      value: "blackYellow",
                      label: t("accessibility.contrast.blackYellow"),
                    },
                    {
                      value: "yellowBlack",
                      label: t("accessibility.contrast.yellowBlack"),
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setContrastMode(option.value as any)}
                      className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                        contrastMode === option.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-accent"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tamanho da Fonte */}
              <div>
                <label className="mb-3 block text-sm font-medium">
                  {t("accessibility.fontSize.label")}
                </label>
                <div className="flex gap-2">
                  {[
                    { value: "small", label: "- A-", size: 14 },
                    { value: "normal", label: "A", size: 16 },
                    { value: "large", label: "+ A+", size: 18 },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFontSize(option.size)}
                      className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                        fontSize === option.size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-accent"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Espaçamento de Texto */}
              <div>
                <label className="mb-3 block text-sm font-medium">
                  {t("accessibility.textSpacing.label")}
                </label>
                <div className="flex gap-2">
                  {[
                    { value: "normal", label: t("accessibility.textSpacing.normal") },
                    { value: "medium", label: t("accessibility.textSpacing.medium") },
                    {
                      value: "large",
                      label: t("accessibility.textSpacing.large"),
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTextSpacing(option.value as any)}
                      className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                        textSpacing === option.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-accent"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {t("accessibility.links.label")}
                </label>
                <button
                  type="button"
                  onClick={() => setHighlightLinks(!highlightLinks)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    highlightLinks ? "bg-primary" : "bg-muted"
                  }`}
                  role="switch"
                  aria-checked={highlightLinks}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform ${
                      highlightLinks ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Leitura Facilitada */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {t("accessibility.dyslexia.label")}
                </label>
                <button
                  type="button"
                  onClick={() => setDyslexiaFont(!dyslexiaFont)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    dyslexiaFont ? "bg-primary" : "bg-muted"
                  }`}
                  role="switch"
                  aria-checked={dyslexiaFont}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform ${
                      dyslexiaFont ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Animações */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {t("accessibility.animations.label")}
                </label>
                <button
                  type="button"
                  onClick={() => setReduceAnimations(!reduceAnimations)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    reduceAnimations ? "bg-primary" : "bg-muted"
                  }`}
                  role="switch"
                  aria-checked={reduceAnimations}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform ${
                      reduceAnimations ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Cursor */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {t("accessibility.cursor.label")}
                </label>
                <button
                  type="button"
                  onClick={() => setEnlargedCursor(!enlargedCursor)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    enlargedCursor ? "bg-primary" : "bg-muted"
                  }`}
                  role="switch"
                  aria-checked={enlargedCursor}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform ${
                      enlargedCursor ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Atalhos de Teclado */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Keyboard className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">
                    {t("accessibility.keyboardShortcuts.title")}
                  </h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("accessibility.keyboardShortcuts.contrast")}
                    </span>
                    <kbd className="rounded border bg-background px-2 py-1 font-mono text-xs">
                      Ctrl+Alt+C
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("accessibility.keyboardShortcuts.dyslexia")}
                    </span>
                    <kbd className="rounded border bg-background px-2 py-1 font-mono text-xs">
                      Ctrl+Alt+F
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("accessibility.keyboardShortcuts.increaseFont")}
                    </span>
                    <kbd className="rounded border bg-background px-2 py-1 font-mono text-xs">
                      Ctrl+Alt++
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("accessibility.keyboardShortcuts.decreaseFont")}
                    </span>
                    <kbd className="rounded border bg-background px-2 py-1 font-mono text-xs">
                      Ctrl+Alt+-
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {t("accessibility.keyboardShortcuts.resetFont")}
                    </span>
                    <kbd className="rounded border bg-background px-2 py-1 font-mono text-xs">
                      Ctrl+Alt+0
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - fixo na parte inferior */}
          <div className="shrink-0 border-t p-4" style={{ backgroundColor: 'hsl(var(--card))' }}>
            <button
              type="button"
              onClick={resetSettings}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-destructive px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <RotateCcw className="h-4 w-4" />
              {t("accessibility.reset")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
