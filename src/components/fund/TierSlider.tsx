'use client';

import { useMemo, useState } from 'react';

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
  const [i, setI] = useState(Math.min(Math.max(defaultIndex, 0), tiers.length - 1));

  const t = tiers[i];

  // cumulative perks from 0..i
  const perks = useMemo(() => {
    const out: string[] = [];
    tiers.slice(0, i + 1).forEach((x, idx) => {
      if (!x.adds) return;
      // split on " · " only for the seed line to split into two
      if (idx === 0 && x.adds.includes(' · ')) {
        out.push(...x.adds.split(' · '));
      } else {
        out.push(x.adds);
      }
    });
    return out;
  }, [tiers, i]);

  const stepCount = tiers.length - 1;

  return (
    <div className="hemp-panel" style={{ padding: 16, display: 'grid', gap: 12 }}>
      {/* header */}
      <div className="center">
        <div className="eyebrow">Choose your support</div>
        <h3 className="display-title" style={{ fontSize: 'clamp(22px,3.6vw,28px)', marginTop: 4 }}>
          {t.label} — ${t.amount.toLocaleString()}
        </h3>
      </div>

      {/* slider */}
      <div style={{ padding: '8px 2px 0' }}>
        <input
          type="range"
          min={0}
          max={stepCount}
          step={1}
          value={i}
          onChange={(e) => setI(parseInt(e.currentTarget.value, 10))}
          aria-label="Select a pledge tier"
          style={{ width: '100%' }}
        />
        {/* ticks */}
        <div
          aria-hidden
          style={{
            position: 'relative',
            height: 24,
            marginTop: 6,
            display: 'grid',
            gridTemplateColumns: `repeat(${tiers.length}, 1fr)`,
            gap: 0,
          }}
        >
          {tiers.map((x, idx) => (
            <div key={x.id} style={{ textAlign: 'center', fontSize: 12, opacity: idx === i ? 1 : 0.6 }}>
              <div style={{ height: 6, width: 2, margin: '0 auto', background: 'rgba(255,255,255,.45)', borderRadius: 2 }} />
              <div style={{ marginTop: 4, whiteSpace: 'nowrap' }}>
                ${x.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* perks list */}
      <ul className="muted" style={{ display: 'grid', gap: 6, margin: 0, paddingLeft: 18 }}>
        {perks.map((p, idx) => (
          <li key={idx}>{p}</li>
        ))}
      </ul>

      {/* primary action */}
      <div className="center" style={{ marginTop: 6 }}>
        <a
          className="btn primary thruster"
          href={`/pay/${campaignSlug}?tier=${encodeURIComponent(t.id)}&amount=${t.amount}`}
        >
          Pledge ${t.amount.toLocaleString()}
        </a>
      </div>

      {/* fallback note */}
      <div className="muted center" style={{ fontSize: '.9rem' }}>
        Use ← / → keys or drag to change tier.
      </div>
    </div>
  );
}