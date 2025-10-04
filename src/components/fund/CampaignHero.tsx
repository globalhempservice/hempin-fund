'use client';
import * as React from 'react';

// tiny local formatter (same style as page)
function format(n: number) {
  try { return Number(n).toLocaleString('en-US'); } catch { return String(n); }
}

type Category = { key: string; label: string; hue: number; icon: React.ReactNode };

type CampaignHeroProps = {
  title: string;
  subtitle: string;
  raised: number;
  goal: number;
  backers: number;
  startISO: string;
  endISO: string;
  live?: boolean;
};

const fmtDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(iso));
  } catch { return iso; }
};

export default function CampaignHero(props: CampaignHeroProps) {
  const { title, subtitle, raised, goal, backers, startISO, endISO, live = true } = props;
  const pct = Math.min(100, Math.round((raised / Math.max(1, goal)) * 100));
  const now = new Date();
  const end = new Date(endISO);
  const dayMs = 24 * 60 * 60 * 1000;
  const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / dayMs));

  // Category chips (reuse style from site; simple emoji placeholders you can swap to your Orb icons)
  const categories: Category[] = [
    { key: 'fashion',     label: 'Fashion',     hue: 345, icon: <span>🧥</span> },
    { key: 'cosmetics',   label: 'Cosmetics',   hue: 285, icon: <span>💄</span> },
    { key: 'home',        label: 'Home',        hue: 155, icon: <span>🏠</span> },
    { key: 'construction',label: 'Construction',hue: 35,  icon: <span>🏗️</span> },
    { key: 'food',        label: 'Food',        hue: 10,  icon: <span>🥣</span> },
    { key: 'bioplastics', label: 'Bioplastics', hue: 200, icon: <span>♻️</span> },
    { key: 'paper',       label: 'Paper',       hue: 40,  icon: <span>📄</span> },
    { key: 'textiles',    label: 'Textiles',    hue: 260, icon: <span>🧵</span> },
  ];

  return (
    <header
      className="hemp-panel"
      style={{ marginTop: 12, padding: 16, display: 'grid', gap: 12, textAlign: 'center' }}
    >
      {/* Top meta row */}
      <div className="row" style={{ justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
        {live && (
          <span className="pill" style={{
            background: 'linear-gradient(90deg,#22c55e,#4ade80)',
            color: '#05120e', fontWeight: 800, boxShadow: '0 0 20px rgba(34,197,94,.25)'
          }}>
            LIVE
          </span>
        )}
        <span className="pill">{fmtDate(startISO)} → {fmtDate(endISO)}</span>
        <span className="pill muted">{daysLeft} day{daysLeft === 1 ? '' : 's'} left</span>
      </div>

      <p className="eyebrow">Hemp’in — Launch Campaign</p>
      <h1 className="display-title hemp-underline-aurora">{title}</h1>
      <p className="lede" style={{ margin: '6px auto 0', maxWidth: 720 }}>
        {subtitle}
      </p>

      {/* Progress */}
      <div style={{ marginTop: 4 }}>
        <div className="hemp-panel" style={{ padding: 10, background: 'rgba(255,255,255,.035)', borderColor: 'rgba(255,255,255,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
            <strong style={{ letterSpacing: '.01em' }}>
              ${format(raised)} raised
            </strong>
            <span className="muted" style={{ fontSize: '.95rem' }}>
              Goal: ${format(goal)}
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label="Campaign progress"
            style={{
              marginTop: 8,
              height: 10,
              borderRadius: 999,
              background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.12)',
              overflow: 'hidden',
            }}
          >
            <span
              aria-hidden
              style={{
                display: 'block',
                height: '100%',
                width: `${pct}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
                transition: 'width .25s ease'
              }}
            />
          </div>
          <div className="muted" style={{ marginTop: 6, fontSize: '.92rem', textAlign: 'right' }}>
            {pct}% funded • {backers} backer{backers === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ marginTop: 2 }}>
        <div className="row" style={{ justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <span key={c.key}
              className="pill"
              style={{
                display:'inline-flex', alignItems:'center', gap:8,
                boxShadow:'0 0 0 1px rgba(255,255,255,.06) inset',
              }}>
              <span
                aria-hidden
                style={{
                  width:18, height:18, display:'grid', placeItems:'center',
                  borderRadius:6,
                  background:`radial-gradient(circle at 40% 40%, #fff 0 40%, hsl(${c.hue} 80% 65% / .35) 42% 80%, transparent 82%)`,
                  boxShadow:`0 0 10px hsl(${c.hue} 80% 65% / .35)`
                }}
              >
                <span style={{ fontSize:12, lineHeight:1 }}>{c.icon}</span>
              </span>
              <span style={{ fontWeight:700 }}>{c.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="hero .cta-row" style={{ padding: 0, margin: 0 }}>
        <a className="btn primary thruster" href="#tiers">
          Participate & Support
        </a>
      </div>
    </header>
  );
}