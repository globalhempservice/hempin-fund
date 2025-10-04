'use client';

import { useState } from 'react';
import PledgeChooser from './PledgeChooser';
import RewardsGrid from './RewardsGrid';

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
  const [i, setI] = useState(
    Math.min(Math.max(defaultIndex, 0), Math.max(0, tiers.length - 1))
  );

  return (
    <>
      <PledgeChooser
        campaignSlug={campaignSlug}
        tiers={tiers}
        selectedIndex={i}
        onChangeIndex={setI}
      />

      <div style={{ marginTop: 14 }}>
        <RewardsGrid tiers={tiers} selectedIndex={i} />
      </div>
    </>
  );
}