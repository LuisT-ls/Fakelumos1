import { NextRequest, NextResponse } from "next/server";
import { handleVerification } from "@/lib/gemini-analysis";
import { validateUserInput } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, locale } = body;

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
      locale || "pt-BR"
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro na API:", error);
    
    // Log detalhado do erro para debug
    if (error instanceof Error) {
      console.error("Mensagem de erro:", error.message);
      console.error("Stack trace:", error.stack);
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
