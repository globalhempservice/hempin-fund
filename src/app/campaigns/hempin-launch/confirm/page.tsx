// src/app/campaigns/hempin-launch/confirm/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Orb from '../../../../ui/organisms/Orb';

type TierKey = 'seed' | 'sprout' | 'stem' | 'field';
const TIER_MAP: Record<TierKey, { title: string; amount: number }> = {
  seed:   { title: 'Seed',   amount: 20 },
  sprout: { title: 'Sprout', amount: 50 },
  stem:   { title: 'Stem',   amount: 100 },
  field:  { title: 'Field',  amount: 500 },
};

const CAMPAIGN_SLUG = 'hempin-launch';
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID; // set in env (sandbox or live)

/** Tiny leaf “+1” pop and counter (the pop anchors to the wrapper via ref) */
function LeafCounter({ count, anchorRef }: { count: number; anchorRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div ref={anchorRef} className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs">
      <span className="opacity-80">Leaf XP</span>
      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-300">+{count}</span>
    </div>
  );
}

export default function ConfirmPage() {
  // ── Parse tier from query
  const params = useMemo(
    () => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''),
    []
  );
  const tierKey = (params.get('tier') as TierKey) || 'seed';
  const tier = TIER_MAP[tierKey] ?? TIER_MAP.seed;

  // ── UX state
  const [email, setEmail] = useState('');
  const [xp, setXp] = useState(0);
  const [status, setStatus] = useState<null | { type: 'info'|'error'|'success'; msg: string }>(null);
  const [paypalReady, setPaypalReady] = useState(false);
  const [mountingButtons, setMountingButtons] = useState(false);
  const paypalDivRef = useRef<HTMLDivElement>(null);

  // Anchor for leaf pops (center top)
  const counterRef = useRef<HTMLDivElement>(null);

  // ── Add a floating “+1 leaf” effect when milestones happen (anchored + slower)
  const spawnLeafBurst = () => {
    setXp((n) => n + 1);
    const host = counterRef.current;
    if (!host) return;

    const node = document.createElement('div');
    node.textContent = '+1 🌿';
    node.className =
      'pointer-events-none absolute left-1/2 -translate-x-1/2 text-emerald-300 text-xs animate-[leafPopSlow_1400ms_ease-out_forwards]';
    // start just above the counter chip
    node.style.top = '-4px';
    host.appendChild(node);
    setTimeout(() => node.remove(), 1450);
  };

  // CSS keyframes for the slower pop, scoped once
  useEffect(() => {
    const id = 'leafPopSlowKF';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes leafPopSlow {
        0%   { opacity: 0; transform: translate(-50%, 0) scale(.92) }
        12%  { opacity: .95 }
        100% { opacity: 0; transform: translate(-50%, -28px) scale(1.06) }
      }
    `;
    document.head.appendChild(style);
  }, []);

  // ── Load PayPal JS SDK (client-side)
  useEffect(() => {
    if (!PAYPAL_CLIENT_ID) {
      setStatus({ type: 'error', msg: 'PayPal client ID missing. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID.' });
      return;
    }
    if ((window as any).paypal) {
      setPaypalReady(true);
      spawnLeafBurst();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      PAYPAL_CLIENT_ID
    )}&currency=USD&intent=capture`;
    script.async = true;
    script.onload = () => {
      setPaypalReady(true);
      spawnLeafBurst();
    };
    script.onerror = () => {
      setStatus({ type: 'error', msg: 'Failed to load PayPal SDK.' });
    };
    document.body.appendChild(script);
  }, []);

  // ── Mount PayPal Buttons once ready
  useEffect(() => {
    if (!paypalReady || mountingButtons) return;
    const container = paypalDivRef.current;
    if (!container) return;

    const paypal: any = (window as any).paypal;
    if (!paypal?.Buttons) return;

    setMountingButtons(true);
    container.innerHTML = '';

    const emailOk = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const buttons = paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'pill', label: 'paypal' },
      onInit: (_data: any, actions: any) => {
        if (!emailOk()) actions.disable();
        const handler = () => (emailOk() ? actions.enable() : actions.disable());
        const input = document.getElementById('email-input');
        input?.addEventListener('input', handler);
      },
      createOrder: async (_data: any, _actions: any) => {
        return _actions.order.create({
          purchase_units: [
            {
              description: `Hempin Launch — ${tier.title} tier`,
              amount: { value: tier.amount.toFixed(2), currency_code: 'USD' },
            },
          ],
        });
      },
      onApprove: async (_data: any, actions: any) => {
        try {
          const details = await actions.order.capture();
          // celebrate a bit
          spawnLeafBurst();
          setTimeout(spawnLeafBurst, 120); // second soft pop
          setStatus({ type: 'info', msg: 'Payment captured. Recording your support…' });

          // Best-effort record (safe even if API isn’t ready)
          try {
            await fetch('/api/pledge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                campaignSlug: CAMPAIGN_SLUG,
                amount: tier.amount,
                currency: 'USD',
                email,
                tierKey, // human key; server maps to UUID
                paypalCaptureId: details?.id,
              }),
            });
          } catch {}

          setStatus({ type: 'success', msg: 'Thank you! Your contribution is recorded.' });
          // Later: redirect to hempin.org/profile?activated=fund
        } catch (e: any) {
          setStatus({ type: 'error', msg: e?.message ?? 'Payment failed. Please try again.' });
        }
      },
      onError: (err: any) => {
        setStatus({ type: 'error', msg: err?.message ?? 'PayPal error. Please try again.' });
      },
    });

    buttons.render(container).catch(() => {
      setStatus({ type: 'error', msg: 'Failed to render PayPal buttons.' });
    });

    return () => {
      try { buttons.close?.(); } catch {}
      setMountingButtons(false);
    };
  }, [paypalReady, email, tier.amount, tier.title, tierKey]);

  // ── Email validation side-effect: +1 on first valid entry
  const [emailedOnce, setEmailedOnce] = useState(false);
  useEffect(() => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (ok && !emailedOnce) {
      spawnLeafBurst();
      setEmailedOnce(true);
    }
  }, [email, emailedOnce]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden">
      {/* Even bigger background orb than the tier page */}
      <Orb className="absolute inset-0 scale-[1.7] md:scale-[2.2]" />

      {/* Top: Leaf counter centered, back link under it */}
      <div className="relative z-10 w-full max-w-5xl mb-6">
        <div className="flex justify-center">
          <LeafCounter count={xp} anchorRef={counterRef} />
        </div>
        <a
          href="/campaigns/hempin-launch"
          className="mt-2 inline-block text-xs opacity-85 hover:opacity-100 underline underline-offset-4"
        >
          ← Back to campaign page
        </a>
      </div>

      <section className="relative z-10 mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs opacity-70 mb-2">Confirm your support</p>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {TIER_MAP[tierKey]?.title ?? 'Seed'} — ${tier.amount}
        </h1>
        <p className="mt-2 text-sm opacity-80">
          Your contribution powers the Hempin Launch. Enter your email and pay securely with PayPal.
        </p>

        {/* Email */}
        <div className="mt-6 text-left">
          <label htmlFor="email-input" className="text-sm">Email</label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-white/15 bg-zinc-900/60 px-3 py-2 outline-none"
            placeholder="you@domain.com"
            autoComplete="email"
            inputMode="email"
            required
          />
          <p className="mt-1 text-xs opacity-60">
            We’ll send your receipt and perks to this address.
          </p>
        </div>

        {/* PayPal */}
        <div className="mt-8">
          {!PAYPAL_CLIENT_ID ? (
            <div className="rounded-md border border-white/15 bg-rose-500/10 p-3 text-rose-200 text-sm">
              PayPal is not configured. Set <code>NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> in your
              environment (sandbox or live), then reload.
            </div>
          ) : (
            <div>
              <div ref={paypalDivRef} className="inline-block" />
              <p className="mt-2 text-xs opacity-60">
                You’ll be charged <strong>${tier.amount.toFixed(2)}</strong> (USD).
              </p>
            </div>
          )}
        </div>

        {status && (
          <div
            className={`mt-6 rounded-md border px-3 py-2 text-sm ${
              status.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : status.type === 'error'
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                : 'border-white/15 bg-white/5 text-white'
            }`}
            role="status"
          >
            {status.msg}
          </div>
        )}
      </section>

      <p className="relative z-10 mt-6 text-xs opacity-50">HEMPIN FUND — 2025</p>
    </main>
  );
}