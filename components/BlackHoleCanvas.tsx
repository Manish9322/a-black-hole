'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {
  type BlackHoleController,
  createBlackHoleScene,
} from '@/lib/blackhole/createBlackHoleScene';
import BlackHoleOverlay from './BlackHoleOverlay';

export default function BlackHoleCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<BlackHoleController | null>(null);

  const [hasInteracted, setHasInteracted] = useState(false);
  const [webglError, setWebglError] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    try {
      const controller = createBlackHoleScene({
        container,
        reducedMotion,
        onFirstInteract: () => setHasInteracted(true),
        onContextLost: () => setContextLost(true),
        onContextRestored: () => setContextLost(false),
      });
      controllerRef.current = controller;
    } catch {
      queueMicrotask(() => setWebglError(true));
      return;
    }

    return () => {
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, []);

  const handleZoomIn = useCallback(() => {
    controllerRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    controllerRef.current?.zoomOut();
  }, []);

  const handleResetView = useCallback(() => {
    controllerRef.current?.resetView();
  }, []);

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-[#020203]">
      {/* Dedicated isolated WebGL canvas container */}
      <div
        ref={containerRef}
        aria-label="Interactive 3D black hole view"
        className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
      />

      {/* Graceful fallback if WebGL is unavailable or context is temporarily lost */}
      {(webglError || contextLost) && (
        <div
          role="status"
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#020203]"
        >
          <div className="relative flex flex-col items-center text-center px-6">
            <div
              aria-hidden="true"
              className="mb-6 h-40 w-40 rounded-full bg-black shadow-[0_0_60px_12px_rgba(217,155,120,0.22),inset_0_0_2px_1px_rgba(255,241,234,0.75)]"
            />
            <p className="text-sm text-[#c9b2a5]">
              {contextLost
                ? 'Restoring 3D graphics…'
                : 'Your browser needs 3D graphics (WebGL) enabled to view this black hole.'}
            </p>
          </div>
        </div>
      )}

      {/* Minimal semantic DOM overlay */}
      <BlackHoleOverlay
        hasInteracted={hasInteracted}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
      />
    </main>
  );
}
