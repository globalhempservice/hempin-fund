// src/app/page.tsx
import WorkTeaser from '@/components/fund/WorkTeaser';

export const dynamic = 'force-dynamic';

export default function FundHome() {
  return (
    <>
      {/* ===== HERO — Featured LIFE campaign ===== */}
      <main className="hero">
        <div className="container center" style={{ position: 'relative', zIndex: 2, paddingTop: 8 }}>
          <p className="eyebrow">LIFE — Featured campaign</p>
          <h1 className="display-title hemp-underline-aurora">Hemp’in Launch</h1>
          

          <p className="lede" style={{ marginTop: 12 }}>
            Help us build the operating system for a living world — software, modules, and tools that connect
            farms, brands, researchers, and communities across hemp.
          </p>

          {/* CTA row */}
          <div className="cta-row">
            <a href="/campaigns/hempin-launch" className="btn primary thruster">Back this campaign</a>
            <a href="/about" className="btn ghost">How it works</a>
          </div>

          {/* tiny meta chips */}
          <div className="pipeline" style={{ justifyContent: 'center' }}>
            <span className="pill">Starts Oct 1</span>
            <span className="pill">30-day window</span>
            <span className="pill">Universal “Early Backer” multipass</span>
          </div>
        </div>

        {/* background glow */}
        <div className="hero-glow" aria-hidden />
      </main>

      {/* ===== UPCOMING — simple grid ===== */}
      <section className="section" id="upcoming">
        <div className="container">
          <div className="center">
            <p className="eyebrow">Upcoming</p>
            <h2 className="display-title hemp-underline-aurora">Next in the fund nebula</h2>
            
            <p className="lede" style={{ marginTop: 10 }}>
              Sneak peek at what’s docking soon. Follow along — we’ll open these as they’re ready.
            </p>
          </div>

          <div className="cards" style={{ marginTop: 18 }}>
            {/* NADA fashion capsule — disabled link */}
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

            {/* Thailand farm — disabled link */}
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

            {/* WORK interest */}
            <a href="/work" className="card planet">
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
      </section>

      {/* ===== WORK teaser section ===== */}
      <WorkTeaser />

      {/* ===== FOOTER (light) ===== */}
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