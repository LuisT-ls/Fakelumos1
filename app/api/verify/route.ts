import { NextRequest, NextResponse } from "next/server";
import { verifyNews } from "@/lib/gemini";

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

    const result = await verifyNews(content, locale || "pt-BR");

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json(
      { error: "Erro ao processar a verificação" },
      { status: 500 }
    );
  }
}
