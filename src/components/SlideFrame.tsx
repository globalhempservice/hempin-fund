'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type SlideFrameProps = {
  children: React.ReactNode;
  title?: string;
  width?: number;
  height?: number;
};

export default function SlideFrame({
  children,
  title = 'Hemp’in — Vision',
  width = 1280,
  height = 800,
}: SlideFrameProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  // Recalculate scale based on viewport
  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Leave a small breathing margin top/bottom (10%)
      const margin = vh * 0.1;
      const usableH = vh - margin * 2;

      const s = Math.min(vw / width, usableH / height);
      setScale(s);
    };

    measure();
    window.addEventListener('resize', measure);
    (window as any).visualViewport?.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('resize', measure);
      (window as any).visualViewport?.removeEventListener('resize', measure);
    };
  }, [width, height]);

  return (
    <section
      ref={shellRef}
      className="fixed inset-0 bg-[#0a0f16] text-slate-100 flex items-center justify-center overflow-hidden"
    >
      {/* Centered slide */}
      <div
        className="shadow-[0_0_60px_rgba(56,189,248,.15)]"
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          background:
            'radial-gradient(1200px 600px at 15% 10%, rgba(16,185,129,.08), transparent 60%), radial-gradient(1200px 600px at 85% 90%, rgba(236,72,153,.08), transparent 60%), linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))',
          borderRadius: 18,
          border: '1px solid rgba(255,255,255,.08)',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </section>
  );
}