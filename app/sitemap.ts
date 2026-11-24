import type {MetadataRoute} from 'next';
import {headers} from 'next/headers';
import {OG_IMAGE_PATH, getMetadataBase} from '@/lib/seo';

export const dynamic = 'force-dynamic';

async function resolveOrigin(): Promise<string> {
  const configured = getMetadataBase();
  if (configured) return configured.origin;

  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  if (!host) return '';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await resolveOrigin();
  if (!origin) return [];

  const lastModified = new Date();

  return [
    {
      url: `${origin}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
      images: [`${origin}${OG_IMAGE_PATH}`],
    },
    {
      url: `${origin}/black-holes`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];
}
