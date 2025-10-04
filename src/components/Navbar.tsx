// src/components/Navbar.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type BootstrapOk =
  | { ok: true; signedIn: false; user: null }
  | { ok: true; signedIn: true; user: { id: string; email: string | null } };

export default function Navbar() {
  const [boot, setBoot] = useState<BootstrapOk | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // mount flag for portals (avoids SSR mismatch)
  useEffect(() => setMounted(true), []);

  // close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // bootstrap signed-in state (shared .hempin.org cookies)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/bootstrap', {
          cache: 'no-store',
          credentials: 'include',
        });
        const json = await res.json();
        if (mounted) setBoot(json);
      } catch {
        if (mounted) setBoot({ ok: true, signedIn: false, user: null });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const nextParam =
    typeof window !== 'undefined'
      ? encodeURIComponent(window.location.href)
      : encodeURIComponent('/');

  const signInHref = `https://auth.hempin.org/login?next=${nextParam}`;

  const Drawer = (
    <>
      <button
        className="nav-backdrop"
        aria-label="Close navigation"
        onClick={() => setMenuOpen(false)}
      />
      <aside
        id="fund-nav-left"
        className={`nav-left ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        onClick={(e) => {
          // close when clicking any link
          const target = e.target as HTMLElement;
          if (target.tagName === 'A') setMenuOpen(false);
        }}
      >
        <div className="nav-head">
          <span className="nav-title">Navigation</span>
          <button className="nav-x" onClick={() => setMenuOpen(false)} aria-label="Close">×</button>
        </div>

        <nav className="nav-list">
          <a href="/campaigns/hempin-launch">Featured — Hemp’in Launch</a>
          <a href="/work">WORK — Submit your campaign</a>
          <a href="https://admin.hempin.org" target="_blank" rel="noopener noreferrer">Admin Console ↗</a>
        </nav>
      </aside>

      {/* minimal global CSS for the drawer (pink-tinted) */}
      <style jsx global>{`
        .nav-backdrop{
          position: fixed; inset: 0; background: rgba(0,0,0,.38); z-index: 90;
        }
        .nav-left{
          position: fixed; top: 10px; bottom: 10px; left: 10px;
          width: min(360px, 92vw);
          background: rgba(8,10,14,.86);
          border: 1px solid rgba(255,255,255,.10);
          border-left: none;
          border-radius: 0 14px 14px 0;
          box-shadow: 12px 0 40px rgba(0,0,0,.45), 0 0 24px rgba(236,72,153,.18) inset;
          backdrop-filter: blur(10px);
          transform: translateX(calc(-100% - 10px));
          transition: transform .24s ease;
          z-index: 95;
          overflow: auto;
        }
        .nav-left.open{ transform: translateX(0); }
        .nav-head{
          position: sticky; top: 0;
          display:flex; align-items:center; justify-content:space-between;
          padding: 14px 14px 10px;
          background: rgba(8,10,14,.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .nav-title{ font-weight: 800; letter-spacing: .02em; }
        .nav-x{ background:transparent; border:0; color:#fff; font-size:22px; line-height:1; padding:6px; cursor:pointer; }
        .nav-list{
          display:grid; gap:8px; padding: 12px 14px;
        }
        .nav-list a{
          display:block; padding:10px 12px; border-radius:10px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          text-decoration:none; color:inherit; font-weight:600;
          transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
        }
        .nav-list a:hover{
          transform: translateY(-1px);
          border-color: rgba(236,72,153,.35);
          box-shadow: 0 10px 24px rgba(0,0,0,.35), 0 0 18px rgba(236,72,153,.20);
        }
      `}</style>
    </>
  );

  return (
    <header className="site-header arc">
      <div className="container">
        {/* Force 3 columns: burger | brand | auth — so brand stays perfectly centered on mobile */}
        <div className="header-rail" style={{ gridTemplateColumns: '42px 1fr auto' }}>
          {/* Left: hamburger (always visible) */}
          <button
            ref={triggerRef}
            className="hamburger"
            aria-label="Open navigation"
            aria-controls="fund-nav-left"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>

          {/* Center: brand pod with pink orb */}
          <a href="/" className="header-pod" aria-label="Hemp’in Fund — home">
            <span className="header-orb" aria-hidden="true" />
            <span className="brand-name">Hemp’in Fund</span>
          </a>

          {/* Right: auth actions */}
          <div>
            {/* loading skeleton */}
            {boot === null && (
              <div className="h-8 w-24 rounded bg-white/10 animate-pulse" aria-hidden />
            )}

            {/* visitor */}
            {boot && boot.ok && !boot.signedIn && (
              <a href={signInHref} className="btn ghost" style={{ padding: '8px 12px' }}>
                Sign in
              </a>
            )}

            {/* signed-in menu */}
            {boot && boot.ok && boot.signedIn && (
              <UserMenu email={boot.user.email || '?'} />
            )}
          </div>
        </div>
      </div>

      {/* Drawer portal */}
      {mounted && menuOpen ? createPortal(Drawer, document.body) : null}
    </header>
  );
}

/* small user dropdown extracted for clarity */
function UserMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-white/20 text-xs">
          {(email || '?').slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden xs:inline">{email}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-52 overflow-hidden rounded-md border border-white/10 bg-black/90 shadow-xl z-50"
          onMouseLeave={() => setOpen(false)}
        >
          <a className="block px-3 py-2 text-sm hover:bg-white/10" href="/me">
            My pledges
          </a>
          <a className="block px-3 py-2 text-sm hover:bg-white/10" href="/logout">
            Log out
          </a>
        </div>
      )}
    </div>
  );
}