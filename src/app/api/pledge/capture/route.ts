// src/app/api/pledge/capture/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { pledgeId, orderId, status, amount, raw } = body ?? {}

    const supa = getServerClient()
    const { data: { user } } = await supa.auth.getUser()
    if (!user) return NextResponse.json({ ok:false, error:'Not signed in' }, { status: 401 })

    const db = createAdminClient()

    if (pledgeId) {
      // normal case: update the “intent” row
      const { error } = await db
        .from('pledges')
        .update({
          user_id: user.id,            // ensure set
          email: user.email,
          status: 'captured',
          paypal_order_id: orderId ?? null,
          amount: amount ?? null,
          metadata: { ...raw }
        })
        .eq('id', pledgeId)

      if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 })
      return NextResponse.json({ ok:true, pledgeId })
    }

    // fallback: create if we didn’t get pledgeId
    const { data: row, error } = await db
      .from('pledges')
      .insert({
        user_id: user.id,
        email: user.email,
        status: 'captured',
        paypal_order_id: orderId ?? null,
        amount: amount ?? null,
        currency: 'USD',
        metadata: { ...raw }
      })
      .select('id')
      .single()

    if (error || !row) return NextResponse.json({ ok:false, error: error?.message ?? 'Insert failed' }, { status: 400 })
    return NextResponse.json({ ok:true, pledgeId: row.id })
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: e?.message ?? 'Server error' }, { status: 500 })
  }
}