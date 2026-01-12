import { NextRequest, NextResponse } from "next/server";
import { handleVerification } from "@/lib/gemini-analysis";
import { validateUserInput } from "@/lib/validation";

export async function POST(request: NextRequest) {
  let locale = "pt-BR";
  
  try {
    const body = await request.json();
    const { content, locale: bodyLocale } = body;
    locale = bodyLocale || "pt-BR";

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Conteúdo da notícia é obrigatório" },
        { status: 400 }
      );
    }

    // Valida entrada do usuário
    const validation = validateUserInput(content);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors[0] || "Entrada inválida" },
        { status: 400 }
      );
    }

    // Verifica se a API key está configurada
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      console.error("NEXT_PUBLIC_GEMINI_API_KEY não está definida");
      return NextResponse.json(
        { error: "Configuração da API não encontrada. Por favor, entre em contato com o suporte." },
        { status: 500 }
      );
    }

    const result = await handleVerification(
      validation.sanitizedText,
      locale
    );

    return NextResponse.json(result);
  } catch (error) {
    // Log detalhado do erro para debug
    if (error instanceof Error) {
      // Tratamento específico para rate limiting
      if (
        error.message.includes("RATE_LIMIT_EXCEEDED") ||
        error.message.includes("429") ||
        error.message.includes("Quota exceeded") ||
        error.message.includes("Too Many Requests")
      ) {
        // Para rate limiting, apenas loga um aviso (não erro)
        console.warn("Rate limit atingido - quota da API excedida");
        return NextResponse.json(
          {
            error:
              locale === "pt-BR"
                ? "A quota da API foi excedida. Por favor, aguarde alguns minutos antes de tentar novamente. Se o problema persistir, entre em contato com o suporte."
                : locale === "es"
                ? "Se ha excedido la cuota de la API. Por favor, espere unos minutos antes de intentar nuevamente. Si el problema persiste, contacte al soporte."
                : "API quota exceeded. Please wait a few minutes before trying again. If the problem persists, please contact support.",
            errorCode: "RATE_LIMIT_EXCEEDED",
          },
          { status: 429 }
        );
      }
      
      // Para outros erros, loga normalmente
      console.error("Erro na API:", error);
      console.error("Mensagem de erro:", error.message);
      console.error("Stack trace:", error.stack);
    } else {
      console.error("Erro na API:", error);
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao processar a verificação. Tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }
}
