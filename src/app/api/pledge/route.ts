// src/app/api/pledge/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/ui/lib/supabaseServer';

type Body = {
  campaignSlug: string;
  amount: number;
  currency?: string;
  email: string;

  // Accept either a concrete tier UUID or a human key like "seed" | "sprout"
  tierId?: string | null;
  tierKey?: string | null;

  // New: profile + PayPal metadata
  profileId?: string | null;
  paypalCaptureId?: string | null; // PayPal order/capture id if available
};

export async function POST(req: Request) {
  try {
    const {
      campaignSlug,
      amount,
      currency = 'USD',
      email,
      tierId,
      tierKey,
      profileId,
      paypalCaptureId,
    }: Body = await req.json();

    if (!campaignSlug || !amount || !email) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const db = supabaseAdmin();

    // 1) Campaign
    const { data: campaign, error: cErr } = await db
      .from('campaigns')
      .select('id, slug, title')
      .eq('slug', campaignSlug)
      .single();

    if (cErr || !campaign) {
      return NextResponse.json(
        { ok: false, error: 'Campaign not found.' },
        { status: 404 }
      );
    }

    // 2) Resolve tier UUID (if provided as human key)
    let resolvedTierId: string | null = null;
    if (tierId && /^[0-9a-f-]{36}$/i.test(tierId)) {
      resolvedTierId = tierId;
    } else if (tierKey && tierKey.trim()) {
      const { data: tiers, error: tErr } = await db
        .from('tiers')
        .select('id, title')
        .eq('campaign_id', campaign.id)
        .ilike('title', tierKey.trim());

      if (tErr) {
        return NextResponse.json({ ok: false, error: 'Error resolving tier.' }, { status: 400 });
      }
      resolvedTierId = tiers?.[0]?.id ?? null;
    }

    // 3) Ensure profile: by profileId, else by email, else create
    let profileRow: { id: string; email: string } | null = null;

    if (profileId) {
      const { data, error } = await db
        .from('profiles')
        .select('id, email')
        .eq('id', profileId)
        .single();
      if (error) {
        return NextResponse.json(
          { ok: false, error: `Profile lookup failed: ${error.message}` },
          { status: 400 }
        );
      }
      profileRow = data;
    } else {
      const { data: byEmail, error: eErr } = await db
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .limit(1);
      if (eErr) {
        return NextResponse.json(
          { ok: false, error: `Profile email lookup failed: ${eErr.message}` },
          { status: 400 }
        );
      }

      if (byEmail && byEmail.length > 0) {
        profileRow = byEmail[0];
      } else {
        const { data: created, error: cProfErr } = await db
          .from('profiles')
          .insert({ email, leaf_total: 0 })
          .select('id, email')
          .single();
        if (cProfErr || !created) {
          return NextResponse.json(
            { ok: false, error: `Profile create failed: ${cProfErr?.message ?? 'unknown'}` },
            { status: 400 }
          );
        }
        profileRow = created;
      }
    }

    // 4) Record pledge row (email-based for now; keep user_id NULL)
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
        { ok: false, error: pErr?.message ?? 'Pledge insert failed.' },
        { status: 400 }
      );
    }

    // 5) Ledger: payment capture (+2 surprise XP; adjust mapping later if desired)
    const leafDelta = 2; // tweak per tier later
    const { error: lErr } = await db.from('leaf_ledger').insert({
      profile_id: profileRow!.id,
      event_type: 'payment_capture',
      source_app: 'fund',
      source: 'paypal',
      leaf_delta: leafDelta,
      reason: 'payment capture',
      campaign_slug: campaign.slug,
      tier_key: tierKey ?? null,
      external_id: paypalCaptureId ?? null,
      metadata: { pledgeId: pledge.id, amount, currency },
    });

    // Note: even if ledger insert fails, the pledge succeeded. We still surface the error.
    if (lErr) {
      return NextResponse.json(
        {
          ok: true,
          warning: `Pledge saved, but ledger insert failed: ${lErr.message}`,
          pledgeId: pledge.id,
          profileId: profileRow!.id,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      ok: true,
      pledgeId: pledge.id,
      profileId: profileRow!.id,
      leafDelta,
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