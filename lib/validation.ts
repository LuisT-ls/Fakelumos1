import {
  detectEncodingEvasion,
  removeControlChars,
  normalizeEncoding,
} from "./security-utils";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedText: string;
  rateLimited?: boolean;
  securityFlags?: string[];
}

const MAX_LENGTH = 5000;
const MIN_LENGTH = 10;

/**
 * Valida se o encoding do texto é válido (UTF-8)
 */
function validateEncoding(text: string): { isValid: boolean; error?: string } {
  try {
    // Tenta normalizar e validar como UTF-8
    const normalized = normalizeEncoding(text);
    const encoder = new TextEncoder();
    const decoder = new TextDecoder("utf-8", { fatal: true });
    const encoded = encoder.encode(normalized);
    decoder.decode(encoded);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error:
        "Encoding inválido detectado. Por favor, use apenas caracteres UTF-8 válidos.",
    };
  }
}

/**
 * Detecta padrões suspeitos de injection
 */
function detectInjectionPatterns(text: string): string[] {
  const flags: string[] = [];
  const lowerText = text.toLowerCase();

  // Padrões SQL Injection
  const sqlPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b.*\b(from|into|table|database|where)\b)/gi,
    /('|(\\')|;|--|\*|\/\*|\*\/|xp_|sp_)/gi,
    /(\bor\b\s*\d+\s*=\s*\d+)/gi,
    /(\band\b\s*\d+\s*=\s*\d+)/gi,
  ];

  // Padrões XSS
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=\s*["'][^"']*["']/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi,
    /<style[^>]*>.*?<\/style>/gi,
    /expression\s*\(/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
  ];

  // Padrões de Command Injection
  const commandPatterns = [
    /[;&|`$(){}[\]]/g,
    /\b(cat|ls|pwd|whoami|id|uname|ps|kill|rm|mv|cp|chmod|chown)\b/gi,
    /\$\{[^}]+\}/g,
    /`[^`]+`/g,
  ];

  // Padrões de Path Traversal
  const pathPatterns = [
    /\.\.\/|\.\.\\/g,
    /\/etc\/passwd|\/proc\/self|\/windows\/system32/gi,
  ];

  // Verificar SQL Injection
  if (sqlPatterns.some((pattern) => pattern.test(text))) {
    flags.push("SQL_INJECTION_SUSPECTED");
  }

  // Verificar XSS
  if (xssPatterns.some((pattern) => pattern.test(text))) {
    flags.push("XSS_SUSPECTED");
  }

  // Verificar Command Injection (apenas se houver múltiplos padrões)
  const commandMatches = commandPatterns.filter((pattern) => pattern.test(text));
  if (commandMatches.length >= 2) {
    flags.push("COMMAND_INJECTION_SUSPECTED");
  }

  // Verificar Path Traversal
  if (pathPatterns.some((pattern) => pattern.test(text))) {
    flags.push("PATH_TRAVERSAL_SUSPECTED");
  }

  return flags;
}

/**
 * Remove scripts e tags HTML maliciosas
 */
function removeMaliciousScripts(text: string): string {
  let sanitized = text;

  // Remove tags script (incluindo variações)
  sanitized = sanitized.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  // Remove event handlers inline
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, "");

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, "");
  sanitized = sanitized.replace(/jscript:/gi, "");
  sanitized = sanitized.replace(/vbscript:/gi, "");
  sanitized = sanitized.replace(/data:text\/html/gi, "");

  // Remove iframes
  sanitized = sanitized.replace(
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    ""
  );

  // Remove objects e embeds
  sanitized = sanitized.replace(
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    ""
  );
  sanitized = sanitized.replace(
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    ""
  );

  // Remove style tags com expressões
  sanitized = sanitized.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    ""
  );

  // Remove meta refresh e outros meta tags perigosos
  sanitized = sanitized.replace(
    /<meta[^>]*(http-equiv|content)[^>]*>/gi,
    ""
  );

  // Remove link tags suspeitas
  sanitized = sanitized.replace(/<link[^>]*>/gi, "");

  // Remove expressões CSS perigosas
  sanitized = sanitized.replace(/expression\s*\(/gi, "");

  // Remove caracteres de controle (exceto quebras de linha e tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "");

  // Remove caracteres Unicode problemáticos
  sanitized = sanitized.replace(/[\u202A-\u202E\u2066-\u2069]/g, "");

  return sanitized;
}

/**
 * Normaliza e limpa o texto
 */
function normalizeText(text: string): string {
  // Normaliza caracteres Unicode (NFKC)
  let normalized = text.normalize("NFKC");

  // Remove espaços em branco excessivos
  normalized = normalized.replace(/\s+/g, " ");

  // Remove caracteres invisíveis
  normalized = normalized.replace(/[\u200B-\u200D\uFEFF]/g, "");

  return normalized.trim();
}

/**
 * Valida e sanitiza entrada do usuário com proteções avançadas
 */
export function validateUserInput(text: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const securityFlags: string[] = [];

  if (!text || typeof text !== "string") {
    errors.push("Entrada inválida: o texto deve ser uma string.");
    return {
      isValid: false,
      errors,
      warnings,
      sanitizedText: "",
      securityFlags,
    };
  }

  let sanitizedText = text.trim();

  // Verifica comprimento mínimo
  if (sanitizedText.length < MIN_LENGTH) {
    errors.push(`O texto deve ter pelo menos ${MIN_LENGTH} caracteres.`);
    return {
      isValid: false,
      errors,
      warnings,
      sanitizedText,
      securityFlags,
    };
  }

  // Verifica comprimento máximo
  if (sanitizedText.length > MAX_LENGTH) {
    errors.push(`O texto não pode exceder ${MAX_LENGTH} caracteres.`);
    return {
      isValid: false,
      errors,
      warnings,
      sanitizedText,
      securityFlags,
    };
  }

  // Valida encoding
  const encodingCheck = validateEncoding(sanitizedText);
  if (!encodingCheck.isValid) {
    errors.push(encodingCheck.error || "Encoding inválido.");
    return {
      isValid: false,
      errors,
      warnings,
      sanitizedText,
      securityFlags,
    };
  }

  // Detecta tentativas de encoding evasion
  if (detectEncodingEvasion(sanitizedText)) {
    securityFlags.push("ENCODING_EVASION_SUSPECTED");
    warnings.push(
      "Tentativa de evasão de encoding detectada. O texto foi normalizado."
    );
  }

  // Normaliza encoding antes de outras verificações
  sanitizedText = normalizeEncoding(sanitizedText);

  // Remove caracteres de controle
  sanitizedText = removeControlChars(sanitizedText);

  // Detecta padrões de injection antes da sanitização
  const injectionFlags = detectInjectionPatterns(sanitizedText);
  if (injectionFlags.length > 0) {
    securityFlags.push(...injectionFlags);
    warnings.push(
      "Padrões suspeitos detectados. O texto foi sanitizado para segurança."
    );
  }

  // Remove scripts e conteúdo malicioso
  sanitizedText = removeMaliciousScripts(sanitizedText);

  // Normaliza o texto
  sanitizedText = normalizeText(sanitizedText);

  // Verifica se após sanitização o texto ainda tem tamanho válido
  if (sanitizedText.length < MIN_LENGTH) {
    errors.push(
      "Após sanitização, o texto ficou muito curto. Por favor, verifique o conteúdo."
    );
    return {
      isValid: false,
      errors,
      warnings,
      sanitizedText,
      securityFlags,
    };
  }

  // Avisos sobre tamanho
  if (sanitizedText.length > 2000) {
    warnings.push("Textos muito longos podem levar mais tempo para análise.");
  }

  if (sanitizedText.length < 50) {
    warnings.push(
      "Textos muito curtos podem resultar em análises menos precisas."
    );
  }

  // Aviso se conteúdo foi removido
  const removedContent = text.length - sanitizedText.length;
  if (removedContent > text.length * 0.1) {
    warnings.push(
      "Uma quantidade significativa de conteúdo foi removida durante a sanitização."
    );
  }

  return {
    isValid: true,
    errors: [],
    warnings,
    sanitizedText,
    securityFlags: securityFlags.length > 0 ? securityFlags : undefined,
  };
}
