'use client';

import { useEffect, useRef, useState } from 'react';

type SlideFrameProps = {
  children: React.ReactNode;
  title?: string;
  /** Where “Share / Email” should point (usually the first slide). */
  firstSlidePath?: string; // e.g. "/vision/one"
  /** Optional: override the slide canvas size if you ever want a different ratio */
  width?: number;  // default 1280
  height?: number; // default 800
};

export default function SlideFrame({
  children,
  title = 'Hemp’in — Vision',
  firstSlidePath = '/vision/one',
  width = 1280,
  height = 800,
}: SlideFrameProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  // compute absolute URL for sharing/email
  const absFirstUrl =
    typeof window === 'undefined'
      ? firstSlidePath
      : new URL(firstSlidePath, window.location.origin).toString();

  // Scale the fixed canvas to the *wrapper* box (which sits under the navbar)
  useEffect(() => {
    const measure = () => {
      const el = wrapRef.current;
      if (!el) return;
      const { width: vw, height: vh } = el.getBoundingClientRect();
      const s = Math.min(vw / width, vh / height);
      setScale(s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [width, height]);

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: 'Hemp’in — Vision deck',
          url: absFirstUrl,
        });
      } else {
        await navigator.clipboard.writeText(absFirstUrl);
        alert('Link copied to clipboard');
      }
    } catch {
      // user cancelled — ignore
    }
  };

  const onEmail = () => {
    const subject = encodeURIComponent('Hemp’in — Vision deck');
    const body = encodeURIComponent(
      `Here’s the Hemp’in vision deck:\n\n${absFirstUrl}\n\n`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <section
      className="
        w-full
        bg-[#0a0f16]
        text-slate-100
        print:bg-white
      "
    >
      {/* Float the slide under your navbar with breathing room */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-8 pb-10">
        {/* Top control bar (not fixed; sits under the site navbar) */}
        <div className="
            mb-4 flex flex-wrap items-center justify-center gap-2
            rounded-full border border-white/10 bg-white/10 px-2.5 py-1.5
            backdrop-blur print:hidden
          ">
          <span className="text-xs opacity-80 px-2">{title}</span>
          <span className="opacity-30 hidden sm:inline">•</span>
          <button
            onClick={() => window.print()}
            className="text-xs font-semibold hover:opacity-90 px-2"
            aria-label="Download PDF"
            title="Download PDF"
          >
            Download PDF
          </button>
          <span className="opacity-30 hidden sm:inline">•</span>
          <button
            onClick={onShare}
            className="text-xs font-semibold hover:opacity-90 px-2"
            aria-label="Share link"
            title="Share link"
          >
            Share
          </button>
          <span className="opacity-30 hidden sm:inline">•</span>
          <button
            onClick={onEmail}
            className="text-xs font-semibold hover:opacity-90 px-2"
            aria-label="Email this presentation"
            title="Email this presentation"
          >
            Email
          </button>
        </div>

        {/* Scaling wrapper box (fills the available height under navbar) */}
        <div
          ref={wrapRef}
          className="
            relative
            h-[calc(100vh-160px)]  // fits below navbar with extra breathing room
            min-h-[560px]          // reasonable minimum for laptops
            grid place-items-center
          "
        >
          {/* The fixed-ratio slide canvas */}
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