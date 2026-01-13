import { NextRequest, NextResponse } from "next/server";
import { handleVerification } from "@/lib/gemini-analysis";
import { validateUserInput } from "@/lib/validation";

export async function POST(request: NextRequest) {
  let locale = "pt-BR";
  const requestId = Date.now();
  
  console.log(`[${requestId}] === INÍCIO DA REQUISIÇÃO ===`);
  console.log(`[${requestId}] Timestamp:`, new Date().toISOString());
  
  try {
    const body = await request.json();
    const { content, locale: bodyLocale } = body;
    locale = bodyLocale || "pt-BR";

    console.log(`[${requestId}] Locale:`, locale);
    console.log(`[${requestId}] Tamanho do conteúdo:`, content?.length || 0);

    if (!content || typeof content !== "string") {
      console.log(`[${requestId}] Erro: Conteúdo inválido ou vazio`);
      return NextResponse.json(
        { error: "Conteúdo da notícia é obrigatório" },
        { status: 400 }
      );
    }

    // Valida entrada do usuário
    const validation = validateUserInput(content);
    if (!validation.isValid) {
      console.log(`[${requestId}] Erro de validação:`, validation.errors);
      return NextResponse.json(
        { error: validation.errors[0] || "Entrada inválida" },
        { status: 400 }
      );
    }

    // Log de segurança se flags foram detectadas
    if (validation.securityFlags && validation.securityFlags.length > 0) {
      console.warn(`[${requestId}] ⚠️ FLAGS DE SEGURANÇA DETECTADAS:`, validation.securityFlags);
      console.warn(`[${requestId}] Tamanho original: ${content.length}, Tamanho após sanitização: ${validation.sanitizedText.length}`);
    }

    // Verifica se a API key está configurada
    const apiKeyExists = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    console.log(`[${requestId}] API Key configurada:`, apiKeyExists ? "Sim" : "Não");
    
    if (!apiKeyExists) {
      console.error(`[${requestId}] ERRO: NEXT_PUBLIC_GEMINI_API_KEY não está definida`);
      return NextResponse.json(
        { error: "Configuração da API não encontrada. Por favor, entre em contato com o suporte." },
        { status: 500 }
      );
    }

    console.log(`[${requestId}] Iniciando verificação com Gemini...`);
    console.log(`[${requestId}] Texto sanitizado (primeiros 100 chars):`, validation.sanitizedText.substring(0, 100));

    const result = await handleVerification(
      validation.sanitizedText,
      locale,
      requestId
    );

    console.log(`[${requestId}] Verificação concluída com sucesso`);
    console.log(`[${requestId}] Score:`, result.overallScore);
    console.log(`[${requestId}] Classificação:`, result.geminiAnalysis.classificacao);

    return NextResponse.json(result);
  } catch (error) {
    console.error(`[${requestId}] === ERRO CAPTURADO ===`);
    console.error(`[${requestId}] Tipo do erro:`, error instanceof Error ? "Error" : typeof error);
    
    // Log detalhado do erro para debug
    if (error instanceof Error) {
      console.error(`[${requestId}] Mensagem de erro:`, error.message);
      console.error(`[${requestId}] Stack trace:`, error.stack);
      console.error(`[${requestId}] Nome do erro:`, error.name);
      
      // Log completo do objeto de erro
      try {
        const errorDetails = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          toString: error.toString(),
        };
        console.error(`[${requestId}] Detalhes completos do erro:`, JSON.stringify(errorDetails, null, 2));
      } catch (e) {
        console.error(`[${requestId}] Erro ao serializar detalhes:`, e);
      }
      
      // Tratamento específico para rate limiting
      const isRateLimit = 
        error.message.includes("RATE_LIMIT_EXCEEDED") ||
        error.message.includes("429") ||
        error.message.includes("Quota exceeded") ||
        error.message.includes("Too Many Requests");
      
      if (isRateLimit) {
        console.warn(`[${requestId}] ⚠️ RATE LIMIT DETECTADO - Quota da API excedida`);
        console.warn(`[${requestId}] Mensagem original:`, error.message);
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
      console.error(`[${requestId}] ❌ ERRO NÃO É RATE LIMIT`);
    } else {
      console.error(`[${requestId}] Erro não é instância de Error:`, error);
      console.error(`[${requestId}] Tipo:`, typeof error);
      console.error(`[${requestId}] Valor:`, JSON.stringify(error, null, 2));
    }
    
    console.error(`[${requestId}] === FIM DO LOG DE ERRO ===`);

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
