"use client";

import { useTranslations } from "next-intl";
import type { VerificationResult } from "@/lib/gemini-analysis";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ExternalLink,
} from "lucide-react";

interface VerificationResultProps {
  result: VerificationResult;
}

export function VerificationResultDisplay({ result }: VerificationResultProps) {
  const t = useTranslations();
  const analysis = result.geminiAnalysis;

  const getClassificationColor = () => {
    switch (analysis.classificacao) {
      case "Comprovadamente Verdadeiro":
        return "text-green-600 dark:text-green-400";
      case "Parcialmente Verdadeiro":
        return "text-blue-600 dark:text-blue-400";
      case "Não Verificável":
        return "text-yellow-600 dark:text-yellow-400";
      case "Provavelmente Falso":
        return "text-orange-600 dark:text-orange-400";
      case "Comprovadamente Falso":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  const getClassificationIcon = () => {
    switch (analysis.classificacao) {
      case "Comprovadamente Verdadeiro":
        return <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />;
      case "Parcialmente Verdadeiro":
        return <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
      case "Não Verificável":
        return <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />;
      case "Provavelmente Falso":
      case "Comprovadamente Falso":
        return <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />;
      default:
        return <Info className="h-6 w-6" />;
    }
  };

  const scorePercentage = Math.round(analysis.score * 100);
  const confiabilidadePercentage = Math.round(analysis.confiabilidade * 100);

  return (
    <div className="mt-6 space-y-6 rounded-lg border bg-card p-6 shadow-sm">
      {/* Cabeçalho com Classificação e Score */}
      <div className="flex items-start justify-between gap-4 border-b pb-4">
        <div className="flex items-start gap-3">
          {getClassificationIcon()}
          <div>
            <h3 className={`text-xl font-bold ${getClassificationColor()}`}>
              {analysis.classificacao}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {analysis.explicacao_score}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{scorePercentage}%</div>
          <div className="text-xs text-muted-foreground">
            {t("history.confidence")}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Confiabilidade: {confiabilidadePercentage}%
          </div>
        </div>
      </div>

      {/* Análise Detalhada */}
      <div>
        <h4 className="mb-2 font-semibold">Análise Detalhada</h4>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {analysis.analise_detalhada}
        </p>
      </div>

      {/* Elementos Verdadeiros */}
      {analysis.elementos_verdadeiros.length > 0 && (
        <div>
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            Elementos Verdadeiros
          </h4>
          <ul className="space-y-1">
            {analysis.elementos_verdadeiros.map((elemento, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                <span dangerouslySetInnerHTML={{ __html: elemento }} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Elementos Falsos */}
      {analysis.elementos_falsos.length > 0 && (
        <div>
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-red-600 dark:text-red-400">
            <XCircle className="h-4 w-4" />
            Elementos Falsos
          </h4>
          <ul className="space-y-1">
            {analysis.elementos_falsos.map((elemento, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                <span>{elemento}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Elementos Suspeitos */}
      {analysis.elementos_suspeitos.length > 0 && (
        <div>
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-yellow-600 dark:text-yellow-400">
            <AlertTriangle className="h-4 w-4" />
            Elementos Suspeitos
          </h4>
          <ul className="space-y-1">
            {analysis.elementos_suspeitos.map((elemento, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-500" />
                <span>{elemento}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Indicadores de Desinformação */}
      {analysis.indicadores_desinformacao.length > 0 && (
        <div>
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-orange-600 dark:text-orange-400">
            <AlertTriangle className="h-4 w-4" />
            Indicadores de Desinformação
          </h4>
          <ul className="space-y-1">
            {analysis.indicadores_desinformacao.map((indicador, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                <span>{indicador}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fontes Confiáveis */}
      {analysis.fontes_confiaveis.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold">Fontes Confiáveis</h4>
          <ul className="space-y-1">
            {analysis.fontes_confiaveis.map((fonte, index) => (
              <li
                key={index}
                className="text-sm text-muted-foreground"
              >
                {fonte}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Limitação Temporal */}
      {analysis.limitacao_temporal.afeta_analise && (
        <div className="rounded-md border border-yellow-500/50 bg-yellow-500/10 p-4">
          <h4 className="mb-2 flex items-center gap-2 font-semibold text-yellow-700 dark:text-yellow-400">
            <AlertTriangle className="h-4 w-4" />
            Limitação Temporal
          </h4>
          <p className="mb-2 text-sm text-muted-foreground">
            Esta análise pode ser afetada por limitações temporais da base de
            conhecimento.
          </p>
          {analysis.limitacao_temporal.elementos_nao_verificaveis.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-medium">Elementos não verificáveis:</p>
              <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                {analysis.limitacao_temporal.elementos_nao_verificaveis.map(
                  (elemento, index) => (
                    <li key={index}>• {elemento}</li>
                  )
                )}
              </ul>
            </div>
          )}
          {analysis.limitacao_temporal.sugestoes_verificacao.length > 0 && (
            <div>
              <p className="text-xs font-medium">Sugestões:</p>
              <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                {analysis.limitacao_temporal.sugestoes_verificacao.map(
                  (sugestao, index) => (
                    <li key={index}>• {sugestao}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Recomendações */}
      {analysis.recomendacoes.length > 0 && (
        <div>
          <h4 className="mb-2 font-semibold">Recomendações</h4>
          <ul className="space-y-2">
            {analysis.recomendacoes.map((recomendacao, index) => (
              <li
                key={index}
                className="flex items-start gap-2 rounded-md bg-muted p-2 text-sm"
              >
                <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-muted-foreground">{recomendacao}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fontes em Tempo Real (Google Search) */}
      {result.realtimeData && result.realtimeData.length > 0 && (
        <div>
          <h4 className="mb-2 flex items-center gap-2 font-semibold">
            <ExternalLink className="h-4 w-4" />
            Fontes Recentes Encontradas
          </h4>
          <div className="space-y-2">
            {result.realtimeData.slice(0, 3).map((fonte, index) => (
              <a
                key={index}
                href={fonte.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md border bg-background p-3 transition-colors hover:bg-accent"
              >
                <div className="font-medium text-sm">{fonte.title}</div>
                <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {fonte.snippet}
                </div>
                <div className="mt-1 text-xs text-primary">{fonte.link}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
