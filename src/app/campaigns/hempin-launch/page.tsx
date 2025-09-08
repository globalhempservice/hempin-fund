// src/app/campaigns/hempin-launch/page.tsx
'use client';

import Orb from '../../../ui/organisms/Orb';

type Tier = {
  key: 'seed' | 'sprout' | 'stem' | 'field';
  title: string;
  amount: number;
  perk: string;
};

const TIERS: Tier[] = [
  { key: 'seed',   title: 'Seed',   amount: 20,  perk: 'Founder badge + thank-you wall' },
  { key: 'sprout', title: 'Sprout', amount: 50,  perk: 'Hempin tote + founder badge' },
  { key: 'stem',   title: 'Stem',   amount: 100, perk: 'T-shirt + founder badge' },
  { key: 'field',  title: 'Field',  amount: 500, perk: 'Showroom invite + all perks' },
];

export default function HempinLaunchPage() {
  const goConfirm = (tierKey: Tier['key']) => {
    window.location.href = `/campaigns/hempin-launch/confirm?tier=${encodeURIComponent(tierKey)}`;
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden">
      {/* Larger background orb for this page — scale on outer wrapper now persists */}
      <Orb className="absolute inset-0 scale-[1.35] md:scale-[1.75]" />

      {/* Back to fund hub (centered, subtle) */}
      <nav className="relative z-10 -mt-6 mb-4">
        <a
          href="/"
          className="inline-block text-xs opacity-70 hover:opacity-100 underline underline-offset-4"
        >
          ← Back to Fund hub
        </a>
      </nav>

      <header className="relative z-10 mx-auto max-w-3xl">
        <p className="text-xs opacity-70 mb-2">🌱 Active campaign</p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Hempin Launch</h1>
        <p className="mt-4 opacity-80">
          Help us kickstart a profile-centered hemp ecosystem—tools for farms, brands, and people.
          Your support accelerates our first public releases.
        </p>
      </header>

      {/* Tiers */}
      <section className="relative z-10 mx-auto mt-12 grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
        {TIERS.map((t) => (
          <article
            key={t.key}
            className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div>
              <p className="text-sm opacity-70">{t.title}</p>
              <p className="mt-1 text-2xl font-semibold">${t.amount}</p>
              <p className="mt-3 text-sm opacity-80">{t.perk}</p>
            </div>

            <div className="mt-auto pt-6">
              <button
                onClick={() => goConfirm(t.key)}
                className="w-full rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
              >
                Select this tier
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}