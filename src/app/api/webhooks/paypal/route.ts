import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const isSandbox = (process.env.PAYPAL_ENV || 'sandbox').toLowerCase() === 'sandbox';
const PAYPAL_API_BASE = isSandbox
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET!;
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID!;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) throw new Error(`PayPal token error: ${await res.text()}`);
  const json = await res.json();
  return json.access_token as string;
}

async function verifyWebhookSignature(event: any, req: Request) {
  try {
    const headers = Object.fromEntries(req.headers.entries());
    const accessToken = await getAccessToken();

    const res = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: PAYPAL_WEBHOOK_ID,
        webhook_event: event,
      }),
    });

    if (!res.ok) return false;
    const json = await res.json();
    return json.verification_status === 'SUCCESS';
  } catch (e) {
    console.error('verifyWebhookSignature error:', e);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Webhook handler
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  const db = createAdminClient();
  const event = await req.json().catch(() => null);
  if (!event) return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });

  const eventType = event?.event_type || 'unknown';
  const resource = event?.resource || {};
  const verified = await verifyWebhookSignature(event, req);

  // Always log incoming events
  await db.from('webhook_events').insert({
    source: 'paypal',
    event_type: eventType,
    resource_id: resource.id || null,
    verified,
    status: resource.status || null,
    payload: event,
  });

  // Stop if signature invalid (still logged)
  if (!verified) return NextResponse.json({ ok: true, verified: false });

  try {
    let updates: Record<string, any> | null = null;

    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED': {
        const captureId = resource.id;
        const orderId = resource?.supplementary_data?.related_ids?.order_id;
        const amount = Number(resource?.amount?.value) || null;
        const currency = resource?.amount?.currency_code || 'USD';

        updates = {
          status: 'paid',
          paypal_capture_id: captureId,
          paypal_order_id: orderId,
          amount,
          currency,
          metadata: resource,
        };

        // Try matching pledge
        if (captureId)
          await db.from('pledges').update(updates).eq('paypal_capture_id', captureId);
        if (orderId)
          await db.from('pledges').update(updates).eq('paypal_order_id', orderId);

        break;
      }

      case 'CHECKOUT.ORDER.COMPLETED': {
        const orderId = resource.id;
        const amount = Number(resource?.purchase_units?.[0]?.amount?.value) || null;
        const currency = resource?.purchase_units?.[0]?.amount?.currency_code || 'USD';

        updates = {
          status: 'paid',
          paypal_order_id: orderId,
          amount,
          currency,
          metadata: resource,
        };

        await db.from('pledges').update(updates).eq('paypal_order_id', orderId);
        break;
      }

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.REFUNDED':
      case 'PAYMENT.CAPTURE.REVERSED': {
        const captureId = resource.id;
        await db.from('pledges')
          .update({ status: eventType.toLowerCase(), metadata: resource })
          .eq('paypal_capture_id', captureId);
        break;
      }

      default:
        console.log(`Unhandled PayPal event: ${eventType}`);
        break;
    }

    return NextResponse.json({ ok: true, verified: true });
  } catch (e: any) {
    console.error('PayPal webhook processing error:', e);
    return NextResponse.json({ ok: false, error: e?.message || 'Processing error' }, { status: 500 });
  }
}