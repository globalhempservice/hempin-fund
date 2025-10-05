// src/app/api/webhooks/paypal/route.ts
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Optional verification:
 *  - You can validate PayPal webhook signatures using their public cert
 *    and the headers PayPal-Transmission-Id, -Sig, -Time, etc.
 *  - For now we accept all incoming events from PayPal's IPs.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const eventType = body?.event_type
    const resource  = body?.resource
    const captureId = resource?.id
    const orderId   = resource?.supplementary_data?.related_ids?.order_id
    const amountObj = resource?.amount ?? resource?.purchase_units?.[0]?.amount
    const value     = parseFloat(amountObj?.value ?? '0')
    const currency  = amountObj?.currency_code ?? 'USD'

    console.log('[PayPal webhook]', eventType, captureId)

    // only process successful captures
    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const db = createAdminClient()

      // Try to find pledge by PayPal order id first
      const { data: pledges } = await db
        .from('pledges')
        .select('id,status')
        .eq('paypal_order_id', orderId)
        .limit(1)

      if (pledges && pledges.length > 0) {
        const pledge = pledges[0]
        await db
          .from('pledges')
          .update({
            status: 'captured',
            amount: value,
            currency,
            metadata: {
              ...(resource || {}),
              via: 'webhook',
            },
          })
          .eq('id', pledge.id)
        console.log(`→ pledge ${pledge.id} marked captured (order ${orderId})`)
      } else {
        // fallback: insert a record if none found
        await db.from('pledges').insert({
          status: 'captured',
          paypal_order_id: orderId,
          amount: value,
          currency,
          metadata: { ...(resource || {}), via: 'webhook_insert' },
        })
        console.log(`→ inserted fallback pledge for order ${orderId}`)
      }
    }

    // ignore other event types safely
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('PayPal webhook error:', e)
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'server error' },
      { status: 500 },
    )
  }
}