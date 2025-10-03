// components/EmailCTA.tsx
import * as React from 'react';

type Role = 'WORK' | 'LIFE';
type Variant = 'emerald' | 'fund';

interface Props {
  role?: Role | string;
  source?: string;
  /** Style treatment:
   *  - 'emerald' (default) → main site look
   *  - 'fund' → pink gradient button + pink focus/feedback
   */
  variant?: Variant;
}

export default function EmailCTA({
  role = 'LIFE',
  source = 'hempin.org:cta-footer',
  variant = 'emerald',
}: Props) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = React.useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMsg('');

    // normalize role: only WORK or LIFE are valid
    const normalized: Role = role?.toUpperCase() === 'WORK' ? 'WORK' : 'LIFE';
    const payload = { email: email.trim().toLowerCase(), role: normalized, source };

    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
        credentials: 'same-origin',
      });
      const j = await r.json();

      if (!r.ok || !j?.ok) {
        setStatus('error');
        setMsg(j?.error || 'Error. Try again.');
        return;
        }

      setStatus('ok');
      setMsg('Thanks — we’ll be in touch.');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMsg(err?.message || 'Network error.');
    }
  }

  // Styling switches by variant
  const inputFocus =
    variant === 'fund'
      ? 'focus:ring-2 focus:ring-rose-400' // pink focus for Fund
      : 'focus:ring-2 focus:ring-emerald-400';

  const buttonClass =
    variant === 'fund'
      ? 'btn primary thruster' // uses your global pink gradient styles
      : 'shrink-0 rounded-md px-4 py-2 ring-1 ring-emerald-400/50 bg-emerald-500/20 hover:bg-emerald-500/25';

  const msgClass =
    variant === 'fund'
      ? status === 'error'
        ? 'text-red-300'
        : 'text-rose-300'
      : status === 'error'
        ? 'text-red-300'
        : 'text-emerald-300';

  return (
    <form onSubmit={submit} className="flex gap-2 items-stretch" aria-live="polite">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`w-full rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10 outline-none ${inputFocus}`}
        placeholder="you@example.com"
        autoComplete="email"
        name="email"
        id="cta-email"
      />
      <button type="submit" disabled={status === 'loading'} className={buttonClass}>
        {status === 'loading' ? 'Sending…' : 'Send'}
      </button>
      {msg && <div className={`ml-2 text-sm ${msgClass}`}>{msg}</div>}
    </form>
  );
}