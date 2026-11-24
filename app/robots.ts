import type {MetadataRoute} from 'next';
import {headers} from 'next/headers';
import {getMetadataBase} from '@/lib/seo';

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

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await resolveOrigin();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    ...(origin ? {sitemap: `${origin}/sitemap.xml`} : {}),
  };
}
