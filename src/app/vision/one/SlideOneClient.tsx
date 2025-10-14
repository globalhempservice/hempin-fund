'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import SlideFrame from '@/components/SlideFrame';

export default function SlideOneClient() {
  return (
    <SlideFrame title="Hemp’in — Vision (1/2)">
      <div className="h-full w-full p-10 grid grid-rows-[auto_1fr_auto]">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href="/vision/zero" className="text-sm opacity-80 hover:opacity-100 transition">← Back</Link>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-2xl font-semibold tracking-tight text-center relative inline-block"
          >
            Hemp’in — Building the Living OS for a Regenerative World
            <span className="absolute left-1/2 -bottom-2 h-[2px] w-40 -translate-x-1/2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-rose-400 blur-sm opacity-80" />
          </motion.h1>
          <Link href="/vision/two" className="text-sm opacity-80 hover:opacity-100 transition">Next →</Link>
        </header>

        {/* Body */}
        <div className="grid grid-cols-2 gap-8 items-stretch mt-6">
          {/* Left column */}
          <motion.section
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold">The Problem</h2>
            <p className="text-sm opacity-90 leading-relaxed">
              The hemp economy is fragmented — research, regulations, markets, funding, and places live in silos.
              Producers, buyers, and citizens can’t easily discover, evaluate, and act across this value chain.
            </p>

            <h2 className="text-lg font-semibold">The Solution</h2>
            <p className="text-sm opacity-90 leading-relaxed">
              <strong>Hemp’in</strong> unifies the ecosystem: a shared identity, shared data layer, and AI orchestration.
              Subdomains (<em>Knowledge, Fund, Market, Places</em>) orbit a central intelligence — the <em>Hemp’in Core</em>.
              From a single intent (“buy seeds for oatmeal”), the Core coordinates research, product options, funding,
              and verified profiles — turning intent into impact.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <CardLink href="https://auth.hempin.org">Auth & SSO ↗</CardLink>
              <CardLink href="https://admin.hempin.org">Admin console ↗</CardLink>
              <CardLink href="https://fund.hempin.org" className="col-span-2">Fund: pledges & campaigns ↗</CardLink>
              <CardLink href="https://knowledge.hempin.org" className="col-span-2">Knowledge: RAG + FAQ cache ↗</CardLink>
              <CardLink href="https://hempin.org/trust" className="col-span-2">Trust Center: Vision · Investor ↗</CardLink>
            </div>
          </motion.section>

          {/* Right: System diagram */}
          <motion.section
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            className="relative rounded-xl border border-white/10 bg-white/[.04] overflow-hidden"
          >
            {/* Soft aurora */}
            <div className="absolute inset-0 opacity-[.85] pointer-events-none">
              <div className="absolute -top-16 -left-20 w-[520px] h-[520px] rounded-full blur-3xl"
                   style={{ background: 'radial-gradient(circle, rgba(16,185,129,.28), transparent 60%)' }} />
              <div className="absolute -bottom-20 -right-16 w-[520px] h-[520px] rounded-full blur-3xl"
                   style={{ background: 'radial-gradient(circle, rgba(236,72,153,.28), transparent 60%)' }} />
            </div>

            {/* Stage */}
            <div className="relative h-full grid place-items-center p-10">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7, ease: 'easeOut' }}
                className="relative h-[440px] w-[440px] rounded-full border border-white/15 bg-black/30"
              >
                {/* Core */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full grid place-items-center border border-cyan-300/40 bg-cyan-400/10 shadow-[0_0_42px_rgba(56,189,248,.35)]">
                  <div className="text-center leading-tight">
                    <div className="text-sm tracking-wide opacity-90">Hemp’in</div>
                    <div className="text-xs opacity-70">Core</div>
                  </div>
                </div>

                {/* Orbiting apps — positioned from center with pixel offsets */}
                <Orb label="Knowledge" dx={-150} dy={-20} hue="cyan" href="https://knowledge.hempin.org" />
                <Orb label="Fund"      dx={ 150} dy={-15} hue="rose"  href="https://fund.hempin.org" />
                <Orb label="Market"    dx={-115} dy={ 155} hue="emerald" />
                <Orb label="Places"    dx={ 115} dy={ 155} hue="violet" />
                <Orb label="Account"   dx={   0} dy={-175} hue="amber"  href="https://account.hempin.org" />
              </motion.div>
            </div>
          </motion.section>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between pt-3">
          <div className="text-xs opacity-80">hempin.org • shared identity • shared data • shared intelligence</div>
          <div className="text-xs opacity-70">Slide 1 / 2</div>
        </footer>
      </div>
    </SlideFrame>
  );
}

/* ——— Helpers ——— */

function CardLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:border-white/20 hover:bg-white/10 transition ${className}`}
    >
      {children}
    </a>
  );
}

function Orb({
  label,
  dx,
  dy,
  hue,
  href,
}: {
  label: string;
  dx: number; // pixel offset from center (x)
  dy: number; // pixel offset from center (y)
  hue: 'cyan' | 'rose' | 'emerald' | 'violet' | 'amber';
  href?: string;
}) {
  const color = {
    cyan:    'shadow-[0_0_30px_rgba(56,189,248,.35)] border-cyan-300/40 bg-cyan-400/10',
    rose:    'shadow-[0_0_30px_rgba(244,63,94,.35)]  border-rose-300/40 bg-rose-400/10',
    emerald: 'shadow-[0_0_30px_rgba(16,185,129,.35)] border-emerald-300/40 bg-emerald-400/10',
    violet:  'shadow-[0_0_30px_rgba(139,92,246,.35)] border-violet-300/40 bg-violet-400/10',
    amber:   'shadow-[0_0_30px_rgba(245,158,11,.35)] border-amber-300/40 bg-amber-400/10',
  }[hue];

  const Tag: any = href ? 'a' : 'div';

  return (
    <Tag
      href={href}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      className={`absolute h-24 w-24 rounded-full grid place-items-center border ${color}`}
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px)`,
      }}
    >
      <span className="text-[11px] opacity-90">{label}</span>
    </Tag>
  );
}