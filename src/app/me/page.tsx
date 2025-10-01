// src/app/me/page.tsx
import { requireUser } from '@/lib/auth/requireUser';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';

type PledgeRow = {
  id: string;
  created_at: string | null;
  amount: number;
  currency: string;
  status: string | null;
  tier_id: string | null;
  campaign: { id: string; slug: string; title: string } | null;
  tier: { id: string; title: string } | null;
};

export default async function MyPledgesPage() {
  // 1) Auth gate
  const user = await requireUser('/me');

  // 2) DB query as service (server only)
  const db = createAdminClient();

  const { data: pledges, error } = await db
    .from('pledges')
    .select(`
      id, created_at, amount, currency, status, tier_id,
      campaign:campaigns!inner ( id, slug, title ),
      tier:tiers ( id, title )
    `)
    .eq('email', user.email)             // filter by the authed user’s email
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    // Soft failure rendering
    return (
      <main className="container" style={{ padding: 16 }}>
        <section className="hemp-panel" style={{ padding: 16 }}>
          <h1 className="display-title">My pledges</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            Couldn’t load your pledges right now: {error.message}
          </p>
        </section>
      </main>
    );
  }

  const list = (pledges || []) as unknown as PledgeRow[];

  return (
    <main className="container" style={{ maxWidth: 980, margin: '0 auto', padding: '18px 16px 28px' }}>
      {/* Mini profile card */}
      <section className="hemp-panel" style={{ padding: 16 }}>
        <p className="eyebrow">Profile</p>
        <h1 className="display-title" style={{ fontSize: 'clamp(22px,3.6vw,32px)' }}>
          {user.email}
        </h1>
        <p className="muted" style={{ marginTop: 6 }}>Early Backer badge will appear after your first captured pledge.</p>
        <div className="center" style={{ marginTop: 10 }}>
          <a className="btn ghost" href="mailto:support@hempin.org?subject=Fund%20support">Contact admin</a>
        </div>
      </section>

      {/* Pledges list or empty state */}
      {list.length === 0 ? (
        <section className="hemp-panel" style={{ marginTop: 16, padding: 16, textAlign: 'center' }}>
          <p className="muted">You haven’t pledged yet.</p>
          <div style={{ marginTop: 10 }}>
            <Link className="btn primary thruster" href="/campaigns/hempin-launch">Explore Hemp’in Launch</Link>
          </div>
        </section>
      ) : (
        <section className="hemp-panel" style={{ marginTop: 16, padding: 16 }}>
          <p className="eyebrow">My pledges</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', display: 'grid', gap: 10 }}>
            {list.map((p) => (
              <li key={p.id} className="hemp-panel" style={{ padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
                  <strong>{p.campaign?.title || 'Campaign'}</strong>
                  <span className="pill">${p.amount.toLocaleString('en-US')} {p.currency}</span>
                </div>
                <div className="muted" style={{ marginTop: 4 }}>
                  {p.tier?.title ? <>Tier: <b>{p.tier.title}</b> · </> : null}
                  Status: <b>{p.status || 'recorded'}</b> ·{' '}
                  {p.created_at ? new Date(p.created_at).toLocaleString() : 'date n/a'}
                </div>
                {p.campaign?.slug && (
                  <div style={{ marginTop: 8 }}>
                    <Link className="btn ghost" href={`/campaigns/${p.campaign.slug}`}>View campaign</Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}