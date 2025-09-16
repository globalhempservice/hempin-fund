import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function fail(status: number, message: string) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return fail(500, 'Supabase server credentials are not configured.');
    }
    const { email, campaignSlug, tierKey } = await req.json();

    // Basic input validation
    const emailOk = typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) return fail(400, 'Invalid email.');
    if (!campaignSlug || typeof campaignSlug !== 'string') {
      return fail(400, 'campaignSlug is required.');
    }
    if (!tierKey || typeof tierKey !== 'string') {
      return fail(400, 'tierKey is required.');
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    });

    // 1) Ensure a profile exists (create if missing)
    const normEmail = String(email).trim().toLowerCase();

    let { data: found, error: findErr } = await admin
      .from('profiles')
      .select('id')
      .ilike('email', normEmail)
      .limit(1)
      .maybeSingle();

    if (findErr) {
      return fail(500, `Failed to lookup profile: ${findErr.message}`);
    }

    let profileId = found?.id as string | null;

    if (!profileId) {
      const displayName = normEmail.split('@')[0];
      const { data: created, error: createErr } = await admin
        .from('profiles')
        .insert({
          email: normEmail,
          display_name: displayName,
          // removed created_from to match your current schema
        })
        .select('id')
        .single();

      if (createErr) {
        if (createErr.code === '23505') {
          const retry = await admin
            .from('profiles')
            .select('id')
            .ilike('email', normEmail)
            .limit(1)
            .maybeSingle();
          if (retry.error || !retry.data) {
            return fail(500, 'Profile creation race condition — please retry.');
          }
          profileId = retry.data.id;
        } else {
          return fail(500, `Failed to create profile: ${createErr.message}`);
        }
      } else {
        profileId = created!.id;
      }
    }

    // 2) Record the +1 leaf in the ledger
    const { error: ledgerErr } = await admin.from('leaf_ledger').insert({
      profile_id: profileId,
      event_type: 'email_capture',
      leaf_delta: 1,
      reason: 'email capture (fund)',
      source_app: 'fund',
    });

    if (ledgerErr) {
      return fail(500, `Failed to log leaf: ${ledgerErr.message}`);
    }

    return NextResponse.json({ ok: true, profileId }, { status: 200 });
  } catch (e: any) {
    return fail(500, e?.message ?? 'Unexpected server error.');
  }
}