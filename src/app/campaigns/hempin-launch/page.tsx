// Campaign single page (LIFE) — Hemp’in Launch
// - Mobile-first layout
// - Progress + tiers
// - Pledge buttons link to /pay with query params
// - Integrates the PayErrorNotice banner
// - No slug logic yet (hard-coded campaign)

import type { Metadata } from 'next';
import PayErrorNotice from '@/components/fund/PayErrorNotice';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "Hemp’in Launch — Fund the navigator",
  description:
    "Back Hemp’in’s public launch: build software modules, keep the lights on, and invite the hemp universe in.",
};

const TIERS: { id: string; label: string; amount: number; blurb: string }[] = [
  { id: 'seed',     label: 'Seed',     amount: 20,    blurb: 'Thank-you + Early Backer badge in your profile.' },
  { id: 'sprout',   label: 'Sprout',   amount: 50,    blurb: 'Early Backer badge + name on the “Founding log”.' },
  { id: 'stem',     label: 'Stem',     amount: 100,   blurb: 'Badge + priority invites to early features.' },
  { id: 'leaf',     label: 'Leaf',     amount: 250,   blurb: 'All above + “Multipass” digital card (seasonal).' },
  { id: 'fiber',    label: 'Fiber',    amount: 500,   blurb: 'All above + surprise drop (in 3–6 months).' },
  { id: 'bast',     label: 'Bast',     amount: 1000,  blurb: 'Founder wall highlight + multipass perks.' },
  { id: 'core',     label: 'Core',     amount: 2500,  blurb: 'Founders circle channel + roadmap votes.' },
  { id: 'field',    label: 'Field',    amount: 5000,  blurb: 'Custom shout-out (opt-in) + early partner slots.' },
  { id: 'cosmos',   label: 'Cosmos',   amount: 10000, blurb: 'Lifetime multipass + priority access windows.' },
];

// (Optional) fake progress for now — you’ll wire to Supabase later.
const GOAL_USD = 50000;
const RAISED_USD = 12780;

export default function LaunchCampaignPage() {
  const pct = Math.min(100, Math.round((RAISED_USD / GOAL_USD) * 100));

  return (
    <main className="min-h-screen app-shell">
      {/* Stars (reuse your site starfield classes) */}
      <div className="starfield-root" aria-hidden>
        <div className="starfield layer-a" />
        <div className="starfield layer-b" />
      </div>

      <section className="container" style={{ maxWidth: 980, margin: '0 auto', padding: '18px 16px 28px' }}>
        {/* Banner for payment errors, if any */}
        <Suspense fallback={null}>
  <PayErrorNotice />
</Suspense>

        {/* Header card */}
        <div
          className="hemp-panel"
          style={{
            marginTop: 12,
            padding: 16,
            display: 'grid',
            gap: 10,
            textAlign: 'center',
          }}
        >
          <p className="eyebrow">Hemp’in — Launch Campaign</p>
          <h1 className="display-title hemp-underline-aurora">Fund the navigator</h1>
          <p className="lede" style={{ margin: '6px auto 0', maxWidth: 720 }}>
            Help us ship the next modules, keep infra humming, and welcome farms, brands, and researchers into the ecosystem.
          </p>

          {/* Progress */}
          <div style={{ marginTop: 10 }}>
            <div
              className="hemp-panel"
              style={{
                padding: 10,
                background: 'rgba(255,255,255,.035)',
                borderColor: 'rgba(255,255,255,.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                <strong style={{ letterSpacing: '.01em' }}>
                  ${format( RAISED_USD )} raised
                </strong>
                <span className="muted" style={{ fontSize: '.95rem' }}>
                  Goal: ${format( GOAL_USD )}
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
            Live now • runs for 30 days • all backers get the <strong>Early Backer</strong> badge
          </div>
        </div>

        {/* Tiers */}
        <div id="tiers" style={{ marginTop: 16 }}>
          <h2 className="display-title" style={{ textAlign: 'center', fontSize: 'clamp(22px,3.6vw,32px)' }}>
            Choose a tier
          </h2>
          <div className="cta-scanline" aria-hidden />

          <ul
            style={{
              listStyle: 'none',
              margin: '12px 0 0',
              padding: 0,
              display: 'grid',
              gap: 10,
              gridTemplateColumns: '1fr',
            }}
          >
            {/* 2-up on tablet/desktop */}
            <style
              dangerouslySetInnerHTML={{
                __html: `
                @media (min-width: 760px){
                  .tiers-grid { grid-template-columns: 1fr 1fr; }
                }
                @media (min-width: 1080px){
                  .tiers-grid { grid-template-columns: 1fr 1fr 1fr; }
                }
              `,
              }}
            />
            <div className="tiers-grid" style={{ display: 'grid', gap: 10 }}>
              {TIERS.map((t) => (
                <li key={t.id} className="hemp-panel" style={{ padding: 14, display: 'grid', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                    <strong style={{ letterSpacing: '.01em' }}>{t.label}</strong>
                    <span className="pill" style={{ fontWeight: 800 }}>${format(t.amount)}</span>
                  </div>
                  <p className="muted" style={{ margin: 0 }}>{t.blurb}</p>

                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    {/* Primary flow → /pay (it will enforce login via auth hub if needed) */}
                    <a
                      className="btn primary thruster"
                      href={`/pay/hempin-launch?tier=${encodeURIComponent(t.id)}&amount=${t.amount}`}                      style={{ flex: 1 }}
                    >
                      Pledge ${format(t.amount)}
                    </a>

                    {/* Ghost: learn more (scrolls to story) */}
                    <a className="btn ghost" href="#story" style={{ whiteSpace: 'nowrap' }}>
                      Why this matters
                    </a>
                  </div>
                </li>
              ))}
            </div>
          </ul>
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
              Yes. When you click a tier, we’ll route you through <strong>auth.hempin.org</strong> (magic link). Once
              signed in, you’ll land on checkout. This keeps your pledge tied to your profile and badge.
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
              Early campaign pledges are used to fund development and operations. If there’s an issue, contact support and we’ll
              do our best to make it right.
            </p>
          </details>
        </div>

        {/* Back to Fund home (placeholder until overview is rebuilt) */}
        <div className="center" style={{ marginTop: 14 }}>
          <a className="btn ghost" href="/">← All campaigns</a>
        </div>
      </section>
    </main>
  );
}

/* ---------- utils ---------- */
function format(n: number) {
  try {
    return n.toLocaleString('en-US');
  } catch {
    return String(n);
  }
}