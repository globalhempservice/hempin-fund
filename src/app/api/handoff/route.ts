import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/ui/lib/supabaseServer';

export async function POST(req: Request) {
  try {
    const {
      profileId,
      email,
      campaignSlug,
      leafTotal,
      tierKey,
      amount,
      paypalCaptureId,
    } = await req.json();

    if (!profileId || !email || !campaignSlug) {
      return NextResponse.json({ ok: false, error: 'Missing fields.' }, { status: 400 });
    }

    const db = supabaseAdmin();

    const { data, error } = await db
      .from('handoff_tokens')
      .insert({
        profile_id: profileId,
        email,
        campaign_slug: campaignSlug,
        leaf_snapshot: typeof leafTotal === 'number' ? leafTotal : null,
        metadata: {
          tierKey: tierKey ?? null,
          amount: amount ?? null,
          paypalCaptureId: paypalCaptureId ?? null,
        },
        // expires_at default handles TTL
      })
      .select('id')
      .single();

    if (error || !data) {
      return NextResponse.json({ ok: false, error: error?.message ?? 'Insert failed' }, { status: 400 });
    }

    return NextResponse.json({ ok: true, handoffId: data.id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Server error' }, { status: 500 });
  }
}