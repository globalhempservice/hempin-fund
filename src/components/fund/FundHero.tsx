// src/components/fund/FundHero.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import EmailCTA from '@/components/EmailCTA';

type Mode = 'LIFE' | 'WORK';

export default function FundHero() {
  const [mode, setMode] = useState<Mode>('LIFE');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setMode('LIFE');
      if (e.key === 'ArrowRight') setMode('WORK');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const CARDS = useMemo(() => {
    if (mode === 'LIFE') {
      return [
        'Back Hemp’in software modules',
        'Invest in regenerative farms',
        'Group-fund a fashion capsule',
        'Reserve regional hempcrete drops',
      ];
    }
    return [
      'Run your crowdfunding campaign',
      'Own a custom funding page',
      'Finance your next season',
      'Show milestones & receipts (WETAS)',
    ];
  }, [mode]);

  return (
    <section className="hero">
      <div className="container center" style={{ position: 'relative', zIndex: 2, paddingTop: 8 }}>
        <p className="eyebrow" style={{ letterSpacing: '0.22em' }}>What is Hemp’in Fund?</p>
        <h1 className="display-title hemp-underline-aurora">Crowdfunding for the hemp universe</h1>

        <p className="lede" style={{ marginTop: 12 }}>
          Hemp’in Fund is the launchpad where the hemp ecosystem gets funded. From farms and labs to
          design studios and open tools—anyone can run a campaign here. Every pledge strengthens a
          living network where hemp knowledge, products, and culture thrive.
        </p>

        {/* LIFE / WORK toggle */}
        <div className="mode-toggle" role="tablist" aria-label="Choose audience">
          <button
            role="tab"
            aria-selected={mode === 'LIFE'}
            className={`mode-pill ${mode === 'LIFE' ? 'is-active' : ''}`}
            onClick={() => setMode('LIFE')}
          >
            LIFE
          </button>
          <button
            role="tab"
            aria-selected={mode === 'WORK'}
            className={`mode-pill ${mode === 'WORK' ? 'is-active' : ''}`}
            onClick={() => setMode('WORK')}
          >
            WORK
          </button>

          {/* sliding visor */}
          <span className={`mode-indicator ${mode.toLowerCase()}`} aria-hidden />
        </div>

        {/* Mini cards */}
        <div className="cards-grid" aria-live="polite">
          {CARDS.map((label) => (
            <div key={label} className="mini-card hemp-panel">
              <div className="mini-title">{label}</div>
            </div>
          ))}
        </div>

        {/* small line above CTA */}
        <p className="muted" style={{ marginTop: 12 }}>
          Get updates about new features and upcoming campaigns.
        </p>

        {/* CTA row */}
        <div className="cta-row" style={{ marginTop: 10, justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div className="inline-flex gap-2" style={{ alignItems: 'center' }}>
            {/* Use pink theme for the button */}
            <EmailCTA role="LIFE" source="fund.hempin.org#fundHero" variant="fund" />
          </div>
        </div>
      </div>

      {/* background glow */}
      <div className="hero-glow" aria-hidden />

      {/* Scoped styles */}
      <style jsx>{`
        /* ===== Toggle ===== */
        .mode-toggle{
          position: relative;
          display: inline-grid;
          grid-auto-flow: column;
          gap: 8px;
          padding: 6px;                  /* outer padding evenly on both sides */
          margin: 18px auto 10px;
          border-radius: 999px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.10);
        }
        .mode-pill{
          position: relative;
          z-index: 2;
          padding: 8px 16px;             /* inner padding */
          border-radius: 999px;
          border: 0;
          background: transparent;
          color: inherit;
          font-weight: 800;
          letter-spacing: .02em;
          cursor: pointer;
        }
        .mode-pill.is-active{ color: #fff; }
        .mode-indicator{
          position: absolute;
          z-index: 1;
          top: 6px; bottom: 6px;
          left: 6px;                      /* ensures equal side padding */
          width: calc(50% - 6px);         /* accounts for left padding */
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(236,72,153,.22), rgba(236,72,153,.10));
          border: 1px solid rgba(236,72,153,.35);
          transition: transform .22s ease;
        }
        .mode-indicator.life{ transform: translateX(0); }
        .mode-indicator.work{ transform: translateX(calc(100% + 6px)); } /* +6px equals right padding */

        /* ===== Cards: 1 → 2 → 4 columns ===== */
        .cards-grid{
          display: grid;
          gap: 10px;
          margin-top: 12px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px){  /* tablet */
          .cards-grid{ grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 980px){  /* desktop */
          .cards-grid{ grid-template-columns: repeat(4, 1fr); }
        }
        .mini-card{
          padding: 12px;
          text-align: left;
          background: rgba(255,255,255,.05);
          border-color: rgba(255,255,255,.10);
          transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
        }
        .mini-card:hover{
          transform: translateY(-2px);
          border-color: rgba(236,72,153,.35);
          box-shadow: 0 10px 24px rgba(0,0,0,.30), 0 0 16px rgba(236,72,153,.18);
        }
        .mini-title{ font-weight: 700; letter-spacing: .01em; }
      `}</style>
    </section>
  );
}