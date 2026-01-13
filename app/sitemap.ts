import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fakelumos.vercel.app';
  const currentDate = new Date();

  // Páginas principais para cada idioma
  const pages = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/how-it-works', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/tips', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/about', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/terms', priority: 0.5, changeFreq: 'yearly' as const },
    { path: '/privacy', priority: 0.5, changeFreq: 'yearly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Gerar entradas para cada idioma e página
  routing.locales.forEach((locale) => {
    pages.forEach((page) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: currentDate,
        changeFrequency: page.changeFreq,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((loc) => [
              loc,
              `${baseUrl}/${loc}${page.path}`,
            ])
          ),
        },
      });
    });
  });

  return sitemapEntries;
}
