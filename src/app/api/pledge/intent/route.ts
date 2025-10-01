// src/app/api/pledge/intent/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { campaign, amount } = body ?? {}

    if (!campaign || !amount) {
      return NextResponse.json({ ok:false, error:'Missing fields' }, { status: 400 })
    }

    // who is logged in?
    const supa = getServerClient()
    const { data: { user } } = await supa.auth.getUser()
    if (!user) return NextResponse.json({ ok:false, error:'Not signed in' }, { status: 401 })

    const db = createAdminClient()

    // look up campaign id from slug
    const { data: camp, error: cErr } = await db
      .from('campaigns')
      .select('id, slug')
      .eq('slug', campaign)
      .single()

    if (cErr || !camp) {
      return NextResponse.json({ ok:false, error:'Campaign not found' }, { status: 404 })
    }

    // create a pledge “intent” row (only columns that exist today)
    const { data: row, error } = await db
      .from('pledges')
      .insert({
        campaign_id: camp.id,
        user_id: user.id,
        email: user.email,
        amount,          // store intended amount now; it will be the same at capture
        // tier_id: null  // keep null for now unless you resolve it elsewhere
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