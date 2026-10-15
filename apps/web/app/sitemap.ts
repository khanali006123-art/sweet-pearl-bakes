import { MetadataRoute } from 'next';
import { DEFAULT_PRODUCTS } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sweetpearlbakes.com';

  const staticRoutes = [
    '',
    '/menu',
    '/custom-cakes',
    '/order',
    '/track',
    '/gallery',
    '/about',
    '/delivery-and-ordering',
    '/faq',
    '/contact',
    '/privacy',
    '/terms'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const productRoutes = DEFAULT_PRODUCTS.map((p) => ({
    url: `${baseUrl}/menu/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes];
}
