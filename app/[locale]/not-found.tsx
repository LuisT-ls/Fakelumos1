"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* Ícone de erro */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <AlertCircle className="h-24 w-24 text-primary" />
            <span className="absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive text-2xl font-bold text-destructive-foreground">
              404
            </span>
          </div>
        </div>

        {/* Título */}
        <h1 className="mb-4 text-5xl font-bold">{t("title")}</h1>

        {/* Descrição */}
        <p className="mb-8 text-lg text-muted-foreground">
          {t("description")}
        </p>

        {/* Mensagem adicional */}
        <p className="mb-12 text-muted-foreground">
          {t("message")}
        </p>

        {/* Botões de ação */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            {t("backHome")}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            {t("goBack")}
          </button>
        </div>

        {/* Links úteis */}
        <div className="mt-12 pt-8 border-t">
          <p className="mb-4 text-sm text-muted-foreground">
            {t("usefulLinks")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/how-it-works"
              className="text-sm text-primary hover:underline"
            >
              {t("howItWorks")}
            </Link>
            <Link
              href="/tips"
              className="text-sm text-primary hover:underline"
            >
              {t("tips")}
            </Link>
            <Link
              href="/about"
              className="text-sm text-primary hover:underline"
            >
              {t("about")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
