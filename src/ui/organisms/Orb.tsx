'use client';

import { useEffect, useRef } from 'react';

export default function Orb({ className = '' }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let rAF = 0;
    const max = 18;
    const onMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = ((e.clientX / w) - 0.5) * 2;
      const y = ((e.clientY / h) - 0.5) * 2;
      const tx = Math.round(x * max);
      const ty = Math.round(y * max);
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${tx}px,${ty}px,0)`;
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(rAF);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}>
      <div
        className="h-[42vh] w-[42vh] min-h-[320px] min-w-[320px] max-h-[68vh] max-w-[68vh]
                   rounded-full opacity-50 blur-3xl mix-blend-screen will-change-transform animate-orb"
        style={{
          background:
            'radial-gradient(closest-side at 58% 42%, #2ef0ff 0%, #7056ff 33%, #0b0a10 70%)'
        }}
      />
      <div
        className="absolute h-[32vh] w-[32vh] min-h-[240px] min-w-[240px] max-h-[52vh] max-w-[52vh]
                   rounded-full opacity-65 blur-2xl mix-blend-screen animate-orb-slow"
        style={{
          background:
            'radial-gradient(closest-side at 46% 54%, rgba(64,255,180,.85) 0%, rgba(126,85,255,.6) 42%, rgba(10,8,20,0) 70%)'
        }}
      />
    </div>
  );
}
