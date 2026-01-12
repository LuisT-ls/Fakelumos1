import { GoogleGenerativeAI } from "@google/generative-ai";
import { searchGoogleCustom, type GoogleSearchResult } from "./google-search";

function getGenAI() {
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY não está definida");
  }
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
 * Detecta se a pergunta envolve fatos pós-2022
 */
function isPerguntaPos2022(text: string): boolean {
  const regexAno = /\b(202[3-9]|20[3-9][0-9]|21[0-9][0-9])\b/;
  const palavrasChave = [
    "atualmente",
    "hoje",
    "neste ano",
    "últimas notícias",
    "recente",
    "agora",
  ];

  if (regexAno.test(text.toLowerCase())) return true;
  if (palavrasChave.some((palavra) => text.toLowerCase().includes(palavra)))
    return true;
  return false;
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
  const textoLower = textoOriginal.toLowerCase();

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
 * Realiza verificação com Gemini
 */
async function checkWithGemini(
  text: string,
  locale: string = "pt-BR"
): Promise<GeminiAnalysisResult> {
  const genAI = getGenAI();
  
  // Lista de modelos para tentar em ordem de preferência
  const modelsToTry = ["gemini-2.5-pro", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  
  let lastError: Error | null = null;
  
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName 
      });
      
      // Tenta gerar conteúdo com este modelo
      return await generateContentWithModel(model, text, locale);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorString = JSON.stringify(error);
      
      // Detecta erro de rate limiting (429) - propaga imediatamente
      if (
        errorMessage.includes("429") ||
        errorMessage.includes("RATE_LIMIT_EXCEEDED") ||
        errorMessage.includes("Quota exceeded") ||
        errorMessage.includes("Too Many Requests") ||
        errorString.includes("429") ||
        errorString.includes("RATE_LIMIT_EXCEEDED") ||
        errorString.includes("Quota exceeded")
      ) {
        console.warn(`Rate limit detectado no modelo ${modelName}`);
        throw error; // Propaga imediatamente, não tenta outros modelos
      }
      
      console.warn(`Erro ao usar modelo ${modelName}:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Se for erro 404 (modelo não encontrado), tenta o próximo
      if (
        errorMessage.includes("404") ||
        errorMessage.includes("not found") ||
        errorMessage.includes("not supported")
      ) {
        continue; // Tenta próximo modelo
      }
      
      // Se for outro tipo de erro, propaga
      throw error;
    }
  }
  
  // Se todos os modelos falharam, lança o último erro
  throw lastError || new Error("Nenhum modelo disponível");
}

/**
 * Função auxiliar para gerar conteúdo com um modelo específico
 */
async function generateContentWithModel(
  model: any,
  text: string,
  locale: string
): Promise<GeminiAnalysisResult> {

  const currentDate = new Date();
  const promptLang =
    locale === "pt-BR"
      ? "em português brasileiro"
      : locale === "es"
      ? "em espanhol"
      : "em inglês";

  const prompt = `Analise detalhadamente o seguinte texto para verificar sua veracidade. 
    Observe que sua base de conhecimento vai até 2022, então para eventos após essa data, 
    indique claramente essa limitação na análise e foque nos elementos verificáveis do texto
    que não dependem do período temporal. Forneça a resposta ${promptLang}:
    
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
    }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text().trim();

    if (!rawText) {
      console.error("Resposta vazia da API Gemini");
      throw new Error("Resposta inválida da API");
    }

    const cleanText = rawText.replace(/```json|```/g, "").trim();
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("JSON não encontrado. Texto recebido:", cleanText.substring(0, 200));
      throw new Error("JSON não encontrado na resposta");
    }

    let parsed: GeminiAnalysisResult;
    try {
      parsed = JSON.parse(jsonMatch[0]) as GeminiAnalysisResult;
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError);
      console.error("JSON recebido:", jsonMatch[0].substring(0, 500));
      throw new Error("Erro ao processar a resposta da API");
    }

    return {
      score: parsed.score ?? 0.5,
      confiabilidade: parsed.confiabilidade ?? parsed.score ?? 0.5,
      classificacao: parsed.classificacao ?? "Não Verificável",
      explicacao_score: parsed.explicacao_score ?? "",
      elementos_verdadeiros: parsed.elementos_verdadeiros ?? [],
      elementos_falsos: parsed.elementos_falsos ?? [],
      elementos_suspeitos: parsed.elementos_suspeitos ?? [],
      fontes_confiaveis: parsed.fontes_confiaveis ?? [],
      indicadores_desinformacao: parsed.indicadores_desinformacao ?? [],
      analise_detalhada: parsed.analise_detalhada ?? "",
      recomendacoes: parsed.recomendacoes ?? [],
      limitacao_temporal: parsed.limitacao_temporal ?? {
        afeta_analise: false,
        elementos_nao_verificaveis: [],
        sugestoes_verificacao: [],
      },
    };
  } catch (error) {
    // Detecta erros de rate limiting (429) da API do Gemini
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorString = JSON.stringify(error);
    
    if (
      errorMessage.includes("429") ||
      errorMessage.includes("RATE_LIMIT_EXCEEDED") ||
      errorMessage.includes("Quota exceeded") ||
      errorMessage.includes("Too Many Requests") ||
      errorString.includes("429") ||
      errorString.includes("RATE_LIMIT_EXCEEDED") ||
      errorString.includes("Quota exceeded")
    ) {
      throw new Error("RATE_LIMIT_EXCEEDED: A quota da API foi excedida. Por favor, aguarde alguns minutos antes de tentar novamente.");
    }
    
    // Propaga outros erros
    throw error;
  }
}

/**
 * Função principal de verificação
 */
export async function handleVerification(
  text: string,
  locale: string = "pt-BR"
): Promise<VerificationResult> {
  const sanitizedText = text.trim();

  let verification: VerificationResult;

  if (isPerguntaPos2022(sanitizedText)) {
    // 1. Analisa com Gemini
    let geminiResult = await checkWithGemini(sanitizedText, locale);

    // 2. Complementa com busca Google
    const googleResults = await searchGoogleCustom(sanitizedText);

    // 3. Ajusta Gemini se fontes confirmarem
    geminiResult = ajustarGeminiComFontes(
      geminiResult,
      googleResults,
      sanitizedText
    );

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
    // Fluxo padrão Gemini
    const geminiResult = await checkWithGemini(sanitizedText, locale);

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

  return verification;
}
