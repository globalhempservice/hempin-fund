'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type SlideFrameProps = {
  children: React.ReactNode;
  title?: string;
  firstSlidePath?: string;
  width?: number;
  height?: number;
  showControls?: boolean;
};

export default function SlideFrame({
  children,
  title = 'Hemp’in — Vision',
  firstSlidePath = '/vision/one',
  width = 1280,
  height = 800,
  showControls = true,
}: SlideFrameProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  const absFirstUrl = useMemo(() => {
    if (typeof window === 'undefined') return firstSlidePath;
    return new URL(firstSlidePath, window.location.origin).toString();
  }, [firstSlidePath]);

  // Scale to fit exactly in viewport (no scroll)
  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.min(vw / width, vh / height);
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

  const onShare = async () => {
    try {
      if (navigator.share)
        await navigator.share({ title, text: 'Hemp’in — Vision deck', url: absFirstUrl });
      else {
        await navigator.clipboard.writeText(absFirstUrl);
        alert('Link copied to clipboard');
      }
    } catch {/* ignore */}
  };

  const onEmail = () => {
    const subject = encodeURIComponent('Hemp’in — Vision deck');
    const body = encodeURIComponent(`Here’s the Hemp’in vision deck:\n\n${absFirstUrl}\n\n`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <section
      ref={shellRef}
      className="fixed inset-0 z-0 bg-[#0a0f16] text-slate-100 print:bg-white overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Optional top control bar */}
      {showControls && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-2
                     rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-sm text-xs print:hidden z-10"
        >
          <span className="opacity-80">{title}</span>
          <span className="opacity-30">•</span>
          <button
            onClick={() => window.print()}
            className="font-semibold hover:opacity-90"
            title="Download PDF"
          >
            Download PDF
          </button>
          <span className="opacity-30">•</span>
          <button
            onClick={onShare}
            className="font-semibold hover:opacity-90"
            title="Share link"
          >
            Share
          </button>
          <span className="opacity-30">•</span>
          <button
            onClick={onEmail}
            className="font-semibold hover:opacity-90"
            title="Email presentation"
          >
            Email
          </button>
        </div>
      )}

      {/* Slide canvas (auto-scaled) */}
      <div
        className="shadow-[0_0_60px_rgba(56,189,248,.15)] print:shadow-none"
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