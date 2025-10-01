import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth/requireUser';
import PayPalButtons from '@/components/fund/PayPalButtons';

// ---- Server page (guards auth) ----
export default async function PayHempinLaunchPage({
  searchParams,
}: {
  searchParams: { tier?: string; amount?: string };
}) {
  // 1) Must be signed in (shared auth helper)
  const user = await requireUser('/pay/hempin-launch');

  // 2) Resolve tier + amount
  const TIER_MAP: Record<string, { label: string; amount: number }> = {
    voyager:       { label: 'Voyager (Supporter)', amount: 20 },
    navigator:     { label: 'Navigator',           amount: 50 },
    builder:       { label: 'Builder',             amount: 100 },
    explorer:      { label: 'Explorer',            amount: 250 },
    pioneer:       { label: 'Pioneer',             amount: 1000 },
    constellation: { label: 'Constellation',       amount: 5000 },
    supernova:     { label: 'Supernova',           amount: 10000 },
  };

  const tierKey = (searchParams.tier || '').toLowerCase();
  const tier = TIER_MAP[tierKey];

  const parsed = Number(searchParams.amount);
  // If a known tier, use its fixed amount; otherwise allow custom (min $5, max $10,000)
  const custom = Number.isFinite(parsed) ? Math.min(10000, Math.max(5, parsed)) : 20;
  const amount = tier ? tier.amount : custom;

  const label = tier ? tier.label : (Number.isFinite(parsed) ? 'Custom pledge' : 'Supporter');

  // 3) Compute absolute return URL (used in PayPal context & our UX)
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host') || '';
  const proto = h.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const origin = `${proto}://${host}`;

  // 4) PayPal env (client id must exist)
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
    // In prod, just send back to campaign
    redirect('/campaigns/hempin-launch');
  }

  const PAYPAL_ENV = (process.env.NEXT_PUBLIC_PAYPAL_ENV || 'sandbox').toLowerCase(); // 'live' | 'sandbox'

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <section className="hemp-panel auth-card p-6 md:p-8" style={{ paddingTop: 18 }}>
        <div className="center">
          <p className="eyebrow">Hemp’in Funding · Payment</p>
          <h1 className="display-title">Complete your pledge</h1>
          <div className="cta-scanline" aria-hidden />
        </div>

        {/* Summary */}
        <div style={{ marginTop: 14 }}>
          <div
            className="glassish"
            style={{
              display: 'grid',
              gap: 8,
              padding: 12,
              borderRadius: 12,
              background: 'rgba(255,255,255,.035)',
              border: '1px solid rgba(255,255,255,.08)',
            }}
          >
            <Row label="Campaign" value="Hemp’in Launch (LIFE)" />
            <Row label="Tier" value={label} />
            <Row label="Amount" value={`$${amount.toFixed(2)} USD`} />
            <Row label="Signed in" value={user.email || '—'} />
          </div>

          <p className="muted" style={{ marginTop: 10, fontSize: '.9rem', textAlign: 'center' }}>
            Your payment is processed securely by PayPal. You’ll receive the
            <b> Early Backer</b> badge and your <b>Multipass</b> will activate after payment clears.
          </p>
        </div>

        {/* PayPal Buttons (client component) */}
        <div style={{ marginTop: 16 }}>
          <PayPalButtons
            amount={amount}
            tierKey={tierKey}
            label={label}
            env={PAYPAL_ENV}
            clientId={PAYPAL_CLIENT_ID}
            origin={origin}
          />
        </div>

        {/* Footer actions */}
        <div className="center" style={{ marginTop: 12 }}>
          <a className="btn ghost" href={`/campaigns/hempin-launch?tier=${encodeURIComponent(tierKey || 'voyager')}`}>
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

// Small display row
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rowish" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
      <span className="muted" style={{ opacity: .9 }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}