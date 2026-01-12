"use client";

import { useTranslations } from "next-intl";
import { Target, Eye, History, Code, Brain, Rocket, Users, Linkedin, Github, CheckCircle2, Cpu, Database, Globe, Shield, Zap } from "lucide-react";
import Image from "next/image";

export function AboutContent() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-12 text-center text-4xl font-bold">{t("about.title")}</h1>

        {/* Missão e Visão lado a lado */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          {/* Missão */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">{t("about.mission.title")}</h2>
            </div>
            <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
              <p className="leading-relaxed text-muted-foreground">
                {t("about.mission.description1")}
              </p>
              <p className="leading-relaxed text-muted-foreground">
                {t("about.mission.description2")}
              </p>
            </div>
          </section>

          {/* Visão */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <Eye className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">{t("about.vision.title")}</h2>
            </div>
            <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
              <p className="leading-relaxed text-muted-foreground">
                {t("about.vision.description1")}
              </p>
              <p className="leading-relaxed text-muted-foreground">
                {t("about.vision.description2")}
              </p>
            </div>
          </section>
        </div>

        {/* História do Projeto */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <History className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">{t("about.history.title")}</h2>
          </div>

          <div className="relative">
            {/* Linha vertical */}
            <div className="absolute left-8 top-0 h-full w-0.5 bg-border"></div>

            {/* Cards da timeline */}
            <div className="space-y-8">
              {/* Card 1 */}
              <div className="relative flex gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg">
                  <Code className="h-6 w-6" />
                </div>
                <div className="flex-1 rounded-lg border bg-card p-6 shadow-sm">
                  <h3 className="mb-2 text-xl font-semibold">
                    {t("about.history.development.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("about.history.development.description")}
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="relative flex gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <div className="flex-1 rounded-lg border bg-card p-6 shadow-sm">
                  <h3 className="mb-2 text-xl font-semibold">
                    {t("about.history.ai.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("about.history.ai.description")}
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="relative flex gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg">
                  <Rocket className="h-6 w-6" />
                </div>
                <div className="flex-1 rounded-lg border bg-card p-6 shadow-sm">
                  <h3 className="mb-2 text-xl font-semibold">
                    {t("about.history.launch.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("about.history.launch.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nossa Equipe */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">{t("about.team.title")}</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Luís Teixeira */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary">
                  <Image
                    src="/luis.svg"
                    alt={t("about.team.luis.name")}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {t("about.team.luis.name")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("about.team.luis.role")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/in/luis-tei/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://github.com/LuisT-ls"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Prof. Dr. Paulo Fonseca */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-primary">
                  <Image
                    src="/image.png"
                    alt={t("about.team.paulo.name")}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {t("about.team.paulo.name")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("about.team.paulo.role")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/in/paulo-f-c-fonseca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Tecnologias Utilizadas */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <Code className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">
              {t("about.technologies.title")}
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">
                  {t("about.technologies.factChecking.title")}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("about.technologies.factChecking.description")}
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">
                  {t("about.technologies.machineLearning.title")}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("about.technologies.machineLearning.description")}
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">
                  {t("about.technologies.textAnalysis.title")}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("about.technologies.textAnalysis.description")}
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">
                  {t("about.technologies.nlp.title")}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("about.technologies.nlp.description")}
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">
                  {t("about.technologies.apis.title")}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("about.technologies.apis.description")}
              </p>
            </div>

            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">
                  {t("about.technologies.security.title")}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("about.technologies.security.description")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
