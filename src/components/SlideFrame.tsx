'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type SlideFrameProps = {
  children: React.ReactNode;
  title?: string;       // unused visually, but kept for future
  width?: number;       // slide logical width
  height?: number;      // slide logical height
};

export default function SlideFrame({
  children,
  title = 'Hemp’in — Vision',
  width = 1280,
  height = 800,
}: SlideFrameProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const rafRef = useRef<number | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const measure = () => {
      if (!wrapRef.current) return;
      const rect = wrapRef.current.getBoundingClientRect();

      // leave a small breathing margin vertically
      const margin = rect.height * 0.08; // 8%
      const usableH = Math.max(0, rect.height - margin * 2);
      const usableW = rect.width;

      const s = Math.min(usableW / width, usableH / height);

      // round to 3 decimals to avoid micro reflows (causes flicker)
      const rounded = Math.max(0.2, Math.round(s * 1000) / 1000);
      setScale(rounded);
    };

    const scheduleMeasure = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measure);
    };

    // Observe wrapper size only (no visualViewport listener)
    roRef.current = new ResizeObserver(scheduleMeasure);
    if (wrapRef.current) roRef.current.observe(wrapRef.current);

    // initial measure
    scheduleMeasure();

    // basic window resize as a fallback (throttled via rAF)
    const onWinResize = scheduleMeasure;
    window.addEventListener('resize', onWinResize);

    return () => {
      window.removeEventListener('resize', onWinResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      roRef.current?.disconnect();
    };
  }, [width, height]);

  return (
    <section className="fixed inset-0 bg-[#0a0f16] text-slate-100 overflow-hidden">
      {/* wrapper fills the true viewport height; dvh prevents iOS URL bar jumps */}
      <div
        ref={wrapRef}
        className="w-full h-dvh grid place-items-center"
        style={{ height: '100dvh' }} // fallback if Tailwind lacks h-dvh
      >
        <div
          className="shadow-[0_0_60px_rgba(56,189,248,.15)] will-change-transform"
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
      </div>
    </section>
  );
}