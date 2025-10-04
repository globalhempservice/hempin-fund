// src/components/fund/PledgeSection.tsx
'use client';

import { useState } from 'react';
import PledgeChooser, { type Tier } from './PledgeChooser';
import RewardsGrid from './RewardsGrid';

export default function PledgeSection({
  campaignSlug,
  tiers,
  defaultIndex = 0,
}: {
  campaignSlug: string;
  tiers: Tier[];            // <-- use Tier from PledgeChooser
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