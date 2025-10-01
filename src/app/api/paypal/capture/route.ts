import { NextResponse } from 'next/server'
import { createServerClientSupabase } from '@/lib/supabase/server'

const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com'

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

function redirectTo(path: string) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || ''
  const url = site ? `${site}${path}` : path
  return NextResponse.redirect(url, 302)
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const orderId = url.searchParams.get('token') // PayPal returns ?token=<orderId>

  if (!orderId) {
    // Missing token → send back with an error flag
    return redirectTo('/campaigns/hempin-launch?pay_error=missing_token')
  }

  try {
    // 1) Auth with PayPal
    const { access_token } = await getPayPalAccessToken()

    // 2) Capture the order
    const captureRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!captureRes.ok) {
      const errText = await captureRes.text()
      console.error('PayPal capture error:', errText)
      return redirectTo('/campaigns/hempin-launch?pay_error=capture_failed')
    }

    const captureJson = await captureRes.json()

    // Basic sanity
    const status = captureJson?.status
    const pu = (captureJson?.purchase_units || [])[0]
    const pledgeId = pu?.reference_id as string | undefined

    if (status !== 'COMPLETED' || !pledgeId) {
      return redirectTo('/campaigns/hempin-launch?pay_error=not_completed')
    }

    // 3) Mark pledge as paid in Supabase
    try {
      const supabase = createServerClientSupabase()
      await supabase
        .from('pledges')
        .update({ status: 'paid' })
        .eq('id', pledgeId)
    } catch (e) {
      // Non-blocking — user already paid; don’t scare them away if DB hiccups
      console.error('Supabase update error (mark paid):', e)
    }

    // 4) Send the backer to our thank-you screen
    return redirectTo(`/campaigns/hempin-launch/thanks?pledge=${encodeURIComponent(pledgeId)}`)

  } catch (e: any) {
    console.error('paypal/capture fatal error:', e?.message || e)
    return redirectTo('/campaigns/hempin-launch?pay_error=server_error')
  }
}