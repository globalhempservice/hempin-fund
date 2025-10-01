// src/app/pay/hempin-launch/page.tsx
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth/requireUser'

// ---- Server page (guards auth) ----
export default async function PayHempinLaunchPage({
  searchParams,
}: {
  searchParams: { tier?: string; amount?: string }
}) {
  // 1) Must be signed in (uses shared auth helper you installed earlier)
  const user = await requireUser('/pay/hempin-launch')

  // 2) Resolve tier + amount
  const TIER_MAP: Record<string, { label: string; amount: number }> = {
    voyager:      { label: 'Voyager (Supporter)',     amount: 20 },
    navigator:    { label: 'Navigator',               amount: 50 },
    builder:      { label: 'Builder',                 amount: 100 },
    explorer:     { label: 'Explorer',                amount: 250 },
    pioneer:      { label: 'Pioneer',                 amount: 1000 },
    constellation:{ label: 'Constellation',           amount: 5000 },
    supernova:    { label: 'Supernova',               amount: 10000 },
  }

  const tierKey = (searchParams.tier || '').toLowerCase()
  const tier = TIER_MAP[tierKey]
  const parsed = Number(searchParams.amount)
  // If a known tier, use its fixed amount; otherwise allow custom (min $5, max $10,000)
  const amount =
    tier?.amount ??
    Math.min(10000, Math.max(5, Number.isFinite(parsed) ? parsed : 0)) || 20

  const label = tier?.label || (parsed ? `Custom pledge` : 'Supporter')

  // 3) Compute absolute return URL (needed by some PayPal configurations / our UX)
  const h = headers()
  const host = h.get('x-forwarded-host') || h.get('host') || ''
  const proto = h.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https')
  const origin = `${proto}://${host}`

  // 4) Read PayPal env (client id must be set in env)
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''
  if (!PAYPAL_CLIENT_ID) {
    // Fail fast in dev if misconfigured
    if (process.env.NODE_ENV !== 'production') {
      return (
        <main className="min-h-screen grid place-items-center px-4">
          <section className="hemp-panel auth-card p-6 md:p-8">
            <h1 className="display-title center">Payment config missing</h1>
            <p className="muted center" style={{ marginTop: 8 }}>
              Set <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> in your environment.
            </p>
            <div className="center" style={{ marginTop: 12 }}>
              <a className="btn" href="/campaigns/hempin-launch">← Back to campaign</a>
            </div>
          </section>
        </main>
      )
    }
    // In prod, just send back to campaign
    redirect('/campaigns/hempin-launch')
  }

  const PAYPAL_ENV = (process.env.NEXT_PUBLIC_PAYPAL_ENV || 'sandbox').toLowerCase() // 'live' or 'sandbox'

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <section className="hemp-panel auth-card p-6 md:p-8" style={{ paddingTop: 18 }}>
        <div className="center">
          <p className="eyebrow">Hemp’in Funding · Payment</p>
          <h1 className="display-title">Complete your pledge</h1>
          <div className="cta-scanline" aria-hidden />
        </div>

        {/* Summary */}
        <div style={{ marginTop: 14 }}>
          <div className="glassish" style={{
            display:'grid', gap:8, padding:12,
            borderRadius:12,
            background:'rgba(255,255,255,.035)',
            border:'1px solid rgba(255,255,255,.08)'
          }}>
            <Row label="Campaign" value="Hemp’in Launch (LIFE)" />
            <Row label="Tier" value={label} />
            <Row label="Amount" value={`$${amount.toFixed(2)} USD`} />
            <Row label="Signed in" value={user.email || '—'} />
          </div>

          <p className="muted" style={{ marginTop: 10, fontSize: '.9rem', textAlign:'center' }}>
            Your payment is processed securely by PayPal. You’ll receive the
            <b> Early Backer</b> badge and your <b>Multipass</b> will activate after payment clears.
          </p>
        </div>

        {/* PayPal Buttons */}
        <div style={{ marginTop: 16 }}>
          <PayPalButtonsClient
            amount={amount}
            tierKey={tierKey}
            label={label}
            env={PAYPAL_ENV}
            clientId={PAYPAL_CLIENT_ID}
            origin={origin}
          />
        </div>

        {/* Footer actions */}
        <div className="center" style={{ marginTop: 12 }}>
          <a className="btn ghost" href={`/campaigns/hempin-launch?tier=${encodeURIComponent(tierKey || 'voyager')}`}>
            ← Back to campaign
          </a>
        </div>

        <p className="muted center" style={{ marginTop: 10, fontSize: '.8rem' }}>
          By pledging you agree to our funding terms and understand this is a contribution to support
          software and community development at Hemp’in.
        </p>
      </section>
    </main>
  )
}

// Small display row
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rowish" style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:12 }}>
      <span className="muted" style={{ opacity:.9 }}>{label}</span>
      <span style={{ fontWeight:700 }}>{value}</span>
    </div>
  )
}

// ---- Client: PayPal Buttons Loader + handlers ----
'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    paypal?: any
  }
}

function PayPalButtonsClient({
  amount,
  tierKey,
  label,
  env,
  clientId,
  origin,
}: {
  amount: number
  tierKey?: string
  label: string
  env: 'sandbox' | 'live' | string
  clientId: string
  origin: string
}) {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const orderIdRef = useRef<string | null>(null)
  const pledgeIdRef = useRef<string | null>(null)

  // Load SDK (once)
  useEffect(() => {
    if (window.paypal) { setReady(true); return }
    const script = document.createElement('script')
    const params = new URLSearchParams({
      'client-id': clientId,
      currency: 'USD',
      intent: 'capture',
      commit: 'true',
      components: 'buttons',
      'enable-funding': 'paypal,venmo,card',
    })
    // Sandbox vs Live
    if (env === 'sandbox') params.set('buyer-country', 'US') // optional helpful hint

    script.src = `https://www.paypal.com/sdk/js?${params.toString()}`
    script.async = true
    script.onload = () => setReady(true)
    script.onerror = () => setError('Failed to load payment SDK.')
    document.body.appendChild(script)
  }, [clientId, env])

  // Render buttons when ready
  useEffect(() => {
    if (!ready || !containerRef.current || !window.paypal) return

    // Clear any previous renders (navigating back/forward)
    containerRef.current.innerHTML = ''

    const buttons = window.paypal.Buttons({
      style: {
        layout: 'vertical',
        shape: 'rect',
        label: 'pay',
        height: 45,
      },

      createOrder: async (_: any, actions: any) => {
        setError(null)
        // (A) Ask our API to create/record the pledge intent (optional but recommended)
        try {
          const res = await fetch('/api/pledge/intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              campaign: 'hempin-launch',
              tier: tierKey || 'custom',
              label,
              currency: 'USD',
              amount,
              returnTo: `${origin}/campaigns/hempin-launch`,
            }),
          })
          const j = await res.json()
          if (res.ok && j.ok && j.pledgeId) {
            pledgeIdRef.current = j.pledgeId as string
          }
        } catch {
          // Non-blocking; we still let PayPal create the order
        }

        // (B) Create the PayPal order
        return actions.order.create({
          purchase_units: [
            {
              description: `Hemp’in Launch · ${label}`,
              amount: { value: amount.toFixed(2), currency_code: 'USD' },
            },
          ],
          application_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            brand_name: 'Hemp’in',
            return_url: `${origin}/campaigns/hempin-launch`,
            cancel_url: `${origin}/campaigns/hempin-launch`,
          },
        })
      },

      onApprove: async (_: any, actions: any) => {
        try {
          const details = await actions.order.capture()
          orderIdRef.current = details?.id || null

          // Notify our server to finalize the pledge
          try {
            await fetch('/api/pledge/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                pledgeId: pledgeIdRef.current,
                orderId: details?.id,
                status: details?.status,
                amount: details?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value,
                raw: details,
              }),
            })
          } catch {}

          // UX: send back to campaign with success flag
          window.location.href = `/campaigns/hempin-launch?pledge=ok`
        } catch (e: any) {
          setError(e?.message || 'Payment failed to capture.')
        }
      },

      onCancel: () => {
        window.location.href = `/campaigns/hempin-launch?pledge=cancel`
      },

      onError: (err: any) => {
        console.error('[PayPal] error', err)
        setError('Payment error. Please try again.')
      },
    })

    if (buttons.isEligible()) {
      buttons.render(containerRef.current)
    } else {
      setError('PayPal is not available for your browser/region.')
    }

    return () => {
      try { buttons.close() } catch {}
    }
  }, [ready, amount, label, origin, tierKey])

  return (
    <div>
      <div ref={containerRef} />
      {error && (
        <div className="muted" style={{ marginTop: 10, color: '#fecaca', textAlign:'center', fontSize: '.9rem' }}>
          {error}
        </div>
      )}
      <p className="muted center" style={{ marginTop: 10, fontSize: '.8rem', opacity:.8 }}>
        {env === 'live' ? 'Live payments enabled' : 'Sandbox mode'}
      </p>
    </div>
  )
}