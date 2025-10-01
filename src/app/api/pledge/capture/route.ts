// src/app/api/pledge/capture/route.ts
import { NextResponse } from 'next/server'
import { getServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { pledgeId, amount } = body ?? {}

    const supa = getServerClient()
    const { data: { user } } = await supa.auth.getUser()
    if (!user) return NextResponse.json({ ok:false, error:'Not signed in' }, { status: 401 })

    const db = createAdminClient()

    if (pledgeId) {
      // Update the existing intent (only columns that exist)
      const { error } = await db
        .from('pledges')
        .update({
          user_id: user.id,
          email: user.email,
          // If you want to re-write amount from capture, keep it; otherwise omit
          ...(amount ? { amount } : {}),
        })
        .eq('id', pledgeId)

      if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 })
      return NextResponse.json({ ok:true, pledgeId })
    }

    // Fallback: create a row if we didn’t receive pledgeId (edge case)
    const { data: row, error } = await db
      .from('pledges')
      .insert({
        user_id: user.id,
        email: user.email,
        amount: amount ?? 0,
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