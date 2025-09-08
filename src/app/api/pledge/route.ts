import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/ui/lib/supabaseServer';

type Body = {
  campaignSlug: string;
  amount: number;
  currency?: string;
  email: string;
  // NEW: accept either tierId (uuid) or tierKey (human label like "Sprout")
  tierId?: string | null;
  tierKey?: string | null;
};

export async function POST(req: Request) {
  try {
    const { campaignSlug, amount, currency = 'USD', email, tierId, tierKey }: Body =
      await req.json();

    if (!campaignSlug || !amount || !email) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const db = supabaseAdmin();

    // 1) find campaign
    const { data: campaign, error: cErr } = await db
      .from('campaigns')
      .select('id, title, slug')
      .eq('slug', campaignSlug)
      .single();

    if (cErr || !campaign) {
      return NextResponse.json(
        { ok: false, error: 'Campaign not found.' },
        { status: 404 }
      );
    }

    // 2) resolve tier uuid (if any)
    let resolvedTierId: string | null = null;

    if (tierId && /^[0-9a-f-]{36}$/i.test(tierId)) {
      // looks like a uuid
      resolvedTierId = tierId;
    } else if (tierKey && tierKey.trim().length > 0) {
      // resolve by title (case-insensitive) within this campaign
      const { data: tier, error: tErr } = await db
        .from('tiers')
        .select('id, title')
        .eq('campaign_id', campaign.id)
        .ilike('title', tierKey.trim()); // case-insensitive match

      if (tErr) {
        return NextResponse.json(
          { ok: false, error: 'Error resolving tier.' },
          { status: 400 }
        );
      }
      if (tier && tier.length > 0) {
        // if multiple match, take the first (shouldn’t happen with unique index)
        resolvedTierId = tier[0].id;
      } else {
        // not fatal—allow pledges with no tier_id
        resolvedTierId = null;
      }
    }

    // 3) insert pledge
    const { data: pledge, error: pErr } = await db
      .from('pledges')
      .insert({
        campaign_id: campaign.id,
        tier_id: resolvedTierId, // may be null
        email,
        amount,
        currency,
        status: 'recorded',
      })
      .select('id, created_at')
      .single();

    if (pErr || !pledge) {
      return NextResponse.json(
        { ok: false, error: pErr?.message ?? 'Insert failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      pledgedId: pledge.id,
      createdAt: pledge.created_at,
      campaign: { id: campaign.id, slug: campaign.slug, title: campaign.title },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}