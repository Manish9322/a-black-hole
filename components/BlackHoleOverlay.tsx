'use client';

import {useId, useState, type ReactNode} from 'react';
import Link from 'next/link';
import {ArrowUpRight, Minus, Plus, RotateCcw} from 'lucide-react';
import {motion} from 'motion/react';

interface BlackHoleOverlayProps {
  hasInteracted: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

interface TooltipIconButtonProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
}

function TooltipIconButton({label, onClick, children}: TooltipIconButtonProps) {
  const tooltipId = useId();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const isOpen = hovered || focused;

  return (
    <div className="relative flex items-center justify-center">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-describedby={isOpen ? tooltipId : undefined}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        onFocus={(e) => {
          if (e.currentTarget.matches(':focus-visible')) setFocused(true);
        }}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setHovered(false);
            setFocused(false);
          }
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#d8c3b8] transition-colors duration-150 after:absolute after:-inset-1 after:content-[''] hover:bg-[#d99b78]/14 hover:text-[#fff5ef] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99b78]/65"
      >
        {children}
      </button>

      <span
        id={tooltipId}
        role="tooltip"
        aria-hidden={!isOpen}
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2.5 -translate-x-1/2 rounded-md border border-[#e6b598]/22 bg-[#120d0e]/95 px-2.5 py-1 text-[11px] font-normal tracking-[0.02em] text-[#f5ece6] whitespace-nowrap shadow-[0_8px_24px_rgba(0,0,0,0.85)] transition-all duration-150 ease-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default function BlackHoleOverlay({
  hasInteracted,
  onZoomIn,
  onZoomOut,
  onResetView,
}: BlackHoleOverlayProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-5 sm:p-8 md:p-10">
      {/* Top row: editorial title on the left, clean link to the black hole guide on the right */}
      <motion.header
        initial={{opacity: 0, y: -8}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.9, ease: [0.16, 1, 0.3, 1]}}
        className="flex items-start justify-between gap-4"
      >
        <div className="max-w-[14rem] sm:max-w-sm select-none">
          <h1 className="font-display text-[1.65rem] sm:text-[2.25rem] font-semibold tracking-[-0.025em] leading-[1.1] text-[#f4ebe5]/95 [text-wrap:balance] drop-shadow-[0_2px_14px_rgba(0,0,0,0.92)]">
            Black Hole
          </h1>
          <p className="mt-2 max-w-[29ch] text-[13px] sm:text-sm font-normal tracking-[0.015em] leading-[1.6] text-[#cbb7ac]/90 drop-shadow-[0_1px_10px_rgba(0,0,0,0.95)]">
            See how gravity bends light and pulls glowing matter into orbit.
          </p>
        </div>

        <nav aria-label="Primary navigation" className="pointer-events-auto shrink-0 pt-1">
          <Link
            href="/black-holes"
            className="group inline-flex min-h-[44px] items-center gap-1.5 px-2 text-xs sm:text-[13px] font-normal tracking-[0.02em] text-[#ebdcd3]/92 whitespace-nowrap shrink-0 underline decoration-[#d99b78]/40 underline-offset-4 transition-colors duration-150 hover:text-[#fff5ef] hover:decoration-[#d99b78] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99b78]/60 rounded-md drop-shadow-[0_1px_10px_rgba(0,0,0,0.95)]"
          >
            <span>Black Hole Guide</span>
            <ArrowUpRight
              className="h-3.5 w-3.5 text-[#d99b78] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </Link>
        </nav>
      </motion.header>

      {/* Bottom-center gentle interaction hint + compact icon view controls */}
      <div className="flex flex-col items-center gap-3">
        <motion.p
          initial={{opacity: 0, y: 6}}
          animate={{
            opacity: hasInteracted ? 0 : 0.78,
            y: hasInteracted ? 4 : 0,
          }}
          transition={{duration: 0.65, ease: [0.16, 1, 0.3, 1]}}
          aria-hidden={hasInteracted}
          className="select-none text-center text-[11px] sm:text-xs font-normal tracking-[0.03em] text-[#cbb7ab] drop-shadow-[0_1px_8px_rgba(0,0,0,0.95)]"
        >
          Drag anywhere to rotate · Scroll or pinch to zoom
        </motion.p>

        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1]}}
          role="group"
          aria-label="View controls"
          className="pointer-events-auto inline-flex items-center gap-0.5 rounded-xl border border-[#e6b598]/16 bg-[#0e0a0b]/88 p-1 shadow-[0_10px_34px_rgba(0,0,0,0.75)]"
        >
          <TooltipIconButton label="Zoom out" onClick={onZoomOut}>
            <Minus className="h-[15px] w-[15px]" strokeWidth={1.75} aria-hidden="true" />
          </TooltipIconButton>

          <TooltipIconButton label="Zoom in" onClick={onZoomIn}>
            <Plus className="h-[15px] w-[15px]" strokeWidth={1.75} aria-hidden="true" />
          </TooltipIconButton>

          <div aria-hidden="true" className="mx-0.5 h-4 w-px bg-[#e6b598]/16" />

          <TooltipIconButton label="Reset view" onClick={onResetView}>
            <RotateCcw className="h-[15px] w-[15px]" strokeWidth={1.75} aria-hidden="true" />
          </TooltipIconButton>
        </motion.div>
      </div>
    </div>
  );
}
