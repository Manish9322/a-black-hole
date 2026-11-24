export const SITE_NAME = 'Black Hole';
export const SITE_TITLE = 'Black Hole — Interactive 3D Simulation & Gravitational Lensing';
export const SITE_DESCRIPTION =
  'Explore an interactive 3D black hole visualization in real time. Orbit the event horizon, see gravitational lensing bend light, and read the physics guide.';

export const OG_IMAGE_PATH = '/og-preview.jpg';
export const OG_IMAGE_ALT =
  'Black Hole — Interactive 3D simulation of gravitational lensing and glowing accretion rings';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const SITE_KEYWORDS = [
  'interactive black hole',
  '3D black hole visualization',
  'black hole simulation',
  'gravitational lensing visualization',
  'accretion disk',
  'event horizon',
  'black hole exploration',
  'relativistic black hole visualization',
  'photon ring',
  'black hole physics guide',
];

export function getMetadataBase(): URL | undefined {
  const candidates = [
    process.env.APP_URL?.trim(),
    process.env.NEXT_PUBLIC_SITE_URL?.trim(),
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL.trim()}` : undefined,
  ];

  for (const raw of candidates) {
    if (!raw || raw === 'MY_APP_URL') continue;
    try {
      const parsed = new URL(raw);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed;
      }
    } catch {
      continue;
    }
  }
  return undefined;
}
