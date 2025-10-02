// src/components/fund/FundHero.tsx
'use client';

import { useState } from 'react';

export default function FundHero() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'ok'|'err'|'loading'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    try {
      setStatus('loading');
      // simple POST to our fund API (we can swap to Supabase directly later)
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role: 'LIFE',
          source: 'fund.hempin.org#herocta',
        }),
      });
      const j = await res.json();
      setStatus(res.ok && j?.ok ? 'ok' : 'err');
    } catch {
      setStatus('err');
    }
  }

  return (
    <section className="hero">
      <div className="container center" style={{ position: 'relative', zIndex: 2, paddingTop: 8 }}>
        <p className="eyebrow" style={{ letterSpacing: '0.22em' }}>What is Hemp’in Fund?</p>
        <h1 className="display-title hemp-underline-aurora">Crowdfunding for the hemp universe</h1>

        <p className="lede" style={{ marginTop: 12 }}>
          Back fashion capsules, regenerative farms, R&amp;D, and open software. One nebula for
          creators and communities to fund what moves hemp forward.
        </p>

        {/* CTA row */}
        <div className="cta-row" style={{ marginTop: 16, justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* email capture */}
          <form onSubmit={onSubmit} className="inline-flex gap-2" style={{ alignItems: 'center' }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,.14)',
                background: 'rgba(255,255,255,.04)',
                minWidth: 220,
              }}
            />
            <button type="submit" className="btn primary thruster" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending…' : 'Get campaign updates'}
            </button>
          </form>

          
        </div>

        {/* tiny success/error */}
        {status === 'ok' && (
          <div className="muted" style={{ marginTop: 8, opacity: .9 }}>
            Thanks! We’ll keep you posted.
          </div>
        )}
        {status === 'err' && (
          <div className="muted" style={{ marginTop: 8, color: '#fecaca' }}>
            Oops — couldn’t save your email. Try again?
          </div>
        )}
      </div>

      {/* background glow */}
      <div className="hero-glow" aria-hidden />
    </section>
  );
}