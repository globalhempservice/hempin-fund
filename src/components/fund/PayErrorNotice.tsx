'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Action = {
  label: string;
  href?: string;
  onClick?: (router: ReturnType<typeof useRouter>) => void;
};

export default function PayErrorNotice() {
  const router = useRouter();
  const qs = useSearchParams();

  // Read status flags from URL, e.g. ?pledge=ok|cancel|error
  const pledge = (qs.get('pledge') || '').toLowerCase();

  const { visible, tone, title, msg, actions } = useMemo(() => {
    // default: hidden
    let visible = false;
    let tone: 'success' | 'warn' | 'error' = 'warn';
    let title = '';
    let msg = '';
    let actions: Action[] = [];

    if (pledge === 'ok') {
      visible = true;
      tone = 'success';
      title = 'Thank you — pledge confirmed';
      msg =
        'Your payment was captured successfully. Your Early Backer badge and Multipass will activate shortly.';
      actions = [
        { label: 'View campaign', href: '/campaigns/hempin-launch' },
        { label: 'Go to my pledges', href: '/me' },
      ];
    } else if (pledge === 'cancel') {
      visible = true;
      tone = 'warn';
      title = 'Payment cancelled';
      msg =
        'No charge was made. You can try again any time — your selection is still available.';
      actions = [
        { label: 'Retry checkout', href: '/pay/hempin-launch' },
        { label: 'Back to campaign', href: '/campaigns/hempin-launch' },
      ];
    } else if (pledge === 'error') {
      visible = true;
      tone = 'error';
      title = 'Payment error';
      msg =
        'We could not complete the transaction. If this persists, try another method or contact support.';
      actions = [
        { label: 'Try again', href: '/pay/hempin-launch' },
        {
          label: 'Refresh',
          onClick: (r) => r.refresh(),
        },
      ];
    }

    return { visible, tone, title, msg, actions };
  }, [pledge]);

  if (!visible) return null;

  const toneBorder =
    tone === 'success'
      ? 'rgba(16,185,129,.45)'
      : tone === 'error'
      ? 'rgba(239,68,68,.45)'
      : 'rgba(234,179,8,.45)';

  const toneBg =
    tone === 'success'
      ? 'rgba(16,185,129,.10)'
      : tone === 'error'
      ? 'rgba(239,68,68,.10)'
      : 'rgba(234,179,8,.10)';

  return (
    <div
      className="hemp-panel"
      style={{
        marginTop: 10,
        padding: 12,
        borderColor: toneBorder,
        background: toneBg,
      }}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      <div style={{ display: 'grid', gap: 8 }}>
        <strong style={{ letterSpacing: '.01em' }}>{title}</strong>
        <p className="muted" style={{ margin: 0 }}>
          {msg}
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {actions.map((a, i) =>
            a.href ? (
              <a key={i} className="btn" href={a.href}>
                {a.label}
              </a>
            ) : (
              <button
                key={i}
                className="btn"
                type="button"
                onClick={() => a.onClick?.(router)}
              >
                {a.label}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}