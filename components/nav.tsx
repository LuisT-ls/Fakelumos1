"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useTheme } from "./theme-provider";
import { Moon, Sun, Accessibility, Languages, GraduationCap } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/routing";
import { useState } from "react";
import { AccessibilitySidebar } from "./accessibility-sidebar";
import { useTutorial } from "./tutorial-provider";

export function Nav() {
  const t = useTranslations();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [showAccessibilitySidebar, setShowAccessibilitySidebar] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  
  // Tutorial hook (pode ser undefined se não estiver no contexto)
  let tutorialContext;
  try {
    tutorialContext = useTutorial();
  } catch {
    // Não está no contexto do tutorial, tudo bem
  }

  const currentLocale = pathname.split("/")[1] || "pt-BR";
  
  const handleRestartTutorial = () => {
    if (tutorialContext) {
      localStorage.removeItem("tutorialCompleted");
      localStorage.removeItem("tutorialSeen");
      tutorialContext.startTutorial();
    }
  };

  const changeLanguage = (locale: string) => {
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "");
    router.push(pathWithoutLocale || "/", { locale });
    setShowLanguageMenu(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Fake Lumos
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/how-it-works"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t("nav.howItWorks")}
            </Link>
            <Link
              href="/tips"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t("nav.tips")}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t("nav.about")}
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 rounded-md p-2 hover:bg-accent"
                aria-label="Selecionar idioma"
              >
                <Languages className="h-5 w-5" />
                <span className="text-sm uppercase">{currentLocale}</span>
              </button>
              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-32 rounded-md border bg-background shadow-lg">
                  <button
                    onClick={() => changeLanguage("pt-BR")}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent"
                  >
                    Português
                  </button>
                  <button
                    onClick={() => changeLanguage("en")}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent"
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("es")}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent"
                  >
                    Español
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="rounded-md p-2 hover:bg-accent"
              aria-label="Alternar tema"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {tutorialContext && (
              <button
                onClick={handleRestartTutorial}
                className="rounded-md p-2 hover:bg-accent"
                aria-label={t("tutorial.restart")}
                title={t("tutorial.restart")}
              >
                <GraduationCap className="h-5 w-5" />
              </button>
            )}
            
            <button
              onClick={() => setShowAccessibilitySidebar(true)}
              className="rounded-md p-2 hover:bg-accent"
              aria-label="Opções de acessibilidade"
            >
              <Accessibility className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <AccessibilitySidebar
        isOpen={showAccessibilitySidebar}
        onClose={() => setShowAccessibilitySidebar(false)}
      />
    </nav>
  );
}
