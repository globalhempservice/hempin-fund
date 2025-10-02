// src/components/fund/FeaturedCampaign.tsx
import Image from 'next/image';
import { createServerClientReadOnly } from '@/lib/supabase/server';

type Status = 'upcoming' | 'live' | 'closed';

type Props = {
  slug: string;                     // ← campaign slug to fetch totals
  eyebrow?: string;
  title: string;
  blurb: string;
  href: string;
  cta?: string;
  image?: { src: string; alt: string };
  status?: Status;
  meta?: string[];                  // static chips like dates
  currency?: string;                // default "USD"
};

// Small helper
function fmtCurrency(n: number, ccy = 'USD') {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: ccy, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n).toLocaleString()}`;
  }
}

const STATUS_COPY: Record<Status, string> = { upcoming: 'UPCOMING', live: 'LIVE', closed: 'CLOSED' };

// Server component (async) pulls live totals via RPC
export default async function FeaturedCampaign({
  slug,
  eyebrow = 'Featured campaign',
  title,
  blurb,
  href,
  cta = 'Visit campaign',
  image,
  status,
  meta = [],
  currency = 'USD',
}: Props) {
  const supa = createServerClientReadOnly();

  // Aggregate totals (RLS-safe RPC)
  const { data: totalsRaw, error } = await supa.rpc('campaign_totals', { slug }).single();
  if (error) console.error('FeaturedCampaign: campaign_totals failed', error);

  // Normalize numbers
  const totals   = (totalsRaw as { goal: number | null; raised: number | null; backers: number | null } | null) ?? null;
  const goal     = Number(totals?.goal ?? 20000);
  const raised   = Number(totals?.raised ?? 0);
  const backers  = Number(totals?.backers ?? 0);
  const pct      = goal > 0 ? Math.max(0, Math.min(100, Math.round((raised / goal) * 100))) : 0;

  const chips = [...meta, `${backers} backer${backers === 1 ? '' : 's'}`];

  return (
    <section className="section" id="featured">
      <div className="container">
        <div className="center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="display-title hemp-underline-aurora">{title}</h2>
        </div>

        <article className="hemp-panel" style={{ marginTop: 16, padding: 0, overflow: 'hidden' }}>
          {/* Banner */}
          <div style={{ position: 'relative', height: 220 }}>
            {image ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 960px) 920px, 100vw"
                style={{ objectFit: 'cover' }}
                priority={false}
              />
            ) : (
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(120deg, rgba(236,72,153,.22), rgba(96,165,250,.18) 52%, rgba(110,231,183,.14))',
                }}
              />
            )}

            {/* overlay */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,.25), rgba(0,0,0,0) 28%, rgba(0,0,0,.35))',
              }}
            />

            {status && (
              <span
                style={{
                  position: 'absolute',
                  left: 12,
                  top: 12,
                  padding: '6px 10px',
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: '.8rem',
                  background:
                    status === 'live'
                      ? 'rgba(34,197,94,.18)'
                      : status === 'upcoming'
                      ? 'rgba(59,130,246,.18)'
                      : 'rgba(148,163,184,.18)',
                  border:
                    status === 'live'
                      ? '1px solid rgba(34,197,94,.35)'
                      : status === 'upcoming'
                      ? '1px solid rgba(59,130,246,.35)'
                      : '1px solid rgba(148,163,184,.30)',
                  backdropFilter: 'blur(6px)',
                }}
              >
                {STATUS_COPY[status]}
              </span>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: 16 }}>
            <p className="muted center" style={{ maxWidth: 760, margin: '0 auto' }}>
              {blurb}
            </p>

            {/* chips */}
            {chips.length > 0 && (
              <div className="pipeline" style={{ justifyContent: 'center', marginTop: 10 }}>
                {chips.map((m, i) => (
                  <span key={i} className="pill">{m}</span>
                ))}
              </div>
            )}

            {/* live progress */}
            {goal > 0 && (
              <div style={{ maxWidth: 560, margin: '14px auto 0' }}>
                <div
                  aria-hidden
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: 'rgba(255,255,255,.06)',
                    border: '1px solid rgba(255,255,255,.08)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
                    }}
                  />
                </div>
                <div className="muted" style={{ marginTop: 6, textAlign: 'center', fontSize: '.9rem' }}>
                  {fmtCurrency(raised, currency)} raised of {fmtCurrency(goal, currency)} · {pct}%
                </div>
              </div>
            )}

            <div className="center" style={{ marginTop: 14 }}>
              <a href={href} className="btn primary thruster">
                {cta}
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}