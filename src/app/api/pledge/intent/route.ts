// src/app/api/pledge/intent/route.ts
import { NextResponse } from 'next/server'
import { createServerClientSupabase } from '@/lib/supabase/server'

type Body = {
  campaign?: string
  tier?: string
  label?: string
  currency?: string
  amount?: number
  returnTo?: string
  // you can pass extra fields; we’ll tuck them into metadata
  [k: string]: any
}

export async function POST(req: Request) {
  try {
    const supabase = createServerClientSupabase()

    // Auth: must be signed in
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr) throw userErr
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Not signed in' }, { status: 401 })
    }

    const body = (await req.json()) as Body

    const campaign = (body.campaign || '').trim()
    if (!campaign) {
      return NextResponse.json({ ok: false, error: 'Missing campaign' }, { status: 400 })
    }

    const amount = Number(body.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ ok: false, error: 'Invalid amount' }, { status: 400 })
    }

    const currency = (body.currency || 'USD').toUpperCase()
    const tier = (body.tier || 'custom').toLowerCase()
    const label = body.label?.toString().slice(0, 120) || 'Pledge'
    const return_to = body.returnTo?.toString().slice(0, 400) || null

    // Optional: stash any extra fields in metadata (safe JSON)
    const { campaign: _c, amount: _a, currency: _cu, tier: _t, label: _l, returnTo: _r, ...rest } = body
    const metadata = Object.keys(rest).length ? rest : null

    // Insert a pending pledge intent
    // Expected table (Supabase):
    // pledges: id uuid (pk default gen_random_uuid()), campaign text, user_id uuid, email text,
    // tier text, label text, amount numeric, currency text, status text, provider_order_id text,
    // return_to text, metadata jsonb, created_at timestamptz default now(), updated_at timestamptz
    const { data, error } = await supabase
      .from('pledges')
      .insert({
        campaign,
        user_id: user.id,
        email: user.email,
        tier,
        label,
        amount,
        currency,
        status: 'intent',
        provider_order_id: null,
        return_to,
        metadata,
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ ok: true, pledgeId: data.id })
  } catch (e: any) {
    console.error('[pledge/intent] error', e?.message || e)
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  // Simple CORS preflight allowance if you ever call from other subs (kept minimal)
  return NextResponse.json({ ok: true })
}