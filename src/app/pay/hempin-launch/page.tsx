// src/app/pay/hempin-launch/page.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth/requireUser';
import PayPalButtonsClient from '@/components/fund/PayPalButtonsClient';

export default async function PayHempinLaunchPage({
  searchParams,
}: {
  searchParams: { tier?: string; amount?: string }
}) {
  // 1) Must be signed in
  const user = await requireUser('/pay/hempin-launch');

  // 2) Resolve tier + amount
  const TIER_MAP: Record<string, { label: string; amount: number }> = {
    seed:          { label: 'Seed (Supporter)', amount: 20 },
    sprout:        { label: 'Sprout',           amount: 50 },
    stem:          { label: 'Stem',             amount: 100 },
    leaf:          { label: 'Leaf',             amount: 250 },
    fiber:         { label: 'Fiber',            amount: 500 },
    bast:          { label: 'Bast',             amount: 1000 },
    core:          { label: 'Core',             amount: 2500 },
    field:         { label: 'Field',            amount: 5000 },
    cosmos:        { label: 'Cosmos',           amount: 10000 },
  };

  const tierKey = (searchParams.tier || '').toLowerCase();
  const tier = TIER_MAP[tierKey];
  const parsed = Number(searchParams.amount);

  // If a known tier, use fixed amount; otherwise custom (min $5, max $10k; default $20)
  const amount =
    tier?.amount ??
    (Number.isFinite(parsed) ? Math.min(10000, Math.max(5, parsed)) : 20);

  const label = tier?.label || (Number.isFinite(parsed) ? 'Custom pledge' : 'Supporter');

  // 3) Compute absolute origin (for PayPal return URLs)
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host') || '';
  const proto = h.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const origin = `${proto}://${host}`;

  // 4) Env
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
  if (!PAYPAL_CLIENT_ID) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <main className="min-h-screen grid place-items-center px-4">
          <section className="hemp-panel auth-card p-6 md:p-8">
            <h1 className="display-title center">Payment config missing</h1>
            <p className="muted center" style={{ marginTop: 8 }}>
              Set <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> in your environment.
            </p>
            <div className="center" style={{ marginTop: 12 }}>
              <a className="btn" href="/campaigns/hempin-launch">← Back to campaign</a>
            </div>
          </section>
        </main>
      );
    }
    redirect('/campaigns/hempin-launch');
  }

  const PAYPAL_ENV = (process.env.NEXT_PUBLIC_PAYPAL_ENV || 'sandbox').toLowerCase() as
    | 'sandbox'
    | 'live'
    | string;

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <section className="hemp-panel auth-card p-6 md:p-8" style={{ paddingTop: 18, maxWidth: 680 }}>
        <div className="center">
          <p className="eyebrow">Hemp’in Funding · Payment</p>
          <h1 className="display-title">Complete your pledge</h1>
          <div className="cta-scanline" aria-hidden />
        </div>

        {/* Summary */}
        <div style={{ marginTop: 14 }}>
          <div className="glassish" style={{
            display:'grid', gap:8, padding:12,
            borderRadius:12,
            background:'rgba(255,255,255,.035)',
            border:'1px solid rgba(255,255,255,.08)'
          }}>
            <Row label="Campaign" value="Hemp’in Launch (LIFE)" />
            <Row label="Tier"     value={label} />
            <Row label="Amount"   value={`$${amount.toFixed(2)} USD`} />
            <Row label="Signed in" value={user.email || '—'} />
          </div>

          <p className="muted" style={{ marginTop: 10, fontSize: '.9rem', textAlign:'center' }}>
            Your payment is processed securely by PayPal. You’ll receive the
            <b> Early Backer</b> badge and your <b>Multipass</b> will activate after payment clears.
          </p>
        </div>

        {/* PayPal Buttons (client) */}
        <div style={{ marginTop: 16 }}>
          <PayPalButtonsClient
            amount={amount}
            tierKey={tierKey}
            label={label}
            env={PAYPAL_ENV}
            clientId={PAYPAL_CLIENT_ID}
            origin={origin}
          />
        </div>

        <div className="center" style={{ marginTop: 12 }}>
          <a className="btn ghost" href={`/campaigns/hempin-launch?tier=${encodeURIComponent(tierKey || 'seed')}`}>
            ← Back to campaign
          </a>
        </div>

        <p className="muted center" style={{ marginTop: 10, fontSize: '.8rem' }}>
          By pledging you agree to our funding terms and understand this is a contribution to support
          software and community development at Hemp’in.
        </p>
      </section>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rowish" style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:12 }}>
      <span className="muted" style={{ opacity:.9 }}>{label}</span>
      <span style={{ fontWeight:700 }}>{value}</span>
    </div>
  );
}