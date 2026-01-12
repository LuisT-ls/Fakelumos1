import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fakelumos.vercel.app';
  const currentDate = new Date();

  // Páginas principais para cada idioma
  const pages = [
    '',
    '/how-it-works',
    '/tips',
    '/about',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Gerar entradas para cada idioma e página
  routing.locales.forEach((locale) => {
    pages.forEach((page) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: currentDate,
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((loc) => [
              loc,
              `${baseUrl}/${loc}${page}`,
            ])
          ),
        },
      });
    });
  });

  return sitemapEntries;
}
