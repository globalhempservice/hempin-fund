import FundHero from '@/components/fund/FundHero';
import OrbitalDivider from '@/components/dividers/OrbitalDivider';
import WorkTeaser from '@/components/fund/WorkTeaser';

export const dynamic = 'force-dynamic';

export default function FundHome() {
  return (
    <>
      {/* 1) What is Hemp’in Fund? */}
      <FundHero />

      <OrbitalDivider label="featured" />

      {/* 2) Featured LIFE campaign */}
      <section className="section" id="featured">
        <div className="container">
          <div className="center">
            <p className="eyebrow">Featured campaign</p>
            <h2 className="display-title hemp-underline-aurora">Hemp’in Launch</h2>
          </div>

          <article className="hemp-panel" style={{ marginTop: 16, padding: 16 }}>
            <p className="muted" style={{ maxWidth: 760, margin: '0 auto' }}>
              Support the public launch of Hemp’in: modules, infra, and community onboarding.
            </p>
            <div className="center" style={{ marginTop: 12 }}>
              <a href="/campaigns/hempin-launch" className="btn primary thruster">Visit campaign</a>
            </div>
          </article>
        </div>
      </section>

      <OrbitalDivider label="upcoming" />

      {/* 3) Upcoming (with pink aura + special WORK tile) */}
      <section className="section" id="upcoming">
        <div className="container">
          <div className="center">
            <p className="eyebrow">Upcoming</p>
            <h2 className="display-title hemp-underline-aurora">Next in the fund nebula</h2>
            <p className="lede" style={{ marginTop: 10 }}>
              Sneak peek at what’s docking soon. Follow along — we’ll open these as they’re ready.
            </p>
          </div>

          {/* pink aura behind grid */}
          <div style={{ position:'relative', marginTop: 18 }}>
            <div aria-hidden
                 style={{
                   position:'absolute', inset:'-6% -6% auto -6%', height: 220,
                   background:'radial-gradient(600px 240px at 50% 30%, rgba(236,72,153,.18), transparent 70%)',
                   filter:'blur(38px)', zIndex:0, pointerEvents:'none'
                 }} />
            <div className="cards" style={{ position:'relative', zIndex:1 }}>
              {/* NADA (disabled) */}
              <a
                href="/campaigns/nada-capsule"
                className="card planet"
                aria-disabled="true"
                tabIndex={-1}
                style={{ pointerEvents: 'none', opacity: 0.75, cursor: 'not-allowed' }}
              >
                <div className="planet-summary">
                  <span className="planet-title">NADA — Hemp Capsule Collection</span>
                  <span className="chevron">↗</span>
                </div>
                <div className="planet-content" style={{ maxHeight: 'none', opacity: 1 }}>
                  <p className="muted" style={{ margin: 0 }}>
                    Limited fashion drop powered by hemp textiles and community energy.
                  </p>
                  <div className="pipeline" style={{ marginTop: 10 }}>
                    <span className="pill">UPCOMING</span>
                    <span className="pill">Starts Nov 1</span>
                    <span className="pill">15 days</span>
                  </div>
                </div>
              </a>

              {/* Thailand (disabled) */}
              <a
                href="/campaigns/thailand-farm"
                className="card planet"
                aria-disabled="true"
                tabIndex={-1}
                style={{ pointerEvents: 'none', opacity: 0.75, cursor: 'not-allowed' }}
              >
                <div className="planet-summary">
                  <span className="planet-title">Thailand Farm Project</span>
                  <span className="chevron">↗</span>
                </div>
                <div className="planet-content" style={{ maxHeight: 'none', opacity: 1 }}>
                  <p className="muted" style={{ margin: 0 }}>
                    Land + regenerative practices + local partners. Dates to be announced.
                  </p>
                  <div className="pipeline" style={{ marginTop: 10 }}>
                    <span className="pill">UPCOMING</span>
                    <span className="pill">Date TBA</span>
                  </div>
                </div>
              </a>

              {/* WORK — visually distinct (pink gradient card) */}
              <a href="/work"
                 className="card planet"
                 style={{
                   background: 'linear-gradient(180deg, rgba(236,72,153,.18), rgba(236,72,153,.06))',
                   borderColor: 'rgba(236,72,153,.35)'
                 }}>
                <div className="planet-summary">
                  <span className="planet-title">WORK — Host your campaign</span>
                  <span className="chevron">↗</span>
                </div>
                <div className="planet-content" style={{ maxHeight: 'none', opacity: 1 }}>
                  <p className="muted" style={{ margin: 0 }}>
                    Professionals can apply to raise on Hemp’in. We’ll review interest to unlock creator tools.
                  </p>
                  <div className="pipeline" style={{ marginTop: 10 }}>
                    <span className="pill">Visible now</span>
                    <span className="pill">Creator tools in queue</span>
                    <span className="pill">Submit interest</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <OrbitalDivider label="pros" compact />

      {/* 4) For Hemp Professionals (keep, but no “live example” button) */}
      <WorkTeaser />

      {/* Footer (unchanged) */}
      <footer className="site-footer">
        <div className="container row">
          <span className="muted tiny">© {new Date().getFullYear()} Hemp’in</span>
          <nav className="tiny">
            <a className="muted" href="/about">About</a>
            <span className="muted" style={{ margin: '0 8px' }}>·</span>
            <a className="muted" href="/work">WORK</a>
            <span className="muted" style={{ margin: '0 8px' }}>·</span>
            <a className="muted" href="/campaigns/hempin-launch">Hemp’in Launch</a>
          </nav>
        </div>
      </footer>
    </>
  );
}