import SlideFrame from '@/components/SlideFrame';
import Link from 'next/link';

export const metadata = { title: 'Hemp’in Vision — Slide One' };

export default function SlideOne() {
  return (
    <SlideFrame title="Hemp’in — Vision (1/2)">
      <div className="h-full w-full p-10 grid grid-rows-[auto_1fr_auto]">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Hemp’in — Building the Living OS for a Regenerative World</h1>
          <Link href="/vision/two" className="text-sm opacity-80 hover:opacity-100">Next →</Link>
        </header>

        {/* Body */}
        <div className="grid grid-cols-2 gap-8 items-stretch">
          {/* Left: Why */}
          <section className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
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

            <div className="grid grid-cols-2 gap-3 mt-2">
              <Stat label="Auth & SSO across *.hempin.org" />
              <Stat label="Admin console live" />
              <Stat label="Fund: pledges & campaigns" />
              <Stat label="Knowledge: RAG + FAQ cache" />
            </div>
          </section>

          {/* Right: System diagram */}
          <section className="relative rounded-xl border border-white/10 bg-white/[.04] overflow-hidden">
            <div className="absolute inset-0 opacity-[.85]">
              {/* Soft aurora */}
              <div className="absolute -top-16 -left-20 w-[520px] h-[520px] rounded-full blur-3xl"
                   style={{ background: 'radial-gradient(circle, rgba(16,185,129,.28), transparent 60%)' }} />
              <div className="absolute -bottom-20 -right-16 w-[520px] h-[520px] rounded-full blur-3xl"
                   style={{ background: 'radial-gradient(circle, rgba(236,72,153,.28), transparent 60%)' }} />
            </div>

            <div className="relative h-full grid place-items-center p-10">
              <div className="relative h-[440px] w-[440px] rounded-full border border-white/15 bg-black/30 grid place-items-center">
                <div className="h-40 w-40 rounded-full grid place-items-center border border-cyan-300/40 bg-cyan-400/10 shadow-[0_0_42px_rgba(56,189,248,.35)]">
                  <div className="text-center">
                    <div className="text-sm tracking-wide opacity-90">Hemp’in</div>
                    <div className="text-xs opacity-70">Core</div>
                  </div>
                </div>

                {/* Orbiting apps */}
                <Orb label="Knowledge" x="-52%" y="-6%" hue="cyan" href="https://knowledge.hempin.org" />
                <Orb label="Fund"      x="56%"  y="-4%" hue="rose"  href="https://fund.hempin.org" />
                <Orb label="Market"    x="-44%" y="64%" hue="emerald" href="#" />
                <Orb label="Places"    x="48%"  y="64%" hue="violet" href="#" />
                <Orb label="Account"   x="0%"   y="-64%" hue="amber"  href="https://account.hempin.org" />
              </div>
            </div>
          </section>
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

function Stat({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs">{label}</div>
  );
}

function Orb({ label, x, y, hue, href }: { label: string; x: string; y: string; hue: 'cyan'|'rose'|'emerald'|'violet'|'amber'; href?: string }) {
  const color = {
    cyan:    'shadow-[0_0_30px_rgba(56,189,248,.35)] border-cyan-300/40 bg-cyan-400/10',
    rose:    'shadow-[0_0_30px_rgba(244,63,94,.35)]  border-rose-300/40 bg-rose-400/10',
    emerald: 'shadow-[0_0_30px_rgba(16,185,129,.35)] border-emerald-300/40 bg-emerald-400/10',
    violet:  'shadow-[0_0_30px_rgba(139,92,246,.35)] border-violet-300/40 bg-violet-400/10',
    amber:   'shadow-[0_0_30px_rgba(245,158,11,.35)] border-amber-300/40 bg-amber-400/10',
  }[hue];

  const C = href ? 'a' : 'div';
  return (
    // @ts-ignore
    <C href={href} className={`absolute h-24 w-24 rounded-full grid place-items-center border ${color}`}
       style={{ transform: `translate(${x}, ${y})` }}>
      <span className="text-[11px] opacity-90">{label}</span>
    </C>
  );
}