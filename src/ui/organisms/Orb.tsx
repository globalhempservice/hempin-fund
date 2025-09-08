'use client';

import { useEffect, useRef } from 'react';

type OrbProps = { className?: string };

/**
 * Pink Orb — outer wrapper holds scale; inner layer handles cursor sway.
 * This prevents JS translate from overwriting page-level scale classes.
 */
export default function Orb({ className = '' }: OrbProps) {
  const swayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = swayRef.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let rAF = 0;
    const max = 16;

    const onMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = ((e.clientX / w) - 0.5) * 2;
      const y = ((e.clientY / h) - 0.5) * 2;
      const tx = Math.round(x * max);
      const ty = Math.round(y * max);
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(rAF);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    // Outer: pointer-events none + centering + page-controlled scale
    <div
      aria-hidden
      className={[
        'pointer-events-none absolute inset-0 flex items-center justify-center',
        className,
      ].join(' ')}
    >
      {/* Inner layer: receives mouse translate, not scale */}
      <div ref={swayRef} className="flex items-center justify-center">
        {/* Outer glow */}
        <div
          className="
            h-[42vh] w-[42vh] min-h-[300px] min-w-[300px] max-h-[68vh] max-w-[68vh]
            rounded-full opacity-60 blur-3xl mix-blend-screen will-change-transform animate-orb
          "
          style={{
            background:
              'radial-gradient(closest-side at 58% 42%, #ffd2e8 0%, #f0a7ff 35%, #0b0b0d 72%)',
          }}
        />
        {/* Inner pulse core */}
        <div
          className="
            absolute h-[32vh] w-[32vh] min-h-[220px] min-w-[220px] max-h-[52vh] max-w-[52vh]
            rounded-full opacity-65 blur-2xl mix-blend-screen animate-orb-slow
          "
          style={{
            background:
              'radial-gradient(closest-side at 46% 54%, rgba(255,185,220,.9) 0%, rgba(210,160,255,.6) 42%, rgba(10,8,20,0) 70%)',
          }}
        />
      </div>
    </div>
  );
}