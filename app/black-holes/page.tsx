import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {DesktopStickyToc, TopGuideBar} from '@/components/BlackHoleGuideNav';
import {GUIDE_SECTIONS} from '@/lib/blackholes/guideContent';
import {
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  getMetadataBase,
} from '@/lib/seo';

const metadataBase = getMetadataBase();

const GUIDE_TITLE = 'Black Holes Explained — Event Horizon, Lensing & Accretion Disk';
const GUIDE_DESCRIPTION =
  'Understand black holes from first principles: spacetime curvature, the event horizon, photon rings, accretion disks, spin, and how scientists observe them.';

export const metadata: Metadata = {
  title: GUIDE_TITLE,
  description: GUIDE_DESCRIPTION,
  keywords: [
    'black holes explained',
    'what is a black hole',
    'event horizon',
    'accretion disk',
    'gravitational lensing',
    'photon ring',
    'black hole shadow',
    'how black holes form',
    'types of black holes',
    'Sagittarius A*',
    'M87*',
  ],
  ...(metadataBase ? {alternates: {canonical: '/black-holes'}} : {}),
  openGraph: {
    title: `${GUIDE_TITLE} | ${SITE_NAME}`,
    description: GUIDE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'article',
    ...(metadataBase ? {url: '/black-holes'} : {}),
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
    title: `${GUIDE_TITLE} | ${SITE_NAME}`,
    description: GUIDE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_PATH,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
};

export default function BlackHolesGuidePage() {
  const tocItems = GUIDE_SECTIONS.map(({id, numeral, title}) => ({id, numeral, title}));
  const origin = metadataBase?.origin;
  const imageUrl = origin ? `${origin}${OG_IMAGE_PATH}` : undefined;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: `${GUIDE_TITLE} | ${SITE_NAME}`,
        description: GUIDE_DESCRIPTION,
        ...(origin ? {url: `${origin}/black-holes`} : {}),
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
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Black Hole 3D Simulation',
            ...(origin ? {item: `${origin}/`} : {}),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Black Hole Guide',
            ...(origin ? {item: `${origin}/black-holes`} : {}),
          },
        ],
      },
      {
        '@type': 'TechArticle',
        headline: GUIDE_TITLE,
        description: GUIDE_DESCRIPTION,
        ...(origin ? {mainEntityOfPage: `${origin}/black-holes`} : {}),
        ...(imageUrl ? {image: imageUrl} : {}),
        about: [
          'Black holes',
          'Event horizon',
          'Gravitational lensing',
          'Accretion disk',
          'Photon sphere',
          'General relativity',
        ],
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
        },
      },
    ],
  };

  return (
    <div id="top" className="min-h-screen bg-[#020203] text-[#ebe3de]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(articleJsonLd)}}
      />

      <TopGuideBar sections={tocItems} />

      <main className="mx-auto max-w-[1380px] px-5 pt-10 pb-24 sm:px-8 sm:pt-14 lg:px-10 xl:px-12 md:pt-16">
        {/* Editorial title header */}
        <header className="max-w-[76ch] pb-10 border-b border-[#d99b78]/18">
          <h1 className="font-editorial-body text-[2.1rem] sm:text-[2.85rem] md:text-[3.3rem] font-semibold leading-[1.1] tracking-[-0.025em] text-[#f7efe9] [text-wrap:balance]">
            Black Holes: Gravity, Light &amp; the Event Horizon
          </h1>
          <p className="mt-5 max-w-[66ch] text-[16.5px] sm:text-[17.5px] leading-[1.72] text-[#cbbab0]">
            A structured reference covering how black holes form, how extreme gravity warps space
            and light, what astronomers actually observe, and how those principles shape our
            interactive 3D view.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-editorial-mono text-xs text-[#9c897e]">
            <span>14 Sections</span>
            <span aria-hidden="true" className="text-[#d99b78]/45">|</span>
            <span>Introductory &amp; Reference Guide</span>
            <span aria-hidden="true" className="text-[#d99b78]/45">|</span>
            <span>Companion to Interactive 3D View</span>
          </div>
        </header>

        {/* Two-column reading canvas: Sticky TOC on desktop + expanded balanced editorial column */}
        <div className="mt-10 flex flex-col lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
          <DesktopStickyToc sections={tocItems} />

          <article className="min-w-0 flex-1 max-w-[980px]">
            {/* Inline Index Overview for quick scanning across screen sizes */}
            <section
              aria-label="Document index"
              className="mb-10 border-b border-[#d99b78]/14 pb-10"
            >
              <h2 className="font-editorial-body text-xs font-semibold uppercase tracking-[0.14em] text-[#d99b78]">
                Document Overview
              </h2>
              <p className="mt-2.5 max-w-[68ch] text-[15px] leading-relaxed text-[#b9a79d]">
                Jump directly to any chapter below, or read straight through from the basics of
                spacetime curvature to the rendering model behind this website.
              </p>
              <ol className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-1.5">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="inline-flex items-baseline gap-2.5 py-1 text-[13.5px] text-[#ded0c7] transition-colors duration-150 hover:text-[#fff5ef] hover:underline decoration-[#d99b78]/50 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99b78]/60 rounded"
                    >
                      <span className="font-editorial-mono text-[11px] tabular-nums text-[#d99b78]/85 w-6 shrink-0">
                        {item.numeral}
                      </span>
                      <span>{item.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </section>

            {/* All 14 chapters */}
            <div className="space-y-14 sm:space-y-16">
              {GUIDE_SECTIONS.map((section, idx) => {
                const subCount = section.subsections?.length ?? 0;
                const useMultiColSubsections = subCount >= 2;

                return (
                  <section
                    key={section.id}
                    id={section.id}
                    aria-labelledby={`${section.id}-heading`}
                    className="scroll-mt-24 border-t border-[#d99b78]/14 pt-10 first:border-t-0 first:pt-0"
                  >
                    <div className="mb-6 max-w-[70ch]">
                      <p className="font-editorial-mono text-xs uppercase tracking-[0.16em] text-[#c79d86]">
                        {section.numeral === '00' ? 'Preface' : `Section ${section.numeral}`}
                      </p>
                      <h2
                        id={`${section.id}-heading`}
                        className="mt-1.5 font-editorial-body text-[1.65rem] sm:text-[2rem] font-semibold leading-[1.18] tracking-[-0.02em] text-[#f7efe9] [text-wrap:balance]"
                      >
                        {section.numeral === '00'
                          ? section.title
                          : `${section.numeral}. ${section.title}`}
                      </h2>
                      <p className="mt-2.5 text-[15px] sm:text-[15.5px] italic leading-relaxed text-[#b9a69b]">
                        {section.summary}
                      </p>
                    </div>

                    <div className="max-w-[70ch] space-y-5 text-[15.5px] sm:text-[16px] leading-[1.78] tracking-[0.005em] text-[#e5dbd5]">
                      {section.paragraphs.map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className={
                            idx === 0 && pIdx === 0
                              ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-editorial-body first-letter:text-[3.1rem] first-letter:leading-[0.84] first-letter:font-bold first-letter:text-[#d99b78]'
                              : undefined
                          }
                        >
                          {para}
                        </p>
                      ))}
                    </div>

                    {section.subsections && subCount > 0 && (
                      <div
                        className={
                          useMultiColSubsections
                            ? 'mt-9 grid grid-cols-1 md:grid-cols-2 gap-x-10 xl:gap-x-12 gap-y-8'
                            : 'mt-8 max-w-[70ch] space-y-7'
                        }
                      >
                        {section.subsections.map((sub, sIdx) => {
                          const isTrailingOdd =
                            useMultiColSubsections &&
                            subCount % 2 === 1 &&
                            sIdx === subCount - 1;

                          return (
                            <div
                              key={sub.title}
                              className={isTrailingOdd ? 'md:col-span-2 max-w-[70ch]' : undefined}
                            >
                              <h3 className="font-editorial-body text-[1.18rem] sm:text-[1.28rem] font-semibold leading-snug tracking-[-0.015em] text-[#f2e5dd] [text-wrap:balance]">
                                {sub.title}
                              </h3>
                              <div className="mt-2.5 space-y-3.5 text-[15px] sm:text-[15.5px] leading-[1.76] tracking-[0.005em] text-[#ded3cd]">
                                {sub.paragraphs.map((p, pIdx) => (
                                  <p key={pIdx}>{p}</p>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {section.details && (
                      <div className="mt-9 max-w-[70ch]">
                        <h3 className="font-editorial-body text-[1.12rem] sm:text-[1.2rem] font-semibold leading-snug tracking-[-0.015em] text-[#f2e5dd]">
                          {section.details.heading}
                        </h3>
                        <ul className="mt-4 divide-y divide-[#d99b78]/12 border-t border-b border-[#d99b78]/12">
                          {section.details.items.map((item) => (
                            <li key={item.name} className="py-3.5">
                              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                                <span className="font-semibold text-[15.5px] text-[#f5ece6]">
                                  {item.name}
                                </span>
                                {item.meta.map((part) => (
                                  <span key={part} className="inline-flex items-baseline gap-2.5">
                                    <span aria-hidden="true" className="text-[#d99b78]/45">
                                      |
                                    </span>
                                    <span className="font-editorial-mono text-xs text-[#c79d86]">
                                      {part}
                                    </span>
                                  </span>
                                ))}
                              </div>
                              <p className="mt-1.5 text-[15px] leading-[1.72] text-[#d6c8bf]">
                                {item.description}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {section.closingNote && (
                      <p className="mt-9 max-w-[70ch] border-t border-b border-[#d99b78]/18 py-4 font-editorial-body text-[1.06rem] sm:text-[1.12rem] font-medium italic leading-relaxed text-[#ecdccf]">
                        {section.closingNote}
                      </p>
                    )}
                  </section>
                );
              })}
            </div>

            {/* Bottom return action back to the 3D interactive black hole */}
            <footer className="mt-16 border-t border-[#d99b78]/18 pt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <h2 className="font-editorial-body text-xl font-semibold tracking-[-0.015em] text-[#f7efe9]">
                  Return to the Live 3D View
                </h2>
                <p className="mt-1 text-sm text-[#b9a79d]">
                  Drag around the black hole and see bent light and orbiting plasma up close.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex self-start sm:self-auto min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#d99b78]/22 bg-[#0b090a] px-4 py-2.5 text-[13px] sm:text-sm font-medium tracking-[0.01em] text-[#e9dad1] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#d99b78]/45 hover:bg-[#d99b78]/12 hover:text-[#fff5ef] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99b78]/60"
              >
                <ArrowLeft className="h-4 w-4 text-[#d99b78]" strokeWidth={1.75} aria-hidden="true" />
                <span>Explore 3D Black Hole</span>
              </Link>
            </footer>
          </article>
        </div>
      </main>
    </div>
  );
}
