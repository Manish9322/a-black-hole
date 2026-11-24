'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {ArrowLeft, ArrowUp, ChevronDown, List} from 'lucide-react';
import type {GuideSection} from '@/lib/blackholes/guideContent';

interface BlackHoleGuideNavProps {
  sections: Pick<GuideSection, 'id' | 'numeral' | 'title'>[];
}

export function TopGuideBar({sections}: BlackHoleGuideNavProps) {
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[#d99b78]/15 bg-[#020203]/94">
      <div className="mx-auto flex h-14 max-w-[1380px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10 xl:px-12">
        <Link
          href="/"
          className="group inline-flex min-h-[44px] items-center gap-2 text-xs sm:text-sm font-medium tracking-[0.015em] text-[#e9dad1] whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#fff5ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99b78]/60 rounded-md"
        >
          <ArrowLeft
            className="h-4 w-4 text-[#d99b78] transition-transform duration-150 group-hover:-translate-x-0.5"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span>Back to 3D Black Hole</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setMobileTocOpen((prev) => !prev)}
            aria-expanded={mobileTocOpen}
            aria-controls="mobile-guide-toc"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#d99b78]/20 bg-[#0b090a] px-3 text-xs font-medium tracking-wide text-[#decbc0] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#d99b78]/40 hover:text-[#fff5ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99b78]/60 lg:hidden"
          >
            <List className="h-3.5 w-3.5 text-[#d99b78]" strokeWidth={1.75} aria-hidden="true" />
            <span>Contents</span>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-150 ${mobileTocOpen ? 'rotate-180' : ''}`}
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </button>

          <a
            href="#top"
            aria-label="Scroll back to top"
            className="inline-flex min-h-[40px] items-center gap-1.5 px-2 text-xs tracking-wide text-[#baa69b] whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#fff5ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99b78]/60 rounded-md"
          >
            <ArrowUp className="h-3.5 w-3.5 text-[#d99b78]/85" strokeWidth={1.75} aria-hidden="true" />
            <span>Top</span>
          </a>
        </div>
      </div>

      {mobileTocOpen && (
        <nav
          id="mobile-guide-toc"
          aria-label="Table of contents"
          className="table-scroll border-t border-[#d99b78]/12 bg-[#070607] px-5 py-4 max-h-[68vh] overflow-y-auto lg:hidden"
        >
          <p className="mb-3 font-editorial-mono text-[11px] uppercase tracking-[0.14em] text-[#b59f93]">
            Sections
          </p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            {sections.map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  onClick={() => setMobileTocOpen(false)}
                  className="flex min-h-[40px] items-baseline gap-2.5 py-1.5 text-sm text-[#d9c7bd] transition-colors duration-150 hover:text-[#fff5ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99b78]/60 rounded"
                >
                  <span className="font-editorial-mono text-[11px] tabular-nums text-[#d99b78]/80 w-6 shrink-0">
                    {sec.numeral}
                  </span>
                  <span className="leading-snug">{sec.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </header>
  );
}

export function DesktopStickyToc({sections}: BlackHoleGuideNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? 'introduction');

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0 && visible[0].target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-18% 0px -65% 0px',
        threshold: 0,
      },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <aside
      aria-label="Table of contents"
      className="table-scroll hidden lg:block w-60 xl:w-64 shrink-0 sticky top-24 self-start max-h-[calc(100vh-7.5rem)] overflow-y-auto pr-3"
    >
      <p className="mb-3 font-editorial-mono text-[11px] uppercase tracking-[0.16em] text-[#a99387]">
        Contents
      </p>
      <nav>
        <ol className="space-y-0.5 border-t border-[#d99b78]/12 pt-3">
          {sections.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={`flex items-baseline gap-2.5 py-1.5 text-[13px] leading-snug transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99b78]/60 rounded ${
                    isActive
                      ? 'text-[#fff3eb] font-medium'
                      : 'text-[#a89489] hover:text-[#e9dad1]'
                  }`}
                >
                  <span
                    className={`font-editorial-mono text-[11px] tabular-nums w-6 shrink-0 ${
                      isActive ? 'text-[#d99b78]' : 'text-[#847167]'
                    }`}
                  >
                    {sec.numeral}
                  </span>
                  <span>{sec.title}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
