'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Tier } from './PledgeSection';

export default function PledgeSlider({
  tiers,
  index,
  onIndexChange,
  campaignSlug,
}: {
  tiers: Tier[];
  index: number;
  onIndexChange: (i: number) => void;
  campaignSlug: string;
}) {
  const maxIndex = Math.max(0, tiers.length - 1);
  const t = tiers[index];

  // animated “jackpot” amount
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

  const dec = () => onIndexChange(Math.max(0, index - 1));
  const inc = () => onIndexChange(Math.min(maxIndex, index + 1));

  // keyboard arrows
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  dec();
      if (e.key === 'ArrowRight') inc();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, maxIndex]);

  const payHref = (tier: Tier) =>
    `/pay/${campaignSlug}?tier=${encodeURIComponent(tier.id)}&amount=${tier.amount}`;

  const pct = (index / maxIndex) * 100 || 0;

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {/* Header */}
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

      {/* Quick chips */}
      <div className="center" style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
        {tiers.map((tier, idx) => (
          <button
            key={tier.id}
            type="button"
            onClick={() => onIndexChange(idx)}
            className="pill"
            aria-current={index === idx}
            style={{
              borderColor: index === idx ? 'rgba(255,255,255,.22)' : undefined,
              boxShadow: index === idx ? '0 0 0 2px rgba(236,72,153,.25)' : undefined,
              fontWeight: 800
            }}
          >
            {tier.label} · ${tier.amount.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Slider (thumb sits on the bar) with arrows on the sides */}
      <div className="range-row">
        <button type="button" onClick={dec} disabled={index===0} aria-label="Previous tier" className="btn game nav">◀</button>

        <div className="range-wrap">
          <div className="range-bar">
            <span aria-hidden style={{ width: `${pct}%`, display:'block', height:'100%', background:'linear-gradient(90deg, var(--accent), var(--accent-2))' }} />
          </div>
          <input
            className="tier-range"
            type="range"
            min={0}
            max={maxIndex}
            step={1}
            value={index}
            onChange={(e) => onIndexChange(parseInt(e.currentTarget.value, 10))}
            aria-label="Select a pledge tier"
          />
        </div>

        <button type="button" onClick={inc} disabled={index===maxIndex} aria-label="Next tier" className="btn game nav">▶</button>
      </div>

      <div className="muted center" style={{ fontSize: '.9rem' }}>
        Drag the slider, press ◀ / ▶, or tap a tier chip.
      </div>

      {/* local styles */}
      <style jsx>{`
        .range-row{
          display:grid;
          grid-template-columns:auto 1fr auto;
          align-items:center;
          gap:10px;
        }
        .btn.game.nav{ min-width:44px; height:40px; display:grid; place-items:center;
          border-radius:10px; font-weight:800; border:1px solid rgba(255,255,255,.15);
          background:rgba(255,255,255,.08)
        }
        .btn.game.nav:disabled{ opacity:.5; cursor:not-allowed }

        .range-wrap{ position:relative; height:32px; }
        .range-bar{
          position:absolute; left:0; right:0; top:50%;
          height:10px; transform:translateY(-50%);
          border-radius:999px; overflow:hidden;
          background:rgba(255,255,255,.10); border:1px solid rgba(255,255,255,.18);
          pointer-events:none;
        }

        .tier-range{ position:absolute; inset:0; width:100%; height:32px; background:transparent; appearance:none }
        .tier-range::-webkit-slider-runnable-track{ height:10px; background:transparent; border:0 }
        .tier-range::-moz-range-track{ height:10px; background:transparent; border:0 }

        .tier-range::-webkit-slider-thumb{
          appearance:none; width:22px; height:22px; border-radius:50%;
          margin-top:-6px; /* centers on a 10px track */
          background: radial-gradient(circle at 40% 40%, #fff 0 35%, #f9a8d4 36% 70%, rgba(0,0,0,0) 72%);
          border:1px solid rgba(255,255,255,.35);
          box-shadow: 0 0 12px rgba(236,72,153,.6), 0 0 18px var(--glow-cyan);
        }
        .tier-range::-moz-range-thumb{
          width:22px; height:22px; border-radius:50%;
          background: radial-gradient(circle at 40% 40%, #fff 0 35%, #f9a8d4 36% 70%, rgba(0,0,0,0) 72%);
          border:1px solid rgba(255,255,255,.35);
          box-shadow: 0 0 12px rgba(236,72,153,.6), 0 0 18px var(--glow-cyan);
        }

        .jackpot{ text-shadow: 0 0 18px rgba(236,72,153,.28) }
      `}</style>
    </div>
  );
}