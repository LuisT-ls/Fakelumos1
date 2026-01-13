/**
 * Utilitários de segurança para validação e sanitização avançada
 */

/**
 * Lista de caracteres perigosos que devem ser removidos ou escapados
 */
export const DANGEROUS_CHARS = [
  "\x00", // NULL
  "\x08", // Backspace
  "\x0B", // Vertical Tab
  "\x0C", // Form Feed
  "\x0E", // Shift Out
  "\x1F", // Unit Separator
  "\x7F", // DEL
  "\u202A", // Left-to-Right Embedding
  "\u202B", // Right-to-Left Embedding
  "\u202C", // Pop Directional Formatting
  "\u202D", // Left-to-Right Override
  "\u202E", // Right-to-Left Override
  "\u2066", // Left-to-Right Isolate
  "\u2067", // Right-to-Left Isolate
  "\u2068", // First Strong Isolate
  "\u2069", // Pop Directional Isolate
  "\uFEFF", // Zero Width No-Break Space
];

/**
 * Padrões regex para detecção de ataques comuns
 */
export const SECURITY_PATTERNS = {
  // SQL Injection
  sqlInjection: [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b.*\b(from|into|table|database|where)\b)/gi,
    /('|(\\')|;|--|\*|\/\*|\*\/|xp_|sp_)/gi,
    /(\bor\b\s*\d+\s*=\s*\d+)/gi,
    /(\band\b\s*\d+\s*=\s*\d+)/gi,
  ],

  // XSS
  xss: [
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
  ],

  // Command Injection
  commandInjection: [
    /[;&|`$(){}[\]]/g,
    /\b(cat|ls|pwd|whoami|id|uname|ps|kill|rm|mv|cp|chmod|chown)\b/gi,
    /\$\{[^}]+\}/g,
    /`[^`]+`/g,
  ],

  // Path Traversal
  pathTraversal: [
    /\.\.\/|\.\.\\/g,
    /\/etc\/passwd|\/proc\/self|\/windows\/system32/gi,
  ],

  // LDAP Injection
  ldapInjection: [
    /[()&|!]/g,
    /\*.*\*/g,
  ],

  // XML/XXE Injection
  xxeInjection: [
    /<!ENTITY/gi,
    /<!DOCTYPE/gi,
    /SYSTEM\s+["']/gi,
  ],
};

/**
 * Escapa caracteres especiais para prevenir injection
 */
export function escapeSpecialChars(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Valida se uma string contém apenas caracteres seguros
 */
export function containsOnlySafeChars(text: string): boolean {
  // Verifica se contém apenas caracteres alfanuméricos, espaços e pontuação comum
  const safePattern = /^[\p{L}\p{N}\s.,!?;:()\-'"]+$/u;
  return safePattern.test(text);
}

/**
 * Detecta tentativas de encoding evasion
 */
export function detectEncodingEvasion(text: string): boolean {
  // Verifica múltiplas codificações do mesmo caractere perigoso
  const suspiciousPatterns = [
    /%3Cscript/gi, // <script URL encoded
    /&#60;script/gi, // <script HTML entity
    /\u003Cscript/gi, // <script Unicode
    /%3C%73%63%72%69%70%74/gi, // <script double encoded
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(text));
}

/**
 * Remove caracteres de controle e invisíveis
 */
export function removeControlChars(text: string): string {
  let cleaned = text;

  // Remove caracteres de controle (exceto \n, \r, \t)
  cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "");

  // Remove caracteres Unicode problemáticos
  cleaned = cleaned.replace(/[\u202A-\u202E\u2066-\u2069]/g, "");

  // Remove zero-width characters
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, "");

  return cleaned;
}

/**
 * Normaliza encoding para UTF-8
 */
export function normalizeEncoding(text: string): string {
  try {
    // Tenta normalizar para UTF-8
    const normalized = text.normalize("NFKC");
    
    // Valida que é UTF-8 válido
    const encoder = new TextEncoder();
    const decoder = new TextDecoder("utf-8", { fatal: true });
    const encoded = encoder.encode(normalized);
    decoder.decode(encoded);
    
    return normalized;
  } catch (error) {
    // Se falhar, tenta remover caracteres inválidos
    return text.replace(/[^\x00-\x7F]/g, "");
  }
}

/**
 * Calcula um score de risco baseado em padrões detectados
 */
export function calculateRiskScore(securityFlags: string[]): number {
  const riskWeights: Record<string, number> = {
    SQL_INJECTION_SUSPECTED: 0.3,
    XSS_SUSPECTED: 0.3,
    COMMAND_INJECTION_SUSPECTED: 0.4,
    PATH_TRAVERSAL_SUSPECTED: 0.3,
    LDAP_INJECTION_SUSPECTED: 0.2,
    XXE_INJECTION_SUSPECTED: 0.3,
    ENCODING_EVASION_SUSPECTED: 0.2,
  };

  return securityFlags.reduce((score, flag) => {
    return score + (riskWeights[flag] || 0.1);
  }, 0);
}
