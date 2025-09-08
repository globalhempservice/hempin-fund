'use client';

import { useMemo, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  campaignSlug: string;
  campaignTitle: string;
  amount: number; // fixed, not editable (but may arrive as 0 due to timing)
  tierId: string; // human key: "seed" | "sprout" | "stem" | "field"
};

const FALLBACK_AMOUNTS: Record<string, number> = {
  seed: 20,
  sprout: 50,
  stem: 100,
  field: 500,
};

export default function PledgeModal({
  open,
  onClose,
  campaignSlug,
  campaignTitle,
  amount,
  tierId,
}: Props) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);

  // If amount is still 0 (e.g., first render race), derive a safe value from tierId.
  const displayAmount = useMemo(() => {
    if (amount && amount > 0) return amount;
    const key = (tierId || '').toLowerCase();
    return FALLBACK_AMOUNTS[key] ?? 0;
  }, [amount, tierId]);

  if (!open) return null;

  const submit = async () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      setStatus({ ok: false, msg: 'Please enter a valid email.' });
      return;
    }
    if (!displayAmount || displayAmount <= 0) {
      setStatus({ ok: false, msg: 'Invalid pledge amount. Please retry.' });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/pledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignSlug,
          amount: displayAmount,
          currency: 'USD',
          email,
          // Send human key; server maps to UUID
          tierKey: tierId,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || 'Failed to submit pledge');
      }

      setStatus({ ok: true, msg: 'Thank you! Pledge recorded.' });
      setTimeout(() => {
        onClose();
        setEmail('');
        setStatus(null);
        setSubmitting(false);
      }, 900);
    } catch (e: any) {
      setStatus({ ok: false, msg: e?.message ?? 'Something went wrong' });
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900 p-6">
        <h2 className="text-lg font-semibold">Pledge to {campaignTitle}</h2>
        <p className="mt-1 text-sm text-zinc-300">You selected a fixed pledge.</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-sm">Amount (USD)</label>
            <div
              aria-label="Amount (fixed)"
              className="mt-1 rounded-md border border-white/15 bg-zinc-800 px-3 py-2 text-white"
            >
              ${displayAmount}
            </div>
            <p className="mt-1 text-xs text-zinc-400">Amount is fixed for this tier.</p>
          </div>

          <div>
            <label htmlFor="pledge-email" className="block text-sm">Email</label>
            <input
              id="pledge-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className="mt-1 w-full rounded-md border border-white/15 bg-zinc-800 px-3 py-2 text-white outline-none disabled:opacity-60"
              placeholder="you@domain.com"
            />
            <p className="mt-1 text-xs text-zinc-400">
              We’ll use this to send your perk details and updates.
            </p>
          </div>

          {status && (
            <div
              className={`rounded-md px-3 py-2 text-sm ${
                status.ok ? 'bg-emerald-600/15 text-emerald-300' : 'bg-red-600/15 text-red-300'
              }`}
              role="alert"
            >
              {status.msg}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-md border border-white/15 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Confirm pledge'}
          </button>
        </div>
      </div>
    </div>
  );
}