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

    const result = await handleVerification(
      validation.sanitizedText,
      locale || "pt-BR"
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao processar a verificação",
      },
      { status: 500 }
    );
  }
}
