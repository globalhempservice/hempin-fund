// src/components/fund/TierSlider.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Tier = { id: string; label: string; amount: number; adds?: string };

export default function TierSlider({
  campaignSlug,
  tiers,
  defaultIndex = 0,
}: {
  campaignSlug: string;
  tiers: Tier[];
  defaultIndex?: number;
}) {
  const maxIndex = Math.max(0, tiers.length - 1);
  const [i, setI] = useState(Math.min(Math.max(defaultIndex, 0), maxIndex));
  const t = tiers[i];

  // --- animated amount (jackpot-style) ---
  const [animated, setAnimated] = useState(t.amount);
  const fromRef = useRef(t.amount);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = t.amount;
    const dur = 420; // ms
    const start = performance.now();
    cancelAnimationFrame(raf.current as number);

    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setAnimated(Math.round(from + (to - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(step);
      else fromRef.current = to;
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current as number);
  }, [t.amount]);

  // --- cumulative rewards as stack of cards ---
  // “seed” may contain two perks separated by " · "
  const rewardCards = useMemo(() => {
    const uniq: string[] = [];
    tiers.forEach((tier, idx) => {
      if (!tier.adds) return;
      const parts =
        idx === 0 && tier.adds.includes(' · ')
          ? tier.adds.split(' · ')
          : [tier.adds];
      parts.forEach((p) => {
        if (!uniq.includes(p)) uniq.push(p);
      });
    });
    return uniq.slice(0, i + 1); // show up to current selection
  }, [tiers, i]);

  const dec = () => setI((n) => Math.max(0, n - 1));
  const inc = () => setI((n) => Math.min(maxIndex, n + 1));

  // keyboard helpers (←/→)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') dec();
      if (e.key === 'ArrowRight') inc();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [maxIndex]);

  return (
    <div className="hemp-panel" style={{ padding: 16, display: 'grid', gap: 14 }}>
      {/* header */}
      <div className="center">
        <div className="eyebrow" style={{ letterSpacing: '.12em' }}>
          CHOOSE YOUR SUPPORT
        </div>
        <div style={{ marginTop: 6 }}>
          <div
            className="planet-title"
            style={{ fontSize: 'clamp(20px,3.4vw,26px)', fontWeight: 800 }}
          >
            {t.label}
          </div>
          <div
            className="jackpot"
            aria-live="polite"
            style={{
              marginTop: 2,
              fontWeight: 900,
              fontSize: 'clamp(22px,4.3vw,34px)',
              letterSpacing: '.02em',
            }}
          >
            ${animated.toLocaleString()}
          </div>
        </div>
      </div>

      {/* slider */}
      <div className="tier-slider-wrap">
        <input
          className="tier-range"
          type="range"
          min={0}
          max={maxIndex}
          step={1}
          value={i}
          onChange={(e) => setI(parseInt(e.currentTarget.value, 10))}
          aria-label="Select a pledge tier"
        />

        {/* arrows */}
        <div className="tier-arrows">
          <button
            type="button"
            onClick={dec}
            disabled={i === 0}
            aria-label="Previous tier"
            className="btn game"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={inc}
            disabled={i === maxIndex}
            aria-label="Next tier"
            className="btn game"
          >
            ▶
          </button>
        </div>
      </div>

      {/* rewards */}
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          REWARDS
        </div>
        <ul className="reward-stack">
          {rewardCards.map((p, idx) => (
            <li key={idx} className="reward-card">
              {/* placeholder for future small icon */}
              <span className="dot" aria-hidden />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* primary action */}
      <div className="center" style={{ marginTop: 6 }}>
        <a
          className="btn primary thruster"
          href={`/pay/${campaignSlug}?tier=${encodeURIComponent(t.id)}&amount=${t.amount}`}
        >
          Pledge ${t.amount.toLocaleString()}
        </a>
      </div>

      <div className="muted center" style={{ fontSize: '.9rem' }}>
        Use ◀ / ▶ keys, click arrows, or drag the slider.
      </div>

      {/* styles */}
      <style jsx>{`
        .tier-slider-wrap {
          display: grid;
          gap: 10px;
          place-items: center;
          margin-top: 6px;
        }
        .tier-arrows {
          display: flex;
          gap: 10px;
        }
        .btn.game {
          min-width: 44px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          font-weight: 800;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.08);
        }
        .btn.game:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Range styling – works on WebKit + Firefox */
        .tier-range {
          width: 100%;
          height: 28px; /* larger hit area for mobile */
          background: transparent;
          appearance: none;
        }
        /* track */
        .tier-range::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            var(--accent) 0%,
            var(--accent-2) 60%,
            rgba(255, 255, 255, 0.18) 60%
          );
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .tier-range::-moz-range-track {
          height: 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        /* thumb */
        .tier-range::-webkit-slider-thumb {
          appearance: none;
          margin-top: -6px; /* centers on 8px track */
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 40% 40%,
            #fff 0 35%,
            #f9a8d4 36% 70%,
            rgba(0, 0, 0, 0) 72%
          );
          box-shadow: 0 0 12px rgba(236, 72, 153, 0.6),
            0 0 18px var(--glow-cyan);
          border: 1px solid rgba(255, 255, 255, 0.35);
        }
        .tier-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 40% 40%,
            #fff 0 35%,
            #f9a8d4 36% 70%,
            rgba(0, 0, 0, 0) 72%
          );
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 0 12px rgba(236, 72, 153, 0.6),
            0 0 18px var(--glow-cyan);
        }

        /* rewards stack */
        .reward-stack {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        }
        .reward-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25),
            0 0 10px rgba(236, 72, 153, 0.12);
          transform: translateY(0);
          transition: transform 160ms ease, box-shadow 160ms ease;
        }
        .reward-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.32),
            0 0 14px rgba(236, 72, 153, 0.18);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent);
        }

        /* jackpot subtle flicker */
        .jackpot {
          text-shadow: 0 0 18px rgba(236, 72, 153, 0.28);
        }
      `}</style>
    </div>
  );
}