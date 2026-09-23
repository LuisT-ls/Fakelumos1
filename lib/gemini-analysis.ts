import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import { searchGoogleCustom, type GoogleSearchResult } from "./google-search";
import { isRecentContent } from "./recent-content";

const DEBUG_GEMINI_LOGS = process.env.DEBUG_GEMINI_LOGS === "true";

function debugLog(...args: unknown[]) {
  if (DEBUG_GEMINI_LOGS) {
    console.log(...args);
  }
}

function getGenAI() {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY não está definida");
  }
  // Usando a API v1 (padrão) em vez de v1beta para ter acesso a mais modelos
  return new GoogleGenerativeAI(API_KEY);
}

export interface LimitacaoTemporal {
  afeta_analise: boolean;
  elementos_nao_verificaveis: string[];
  sugestoes_verificacao: string[];
}

export interface GeminiAnalysisResult {
  score: number;
  confiabilidade: number;
  classificacao:
    | "Comprovadamente Verdadeiro"
    | "Parcialmente Verdadeiro"
    | "Não Verificável"
    | "Provavelmente Falso"
    | "Comprovadamente Falso";
  explicacao_score: string;
  elementos_verdadeiros: string[];
  elementos_falsos: string[];
  elementos_suspeitos: string[];
  fontes_confiaveis: string[];
  indicadores_desinformacao: string[];
  analise_detalhada: string;
  recomendacoes: string[];
  limitacao_temporal: LimitacaoTemporal;
}

export interface VerificationResult {
  id: number;
  timestamp: string;
  text: string;
  geminiAnalysis: GeminiAnalysisResult;
  overallScore: number;
  realtimeSource?: string;
  realtimeData?: GoogleSearchResult[];
}

/**
 * Ajusta resultado do Gemini com base em fontes do Google
 */
function ajustarGeminiComFontes(
  geminiResult: GeminiAnalysisResult,
  googleResults: GoogleSearchResult[],
  textoOriginal: string
): GeminiAnalysisResult {
  if (!Array.isArray(googleResults) || googleResults.length === 0)
    return geminiResult;

  // Extrai datas do texto original
  const datasInput: string[] = [];
  const regexAno = /(20\d{2})/g;
  const regexData = /(\d{1,2}\/\d{1,2}\/20\d{2})/g;
  const regexMesAno =
    /((janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro) de (20\d{2}))/gi;

  let match;
  while ((match = regexAno.exec(textoOriginal)) !== null)
    datasInput.push(match[1]);
  while ((match = regexData.exec(textoOriginal)) !== null)
    datasInput.push(match[1]);
  while ((match = regexMesAno.exec(textoOriginal)) !== null)
    datasInput.push(match[0].toLowerCase());

  // Extração de mês e ano
  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  let mesEncontrado: string | null = null;
  let anoEncontrado: string | null = null;

  for (const mes of meses) {
    const regex = new RegExp(`${mes} de (20\\d{2})`, "i");
    const found = textoOriginal.match(regex);
    if (found) {
      mesEncontrado = mes;
      anoEncontrado = found[1];
      break;
    }
  }

  if (!mesEncontrado) {
    const regexNum = /(\d{1,2})\/(20\d{2})/;
    const found = textoOriginal.match(regexNum);
    if (found) {
      mesEncontrado = meses[parseInt(found[1], 10) - 1] || null;
      anoEncontrado = found[2];
    }
  }

  // Gera padrões de busca para mês/ano
  let padroesMesAno: string[] = [];
  if (mesEncontrado && anoEncontrado) {
    const mesNum = (meses.indexOf(mesEncontrado) + 1)
      .toString()
      .padStart(2, "0");
    padroesMesAno = [
      `${mesEncontrado} de ${anoEncontrado}`,
      `${mesNum}/${anoEncontrado}`,
      `${mesEncontrado.slice(0, 3)}/${anoEncontrado}`,
    ];
  }

  // Palavras-chave para confirmação
  const palavrasChaveConfirmacao = [
    "morre",
    "morreu",
    "óbito",
    "falecimento",
    "faleceu",
    "morte",
    "perde a vida",
    "vem a óbito",
    "falecida",
    "falecido",
    "morta",
    "morto",
    "confirmada a morte",
    "confirma morte",
    "confirma óbito",
    "covid",
    "covid-19",
    "coronavírus",
    "pandemia",
    "mortes",
    "óbitos",
    "casos",
  ];

  // Extrai possíveis nomes
  const nomesPossiveis =
    textoOriginal.match(/[A-Z][a-z]+\s[A-Z][a-z]+/g) || [];
  // Busca confirmação criteriosa
  const fonteConfirma = googleResults.find((item) => {
    const titulo = item.title.toLowerCase();
    const snippet = item.snippet.toLowerCase();

    let contemMesAno = false;
    if (padroesMesAno.length > 0) {
      contemMesAno = padroesMesAno.some(
        (pat) => titulo.includes(pat) || snippet.includes(pat)
      );
    } else if (datasInput.length > 0) {
      contemMesAno = datasInput.some(
        (data) => titulo.includes(data) || snippet.includes(data)
      );
    }

    if (!contemMesAno && padroesMesAno.length > 0) return false;

    return palavrasChaveConfirmacao.some((palavra) => {
      if (titulo.includes(palavra) || snippet.includes(palavra)) {
        if (nomesPossiveis.length > 0) {
          return nomesPossiveis.some(
            (nome) =>
              titulo.includes(nome.toLowerCase()) ||
              snippet.includes(nome.toLowerCase())
          );
        }
        return true;
      }
      return false;
    });
  });

  // Se usuário forneceu ano > 2022 e não há confirmação
  const anoFuturo = datasInput.some((data) => {
    const ano = data.match(/20\d{2}/);
    return ano && parseInt(ano[0]) > 2022;
  });

  if (!fonteConfirma && anoFuturo) {
    return {
      ...geminiResult,
      classificacao: "Não Verificável",
      score: 0.3,
      explicacao_score:
        "Não há informações suficientes ou fontes confiáveis que confirmem a afirmação para o período exato informado.",
      elementos_verdadeiros: [],
      elementos_falsos: [],
      elementos_suspeitos: [
        "Não foi encontrada confirmação para a data/mês/ano informado nas fontes pesquisadas.",
      ],
      indicadores_desinformacao: [],
      recomendacoes: [
        "Aguarde a publicação de dados oficiais ou notícias confiáveis para o período informado.",
        ...(geminiResult.recomendacoes || []),
      ],
      analise_detalhada:
        "A análise não pôde ser realizada de forma conclusiva, pois não há fontes confiáveis que confirmem ou neguem a afirmação para o período exato informado pelo usuário.",
    };
  }

  if (fonteConfirma) {
    return {
      ...geminiResult,
      classificacao: "Comprovadamente Verdadeiro",
      score: 0.98,
      explicacao_score:
        "A informação foi confirmada por fontes confiáveis e recentes encontradas no Google.",
      elementos_verdadeiros: [
        ...(geminiResult.elementos_verdadeiros || []),
        `Confirmação encontrada em: ${fonteConfirma.title}`,
      ],
      elementos_falsos: [],
      elementos_suspeitos: [],
      indicadores_desinformacao: [],
      recomendacoes: [
        "Consulte as fontes recentes listadas para mais detalhes.",
        ...(geminiResult.recomendacoes || []),
      ],
      analise_detalhada: `A afirmação foi confirmada por fontes confiáveis e recentes, como ${fonteConfirma.title}. Recomenda-se consultar a fonte para mais detalhes e contexto.`,
    };
  }

  return geminiResult;
}

/**
 * Função auxiliar para aguardar um tempo (delay)
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Detecta se o erro é rate limiting
 */
function isRateLimitError(error: unknown): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  let errorString = "";
  try {
    errorString = JSON.stringify(error);
  } catch {
    errorString = String(error);
  }
  
  return (
    errorMessage.includes("429") ||
    errorMessage.includes("503") ||
    errorMessage.includes("RATE_LIMIT_EXCEEDED") ||
    errorMessage.includes("Quota exceeded") ||
    errorMessage.includes("Too Many Requests") ||
    errorMessage.includes("Service Unavailable") ||
    errorMessage.includes("high demand") ||
    errorString.includes("429") ||
    errorString.includes("503") ||
    errorString.includes("RATE_LIMIT_EXCEEDED") ||
    errorString.includes("Quota exceeded") ||
    errorString.includes("Service Unavailable") ||
    errorString.includes("high demand")
  );
}

const VALID_CLASSIFICATIONS: GeminiAnalysisResult["classificacao"][] = [
  "Comprovadamente Verdadeiro",
  "Parcialmente Verdadeiro",
  "Não Verificável",
  "Provavelmente Falso",
  "Comprovadamente Falso",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").slice(0, 50)
    : [];
}

function toScore(value: unknown, fallback: number): number {
  const score = typeof value === "number" ? value : Number(value);
  return Number.isFinite(score) ? Math.min(1, Math.max(0, score)) : fallback;
}

function normalizeGeminiAnalysis(value: unknown): GeminiAnalysisResult {
  const parsed = isRecord(value) ? value : {};
  const score = toScore(parsed.score, 0.5);
  const classification = VALID_CLASSIFICATIONS.includes(
    parsed.classificacao as GeminiAnalysisResult["classificacao"]
  )
    ? (parsed.classificacao as GeminiAnalysisResult["classificacao"])
    : "Não Verificável";
  const temporal = isRecord(parsed.limitacao_temporal)
    ? parsed.limitacao_temporal
    : {};

  return {
    score,
    confiabilidade: toScore(parsed.confiabilidade, score),
    classificacao: classification,
    explicacao_score:
      typeof parsed.explicacao_score === "string" ? parsed.explicacao_score : "",
    elementos_verdadeiros: toStringArray(parsed.elementos_verdadeiros),
    elementos_falsos: toStringArray(parsed.elementos_falsos),
    elementos_suspeitos: toStringArray(parsed.elementos_suspeitos),
    fontes_confiaveis: toStringArray(parsed.fontes_confiaveis),
    indicadores_desinformacao: toStringArray(parsed.indicadores_desinformacao),
    analise_detalhada:
      typeof parsed.analise_detalhada === "string" ? parsed.analise_detalhada : "",
    recomendacoes: toStringArray(parsed.recomendacoes),
    limitacao_temporal: {
      afeta_analise: temporal.afeta_analise === true,
      elementos_nao_verificaveis: toStringArray(
        temporal.elementos_nao_verificaveis
      ),
      sugestoes_verificacao: toStringArray(temporal.sugestoes_verificacao),
    },
  };
}

/**
 * Realiza verificação com Gemini com retry e fallback
 */
async function checkWithGemini(
  text: string,
  locale: string = "pt-BR",
  requestId?: number
): Promise<GeminiAnalysisResult> {
  const logId = requestId ? `checkWithGemini-${requestId}` : `checkWithGemini-${Date.now()}`;
  debugLog(`[${logId}] === INICIANDO checkWithGemini ===`);
  debugLog(`[${logId}] Locale:`, locale);
  debugLog(`[${logId}] Tamanho do texto:`, text.length);
  
  try {
    const genAI = getGenAI();
    debugLog(`[${logId}] Instância do Gemini AI criada com sucesso`);
    
    // Lista de modelos para tentar em ordem de preferência
    // Baseado na documentação oficial: https://ai.google.dev/gemini-api/docs/models?hl=pt-br
    // Ordem: modelos mais leves primeiro (mais quota), depois modelos mais pesados
    // Modelos estáveis têm prioridade sobre previews
    const modelsToTry = [
      "gemini-3-flash-preview",  // Preview do modelo mais recente e equilibrado (testando)
      "gemini-2.5-flash",        // Modelo estável mais leve (fallback 1)
      "gemini-2.0-flash-lite",   // Modelo leve de segunda geração (fallback 2)
      "gemini-2.5-pro",          // Modelo estável mais pesado (fallback 3)
      "gemini-3-pro-preview",    // Preview do modelo mais inteligente (fallback 4)
    ];
    debugLog(`[${logId}] Modelos para tentar:`, modelsToTry.join(", "));
    
    let lastError: Error | null = null;
    let rateLimitCount = 0;
    const maxRetries = 2; // Reduzido para 2 tentativas (rate limit não resolve rápido)
    const baseDelay = 1000; // Reduzido para 1 segundo base (resposta mais rápida)
    const rateLimitMaxRetries = 1; // Apenas 1 tentativa para rate limit (tenta próximo modelo imediatamente)
    
    for (const modelName of modelsToTry) {
      debugLog(`[${logId}] Tentando modelo: ${modelName}`);
      
      // Tenta até maxRetries vezes com backoff exponencial
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const model = genAI.getGenerativeModel({ 
            model: modelName 
          });
          debugLog(`[${logId}] Modelo ${modelName} instanciado (tentativa ${attempt + 1}/${maxRetries})`);
          
          // Se não é a primeira tentativa, aguarda antes de tentar novamente
          if (attempt > 0) {
            const delayMs = baseDelay * Math.pow(2, attempt - 1); // Backoff exponencial: 2s, 4s, 8s
            debugLog(`[${logId}] Aguardando ${delayMs}ms antes de retry...`);
            await delay(delayMs);
          }
          
          // Tenta gerar conteúdo com este modelo
          const result = await generateContentWithModel(model, text, locale, logId);
          debugLog(`[${logId}] ✅ Sucesso com modelo ${modelName} na tentativa ${attempt + 1}`);
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`[${logId}] Falha ao usar o modelo ${modelName} (tentativa ${attempt + 1})`);
          if (DEBUG_GEMINI_LOGS) {
            console.error(`[${logId}] Detalhe:`, errorMessage);
          }
          
          // Detecta erro de rate limiting
          const isRateLimit = isRateLimitError(error);
          
          if (isRateLimit) {
            rateLimitCount++;
            console.warn(`[${logId}] ⚠️ RATE LIMIT detectado no modelo ${modelName} (tentativa ${attempt + 1})`);
            
            // Para rate limit, tentamos apenas 1 vez por modelo e depois vamos para o próximo
            // Rate limit geralmente não resolve em segundos, então não faz sentido esperar muito
            if (attempt < rateLimitMaxRetries) {
              // Apenas 1 tentativa rápida com delay curto (1s)
              const delayMs = baseDelay; // 1 segundo apenas
              console.warn(`[${logId}] Aguardando ${delayMs}ms (${(delayMs / 1000).toFixed(1)}s) antes de retry rápido...`);
              await delay(delayMs);
              continue; // Tenta novamente com este modelo (apenas 1 vez)
            } else {
              // Se esgotou as tentativas para este modelo, tenta o próximo imediatamente
              console.warn(`[${logId}] Rate limit persistente em ${modelName}, tentando próximo modelo imediatamente...`);
              lastError = error instanceof Error ? error : new Error(String(error));
              break; // Sai do loop de retry e tenta próximo modelo
            }
          }
          
          // Se for erro 404 (modelo não encontrado), tenta o próximo modelo
          if (
            errorMessage.includes("404") ||
            errorMessage.includes("not found") ||
            errorMessage.includes("not supported")
          ) {
            console.warn(`[${logId}] Modelo ${modelName} não encontrado (404) - tentando próximo`);
            lastError = error instanceof Error ? error : new Error(String(error));
            break; // Sai do loop de retry e tenta próximo modelo
          }
          
          // Para outros erros, propaga imediatamente
          console.error(`[${logId}] Erro não é 404 nem rate limit - propagando`);
          throw error;
        }
      }
    }
    
    // Se todos os modelos falharam, lança o último erro
    console.error(`[${logId}] Todos os modelos falharam após ${rateLimitCount} rate limits`);
    
    if (lastError && isRateLimitError(lastError)) {
      throw new Error("RATE_LIMIT_EXCEEDED: A quota da API foi excedida para todos os modelos. Por favor, aguarde alguns minutos antes de tentar novamente.");
    }
    
    throw lastError || new Error("Nenhum modelo disponível");
  } catch (error) {
    console.error(`[${logId}] Erro final na verificação com Gemini`);
    if (DEBUG_GEMINI_LOGS) {
      console.error(`[${logId}] Detalhe:`, error instanceof Error ? error.message : String(error));
    }
    throw error;
  }
}

/**
 * Função auxiliar para gerar conteúdo com um modelo específico
 */
async function generateContentWithModel(
  model: GenerativeModel,
  text: string,
  locale: string,
  logId?: string
): Promise<GeminiAnalysisResult> {
  const localLogId = logId || `generateContent-${Date.now()}`;
  debugLog(`[${localLogId}] === INICIANDO generateContentWithModel ===`);

  const currentDate = new Date();
  const promptLang =
    locale === "pt-BR"
      ? "em português brasileiro"
      : locale === "es"
      ? "em espanhol"
      : "em inglês";

  const prompt = `Analise detalhadamente o seguinte texto para verificar sua veracidade. 
    Use sua base de conhecimento atualizada para verificar fatos, datas, eventos e informações mencionadas no texto.
    Seja criterioso e analise todos os elementos do texto, incluindo afirmações sobre eventos recentes.
    Forneça a resposta ${promptLang}:
    
    Data atual: ${currentDate.toISOString()}
    Texto para análise: "${text}"

    Retorne APENAS um objeto JSON válido com esta estrutura exata, sem nenhum texto adicional:
    {
      "score": [0-1],
      "confiabilidade": [0-1],
      "classificacao": ["Comprovadamente Verdadeiro", "Parcialmente Verdadeiro", "Não Verificável", "Provavelmente Falso", "Comprovadamente Falso"],
      "explicacao_score": "string",
      "elementos_verdadeiros": ["array"],
      "elementos_falsos": ["array"],
      "elementos_suspeitos": ["array"],
      "fontes_confiaveis": ["array"],
      "indicadores_desinformacao": ["array"],
      "analise_detalhada": "string",
      "recomendacoes": ["array"],
      "limitacao_temporal": {
        "afeta_analise": boolean,
        "elementos_nao_verificaveis": ["array"],
        "sugestoes_verificacao": ["array"]
      }
    }
    
    Nota: O campo "limitacao_temporal" deve ser usado apenas se houver elementos que realmente não possam ser verificados,
    como informações muito específicas ou não documentadas. Para eventos recentes, use sua base de conhecimento atualizada.`;

  try {
    debugLog(`[${localLogId}] Enviando requisição para o modelo...`);
    debugLog(`[${localLogId}] Tamanho do prompt:`, prompt.length);
    
    const startTime = Date.now();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const elapsedTime = Date.now() - startTime;
    
    debugLog(`[${localLogId}] Resposta recebida em ${elapsedTime}ms`);
    
    const rawText = response.text().trim();
    debugLog(`[${localLogId}] Tamanho da resposta:`, rawText.length);

    if (!rawText) {
      console.error("Resposta vazia da API Gemini");
      throw new Error("Resposta inválida da API");
    }

    const cleanText = rawText.replace(/```json|```/g, "").trim();
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("JSON não encontrado na resposta do Gemini");
      throw new Error("JSON não encontrado na resposta");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Erro ao processar o JSON retornado pelo Gemini");
      if (DEBUG_GEMINI_LOGS) {
        console.error("Detalhe do parse:", parseError instanceof Error ? parseError.message : String(parseError));
      }
      throw new Error("Erro ao processar a resposta da API");
    }

    return normalizeGeminiAnalysis(parsed);
  } catch (error) {
    // Detecta erros de rate limiting (429) da API do Gemini
    const errorMessage = error instanceof Error ? error.message : String(error);
    let errorString = "";
    
    try {
      errorString = JSON.stringify(error);
    } catch {
      errorString = String(error);
    }
    
    console.error(`[${localLogId}] Falha ao processar a chamada ao Gemini`);
    if (DEBUG_GEMINI_LOGS) {
      console.error(`[${localLogId}] Tipo:`, error instanceof Error ? error.constructor.name : typeof error);
      console.error(`[${localLogId}] Detalhe:`, errorMessage);
    }
    
    const isRateLimit = 
      errorMessage.includes("429") ||
      errorMessage.includes("503") ||
      errorMessage.includes("RATE_LIMIT_EXCEEDED") ||
      errorMessage.includes("Quota exceeded") ||
      errorMessage.includes("Too Many Requests") ||
      errorMessage.includes("Service Unavailable") ||
      errorMessage.includes("high demand") ||
      errorString.includes("429") ||
      errorString.includes("503") ||
      errorString.includes("RATE_LIMIT_EXCEEDED") ||
      errorString.includes("Quota exceeded") ||
      errorString.includes("Service Unavailable") ||
      errorString.includes("high demand");
    
    if (isRateLimit) {
      console.warn(`[${localLogId}] ⚠️ SOBRECARGA/RATE LIMIT detectado - propagando erro`);
      throw new Error("RATE_LIMIT_EXCEEDED: O modelo está temporariamente sobrecarregado. Por favor, aguarde alguns instantes antes de tentar novamente.");
    }
    
    console.error(`[${localLogId}] Erro não relacionado a limite de uso`);
    // Propaga outros erros
    throw error;
  }
}

/**
 * Função principal de verificação
 */
export async function handleVerification(
  text: string,
  locale: string = "pt-BR",
  requestId?: number
): Promise<VerificationResult> {
  const logId = requestId ? `handleVerification-${requestId}` : `handleVerification-${Date.now()}`;
  debugLog(`[${logId}] === INICIANDO handleVerification ===`);
  debugLog(`[${logId}] Locale:`, locale);
  debugLog(`[${logId}] Tamanho do texto original:`, text.length);
  
  const sanitizedText = text.trim();

  let verification: VerificationResult;

  const isPost2022 = isRecentContent(sanitizedText);
  debugLog(`[${logId}] É pergunta pós-2022:`, isPost2022);

  try {
    if (isPost2022) {
      debugLog(`[${logId}] Fluxo: Conteúdo recente detectado - usando Gemini + Google Search para complementar`);
      
      // 1. Analisa com Gemini
      debugLog(`[${logId}] Passo 1: Analisando com Gemini...`);
      let geminiResult = await checkWithGemini(sanitizedText, locale, requestId);
      debugLog(`[${logId}] Gemini análise concluída. Score:`, geminiResult.score);

      // 2. Complementa com busca Google
      debugLog(`[${logId}] Passo 2: Buscando no Google...`);
      const googleResults = await searchGoogleCustom(sanitizedText);
      debugLog(`[${logId}] Google Search retornou ${googleResults.length} resultados`);

      // 3. Ajusta Gemini se fontes confirmarem
      debugLog(`[${logId}] Passo 3: Ajustando resultado com fontes do Google...`);
      geminiResult = ajustarGeminiComFontes(
        geminiResult,
        googleResults,
        sanitizedText
      );
      debugLog(`[${logId}] Resultado ajustado. Score final:`, geminiResult.score);

      verification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        text:
          sanitizedText.substring(0, 200) +
          (sanitizedText.length > 200 ? "..." : ""),
        geminiAnalysis: geminiResult,
        overallScore: geminiResult.score,
        realtimeSource: "Google Custom Search",
        realtimeData: googleResults,
      };
    } else {
      debugLog(`[${logId}] Fluxo: Padrão - usando apenas Gemini`);
      
      // Fluxo padrão Gemini
      const geminiResult = await checkWithGemini(sanitizedText, locale, requestId);
      debugLog(`[${logId}] Gemini análise concluída. Score:`, geminiResult.score);

      verification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        text:
          sanitizedText.substring(0, 200) +
          (sanitizedText.length > 200 ? "..." : ""),
        geminiAnalysis: geminiResult,
        overallScore: geminiResult.score,
      };
    }

    debugLog(`[${logId}] ✅ Verificação concluída com sucesso`);
    debugLog(`[${logId}] ID da verificação:`, verification.id);
    debugLog(`[${logId}] Score final:`, verification.overallScore);
    debugLog(`[${logId}] Classificação:`, verification.geminiAnalysis.classificacao);

    return verification;
  } catch (error) {
    console.error(`[${logId}] Erro ao concluir a verificação`);
    if (DEBUG_GEMINI_LOGS) {
      console.error(`[${logId}] Detalhe:`, error instanceof Error ? error.message : String(error));
    }
    throw error;
  }
}
