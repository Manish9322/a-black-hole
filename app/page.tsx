import type {Metadata} from 'next';
import BlackHoleCanvas from '@/components/BlackHoleCanvas';
import {
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  getMetadataBase,
} from '@/lib/seo';

const metadataBase = getMetadataBase();

export const metadata: Metadata = {
  title: {
    absolute: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  ...(metadataBase ? {alternates: {canonical: '/'}} : {}),
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
    ...(metadataBase ? {url: '/'} : {}),
    images: [
      {
        url: OG_IMAGE_PATH,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: OG_IMAGE_ALT,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_PATH,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
};

export default function HomePage() {
  const origin = metadataBase?.origin;
  const imageUrl = origin ? `${origin}${OG_IMAGE_PATH}` : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        ...(origin ? {url: `${origin}/`} : {}),
      },
      {
        '@type': 'WebPage',
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        ...(origin ? {url: `${origin}/`} : {}),
        ...(imageUrl
          ? {
              primaryImageOfPage: {
                '@type': 'ImageObject',
                url: imageUrl,
                width: OG_IMAGE_WIDTH,
                height: OG_IMAGE_HEIGHT,
              },
            }
          : {}),
      },
      {
        '@type': 'SoftwareApplication',
        name: SITE_TITLE,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        isAccessibleForFree: true,
        description: SITE_DESCRIPTION,
        featureList: [
          'Real-time 3D gravitational lensing visualization',
          'Interactive 360-degree camera orbiting and zoom',
          'Glowing accretion disk and orbiting particle rings',
          'Companion black hole physics reference guide',
        ],
        ...(imageUrl ? {screenshot: imageUrl} : {}),
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <BlackHoleCanvas />
      <section className="sr-only" aria-label="About this interactive black hole simulation">
        <h2>Interactive 3D Black Hole Visualization</h2>
        <p>
          Explore a relativistic black hole simulation in 3D, featuring curved light paths around
          the event horizon, glowing accretion rings, and orbiting dust particles. Drag anywhere to
          orbit, scroll or pinch to zoom, or visit the Black Hole Guide to learn about spacetime
          curvature, photon rings, accretion disks, and real black hole observations.
        </p>
      </section>
    </>
  );
}
