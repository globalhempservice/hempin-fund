'use client';

import React, { useState } from 'react';
import PledgeSlider from './PledgeSlider';
import RewardGrid from './RewardGrid';

export type Tier = { id: string; label: string; amount: number; adds?: string };

export default function PledgeSection({
  campaignSlug,
  tiers,
  defaultIndex = 0,
}: {
  campaignSlug: string;
  tiers: Tier[];
  defaultIndex?: number;
}) {
  const [index, setIndex] = useState(
    Math.min(Math.max(defaultIndex, 0), Math.max(0, tiers.length - 1))
  );

  const tier = tiers[index];

  return (
    <>
      {/* BOX 1 — slider/controls */}
      <section className="hemp-panel" style={{ padding: 16 }}>
        <PledgeSlider
          tiers={tiers}
          index={index}
          onIndexChange={setIndex}
          campaignSlug={campaignSlug}
        />
      </section>

      {/* BOX 2 — rewards */}
      <section className="hemp-panel" style={{ padding: 16, marginTop: 14 }}>
        <RewardGrid
          tiers={tiers}
          index={index}
          campaignSlug={campaignSlug}
          key={`grid-${tier.id}`} // forces a quick entry animation on change
        />
      </section>
    </>
  );
}