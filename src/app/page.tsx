// src/app/page.tsx
import Orb from '../ui/organisms/Orb';

export default function FundHome() {
  return (
    <main className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden">
      {/* Background orb */}
      <Orb className="absolute inset-0" />

      {/* App intro */}
      <section className="relative z-10 space-y-5 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Fund Hemp Projects
        </h1>
        <p className="opacity-75">
          Welcome to <strong>fund.hempin.org</strong> — our hub for backing hemp
          innovation worldwide. Here you can support active campaigns and help bring
          regenerative projects to life.
        </p>
      </section>

      {/* Active campaign list */}
      <section className="relative z-10 mt-12 w-full max-w-lg">
        <a
          href="/campaigns/hempin-launch"
          className="block rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-left hover:bg-white/10 transition"
        >
          <div className="text-sm opacity-70">🌱 Active Campaign</div>
          <div className="mt-1 text-xl font-semibold">Hempin Launch</div>
          <p className="mt-2 text-sm opacity-80">
            Kickstart the Hempin ecosystem. Your support helps us build tools for
            farmers, brands, and citizens in the hemp universe.
          </p>
          <div className="mt-3 text-xs opacity-60">View tiers & pledge →</div>
        </a>
      </section>

      <p className="relative z-10 text-xs opacity-50 pt-12">HEMPIN FUND — 2025</p>
    </main>
  );
}