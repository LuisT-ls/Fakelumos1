export interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
}

const GOOGLE_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

/**
 * Busca no Google Custom Search API
 * Nota: Requer configuração de API Key e Search Engine ID
 */
export async function searchGoogleCustom(
  query: string
): Promise<GoogleSearchResult[]> {
  if (!GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
    console.warn("Google Search API não configurada");
    return [];
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=5`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro na busca do Google");
    }

    const data = await response.json();
    const items = data.items || [];

    return items.map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
    }));
  } catch (error) {
    console.error("Erro na busca Google:", error);
    return [];
  }
}
