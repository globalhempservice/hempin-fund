'use client';

import { useEffect, useRef, useState } from 'react';

type SlideFrameProps = {
  children: React.ReactNode;
  title?: string;
};

export default function SlideFrame({ children, title = 'Hemp’in — Vision' }: SlideFrameProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  // Keep a fixed canvas (1280x800), scale to fit viewport while preserving aspect
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const targetW = 1280;
      const targetH = 800;
      const s = Math.min(vw / targetW, vh / targetH);
      setScale(s);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="fixed inset-0 grid place-items-center bg-[#0a0f16] text-slate-100 print:bg-white">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 hidden print:hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur">
        <span className="text-xs opacity-80">{title}</span>
        <span className="opacity-30">•</span>
        <button
          onClick={() => window.print()}
          className="text-xs font-semibold hover:opacity-90"
          aria-label="Export PDF"
          title="Export PDF"
        >
          Export PDF
        </button>
      </div>

      {/* The fixed-size slide canvas */}
      <div
        ref={ref}
        className="slide-canvas shadow-[0_0_60px_rgba(56,189,248,.15)] print:shadow-none"
        style={{
          width: 1280,
          height: 800,
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          background:
            'radial-gradient(1200px 600px at 15% 10%, rgba(16,185,129,.08), transparent 60%), radial-gradient(1200px 600px at 85% 90%, rgba(236,72,153,.08), transparent 60%), linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02))',
          borderRadius: 18,
          border: '1px solid rgba(255,255,255,.08)',
        }}
      >
        {children}
      </div>
    </div>
  );
}