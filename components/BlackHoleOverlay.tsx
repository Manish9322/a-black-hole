'use client';

import {Minus, Plus, RotateCcw} from 'lucide-react';
import {motion} from 'motion/react';

interface BlackHoleOverlayProps {
  hasInteracted: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export default function BlackHoleOverlay({
  hasInteracted,
  onZoomIn,
  onZoomOut,
  onResetView,
}: BlackHoleOverlayProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between p-5 sm:p-8 md:p-10">
      {/* Top-left minimal editorial introduction */}
      <motion.header
        initial={{opacity: 0, y: -8}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.9, ease: [0.16, 1, 0.3, 1]}}
        className="max-w-xs sm:max-w-sm select-none"
      >
        <h1 className="font-display text-[1.8rem] sm:text-[2.35rem] font-normal tracking-[0.025em] leading-[1.1] text-[#f4ebe5]/95 [text-wrap:balance] drop-shadow-[0_2px_14px_rgba(0,0,0,0.92)]">
          Event Horizon
        </h1>
        <p className="mt-2 max-w-[29ch] text-[13px] sm:text-sm font-light tracking-[0.015em] leading-[1.6] text-[#bfa99d]/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.95)]">
          Gravitational lensing around a relativistic accretion disk.
        </p>
      </motion.header>

      {/* Bottom-center subtle hint + minimal camera controls */}
      <div className="flex flex-col items-center gap-3">
        <motion.p
          initial={{opacity: 0, y: 6}}
          animate={{
            opacity: hasInteracted ? 0 : 0.72,
            y: hasInteracted ? 4 : 0,
          }}
          transition={{duration: 0.65, ease: [0.16, 1, 0.3, 1]}}
          aria-hidden={hasInteracted}
          className="select-none text-center text-[11px] sm:text-xs font-light tracking-[0.04em] text-[#c7b1a4] drop-shadow-[0_1px_8px_rgba(0,0,0,0.95)]"
        >
          Drag to orbit in 3D · Scroll or pinch to zoom
        </motion.p>

        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1]}}
          role="group"
          aria-label="Camera controls"
          className="pointer-events-auto inline-flex items-center gap-1 rounded-xl border border-[#e6b598]/15 bg-[#0e0a0b]/85 p-1 shadow-[0_10px_34px_rgba(0,0,0,0.75)]"
        >
          <button
            type="button"
            onClick={onZoomOut}
            aria-label="Zoom out"
            title="Zoom out"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-[#d8c3b8] transition-colors duration-150 hover:bg-[#d99b78]/12 hover:text-[#fff5ef] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99b78]/60"
          >
            <Minus className="h-4 w-4" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={onZoomIn}
            aria-label="Zoom in"
            title="Zoom in"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-[#d8c3b8] transition-colors duration-150 hover:bg-[#d99b78]/12 hover:text-[#fff5ef] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99b78]/60"
          >
            <Plus className="h-4 w-4" strokeWidth={1.75} />
          </button>

          <div aria-hidden="true" className="mx-0.5 h-5 w-px bg-[#e6b598]/15" />

          <button
            type="button"
            onClick={onResetView}
            aria-label="Reset camera view"
            title="Reset camera view"
            className="flex h-11 items-center gap-2 rounded-lg px-3.5 text-xs font-medium tracking-wide text-[#d8c3b8] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#d99b78]/12 hover:text-[#fff5ef] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99b78]/60"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>Reset</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
