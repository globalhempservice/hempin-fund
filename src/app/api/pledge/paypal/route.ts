import { NextResponse } from 'next/server'
import { createServerClientSupabase } from '@/lib/supabase/server'


const ENV = (process.env.NEXT_PUBLIC_PAYPAL_ENV || 'sandbox').toLowerCase();
const PAYPAL_API_BASE =
  ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_SECRET

  if (!clientId || !secret) {
    throw new Error('Missing PayPal env vars')
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64')

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal token error: ${err}`)
  }

  return res.json() as Promise<{ access_token: string }>
}

export async function POST(req: Request) {
  try {
    const supabase = createServerClientSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ ok: false, error: 'not signed in' }, { status: 401 })

    const body = await req.json()
    const { pledgeId } = body as { pledgeId: string }
    if (!pledgeId) return NextResponse.json({ ok: false, error: 'missing pledgeId' }, { status: 400 })

    // lookup pledge
    const { data: pledge, error } = await supabase
      .from('pledges')
      .select('id, tier, amount, status')
      .eq('id', pledgeId)
      .eq('user_id', user.id)
      .single()

    if (error || !pledge) {
      return NextResponse.json({ ok: false, error: 'pledge not found' }, { status: 404 })
    }

    if (pledge.status !== 'pending') {
      return NextResponse.json({ ok: false, error: 'pledge not pending' }, { status: 400 })
    }

    // get access token
    const { access_token } = await getPayPalAccessToken()

    // create order
    const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: pledge.id,
            amount: {
              currency_code: 'USD',
              value: pledge.amount.toFixed(2),
            },
            description: `Hemp’in Fund pledge: ${pledge.tier}`,
          },
        ],
        application_context: {
          brand_name: "Hemp'in Fund",
          landing_page: 'LOGIN',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/paypal/capture`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/campaigns/hempin-launch`,
        },
      }),
    })

    if (!orderRes.ok) {
      const err = await orderRes.text()
      throw new Error(`PayPal order error: ${err}`)
    }

    const order = await orderRes.json()

    // grab approval URL
    const approval = order.links?.find((l: any) => l.rel === 'approve')?.href
    if (!approval) throw new Error('No PayPal approval link')

    return NextResponse.json({ ok: true, orderId: order.id, approvalUrl: approval })
  } catch (e: any) {
    console.error('paypal route error', e)
    return NextResponse.json({ ok: false, error: e?.message ?? 'server error' }, { status: 500 })
  }
}