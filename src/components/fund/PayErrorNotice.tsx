'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type KnownErr =
  | 'cancelled'
  | 'declined'
  | 'expired'
  | 'invalid'
  | 'network'
  | 'unknown';

export default function PayErrorNotice() {
  const sp = useSearchParams();
  const router = useRouter();
  const [hidden, setHidden] = useState(false);

  // Read and normalize the error code from the URL
  const code: KnownErr | null = useMemo(() => {
    const raw = (sp.get('pay_error') || '').toLowerCase().trim();
    if (!raw) return null;
    if (['cancelled', 'declined', 'expired', 'invalid', 'network'].includes(raw)) {
      return raw as KnownErr;
    }
    return 'unknown';
  }, [sp]);

  // Optional: auto-clear the query param after first render (keeps URL clean)
  useEffect(() => {
    if (!code) return;
    const url = new URL(window.location.href);
    url.searchParams.delete('pay_error');
    window.history.replaceState(null, '', url.toString());
  }, [code]);

  if (!code || hidden) return null;

  const meta = getCopy(code);

  return (
    <div
      role="alert"
      className="hemp-panel"
      style={{
        borderColor: 'rgba(244,63,94,.28)',
        boxShadow:
          '0 0 0 1px rgba(244,63,94,.18) inset, 0 10px 24px rgba(0,0,0,.35), 0 0 18px rgba(244,63,94,.12)',
        background: 'rgba(244,63,94,.08)',
        padding: 12,
        display: 'grid',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'start', gap: 10, justifyContent: 'space-between' }}>
        <div style={{ display: 'grid', gap: 2 }}>
          <strong style={{ letterSpacing: '.01em' }}>{meta.title}</strong>
          <span className="muted" style={{ fontSize: '.95rem' }}>{meta.body}</span>
        </div>

        <button
          aria-label="Dismiss"
          onClick={() => setHidden(true)}
          className="pill"
          style={{
            background: 'rgba(255,255,255,.06)',
            border: '1px solid rgba(255,255,255,.14)',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {meta.actions?.length ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {meta.actions.map((a, i) =>
            a.kind === 'primary' ? (
              <a key={i} href={a.href} className="btn primary">
                {a.label}
              </a>
            ) : a.kind === 'ghost' ? (
              <a key={i} href={a.href} className="btn ghost">
                {a.label}
              </a>
            ) : (
              <button
                key={i}
                className="btn"
                onClick={() => (a.onClick ? a.onClick(router) : null)}
              >
                {a.label}
              </button>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}

function getCopy(code: KnownErr) {
  switch (code) {
    case 'cancelled':
      return {
        title: 'Payment cancelled',
        body:
          'No charge was made. If you changed your mind, you can try again anytime.',
        actions: [
          { kind: 'primary' as const, label: 'Try again', href: '#tiers' },
        ],
      };
    case 'declined':
      return {
        title: 'Payment was declined',
        body:
          'Your provider did not approve the transaction. You may try another method or contact your bank.',
        actions: [
          { kind: 'primary' as const, label: 'Choose a different tier', href: '#tiers' },
          { kind: 'ghost' as const, label: 'Back to campaign', href: '/campaigns/hempin-launch' },
        ],
      };
    case 'expired':
      return {
        title: 'Session expired',
        body:
          'The checkout session timed out. Please start again and complete within the allotted time.',
        actions: [
          { kind: 'primary' as const, label: 'Restart checkout', href: '#tiers' },
        ],
      };
    case 'invalid':
      return {
        title: 'Invalid checkout',
        body:
          'We couldn’t validate this checkout request. Please begin again from the campaign page.',
        actions: [
          { kind: 'primary' as const, label: 'Back to campaign', href: '/campaigns/hempin-launch' },
        ],
      };
    case 'network':
      return {
        title: 'Network issue',
        body:
          'We hit a temporary connection problem. Please check your connection and try again.',
        actions: [
          { kind: 'primary' as const, label: 'Retry', href: '#tiers' },
        ],
      };
    default:
      return {
        title: 'Something went wrong',
        body:
          'We couldn’t complete the payment. No funds were captured. You can try again in a moment.',
        actions: [
          { kind: 'primary' as const, label: 'Back to campaign', href: '/campaigns/hempin-launch' },
        ],
      };
  }
}