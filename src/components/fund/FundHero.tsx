'use client';

import { useState } from 'react';

export default function FundHero() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle'|'loading'|'ok'|'err'>('idle');
  const [msg, setMsg] = useState<string>('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState('loading');
    setMsg('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: 'LIFE', source: 'fund.hempin.org#herocta' }),
      });
      const j = await res.json();
      if (res.ok && j.ok) {
        setState('ok');
        setMsg('You’re in. We’ll email you when new campaigns dock.');
        setEmail('');
      } else {
        setState('err');
        setMsg(j?.error || 'Something went wrong. Try again?');
      }
    } catch {
      setState('err');
      setMsg('Network hiccup. Please try again.');
    }
  }

  return (
    <section className="hero">
      <div className="container center" style={{ position:'relative', zIndex:2, paddingTop: 8 }}>
        <p className="eyebrow">What is Hemp’in Fund?</p>
        <h1 className="display-title hemp-underline-aurora">Crowdfunding for the hemp universe</h1>

        <p className="lede" style={{ marginTop: 12 }}>
          Back fashion capsules, regenerative farms, R&amp;D, and core software. One nebula for makers and supporters.
        </p>

        {/* Email CTA */}
        <form onSubmit={onSubmit} className="cta-row" style={{ marginTop: 16, gap: 10 }}>
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            placeholder="you@planetmail.com"
            className="input"
            aria-label="Email address"
            style={{
              minWidth: 260,
              padding: '10px 12px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,.12)',
              background: 'rgba(255,255,255,.06)',
            }}
          />
          <button className="btn primary thruster" disabled={state==='loading'} type="submit">
            {state==='loading' ? 'Joining…' : 'Get campaign updates'}
          </button>
          <a className="btn ghost" href="https://hempin.org" target="_blank" rel="noopener noreferrer">
            Learn about Hempin.org ↗
          </a>
        </form>

        {msg && (
          <div className="muted" style={{ marginTop: 8, opacity: state==='err' ? 1 : .9 }}>
            {msg}
          </div>
        )}
      </div>

      {/* subtle pink glow for Fund */}
      <div className="hero-glow fund" aria-hidden />
    </section>
  );
}