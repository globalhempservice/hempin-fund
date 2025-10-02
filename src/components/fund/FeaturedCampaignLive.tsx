// src/components/fund/FeaturedCampaignLive.tsx
import FeaturedCampaign from '@/components/fund/FeaturedCampaign';
import { createServerClientReadOnly } from '@/lib/supabase/server';

type Totals = { campaign_id: string; raised: number | null; backers: number | null; goal: number | null };

export default async function FeaturedCampaignLive() {
  const supa = createServerClientReadOnly();

  // Read public totals (RPC bypasses RLS for aggregate only)
  const { data: totalsRaw, error } = await supa.rpc('campaign_totals', { slug: 'hempin-launch' }).single();
  if (error) console.error('featured: campaign_totals RPC failed', error);

  const totals  = (totalsRaw as Totals | null) ?? null;
  const raised  = Number(totals?.raised ?? 0);
  const goal    = Number(totals?.goal ?? 20000);
  const backers = Number(totals?.backers ?? 0);

  return (
    <FeaturedCampaign
      eyebrow="Featured campaign"
      title="Hemp’in Launch"
      blurb="Support the public launch of Hemp’in: modules, infra, and community onboarding."
      href="/campaigns/hempin-launch"
      cta="Visit campaign"
      status="live"
      image={{
        src: '/images/launch-banner.jpg',  // optional — swap to your asset or remove image prop
        alt: 'Hemp’in Launch banner',
      }}
      meta={[
        'Oct 1 → Oct 31',
        `${backers} backer${backers === 1 ? '' : 's'}`,
      ]}
      raised={raised}
      goal={goal}
      currency="USD"
    />
  );
}