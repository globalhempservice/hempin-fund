// src/app/campaigns/hempin-launch/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import PayErrorNotice from '@/components/fund/PayErrorNotice';
import TierSlider from '@/components/fund/TierSlider';
import { createServerClientReadOnly } from '@/lib/supabase/server';

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

type Tier = { id: string; label: string; amount: number; adds?: string };
const TIERS: Tier[] = [
  { id: 'seed',   label: 'Seed',   amount: 20,    adds: 'Thank you · Early Backer badge' },
  { id: 'sprout', label: 'Sprout', amount: 50,    adds: 'Name on the “Founding log”' },
  { id: 'stem',   label: 'Stem',   amount: 100,   adds: 'Priority invites to early features' },
  { id: 'leaf',   label: 'Leaf',   amount: 250,   adds: '“Multipass” seasonal digital card' },
  { id: 'fiber',  label: 'Fiber',  amount: 500,   adds: 'Surprise drop (3–6 months)' },
  { id: 'bast',   label: 'Bast',   amount: 1000,  adds: 'Founder wall highlight' },
  { id: 'core',   label: 'Core',   amount: 2500,  adds: 'Founders circle channel + roadmap votes' },
  { id: 'field',  label: 'Field',  amount: 5000,  adds: 'Custom shout-out (opt-in)' },
  { id: 'cosmos', label: 'Cosmos', amount: 10000, adds: 'Lifetime multipass + priority windows' },
];

export default async function LaunchCampaignPage() {
  const supa = createServerClientReadOnly();

  export default async function LaunchCampaignPage() {
    const supa = createServerClientReadOnly();
  
    // Call RPC without generics; cast after .single() to dodge TS generic mismatch across envs
    const { data: totalsRaw, error } = await supa
      .rpc('campaign_totals', { slug: 'hempin-launch' })
      .single();
  
    if (error) console.error('campaign_totals RPC failed', error);
  
    const totals  = (totalsRaw as CampaignTotals | null) ?? null;
    const goal    = Number(totals?.goal ?? 20000);
    const raised  = Number(totals?.raised ?? 0);
    const backers = Number(totals?.backers ?? 0);
    const pct     = Math.min(100, Math.round((raised / goal) * 100));
  
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

        {/* Header card */}
        <div
          className="hemp-panel"
          style={{ marginTop: 12, padding: 16, display: 'grid', gap: 10, textAlign: 'center' }}
        >
          <p className="eyebrow">Hemp’in — Launch Campaign</p>
          <h1 className="display-title hemp-underline-aurora">Fund the navigator</h1>
          <p className="lede" style={{ margin: '6px auto 0', maxWidth: 720 }}>
            Help us ship the next modules, keep infra humming, and welcome farms, brands, and researchers into the ecosystem.
          </p>

          {/* Progress */}
          <div style={{ marginTop: 10 }}>
            <div className="hemp-panel" style={{ padding: 10, background: 'rgba(255,255,255,.035)', borderColor: 'rgba(255,255,255,.08)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                <strong style={{ letterSpacing: '.01em' }}>
                  ${format(raised)} raised
                </strong>
                <span className="muted" style={{ fontSize: '.95rem' }}>
                  Goal: ${format(goal)}
                </span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  height: 10,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,.06)',
                  border: '1px solid rgba(255,255,255,.12)',
                  overflow: 'hidden',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    display: 'block',
                    height: '100%',
                    width: `${pct}%`,
                    background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
                  }}
                />
              </div>
              <div className="muted" style={{ marginTop: 6, fontSize: '.92rem', textAlign: 'right' }}>
                {pct}% funded
              </div>
            </div>
          </div>

          {/* campaign meta */}
          <div className="muted" style={{ fontSize: '.92rem' }}>
            Live Oct 1 → Oct 31 • {backers} backer{backers === 1 ? '' : 's'} • all backers get the <strong>Early Backer</strong> badge
          </div>
        </div>

        {/* Tiers — slider selector */}
        <div id="tiers" style={{ marginTop: 16 }}>
          <h2 className="display-title" style={{ textAlign: 'center', fontSize: 'clamp(22px,3.6vw,32px)' }}>
            Choose a tier
          </h2>
          <div className="cta-scanline" aria-hidden />
          <TierSlider campaignSlug="hempin-launch" tiers={TIERS} />
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

        {/* FAQ mini */}
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

/* ---------- utils ---------- */
function format(n: number) {
  try { return Number(n).toLocaleString('en-US'); } catch { return String(n); }
}