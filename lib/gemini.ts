import { GoogleGenerativeAI } from "@google/generative-ai";

function getGenAI() {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY não está definida");
  }
  return new GoogleGenerativeAI(API_KEY);
}

export interface VerificationResult {
  isFake: boolean;
  confidence: number;
  explanation: string;
  reasons: string[];
}

export async function verifyNews(content: string, locale: string = "pt-BR"): Promise<VerificationResult> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Você é um especialista em verificação de fatos e detecção de fake news. Analise a seguinte notícia e determine se é falsa ou verdadeira.

Notícia para análise:
${content}

Forneça uma análise detalhada em ${locale === "pt-BR" ? "português brasileiro" : locale === "es" ? "espanhol" : "inglês"} com:
1. Uma conclusão clara: a notícia é falsa (true) ou provavelmente verdadeira (false)
2. Um nível de confiança (0-100)
3. Uma explicação detalhada do porquê
4. Uma lista de razões específicas que levaram a essa conclusão

Responda APENAS com um JSON válido no seguinte formato:
{
  "isFake": boolean,
  "confidence": number,
  "explanation": "string",
  "reasons": ["string", "string"]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extrair JSON da resposta
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Resposta inválida da API");
    }

    const parsed = JSON.parse(jsonMatch[0]) as VerificationResult;
    
    return {
      isFake: parsed.isFake ?? false,
      confidence: parsed.confidence ?? 50,
      explanation: parsed.explanation ?? "Análise não disponível",
      reasons: parsed.reasons ?? [],
    };
  } catch (error) {
    console.error("Erro ao verificar notícia:", error);
    throw new Error("Erro ao processar a verificação. Tente novamente.");
  }
}
