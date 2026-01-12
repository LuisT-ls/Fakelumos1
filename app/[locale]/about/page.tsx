import { useTranslations } from "next-intl";
import { Target, Eye, History, Code, Brain, Rocket, Users, Linkedin, Github, CheckCircle2, Cpu, Database, Globe, Shield, Zap } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
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
        <section>
          <div className="mb-12 flex items-center gap-3">
            <History className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">{t("about.history.title")}</h2>
          </div>
          
          {/* Timeline */}
          <div className="relative px-4 md:px-0">
            {/* Linha vertical da timeline - apenas no desktop */}
            <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-border md:left-1/2 md:block md:-translate-x-0.5"></div>

            <div className="space-y-16 md:space-y-20">
              {/* Início do Desenvolvimento */}
              <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:gap-0">
                {/* Ponto da timeline */}
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary shadow-lg md:absolute md:left-1/2 md:-translate-x-1/2">
                  <Code className="h-8 w-8 text-primary-foreground" />
                </div>
                
                {/* Conteúdo - lado esquerdo no desktop */}
                <div className="w-full rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:mr-auto md:w-[calc(50%-5rem)] md:pr-8">
                  <h3 className="mb-3 text-xl font-semibold">
                    {t("about.history.development.title")}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {t("about.history.development.description")}
                  </p>
                </div>
                
                {/* Espaçador no desktop para manter alinhamento */}
                <div className="hidden md:block md:w-[calc(50%-5rem)]"></div>
              </div>

              {/* Desenvolvimento da IA */}
              <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:gap-0">
                {/* Ponto da timeline */}
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary shadow-lg md:absolute md:left-1/2 md:-translate-x-1/2">
                  <Brain className="h-8 w-8 text-primary-foreground" />
                </div>
                
                {/* Espaçador no desktop para manter alinhamento */}
                <div className="hidden md:block md:w-[calc(50%-5rem)]"></div>
                
                {/* Conteúdo - lado direito no desktop */}
                <div className="w-full rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:ml-auto md:w-[calc(50%-5rem)] md:pl-8">
                  <h3 className="mb-3 text-xl font-semibold">
                    {t("about.history.ai.title")}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {t("about.history.ai.description")}
                  </p>
                </div>
              </div>

              {/* Lançamento */}
              <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:gap-0">
                {/* Ponto da timeline */}
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary shadow-lg md:absolute md:left-1/2 md:-translate-x-1/2">
                  <Rocket className="h-8 w-8 text-primary-foreground" />
                </div>
                
                {/* Conteúdo - lado esquerdo no desktop */}
                <div className="w-full rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:mr-auto md:w-[calc(50%-5rem)] md:pr-8">
                  <h3 className="mb-3 text-xl font-semibold">
                    {t("about.history.launch.title")}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {t("about.history.launch.description")}
                  </p>
                </div>
                
                {/* Espaçador no desktop para manter alinhamento */}
                <div className="hidden md:block md:w-[calc(50%-5rem)]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Nossa Equipe */}
        <section className="mt-16">
          <div className="mb-12 flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">{t("about.team.title")}</h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* Luís Teixeira */}
            <div className="flex flex-col items-center rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="relative mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-primary/20 bg-muted">
                <img
                  src="/luis.svg"
                  alt={t("about.team.luis.name")}
                  className="h-full w-full object-cover"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="mb-2 text-xl font-bold">{t("about.team.luis.name")}</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                {t("about.team.luis.role")}
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.linkedin.com/in/luis-tei/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary transition-colors hover:text-primary/80"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href="https://github.com/LuisT-ls"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary transition-colors hover:text-primary/80"
                  aria-label="GitHub"
                >
                  <Github className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Prof. Dr. Paulo Fonseca */}
            <div className="flex flex-col items-center rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="relative mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-primary/20 bg-muted">
                <Image
                  src="/image.png"
                  alt={t("about.team.paulo.name")}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <h3 className="mb-2 text-xl font-bold">{t("about.team.paulo.name")}</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                {t("about.team.paulo.role")}
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.linkedin.com/in/paulo-f-c-fonseca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary transition-colors hover:text-primary/80"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Tecnologias Utilizadas */}
        <section className="mt-16">
          <div className="mb-12 flex items-center gap-3">
            <Zap className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">{t("about.technologies.title")}</h2>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Fact-checking */}
            <div className="flex items-start gap-4 rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">{t("about.technologies.factChecking.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("about.technologies.factChecking.description")}
                </p>
              </div>
            </div>

            {/* Machine Learning */}
            <div className="flex items-start gap-4 rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">{t("about.technologies.machineLearning.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("about.technologies.machineLearning.description")}
                </p>
              </div>
            </div>

            {/* Análise de Texto */}
            <div className="flex items-start gap-4 rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">{t("about.technologies.textAnalysis.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("about.technologies.textAnalysis.description")}
                </p>
              </div>
            </div>

            {/* Processamento de Linguagem Natural */}
            <div className="flex items-start gap-4 rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">{t("about.technologies.nlp.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("about.technologies.nlp.description")}
                </p>
              </div>
            </div>

            {/* APIs de Verificação */}
            <div className="flex items-start gap-4 rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">{t("about.technologies.apis.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("about.technologies.apis.description")}
                </p>
              </div>
            </div>

            {/* Segurança de Dados */}
            <div className="flex items-start gap-4 rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold">{t("about.technologies.security.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("about.technologies.security.description")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
