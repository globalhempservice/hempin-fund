// src/app/api/pledge/intent/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'   // ⬅️ rename import
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { campaign, tier, label, currency = 'USD', amount, returnTo } = body ?? {}
    if (!campaign || !amount) {
      return NextResponse.json({ ok:false, error:'Missing fields' }, { status: 400 })
    }

    // who is logged in?
    // If your helper takes no args, use: const supa = createServerClient()
    const supa = createServerClient(cookies())
    const { data: { user } } = await supa.auth.getUser()
    if (!user) return NextResponse.json({ ok:false, error:'Not signed in' }, { status: 401 })

    const db = createAdminClient()

    const { data: camp, error: cErr } = await db
      .from('campaigns')
      .select('id, slug').eq('slug', campaign).single()
    if (cErr || !camp) return NextResponse.json({ ok:false, error:'Campaign not found' }, { status: 404 })

    const { data: row, error } = await db
      .from('pledges')
      .insert({
        campaign_id: camp.id,
        user_id: user.id,
        email: user.email,
        tier_key: tier ?? null,
        label: label ?? null,
        currency,
        amount,
        status: 'intent',
        metadata: { returnTo }
      })
      .select('id')
      .single()

    if (error || !row) {
      return NextResponse.json({ ok:false, error: error?.message ?? 'Insert failed' }, { status: 400 })
    }
    return NextResponse.json({ ok:true, pledgeId: row.id })
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message ?? 'Server error' }, { status: 500 })
  }
}