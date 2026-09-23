import { NextRequest, NextResponse } from "next/server";
import { handleVerification } from "@/lib/gemini-analysis";
import { validateUserInput } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";

const SUPPORTED_LOCALES = new Set(["pt-BR", "en", "es"]);

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const requestOrigin = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  const configuredOrigins = (process.env.APP_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return origin === requestOrigin || configuredOrigins.includes(origin);
}

function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return (
    forwardedFor?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  let locale = "pt-BR";
  const requestId = Date.now();

  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json(
        { error: "Origem não autorizada", errorCode: "ORIGIN_NOT_ALLOWED" },
        { status: 403 }
      );
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Corpo da requisição inválido", errorCode: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    const { content, locale: bodyLocale } = body as {
      content?: unknown;
      locale?: unknown;
    };
    const requestedLocale = typeof bodyLocale === "string" ? bodyLocale : "pt-BR";
    locale = SUPPORTED_LOCALES.has(requestedLocale) ? requestedLocale : "pt-BR";

    const rateLimit = checkRateLimit(getClientIdentifier(request));
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            locale === "pt-BR"
              ? "Muitas tentativas. Aguarde um momento antes de tentar novamente."
              : locale === "es"
              ? "Demasiados intentos. Espere un momento antes de intentarlo de nuevo."
              : "Too many attempts. Please wait a moment before trying again.",
          errorCode: "RATE_LIMIT_EXCEEDED",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Conteúdo da notícia é obrigatório", errorCode: "INVALID_CONTENT" },
        { status: 400 }
      );
    }

    // Valida entrada do usuário
    const validation = validateUserInput(content);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: validation.errors[0] || "Entrada inválida",
          errorCode: "INVALID_CONTENT",
        },
        { status: 400 }
      );
    }

    // Log de segurança se flags foram detectadas
    if (validation.securityFlags && validation.securityFlags.length > 0) {
      console.warn(`[${requestId}] ⚠️ FLAGS DE SEGURANÇA DETECTADAS:`, validation.securityFlags);
    }

    // Verifica se a API key está configurada
    const apiKeyExists = !!process.env.GEMINI_API_KEY;
    
    if (!apiKeyExists) {
      return NextResponse.json(
        {
          error: "Configuração da API não encontrada. Por favor, entre em contato com o suporte.",
          errorCode: "CONFIGURATION_ERROR",
        },
        { status: 500 }
      );
    }

    const result = await handleVerification(
      validation.sanitizedText,
      locale,
      requestId
    );

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isRateLimit = /429|503|RATE_LIMIT_EXCEEDED|Quota exceeded|Too Many Requests|Service Unavailable|high demand/i.test(
      errorMessage
    );

    if (isRateLimit) {
      return NextResponse.json(
        {
          error:
            locale === "pt-BR"
              ? "O serviço está temporariamente sobrecarregado. Aguarde alguns instantes e tente novamente."
              : locale === "es"
              ? "El servicio está temporalmente sobrecargado. Espere unos instantes e inténtelo de nuevo."
              : "The service is temporarily overloaded. Please wait a moment and try again.",
          errorCode: "RATE_LIMIT_EXCEEDED",
        },
        { status: 429 }
      );
    }

    console.error(`[${requestId}] Falha na verificação`);

    return NextResponse.json(
      {
        error:
          locale === "pt-BR"
            ? "Não foi possível processar a verificação. Tente novamente mais tarde."
            : locale === "es"
            ? "No fue posible procesar la verificación. Inténtelo de nuevo más tarde."
            : "The verification could not be processed. Please try again later.",
        errorCode: "VERIFICATION_FAILED",
      },
      { status: 500 }
    );
  }
}
