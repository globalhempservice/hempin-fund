import type { Metadata } from 'next';
import { Suspense } from 'react';

import PayErrorNotice from '@/components/fund/PayErrorNotice';
import { createServerClientReadOnly } from '@/lib/supabase/server';
import CampaignHero from '@/components/fund/CampaignHero';
import PledgeSection from '@/components/fund/PledgeSection';

// ✅ Single source of truth for tiers
import { HEMPIN_TIERS } from '@/components/fund/TierList';
import type { Tier as UITier } from '@/components/fund/PledgeChooser';

type CampaignTotals = {
  campaign_id: string;
  raised: number | null;
  backers: number | null;
  goal: number | null;
};

export const metadata: Metadata = {
  title: "Hemp’in Launch — Fund the navigator",
  description:
    "Back Hemp’in’s public launch: build software modules, keep the lights on, and invite the hemp universe in.",
};

// Use SSOT (Seed → Core $2,000). Cast to the UI type.
const TIERS = HEMPIN_TIERS as unknown as UITier[];

export default async function LaunchCampaignPage() {
  const supa = createServerClientReadOnly();

  // live totals
  const { data: totalsRaw, error } = await supa
    .rpc('campaign_totals', { slug: 'hempin-launch' })
    .single();
  if (error) console.error('campaign_totals RPC failed', error);

  const totals  = (totalsRaw as CampaignTotals | null) ?? null;
  const goal    = Number(totals?.goal ?? 20000);
  const raised  = Number(totals?.raised ?? 0);
  const backers = Number(totals?.backers ?? 0);

  return (
    <main className="min-h-screen app-shell">
      {/* Stars */}
      <div className="starfield-root" aria-hidden>
        <div className="starfield layer-a" />
        <div className="starfield layer-b" />
      </div>

      <section className="container" style={{ maxWidth: 980, margin: '0 auto', padding: '18px 16px 28px' }}>
        <Suspense fallback={null}>
          <PayErrorNotice />
        </Suspense>

        <CampaignHero
          title="WIN PRIZES AND BECOME HEMP'IN EARLY ADOPTER"
          subtitle="Hemp'in is about to launch the largest global Hemp products Supermarket. We are asking for your support to make it come to life and to thank you we have prepared a few cool prizes! The more funds we raise, the sooner we can reward everyone."
          raised={raised}
          goal={goal}
          backers={backers}
          startISO="2025-10-01"
          endISO="2025-10-31"
          live
        />

        {/* Tiers + CTA + Rewards */}
        <div id="tiers" style={{ marginTop: 16 }}>
          <h2 className="display-title" style={{ textAlign: 'center', fontSize: 'clamp(22px,3.6vw,32px)' }}>
            It&apos;s your turn to shine
          </h2>
          <div className="cta-scanline" aria-hidden />
          <PledgeSection campaignSlug="hempin-launch" tiers={TIERS} />
        </div>

        {/* Story / what you enable */}
        <article id="story" className="hemp-panel" style={{ marginTop: 16, padding: 14 }}>
          <h3 style={{ margin: '0 0 6px' }}>What your pledge enables</h3>
          <ul className="muted" style={{ margin: '6px 0 0', paddingLeft: 18, display: 'grid', gap: 6 }}>
            <li>Ship core modules (funding, wallet, campaign setup) and keep infra running smoothly.</li>
            <li>Onboard farms, brands, and researchers — with docs, examples, and starter templates.</li>
            <li>Grow a trusted network where hemp knowledge, products, and culture can thrive.</li>
          </ul>
          <div className="muted" style={{ marginTop: 10, fontSize: '.95rem' }}>
            Every tier grants the same <strong>Early Backer</strong> profile badge. Higher tiers help us move faster and
            unlock earlier access windows and surprises (opt-in).
          </div>
        </article>

        {/* FAQ */}
        <div className="hemp-panel" style={{ marginTop: 12, padding: 14 }}>
          <h3 style={{ margin: '0 0 6px' }}>FAQ</h3>
          <details>
            <summary className="planet-title">Do I need an account to pledge?</summary>
            <p className="muted" style={{ marginTop: 6 }}>
              Yes. When you choose a tier, we route you through <strong>auth.hempin.org</strong> (magic link). Once
              signed in, you land on checkout so your pledge and badge tie to your profile.
            </p>
          </details>
          <details style={{ marginTop: 8 }}>
            <summary className="planet-title">How do payments work?</summary>
            <p className="muted" style={{ marginTop: 6 }}>
              We use PayPal. You can cancel any time before approval. If something fails, you’ll be redirected back here
              with a short message.
            </p>
          </details>
          <details style={{ marginTop: 8 }}>
            <summary className="planet-title">What about refunds?</summary>
            <p className="muted" style={{ marginTop: 6 }}>
              Early campaign pledges fund development and operations. If there’s an issue, contact support and we’ll
              do our best to make it right.
            </p>
          </details>
        </div>

        {/* Back to Fund home */}
        <div className="center" style={{ marginTop: 14 }}>
          <a className="btn ghost" href="/">← All campaigns</a>
        </div>
      </section>
    </main>
  );
}