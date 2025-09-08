'use client';

import { useState } from 'react';
import Orb from '@/ui/organisms/Orb';
import TierCard from '@/ui/molecules/TierCard';

const TIERS = [
  { title: 'Seed',   amount: 20,  perk: 'Founder badge + thank-you wall' },
  { title: 'Sprout', amount: 50,  perk: 'Hempin tote + founder badge' },
  { title: 'Stem',   amount: 100, perk: 'T-shirt + founder badge' },
  { title: 'Field',  amount: 500, perk: 'Showroom invite + all perks' }
];

export default function FundHome() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <main className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      <Orb />

      <section className="relative z-10 w-full max-w-5xl px-6">
        <header className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Fund Hempin</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Help launch a profile-centered hemp ecosystem: farmers, brands, factories, and people connected through one glowing nebula.
          </p>
          <p className="text-sm text-zinc-500">HEMPIN — 2025</p>
        </header>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map((t, i) => (
            <TierCard
              key={t.title}
              title={t.title}
              amount={t.amount}
              perk={t.perk}
              onSelect={() => setSelected(i)}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
          >
            Back to hempin.org
          </a>
        </div>

        {/* Placeholder: next step we’ll add PledgeModal + Supabase */}
        {selected !== null && (
          <div className="mt-6 text-center text-zinc-300">
            Selected tier: <strong>{TIERS[selected].title}</strong> — ${TIERS[selected].amount}.
            <br />
            We’ll wire the pledge modal + Supabase next.
          </div>
        )}
      </section>
    </main>
  );
}
