'use client';

import { useState } from 'react';
import PledgeModal from '@/ui/molecules/PledgeModal';
import TierCard from '../../../ui/molecules/TierCard';

const CAMPAIGN_SLUG = 'hempin-launch';

type Tier = { id: string; title: string; amount: number; perk?: string };

const TIERS: Tier[] = [
  { id: 'seed',   title: 'Seed',   amount: 20,  perk: 'Founder badge + thank-you wall' },
  { id: 'sprout', title: 'Sprout', amount: 50,  perk: 'Hempin tote + founder badge' },
  { id: 'stem',   title: 'Stem',   amount: 100, perk: 'T-shirt + founder badge' },
  { id: 'field',  title: 'Field',  amount: 500, perk: 'Showroom invite + all perks' },
];

export default function HempinLaunchPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Tier | null>(null);

  const onTier = (t: Tier) => {
    setSelected(t);      // store full tier so we have amount + id
    setOpen(true);
  };

  const openFree = () => {
    // Optional custom-amount flow (kept for now; amount=0)
    setSelected({ id: '', title: 'Custom', amount: 0 });
    setOpen(true);
  };

  return (
    <main className="min-h-[90vh] px-6 py-14">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Fund Hempin</h1>
        <p className="mt-3 opacity-70">
          Help launch a profile-centered hemp ecosystem: farms, brands, factories, and people
          connected through one glowing nebula.
        </p>
        <p className="mt-3 text-xs opacity-50">HEMPIN — 2025</p>
      </section>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
        {TIERS.map((t) => (
          <TierCard
            key={t.id}
            title={t.title}
            amount={t.amount}
            perk={t.perk}
            onPledge={() => onTier(t)}
          />
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={openFree}
          className="rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 transition"
        >
          Choose your own amount
        </button>
      </div>

      <PledgeModal
        open={open}
        onClose={() => setOpen(false)}
        campaignSlug={CAMPAIGN_SLUG}
        campaignTitle="Hempin Launch"
        amount={selected?.amount ?? 0}     // <-- FIX: pass real amount from selected tier
        tierId={selected?.id ?? ''}        // <-- human key (seed/sprout/stem/field)
      />
    </main>
  );
}