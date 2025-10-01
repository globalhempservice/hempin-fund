// src/components/fund/FeaturedCampaign.tsx
import Image from 'next/image';

type Status = 'upcoming' | 'live' | 'closed';

type Props = {
  eyebrow?: string;                 // small label above title
  title: string;                    // campaign name
  blurb: string;                    // short description
  href: string;                     // CTA link
  cta?: string;                     // CTA label (default: "Visit campaign")
  image?: { src: string; alt: string }; // optional banner
  status?: Status;                  // shows a pill on the image
  meta?: string[];                  // little chips under the blurb
  raised?: number;                  // optional progress bar (raised / goal)
  goal?: number;
  currency?: string;                // default "USD"
};

const STATUS_COPY: Record<Status, string> = {
  upcoming: 'UPCOMING',
  live: 'LIVE',
  closed: 'CLOSED',
};

export default function FeaturedCampaign({
  eyebrow = 'Featured campaign',
  title,
  blurb,
  href,
  cta = 'Visit campaign',
  image,
  status,
  meta = [],
  raised,
  goal,
  currency = 'USD',
}: Props) {
  const showProgress = typeof raised === 'number' && typeof goal === 'number' && goal > 0;
  const pct = showProgress ? Math.max(0, Math.min(100, Math.round((raised! / goal!) * 100))) : 0;

  return (
    <section className="section" id="featured">
      <div className="container">
        {/* Heading sits OUTSIDE the card, like the Launch section */}
        <div className="center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="display-title hemp-underline-aurora">{title}</h2>
        </div>

        {/* Card */}
        <article className="hemp-panel" style={{ marginTop: 16, padding: 0, overflow: 'hidden' }}>
          {/* Banner (optional) */}
          <div style={{ position: 'relative', height: 220 }}>
            {image ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={false}
                sizes="(min-width: 960px) 920px, 100vw"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              // graceful placeholder gradient if no image provided
              <div
                style={{
                  position: 'absolute', inset: 0,
                  background:
                    'linear-gradient(120deg, rgba(236,72,153,.22), rgba(96,165,250,.18) 52%, rgba(110,231,183,.14))',
                }}
                aria-hidden
              />
            )}

            {/* subtle top overlay + bottom fade for legibility */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, rgba(0,0,0,.25), rgba(0,0,0,0) 28%, rgba(0,0,0,.35))',
              }}
            />

            {/* status pill */}
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

            {/* meta chips */}
            {meta.length > 0 && (
              <div className="pipeline" style={{ justifyContent: 'center', marginTop: 10 }}>
                {meta.map((m, i) => (
                  <span key={i} className="pill">{m}</span>
                ))}
              </div>
            )}

            {/* progress */}
            {showProgress && (
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
                  {fmtCurrency(raised!, currency)} raised of {fmtCurrency(goal!, currency)} · {pct}%
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

/* ---------- helpers ---------- */
function fmtCurrency(n: number, ccy = 'USD') {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: ccy, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n).toLocaleString()}`;
  }
}