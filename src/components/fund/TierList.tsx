// src/components/fund/TierList.tsx
'use client';

export type Tier = {
  id: string;
  label: string;
  amount: number;
  adds: string;
};

export const HEMPIN_TIERS: Tier[] = [
  {
    id: 'seed',
    label: 'Seed',
    amount: 20,
    adds:
      'A chance to win a Surprise Hemp’in Drop Box · Thank you note (opt-in/out) · 1 random Cosmos sticker · Early Backer badge'
  },
  {
    id: 'sprout',
    label: 'Sprout',
    amount: 50,
    adds:
      'Full Hemp’in sticker collection · Chance to win limited edition Hemp’in Orb hemp tee'
  },
  {
    id: 'stem',
    label: 'Stem',
    amount: 100,
    adds:
      'Innovative Velcro Hemp’in logo kit to customize any clothes'
  },
  {
    id: 'leaf',
    label: 'Leaf',
    amount: 250,
    adds:
      'One limited edition Hemp’in T-shirt'
  },
  {
    id: 'fiber',
    label: 'Fiber',
    amount: 500,
    adds:
      'One Hemp’in Surprise Box Drop at the marketplace opening'
  },
  {
    id: 'bast',
    label: 'Bast',
    amount: 1000,
    adds:
      '+4 EXTRA guaranteed Surprise Boxes during the next year'
  },
  {
    id: 'core',
    label: 'Core',
    amount: 2000,
    adds:
      '+6 EXTRA guaranteed Surprise Boxes during the next two years'
  }
];

// Optional visual component if you want to display them statically
export default function TierList() {
  return (
    <section className="hemp-panel" style={{ padding: 18, display: 'grid', gap: 14 }}>
      <h3 style={{ margin: 0, textAlign: 'center' }}>Backer Tiers</h3>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: 12
        }}
      >
        {HEMPIN_TIERS.map((tier) => (
          <li
            key={tier.id}
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 14,
              padding: 14,
              display: 'grid',
              gap: 8
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
              {tier.label} – ${tier.amount}
            </div>
            <div style={{ fontSize: '.9rem', opacity: 0.9 }}>{tier.adds}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}