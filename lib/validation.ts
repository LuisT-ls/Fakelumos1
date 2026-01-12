export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedText: string;
  rateLimited?: boolean;
}

const MAX_LENGTH = 5000;
const MIN_LENGTH = 10;

export function validateUserInput(text: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let sanitizedText = text.trim();

  // Verifica comprimento mínimo
  if (sanitizedText.length < MIN_LENGTH) {
    errors.push(`O texto deve ter pelo menos ${MIN_LENGTH} caracteres.`);
    return {
      isValid: false,
      errors,
      warnings,
      sanitizedText,
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
    };
  }

  // Remove caracteres potencialmente perigosos, mas mantém a estrutura
  sanitizedText = sanitizedText
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");

  // Avisos
  if (sanitizedText.length > 2000) {
    warnings.push("Textos muito longos podem levar mais tempo para análise.");
  }

  if (sanitizedText.length < 50) {
    warnings.push("Textos muito curtos podem resultar em análises menos precisas.");
  }

  return {
    isValid: true,
    errors: [],
    warnings,
    sanitizedText,
  };
}
