'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type Tier = { id: string; label: string; amount: number; adds?: string };

function splitAdds(t: Tier) {
  // allow multiple perks separated by " · " or " + "
  if (!t.adds) return [] as string[];
  return t.adds.split(/ · |\s\+\s/g).map(s => s.trim()).filter(Boolean);
}

export default function PledgeChooser({
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

  // rows logic
  const nowUnlocked = useMemo(() => splitAdds(tiers[i]), [tiers, i]);
  const alsoIncluded = useMemo(() => {
    const prev = tiers.slice(0, i).flatMap(splitAdds);
    // de-dupe to avoid doubles if wording repeats
    return Array.from(new Set(prev));
  }, [tiers, i]);

  // keyboard arrows
  const dec = () => setI(n => Math.max(0, n - 1));
  const inc = () => setI(n => Math.min(maxIndex, n + 1));
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  dec();
      if (e.key === 'ArrowRight') inc();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [maxIndex]);

  const payHref = (tier: Tier) =>
    `/pay/${campaignSlug}?tier=${encodeURIComponent(tier.id)}&amount=${tier.amount}`;

  // Range fill % for the custom progress under the thumb
  const pct = (i / maxIndex) * 100 || 0;

  return (
    <section className="hemp-panel" style={{ padding: 16, display: 'grid', gap: 14 }}>
      {/* Header — “level” + big jackpot + primary CTA */}
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

      {/* Quick chips for jumping directly to a tier */}
      <div className="center" style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
        {tiers.map((tier, idx) => (
          <button
            key={tier.id}
            type="button"
            onClick={() => setI(idx)}
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

      {/* Slider + progress bar that truly fills */}
      <div style={{ display:'grid', gap:10 }}>
        {/* Custom fill bar */}
        <div style={{ position:'relative', height:10, borderRadius:999, overflow:'hidden',
                      background:'rgba(255,255,255,.10)', border:'1px solid rgba(255,255,255,.18)' }}>
          <span
            aria-hidden
            style={{
              position:'absolute', inset:'0 auto 0 0',
              width: `${pct}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--accent-2))'
            }}
          />
        </div>
        <div className="tier-arrows" style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'center', gap:10 }}>
          <button type="button" onClick={dec} disabled={i===0} aria-label="Previous tier" className="btn game">◀</button>
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
          <button type="button" onClick={inc} disabled={i===maxIndex} aria-label="Next tier" className="btn game">▶</button>
        </div>
      </div>

      {/* Rewards rows */}
      <div style={{ display:'grid', gap:12 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom:8 }}>NOW UNLOCKED</div>
          <ul className="reward-row">
            {nowUnlocked.length === 0 ? (
              <li className="reward-card ghost-card">Nothing extra at this tier (yet)</li>
            ) : nowUnlocked.map((p, idx) => (
              <RewardCard key={`now-${idx}`} title={p} ctaHref={payHref(t)} />
            ))}
          </ul>
        </div>

        {alsoIncluded.length > 0 && (
          <div>
            <div className="eyebrow" style={{ marginBottom:8 }}>ALSO INCLUDED</div>
            <ul className="reward-row">
              {alsoIncluded.map((p, idx) => (
                <RewardCard key={`inc-${idx}`} title={p} subtle ctaHref={payHref(t)} />
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="muted center" style={{ fontSize: '.9rem' }}>
        Drag the slider, press ◀ / ▶, or tap a tier chip.
      </div>

      {/* local styles */}
      <style jsx>{`
        .btn.game{
          min-width:44px;height:40px;display:grid;place-items:center;
          border-radius:10px;font-weight:800;
          border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08)
        }
        .btn.game:disabled{ opacity:.5; cursor:not-allowed }

        /* native range: keep transparent so our custom fill does the work */
        .tier-range{ width:100%; height:28px; background:transparent; appearance:none }
        .tier-range::-webkit-slider-runnable-track{
          height:0; background:transparent; border:0;
        }
        .tier-range::-moz-range-track{
          height:0; background:transparent; border:0;
        }
        .tier-range::-webkit-slider-thumb{
          appearance:none; margin-top:-10px; width:22px; height:22px; border-radius:50%;
          background: radial-gradient(circle at 40% 40%, #fff 0 35%, #f9a8d4 36% 70%, rgba(0,0,0,0) 72%);
          box-shadow: 0 0 12px rgba(236,72,153,.6), 0 0 18px var(--glow-cyan);
          border:1px solid rgba(255,255,255,.35);
        }
        .tier-range::-moz-range-thumb{
          width:22px;height:22px;border-radius:50%;
          background: radial-gradient(circle at 40% 40%, #fff 0 35%, #f9a8d4 36% 70%, rgba(0,0,0,0) 72%);
          border:1px solid rgba(255,255,255,.35);
          box-shadow: 0 0 12px rgba(236,72,153,.6), 0 0 18px var(--glow-cyan);
        }

        .reward-row{
          list-style:none; margin:0; padding:0;
          display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px;
        }
        .reward-card{
          position:relative; display:grid; align-content:start; gap:10px;
          padding:12px; border-radius:14px;
          background: rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.12);
          box-shadow: 0 6px 18px rgba(0,0,0,.25), 0 0 10px rgba(236,72,153,.12);
          transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
        }
        .reward-card:hover{
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(0,0,0,.32), 0 0 14px rgba(236,72,153,.18);
          border-color: rgba(255,255,255,.18);
        }
        .reward-card .media{
          width:100%; aspect-ratio: 5/3; border-radius:10px;
          background: linear-gradient(135deg, rgba(236,72,153,.22), rgba(96,165,250,.18));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
        }
        .reward-card .title{ font-weight:800; letter-spacing:.01em }
        .reward-card .row{ display:flex; justify-content:space-between; align-items:center; gap:8px }
        .reward-card .mini{ font-size:.85rem; opacity:.85 }

        .reward-card.subtle{ opacity:.9; background:rgba(255,255,255,.04) }
        .reward-card.ghost-card{ display:flex; align-items:center; justify-content:center; font-style:italic }
      `}</style>
    </section>
  );
}

function RewardCard({ title, subtle=false, ctaHref }:{
  title: string;
  subtle?: boolean;
  ctaHref: string;
}) {
  return (
    <li className={`reward-card${subtle ? ' subtle' : ''}`}>
      {/* image placeholder – drop your sticker/tee/box art later */}
      <div className="media" aria-hidden />
      <div className="title">{title}</div>
      <div className="row">
        <span className="mini muted">Included at this selection</span>
        <a className="btn primary" href={ctaHref} style={{ padding:'8px 10px' }}>Choose</a>
      </div>
    </li>
  );
}