'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type SlideFrameProps = {
  children: React.ReactNode;
  title?: string;
  firstSlidePath?: string; // where Share/Email should point (usually /vision/one)
  width?: number;  // fixed canvas width (default 1280)
  height?: number; // fixed canvas height (default 800)
};

export default function SlideFrame({
  children,
  title = 'Hemp’in — Vision',
  firstSlidePath = '/vision/one',
  width = 1280,
  height = 800,
}: SlideFrameProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const [wrapH, setWrapH] = useState<number | null>(null);
  const [scale, setScale] = useState(1);

  // absolute URL for share/email
  const absFirstUrl = useMemo(() => {
    if (typeof window === 'undefined') return firstSlidePath;
    return new URL(firstSlidePath, window.location.origin).toString();
  }, [firstSlidePath]);

  // Measure available vertical space under the control bar, then compute scale.
  useEffect(() => {
    const measure = () => {
      const viewportH =
        (window as any).visualViewport?.height ?? window.innerHeight;

      const shellTop = shellRef.current?.getBoundingClientRect().top ?? 0;
      const barH = barRef.current?.getBoundingClientRect().height ?? 0;

      // space below the control bar, with a tiny breathing room
      const availableH = Math.max(0, viewportH - shellTop - barH - 24);

      setWrapH(availableH);
      const wrapW = shellRef.current?.clientWidth ?? window.innerWidth;
      const s = Math.min(wrapW / width, availableH / height);
      setScale(Number.isFinite(s) ? Math.max(0.2, s) : 1);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (shellRef.current) ro.observe(shellRef.current);
    if (barRef.current) ro.observe(barRef.current);
    window.addEventListener('resize', measure);
    (window as any).visualViewport?.addEventListener('resize', measure);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      (window as any).visualViewport?.removeEventListener('resize', measure);
    };
  }, [width, height]);

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: 'Hemp’in — Vision deck', url: absFirstUrl });
      } else {
        await navigator.clipboard.writeText(absFirstUrl);
        alert('Link copied to clipboard');
      }
    } catch {/* user cancelled */}
  };

  const onEmail = () => {
    const subject = encodeURIComponent('Hemp’in — Vision deck');
    const body = encodeURIComponent(`Here’s the Hemp’in vision deck:\n\n${absFirstUrl}\n\n`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <section className="w-full bg-[#0a0f16] text-slate-100 print:bg-white">
      <div
        ref={shellRef}
        className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-6 pb-8"
      >
        {/* Control bar (sits under site navbar) */}
        <div
          ref={barRef}
          className="mb-4 flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-2.5 py-1.5 backdrop-blur print:hidden"
        >
          <span className="text-xs opacity-80 px-2">{title}</span>
          <span className="opacity-30 hidden sm:inline">•</span>
          <button
            onClick={() => window.print()}
            className="text-xs font-semibold hover:opacity-90 px-2"
            title="Download PDF"
            aria-label="Download PDF"
          >
            Download PDF
          </button>
          <span className="opacity-30 hidden sm:inline">•</span>
          <button
            onClick={onShare}
            className="text-xs font-semibold hover:opacity-90 px-2"
            title="Share link"
            aria-label="Share link"
          >
            Share
          </button>
          <span className="opacity-30 hidden sm:inline">•</span>
          <button
            onClick={onEmail}
            className="text-xs font-semibold hover:opacity-90 px-2"
            title="Email this presentation"
            aria-label="Email this presentation"
          >
            Email
          </button>
        </div>

        {/* Wrapper fills the measured space; no page scroll needed */}
        <div
          className="relative grid place-items-center overflow-hidden"
          style={{ height: wrapH ?? '60dvh' }}
        >
          {/* Fixed-ratio slide canvas, scaled to fit */}
          <div
            className="shadow-[0_0_60px_rgba(56,189,248,.15)] print:shadow-none"
            style={{
              width,
              height,
              transform: `scale(${scale})`,
              transformOrigin: 'center',
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
      </div>
    </section>
  );
}