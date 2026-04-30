# 📝 Implementação: Sistema de Feedback do Usuário

## Visão Geral

Este documento detalha a implementação do Sistema de Feedback do Usuário, uma das melhorias prioritárias identificadas.

---

## 🎯 Objetivos

1. Permitir que usuários reportem se a análise foi correta ou incorreta
2. Coletar dados para melhorar a precisão do sistema
3. Identificar padrões de falsos positivos/negativos
4. Construir um dataset de treinamento

---

## 📋 Estrutura de Implementação

### 1. Tipos TypeScript

```typescript
// lib/types/feedback.ts
export type FeedbackRating = "correto" | "incorreto" | "parcial" | "não_sei";

export interface UserFeedback {
  id: string;
  verificationId: number;
  rating: FeedbackRating;
  comment?: string;
  timestamp: string;
  userAgent?: string;
  locale: string;
}

export interface FeedbackStats {
  total: number;
  correto: number;
  incorreto: number;
  parcial: number;
  naoSei: number;
  accuracyRate: number;
}
```

### 2. API Route

```typescript
// app/api/feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { UserFeedback, FeedbackRating } from "@/lib/types/feedback";

// Armazenamento temporário (em produção, usar banco de dados)
const feedbackStorage: UserFeedback[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { verificationId, rating, comment, locale } = body;

    // Validação
    if (!verificationId || !rating) {
      return NextResponse.json(
        { error: "verificationId e rating são obrigatórios" },
        { status: 400 }
      );
    }

    const validRatings: FeedbackRating[] = ["correto", "incorreto", "parcial", "não_sei"];
    if (!validRatings.includes(rating)) {
      return NextResponse.json(
        { error: "rating inválido" },
        { status: 400 }
      );
    }

    // Criar feedback
    const feedback: UserFeedback = {
      id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      verificationId,
      rating,
      comment: comment?.trim().substring(0, 500), // Limite de 500 caracteres
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || undefined,
      locale: locale || "pt-BR",
    };

    // Salvar (em produção, salvar em banco de dados)
    feedbackStorage.push(feedback);

    // Limitar tamanho do array (últimos 1000 feedbacks)
    if (feedbackStorage.length > 1000) {
      feedbackStorage.shift();
    }

    return NextResponse.json({
      success: true,
      feedbackId: feedback.id,
      message: "Feedback registrado com sucesso. Obrigado!",
    });
  } catch (error) {
    console.error("Erro ao processar feedback:", error);
    return NextResponse.json(
      { error: "Erro ao processar feedback" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Retornar estatísticas (apenas para admin em produção)
  const stats = {
    total: feedbackStorage.length,
    correto: feedbackStorage.filter((f) => f.rating === "correto").length,
    incorreto: feedbackStorage.filter((f) => f.rating === "incorreto").length,
    parcial: feedbackStorage.filter((f) => f.rating === "parcial").length,
    naoSei: feedbackStorage.filter((f) => f.rating === "não_sei").length,
  };

  return NextResponse.json(stats);
}
```

### 3. Componente de Feedback

```typescript
// components/feedback-widget.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ThumbsUp, ThumbsDown, HelpCircle, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { FeedbackRating } from "@/lib/types/feedback";
import type { VerificationResult } from "@/lib/gemini-analysis";

interface FeedbackWidgetProps {
  verificationResult: VerificationResult;
}

export function FeedbackWidget({ verificationResult }: FeedbackWidgetProps) {
  const t = useTranslations();
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!rating) return;

    setLoading(true);
    setError(null);

    try {
      const locale = window.location.pathname.split("/")[1] || "pt-BR";
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verificationId: verificationResult.id,
          rating,
          comment: comment.trim() || undefined,
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar feedback");
      }

      setSubmitted(true);
      
      // Salvar no localStorage que já deu feedback para esta verificação
      const feedbackHistory = JSON.parse(
        localStorage.getItem("feedbackHistory") || "[]"
      );
      feedbackHistory.push({
        verificationId: verificationResult.id,
        rating,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("feedbackHistory", JSON.stringify(feedbackHistory));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  // Verificar se já deu feedback para esta verificação
  const feedbackHistory = JSON.parse(
    localStorage.getItem("feedbackHistory") || "[]"
  );
  const hasFeedback = feedbackHistory.some(
    (f: any) => f.verificationId === verificationResult.id
  );

  if (hasFeedback && !submitted) {
    return (
      <div className="mt-4 rounded-md border border-green-500/20 bg-green-500/10 p-4">
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>Obrigado pelo seu feedback!</span>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mt-4 rounded-md border border-green-500/20 bg-green-500/10 p-4">
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>Feedback enviado com sucesso! Obrigado por contribuir.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg border bg-card p-4 shadow-sm">
      <h4 className="mb-3 text-sm font-semibold">
        Esta análise foi útil?
      </h4>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setRating("correto")}
          disabled={loading}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            rating === "correto"
              ? "bg-green-500 text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <ThumbsUp className="h-4 w-4" />
          Correto
        </button>

        <button
          onClick={() => setRating("incorreto")}
          disabled={loading}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            rating === "incorreto"
              ? "bg-red-500 text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <ThumbsDown className="h-4 w-4" />
          Incorreto
        </button>

        <button
          onClick={() => setRating("parcial")}
          disabled={loading}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            rating === "parcial"
              ? "bg-yellow-500 text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          Parcial
        </button>

        <button
          onClick={() => setRating("não_sei")}
          disabled={loading}
          className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            rating === "não_sei"
              ? "bg-gray-500 text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          Não sei
        </button>
      </div>

      {rating && (
        <div className="space-y-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comentário opcional (máx. 500 caracteres)..."
            maxLength={500}
            className="min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={loading}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {comment.length}/500 caracteres
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </span>
              ) : (
                "Enviar Feedback"
              )}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
```

### 4. Integração no Componente de Resultado

```typescript
// Modificar components/verification-result.tsx
// Adicionar após o último elemento do resultado:

{/* Feedback Widget */}
<FeedbackWidget result={result} />
```

### 5. Traduções

```json
// i18n/messages/pt-BR.json
{
  "feedback": {
    "title": "Esta análise foi útil?",
    "correto": "Correto",
    "incorreto": "Incorreto",
    "parcial": "Parcial",
    "naoSei": "Não sei",
    "commentPlaceholder": "Comentário opcional (máx. 500 caracteres)...",
    "submit": "Enviar Feedback",
    "submitting": "Enviando...",
    "success": "Feedback enviado com sucesso! Obrigado por contribuir.",
    "error": "Erro ao enviar feedback. Tente novamente.",
    "thankYou": "Obrigado pelo seu feedback!"
  }
}
```

---

## 🚀 Próximos Passos

### Fase 1: Implementação Básica (Atual)
- ✅ Componente de feedback
- ✅ API route
- ✅ Integração com resultados

### Fase 2: Melhorias
- [ ] Dashboard de feedback (admin)
- [ ] Análise de padrões de feedback
- [ ] Exportação de dados de feedback
- [ ] Notificações quando feedback é recebido

### Fase 3: Integração com Banco de Dados
- [ ] Migrar de array em memória para banco de dados
- [ ] Sincronização entre instâncias
- [ ] Backup automático
- [ ] Analytics avançado

---

## 📊 Métricas de Sucesso

- Taxa de feedback: % de verificações com feedback
- Distribuição de ratings
- Taxa de precisão (baseado em feedback)
- Tempo médio para feedback

---

**Nota:** Esta implementação usa armazenamento em memória para desenvolvimento. Em produção, deve-se usar um banco de dados (PostgreSQL, MongoDB, ou Vercel KV).
