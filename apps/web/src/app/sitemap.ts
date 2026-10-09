import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: new URL('/', siteUrl).toString(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: new URL(
        '/calculators/simple-interest',
        siteUrl,
      ).toString(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: new URL(
        '/calculators/compound-interest',
        siteUrl,
      ).toString(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  return routes;
}