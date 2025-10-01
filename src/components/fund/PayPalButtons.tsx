'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    paypal?: any;
  }
}

type Props = {
  amount: number;
  tierKey?: string;
  label: string;
  env: 'sandbox' | 'live' | string;
  clientId: string;
  origin: string;
};

export default function PayPalButtons({
  amount,
  tierKey,
  label,
  env,
  clientId,
  origin,
}: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const orderIdRef = useRef<string | null>(null);
  const pledgeIdRef = useRef<string | null>(null);

  // Load PayPal SDK (once)
  useEffect(() => {
    if (window.paypal) { setReady(true); return; }

    const script = document.createElement('script');
    const params = new URLSearchParams({
      'client-id': clientId,
      currency: 'USD',
      intent: 'capture',
      commit: 'true',
      components: 'buttons',
      'enable-funding': 'paypal,venmo,card',
    });
    if (env === 'sandbox') params.set('buyer-country', 'US'); // harmless hint

    script.src = `https://www.paypal.com/sdk/js?${params.toString()}`;
    script.async = true;
    script.onload = () => setReady(true);
    script.onerror = () => setError('Failed to load payment SDK.');
    document.body.appendChild(script);
  }, [clientId, env]);

  // Render buttons when ready
  useEffect(() => {
    if (!ready || !containerRef.current || !window.paypal) return;

    // Clear any previous renders (navigating back/forward)
    containerRef.current.innerHTML = '';

    const buttons = window.paypal.Buttons({
      style: {
        layout: 'vertical',
        shape: 'rect',
        label: 'pay',
        height: 45,
      },

      // Create order (client-side) + record intent on our server
      createOrder: async (_: any, actions: any) => {
        setError(null);

        // Optional: record pledge intent in our DB
        try {
          const res = await fetch('/api/pledge/intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              campaign: 'hempin-launch',
              tier: tierKey || 'custom',
              label,
              currency: 'USD',
              amount,
              returnTo: `${origin}/campaigns/hempin-launch`,
            }),
          });
          const j = await res.json();
          if (res.ok && j.ok && j.pledgeId) {
            pledgeIdRef.current = j.pledgeId as string;
          }
        } catch {
          // non-blocking
        }

        // Create the actual PayPal order in the browser
        return actions.order.create({
          purchase_units: [
            {
              description: `Hemp’in Launch · ${label}`,
              amount: { value: amount.toFixed(2), currency_code: 'USD' },
            },
          ],
          application_context: {
            shipping_preference: 'NO_SHIPPING',
            user_action: 'PAY_NOW',
            brand_name: 'Hemp’in',
            return_url: `${origin}/campaigns/hempin-launch`,
            cancel_url: `${origin}/campaigns/hempin-launch`,
          },
        });
      },

      onApprove: async (_: any, actions: any) => {
        try {
          const details = await actions.order.capture();
          orderIdRef.current = details?.id || null;

          // Tell our server a capture happened (route we already created)
          try {
            await fetch('/api/paypal/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                pledgeId: pledgeIdRef.current,
                orderId: details?.id,
                status: details?.status,
                amount: details?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value,
                raw: details,
              }),
            });
          } catch {
            // non-blocking—UX still continues
          }

          // Back to the campaign with success flag
          window.location.href = `/campaigns/hempin-launch?pledge=ok`;
        } catch (e: any) {
          setError(e?.message || 'Payment failed to capture.');
        }
      },

      onCancel: () => {
        window.location.href = `/campaigns/hempin-launch?pledge=cancel`;
      },

      onError: (err: any) => {
        console.error('[PayPal] error', err);
        setError('Payment error. Please try again.');
      },
    });

    if (buttons.isEligible()) {
      buttons.render(containerRef.current);
    } else {
      setError('PayPal is not available for your browser/region.');
    }

    return () => {
      try { buttons.close(); } catch {}
    };
  }, [ready, amount, label, origin, tierKey]);

  return (
    <div>
      <div ref={containerRef} />
      {error && (
        <div className="muted" style={{ marginTop: 10, color: '#fecaca', textAlign:'center', fontSize: '.9rem' }}>
          {error}
        </div>
      )}
      <p className="muted center" style={{ marginTop: 10, fontSize: '.8rem', opacity:.8 }}>
        {env === 'live' ? 'Live payments enabled' : 'Sandbox mode'}
      </p>
    </div>
  );
}