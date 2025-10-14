import SlideFrame from '@/components/SlideFrame';
import Link from 'next/link';


export default function SlideTwo() {
  return (
    <SlideFrame title="Hemp’in — Vision (2/2)">
      <div className="h-full w-full p-10 grid grid-rows-[auto_1fr_auto]">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href="/vision/one" className="text-sm opacity-80 hover:opacity-100">← Back</Link>
          <h1 className="text-2xl font-semibold tracking-tight">Hemp’in Core — The Living Navigator</h1>
          <span />
        </header>

        {/* Body */}
        <div className="grid grid-cols-2 gap-8">
          {/* Core */}
          <section className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
            <p className="text-sm opacity-90 leading-relaxed">
              The <strong>Hemp’in Core</strong> is a context-aware assistant that turns intent into action.
              It understands Life ↔ Work, surfaces tasks & opportunities, and orchestrates modules across Knowledge,
              Fund, Market, and Places — with citations and real-world follow-through.
            </p>

            <div className="grid grid-cols-3 gap-3">
              <Widget title="Ask Hemp’in">
                “I need hemp seeds for oatmeal.” → Products nearby, verified farmers, support options, learn more.
              </Widget>
              <Widget title="My Tasks">
                Upload batch docs · Review fund application · Reply to buyer inquiry.
              </Widget>
              <Widget title="Signals">
                Weather clear • Market price ↑3% • New law draft in your region.
              </Widget>
            </div>
          </section>

          {/* Roadmap + Ask */}
          <section className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 className="text-lg font-semibold">Roadmap</h2>
            <ol className="text-sm space-y-1 opacity-90">
              <li>1) Unify data across subdomains (live: auth, admin, fund, knowledge).</li>
              <li>2) Core v1: helper brain + widgets + Life/Work switch.</li>
              <li>3) Partner onboarding (farmers, labs, brands, co-ops).</li>
              <li>4) Market + Places integration with verified profiles.</li>
              <li>5) Native apps + device layer (the “OS” phase).</li>
            </ol>

            <h2 className="text-lg font-semibold pt-3">Why Now / What We Need</h2>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Seed to expand ingestion, onboarding, and market integrations.</li>
              <li>• Strategic partners across farming, processing, retail, and standards.</li>
              <li>• Co-design pilots: measure impact, publish results, scale.</li>
            </ul>

{/* Quick demos */}
<div className="grid grid-cols-2 gap-3 pt-2">
  <a
    href="https://fund.hempin.org/research"
    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:border-white/20 hover:bg-white/7 transition"
  >
    Fund demo → <span className="opacity-70">pledges & campaigns</span>
  </a>
  <a
    href="https://knowledge.hempin.org"
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:border-white/20 hover:bg-white/7 transition"
  >
    Knowledge demo ↗ <span className="opacity-70">ask + sources</span>
  </a>
</div>

            <div className="pt-2 text-sm opacity-90">
              Contact: <a className="underline" href="mailto:info@globalhempservice.com">info@globalhempservice.com</a>
              <span className="opacity-50"> • </span>
              <a className="underline" href="https://hempin.org" target="_blank">hempin.org</a>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between pt-3">
          <div className="text-xs opacity-80">The Living Graph of Hemp — intent → action → impact</div>
          <div className="text-xs opacity-70">Slide 2 / 2</div>
        </footer>
      </div>
    </SlideFrame>
  );
}

function Widget({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-3">
      <div className="text-xs font-semibold mb-1">{title}</div>
      <div className="text-xs opacity-90 leading-relaxed">{children}</div>
    </div>
  );
}