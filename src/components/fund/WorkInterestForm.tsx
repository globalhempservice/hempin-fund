'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'ok' | 'err';

export default function WorkInterestForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    message: '',
  });

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMsg('');

    try {
      const res = await fetch('/api/form', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...form,
          role: 'WORK',
          source: 'fund.hempin.org#workform1',
        }),
      });

      const j = await res.json();

      if (!res.ok || !j?.ok) {
        setStatus('err');
        setMsg(j?.error || 'Could not submit. Try again?');
        return;
      }

      setStatus('ok');
      setMsg('Thanks — we’ll reach out when WORK tools open.');
      setForm({ name: '', email: '', company: '', website: '', message: '' });
    } catch (err: any) {
      setStatus('err');
      setMsg(err?.message || 'Network error.');
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 max-w-xl mx-auto mt-6">
      <input
        className="rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-rose-400"
        placeholder="Your name"
        required
        value={form.name}
        onChange={(e) => update('name', e.target.value)}
        name="name"
        autoComplete="name"
      />
      <input
        className="rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-rose-400"
        placeholder="you@company.com"
        type="email"
        required
        value={form.email}
        onChange={(e) => update('email', e.target.value)}
        name="email"
        autoComplete="email"
      />
      <input
        className="rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-rose-400"
        placeholder="Company (optional)"
        value={form.company}
        onChange={(e) => update('company', e.target.value)}
        name="company"
        autoComplete="organization"
      />
      <input
        className="rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-rose-400"
        placeholder="Website (optional)"
        value={form.website}
        onChange={(e) => update('website', e.target.value)}
        name="website"
        autoComplete="url"
      />
      <textarea
        className="rounded-md bg-white/5 px-3 py-2 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-rose-400"
        placeholder="Tell us about your campaign idea…"
        rows={5}
        value={form.message}
        onChange={(e) => update('message', e.target.value)}
        name="message"
        style={{ resize: 'vertical' }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn primary thruster"
      >
        {status === 'loading' ? 'Sending…' : 'Submit interest'}
      </button>

      {msg && (
        <div
          className={`text-sm ${status === 'err' ? 'text-red-300' : 'text-rose-300'} text-center`}
        >
          {msg}
        </div>
      )}
    </form>
  );
}