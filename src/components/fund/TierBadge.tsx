// src/components/fund/TierBadge.tsx
'use client';

import React from 'react';

export type TierId =
  | 'seed'
  | 'sprout'
  | 'stem'
  | 'leaf'
  | 'fiber'
  | 'bast'
  | 'core'
  | 'field'
  | 'cosmos';

type Props = {
  tierId: TierId;
  size?: number;
  title?: string;
};

export function TierBadge({ tierId, size = 18, title }: Props) {
  // Hue pairs for each tier (HSL)
  const palette: Record<TierId, [number, number]> = {
    seed:   [140, 160],  // greenish
    sprout: [150, 180],  // mint → teal
    stem:   [180, 205],  // teal → cyan
    leaf:   [200, 220],  // cyan → blue
    fiber:  [220, 260],  // blue → indigo
    bast:   [280, 310],  // purple → magenta
    core:   [320, 350],  // magenta → rose
    field:  [10,  40],   // orange → amber
    cosmos: [210, 320],  // cyan → magenta sweep
  };

  const [h1, h2] = palette[tierId] ?? [330, 210];
  const px = `${size}px`;

  return (
    <span
      className="tier-badge"
      title={title}
      aria-hidden={title ? undefined : true}
      style={{
        width: px,
        height: px,
        borderRadius: '50%',
        display: 'inline-grid',
        placeItems: 'center',
        background: `linear-gradient(135deg, hsl(${h1} 85% 60%) 0%, hsl(${h2} 85% 62%) 100%)`,
        boxShadow:
          '0 0 10px rgba(236,72,153,.35), 0 0 14px var(--glow-cyan), inset 0 0 0 1px rgba(255,255,255,.35)',
      }}
    >
      <span
        style={{
          width: Math.max(4, Math.round(size / 6)),
          height: Math.max(4, Math.round(size / 6)),
          borderRadius: '50%',
          background: 'rgba(255,255,255,.92)',
          filter: 'blur(0.2px)',
        }}
      />
    </span>
  );
}

// Optional default export to be resilient if someone uses `import TierBadge from ...`
export default TierBadge;