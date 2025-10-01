// src/app/me/page.tsx
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';

type PledgeRow = {
  id: string;
  campaign_id: string | null;
  tier_id: string | null;
  amount: number | null;
  currency: string | null;
  status: string | null;
  created_at: string;
};

export default async function MePage() {
  const supa = createServerClient(cookies());
  const { data: { user } } = await supa.auth.getUser();

  if (!user) {
    return (
      <main className="container" style={{ padding: '18px 12px' }}>
        <article className="hemp-panel center" style={{ padding: 16 }}>
          <h1 className="display-title">Please sign in</h1>
          <p className="muted" style={{ marginTop: 8 }}>You need to be signed in to see your pledges.</p>
          <div className="center" style={{ marginTop: 12 }}>
            <a className="btn primary thruster" href="https://auth.hempin.org">Sign in</a>
          </div>
        </article>
      </main>
    );
  }

  // 1) get pledges for this user
  const { data: pledges = [] } = await supa
    .from('pledges')
    .select('id,campaign_id,tier_id,amount,currency,status,created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: PledgeRow[] | null };

  // 2) fetch related titles in one go
  const campaignIds = [...new Set(pledges.map(p => p.campaign_id).filter(Boolean))] as string[];
  const tierIds     = [...new Set(pledges.map(p => p.tier_id).filter(Boolean))] as string[];

  const [{ data: campaigns = [] }, { data: tiers = [] }] = await Promise.all([
    campaignIds.length
      ? supa.from('campaigns').select('id, title, slug').in('id', campaignIds)
      : Promise.resolve({ data: [] as any }),
    tierIds.length
      ? supa.from('tiers').select('id, title').in('id', tierIds)
      : Promise.resolve({ data: [] as any }),
  ]);

  const campById = new Map(campaigns.map((c:any) => [c.id, c]));
  const tierById = new Map(tiers.map((t:any) => [t.id, t]));

  return (
    <main className="container" style={{ maxWidth: 920, margin: '0 auto', padding: '18px 12px 28px' }}>
      {/* Profile card */}
      <section className="hemp-panel" style={{ padding: 16 }}>
        <p className="eyebrow">Profile</p>
        <h2 style={{ margin: '4px 0 0' }} className="planet-title">{user.email}</h2>
        <p className="muted" style={{ marginTop: 8 }}>
          Your <strong>Early Backer</strong> badge will be delivered on <strong>Nov 1</strong> with the rollout of Hemp’in user profiles.
        </p>
        <div className="center" style={{ marginTop: 12 }}>
          <a className="btn ghost" href="mailto:hello@hempin.org?subject=Hempin%20Fund%20support">Contact admin</a>
        </div>
      </section>

      {/* Pledges */}
      <section className="hemp-panel" style={{ marginTop: 16, padding: 16 }}>
        <p className="eyebrow">My pledges</p>

        {pledges.length === 0 ? (
          <div className="muted" style={{ marginTop: 8 }}>
            You haven’t pledged yet — <a className="link" href="/campaigns/hempin-launch">check out Hemp’in Launch</a>.
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', display: 'grid', gap: 10 }}>
            {pledges.map((p) => {
              const camp = p.campaign_id ? campById.get(p.campaign_id) : null;
              const tier = p.tier_id ? tierById.get(p.tier_id) : null;
              const amount = p.amount ?? 0;
              const curr = (p.currency || 'USD').toUpperCase();
              const when = new Date(p.created_at);
              const dateStr = when.toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' });

              return (
                <li key={p.id} className="hemp-panel" style={{ padding: 14, display: 'grid', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
                    <strong style={{ letterSpacing: '.01em' }}>
                      {camp?.title || 'Campaign'}{tier?.title ? ` — ${tier.title}` : ''}
                    </strong>
                    <span className="pill" style={{ fontWeight: 800 }}>
                      ${amount.toLocaleString()} {curr}
                    </span>
                  </div>
                  <div className="muted" style={{ fontSize: '.92rem' }}>
                    Status: <strong>{p.status || 'captured'}</strong> · {dateStr}
                  </div>
                  {camp?.slug && (
                    <div>
                      <a className="btn ghost" href={`/campaigns/${camp.slug}`}>View campaign</a>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}