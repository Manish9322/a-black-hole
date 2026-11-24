import {IBM_Plex_Mono} from 'next/font/google';

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-editorial-mono',
  display: 'swap',
});

export default function BlackHoleGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${plexMono.variable} min-h-screen bg-[#020203] text-[#ebe3de] font-editorial-body`}
    >
      {children}
    </div>
  );
}
