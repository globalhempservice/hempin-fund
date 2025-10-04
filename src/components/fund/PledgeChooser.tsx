'use client';

import { useEffect, useRef, useState } from 'react';

type Tier = { id: string; label: string; amount: number; adds?: string };

export default function PledgeChooser({
  campaignSlug,
  tiers,
  selectedIndex,
  onChangeIndex,
}: {
  campaignSlug: string;
  tiers: Tier[];
  selectedIndex: number;
  onChangeIndex: (i: number) => void;
}) {
  const maxIndex = Math.max(0, tiers.length - 1);
  const i = Math.min(Math.max(selectedIndex, 0), maxIndex);
  const t = tiers[i];

  // animated jackpot $$
  const [animated, setAnimated] = useState(t.amount);
  const raf = useRef<number | null>(null);
  const fromRef = useRef(t.amount);
  useEffect(() => {
    const from = fromRef.current, to = t.amount, dur = 420, start = performance.now();
    cancelAnimationFrame(raf.current as number);
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimated(Math.round(from + (to - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(step);
      else fromRef.current = to;
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current as number);
  }, [t.amount]);

  // keyboard helpers
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  onChangeIndex(Math.max(0, i - 1));
      if (e.key === 'ArrowRight') onChangeIndex(Math.min(maxIndex, i + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [i, maxIndex, onChangeIndex]);

  const payHref = (tier: Tier) =>
    `/pay/${campaignSlug}?tier=${encodeURIComponent(tier.id)}&amount=${tier.amount}`;

  const pct = (i / maxIndex) * 100 || 0;

  return (
    <section className="hemp-panel" style={{ padding: 16, display: 'grid', gap: 14 }}>
      {/* header */}
      <div className="center">
        <div className="eyebrow">LEVEL</div>
        <div style={{ marginTop: 6 }}>
          <div className="planet-title" style={{ fontSize: 'clamp(20px,3.4vw,26px)', fontWeight: 800 }}>
            {t.label}
          </div>
          <div
            className="jackpot"
            aria-live="polite"
            style={{ marginTop: 2, fontWeight: 900, fontSize: 'clamp(22px,4.3vw,34px)', letterSpacing: '.02em' }}
          >
            ${animated.toLocaleString()}
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <a className="btn primary thruster" href={payHref(t)}>
            Pledge ${t.amount.toLocaleString()}
          </a>
        </div>
      </div>

      {/* chips */}
      <div className="center" style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
        {tiers.map((tier, idx) => (
          <button
            key={tier.id}
            type="button"
            onClick={() => onChangeIndex(idx)}
            className="pill"
            aria-current={i === idx}
            style={{
              borderColor: i === idx ? 'rgba(255,255,255,.22)' : undefined,
              boxShadow: i === idx ? '0 0 0 2px rgba(236,72,153,.25)' : undefined,
              fontWeight: 800
            }}
          >
            {tier.label} · ${tier.amount.toLocaleString()}
          </button>
        ))}
      </div>

      {/* track + arrows (no orb) */}
      <div className="slider-row">
        <button
          type="button"
          className="btn pink-arrow"
          onClick={() => onChangeIndex(Math.max(0, i - 1))}
          disabled={i === 0}
          aria-label="Previous tier"
        >
          ◀
        </button>

        <div className="track-wrap">
          <div className="track-bg" />
          <div className="track-fill" style={{ width: `${pct}%` }} />
          <input
            className="tier-range"
            type="range"
            min={0}
            max={maxIndex}
            step={1}
            value={i}
            onChange={(e) => onChangeIndex(parseInt(e.currentTarget.value, 10))}
            aria-label="Select a pledge tier"
          />
        </div>

        <button
          type="button"
          className="btn pink-arrow"
          onClick={() => onChangeIndex(Math.min(maxIndex, i + 1))}
          disabled={i === maxIndex}
          aria-label="Next tier"
        >
          ▶
        </button>
      </div>

      <div className="muted center" style={{ fontSize: '.9rem' }}>
        Drag the slider, press ◀ / ▶, or tap a tier chip.
      </div>

      {/* local styles */}
      <style jsx>{`
        .slider-row{
          display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:10px;
        }

        .pink-arrow{
          min-width:44px; height:40px; display:grid; place-items:center; border-radius:10px; font-weight:900;
          border:1px solid rgba(255,255,255,.12);
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
          color:#05120e;
          box-shadow: 0 0 18px rgba(236,72,153,.35), 0 6px 18px rgba(0,0,0,.30);
        }
        .pink-arrow:disabled{ opacity:.55; cursor:not-allowed; filter:grayscale(.2) }

        .track-wrap{
          position:relative; height:14px; border-radius:999px;
        }
        .track-bg{
          position:absolute; inset:0;
          background: rgba(255,255,255,.10);
          border:1px solid rgba(255,255,255,.18);
          border-radius:999px;
        }
        .track-fill{
          position:absolute; inset:0 auto 0 0; height:100%;
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
          border-radius:999px;
          box-shadow: 0 0 16px rgba(236,72,153,.30);
          pointer-events:none;
        }
        .tier-range{
          position:absolute; inset:-8px 0 -8px;  /* larger hit area; perfectly centered */
          appearance:none; background:transparent; width:100%; height:30px;
        }
        .tier-range::-webkit-slider-runnable-track{ height:0; background:transparent; border:0 }
        .tier-range::-moz-range-track{ height:0; background:transparent; border:0 }
        .tier-range::-webkit-slider-thumb{
          appearance:none; width:22px; height:22px; border-radius:50%;
          margin-top:-6px; /* centers over 14px track */
          background: radial-gradient(circle at 40% 40%, #fff 0 35%, #f9a8d4 36% 70%, rgba(0,0,0,0) 72%);
          border:1px solid rgba(255,255,255,.35);
          box-shadow: 0 0 12px rgba(236,72,153,.65), 0 0 18px var(--glow-cyan);
        }
        .tier-range::-moz-range-thumb{
          width:22px; height:22px; border-radius:50%;
          background: radial-gradient(circle at 40% 40%, #fff 0 35%, #f9a8d4 36% 70%, rgba(0,0,0,0) 72%);
          border:1px solid rgba(255,255,255,.35);
          box-shadow: 0 0 12px rgba(236,72,153,.65), 0 0 18px var(--glow-cyan);
        }

        .jackpot{ text-shadow: 0 0 18px rgba(236,72,153,.28) }
      `}</style>
    </section>
  );
}