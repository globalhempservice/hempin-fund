"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NavLink = ({
  href,
  label,
  onClick
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) => {
  const path = usePathname();
  const active = path === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-sm ${active ? "bg-white/10" : "hover:bg-white/5"}`}
    >
      {label}
    </Link>
  );
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change or Esc
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide">
          <span className="text-brand">Hemp’in</span> Fund
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-1">
          <NavLink href="/campaigns" label="Campaigns" />
          <NavLink href="/how-it-works" label="How it works" />
          <NavLink href="/about" label="About" />
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex gap-2">
          <Link href="/auth/sign-in" className="btn-ghost">Sign in</Link>
          <Link href="/auth/sign-up" className="btn-primary">Join</Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-lg px-3 py-2 hover:bg-white/5"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M8 17h12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/40 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-2">
            <div className="flex gap-2">
              <Link href="/auth/sign-in" className="btn-ghost w-full text-center">Sign in</Link>
              <Link href="/auth/sign-up" className="btn-primary w-full text-center">Join</Link>
            </div>
            <div className="flex flex-wrap gap-2">
              <NavLink href="/campaigns" label="Campaigns" onClick={() => setOpen(false)} />
              <NavLink href="/how-it-works" label="How it works" onClick={() => setOpen(false)} />
              <NavLink href="/about" label="About" onClick={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}