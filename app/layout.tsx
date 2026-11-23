import type {Metadata, Viewport} from 'next';
import {Bodoni_Moda, Manrope} from 'next/font/google';
import './globals.css';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-display',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Singularity — Interactive 3D Black Hole',
  description:
    'A cinematic, real-time interactive 3D black hole experience with gravitational lensing, fluid accretion rings, and smooth 360-degree exploration.',
  openGraph: {
    title: 'Singularity — Interactive 3D Black Hole',
    description:
      'A cinematic, real-time interactive 3D black hole experience with gravitational lensing, fluid accretion rings, and smooth 360-degree exploration.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Singularity — Interactive 3D Black Hole',
    description:
      'A cinematic, real-time interactive 3D black hole experience with gravitational lensing, fluid accretion rings, and smooth 360-degree exploration.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#020203',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${manrope.variable} dark`}
    >
      <body className="font-sans bg-[#020203] text-[#f4ece8] antialiased selection:bg-[#d99b78]/30 selection:text-[#fff5ef]">
        {children}
      </body>
    </html>
  );
}
