const RECENT_YEAR_PATTERN = /\b(?:20(?:2[3-9]|[3-9]\d)|2[1-9]\d{2})\b/;

const RECENT_KEYWORDS = [
  "atualmente",
  "hoje",
  "neste ano",
  "últimas notícias",
  "últimas semanas",
  "últimas horas",
  "recente",
  "recentemente",
  "agora",
  "currently",
  "today",
  "this year",
  "latest news",
  "last weeks",
  "last hours",
  "recent",
  "recently",
  "ahora",
  "hoy",
  "este año",
  "últimas noticias",
  "reciente",
  "recientemente",
  "últimas semanas",
  "últimas horas",
];

export function isRecentContent(text: string): boolean {
  const normalizedText = text.toLocaleLowerCase();

  return (
    RECENT_YEAR_PATTERN.test(normalizedText) ||
    RECENT_KEYWORDS.some((keyword) => normalizedText.includes(keyword))
  );
}
