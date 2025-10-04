'use client';

import React from 'react';

// keep ids aligned with your page tiers
export type TierId =
  | 'seed' | 'sprout' | 'stem' | 'leaf'
  | 'fiber' | 'bast' | 'core' | 'field' | 'cosmos';

/** Hue per tier (HSL) — tweak to taste */
const HUES: Record<TierId, number> = {
  seed:   118,  // green
  sprout: 96,   // lime
  stem:   54,   // golden
  leaf:   162,  // teal
  fiber:  200,  // sky
  bast:   258,  // violet
  core:   292,  // magenta
  field:  24,   // orange
  cosmos: 330,  // rose
};

export default function TierBadge({
  tierId,
  size = 28,
  className,
  title,
}: {
  tierId: TierId;
  size?: number;
  className?: string;
  title?: string;
}) {
  const h = HUES[tierId];

  return (
    <span
      className={className}
      title={title}
      aria-hidden
      style={{
        display:'inline-block',
        width:size,
        height:size,
        borderRadius:'50%',
        // subtle ring + glow
        border:'1px solid rgba(255,255,255,.28)',
        boxShadow:'0 0 10px rgba(255,255,255,.18), 0 0 14px hsl(210 80% 65% / .18)',
        // layered orb look
        background: `
          radial-gradient(38% 38% at 38% 35%, #fff 0 36%, rgba(255,255,255,0) 38%),
          radial-gradient(78% 78% at 70% 70%, hsl(${h} 85% 62% / .55), transparent 62%),
          radial-gradient(90% 90% at 35% 35%, hsl(${h} 85% 58% / .35), transparent 72%)
        `,
      }}
    />
  );
}