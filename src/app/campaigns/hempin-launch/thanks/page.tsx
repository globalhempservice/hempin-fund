// src/app/campaigns/hempin-launch/thanks/page.tsx
import Link from 'next/link'
import { createServerClientSupabase } from '@/lib/supabase/server'

type PageProps = {
  searchParams?: { pledge?: string }
}

function fmtCurrency(n: number | null | undefined, currency: string | null | undefined) {
  if (!n) return null
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(n)
  } catch {
    return `$${n.toFixed(2)}`
  }
}

export const dynamic = 'force-dynamic'

export default async function ThanksPage({ searchParams }: PageProps) {
  const pledgeId = (searchParams?.pledge || '').trim()
  let amount: number | null = null
  let currency: string | null = 'USD'
  let tierKey: string | null = null

  if (pledgeId) {
    try {
      const supabase = createServerClientSupabase()
      const { data } = await supabase
        .from('pledges')
        .select('amount, currency, tier_key')
        .eq('id', pledgeId)
        .maybeSingle()

      amount = data?.amount ?? null
      currency = (data?.currency as string) || 'USD'
      tierKey = (data?.tier_key as string) || null
    } catch {
      // non-blocking; we still show a generic thank-you
    }
  }

  const pretty = fmtCurrency(amount, currency)

  return (
    <main className="min-h-screen grid place-items-center px-4 py-10">
      <section className="hemp-panel auth-card" style={{ padding: 24 }}>
        <div className="center" style={{ maxWidth: 660, margin: '0 auto' }}>
          <p className="eyebrow">Hemp’in Fund</p>
          <h1 className="display-title">Thank you for backing our launch</h1>
          <div className="cta-scanline" aria-hidden />

          <p className="muted" style={{ marginTop: 12 }}>
            Engines humming — your pledge is locked in. We’re fueling the next features, modules,
            and community tools across the hemp universe.
          </p>

          {/* Highlighted pledge summary */}
          <div
            className="glass-card"
            style={{
              margin: '16px auto 0',
              padding: 14,
              maxWidth: 520,
              borderRadius: 12,
            }}
          >
            <div className="row" style={{ justifyContent: 'center', gap: 10 }}>
              <div>
                <div style={{ opacity: 0.85, fontSize: '.9rem' }}>Pledge</div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>
                  {pretty ? pretty : 'Confirmed'}
                </div>
              </div>
              {tierKey && (
                <div className="pill" style={{ marginLeft: 8 }}>
                  Tier: <b style={{ marginLeft: 6 }}>{tierKey}</b>
                </div>
              )}
              {pledgeId && (
                <div className="pill" style={{ marginLeft: 8 }}>
                  Ref: <code style={{ opacity: 0.9 }}>{pledgeId.slice(0, 8)}…</code>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="row" style={{ justifyContent: 'center', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            {/* Primary: back to campaign */}
            <Link href="/campaigns/hempin-launch" className="btn primary thruster">
              Back to campaign
            </Link>

            {/* Secondary: view my pledge (placeholder for future pledge details page) */}
            {pledgeId ? (
              <Link
                href={`/pledges/${encodeURIComponent(pledgeId)}`}
                className="btn"
                aria-disabled
                onClick={(e) => {
                  // If you don’t have this page yet, prevent navigation
                  e.preventDefault()
                }}
                title="Coming soon"
              >
                View my pledge (soon)
              </Link>
            ) : null}

            {/* Share button (Web Share API + fallback) */}
            <button
              className="btn"
              onClick={async () => {
                const shareUrl = typeof window !== 'undefined'
                  ? `${window.location.origin}/campaigns/hempin-launch`
                  : 'https://fund.hempin.org/campaigns/hempin-launch'

                const text = `I just backed Hemp’in’s launch on fund.hempin.org — join me?`
                try {
                  if (navigator.share) {
                    await navigator.share({ title: 'Hemp’in Launch', text, url: shareUrl })
                  } else {
                    await navigator.clipboard.writeText(`${text} ${shareUrl}`)
                    alert('Link copied — thanks for sharing!')
                  }
                } catch {
                  try {
                    await navigator.clipboard.writeText(`${text} ${shareUrl}`)
                    alert('Link copied — thanks for sharing!')
                  } catch {
                    // ignore
                  }
                }
              }}
            >
              Share
            </button>
          </div>

          {/* Micro footnote */}
          <p className="muted" style={{ marginTop: 12, fontSize: '.9rem' }}>
            Your <b>Early Backer</b> multipass will activate as we roll out features. We’ll email updates.
          </p>
        </div>
      </section>
    </main>
  )
}