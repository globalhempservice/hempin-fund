// src/app/page.tsx or src/app/fund/page.tsx (wherever FundHome lives)
import FundHero from '@/components/fund/FundHero';
import NebulaDivider from '@/components/dividers/NebulaDivider';
import WorkTeaser from '@/components/fund/WorkTeaser';


import FeaturedCampaign from '@/components/fund/FeaturedCampaign';

export const dynamic = 'force-dynamic';

export default function FundHome() {
  return (
    <>
      
      {/* 2) Featured LIFE campaign — now live numbers */}
      <FeaturedCampaign
  slug="hempin-launch"
  eyebrow="Featured campaign"
  title="Support Hemp’in and win prizes"
  blurb="Back Hemp’in and get more than a badge. Expect surprise perks, early access, and community drops — while helping us build the hemp supermarket, recruit global brands, and ship a mobile app for citizens everywhere."
  href="/campaigns/hempin-launch"
  cta="Open campaign page"
  status="live"
  image={{ src: '/images/hempin-launch-banner.jpg', alt: 'Hemp’in Launch banner' }}
  meta={['Oct 1 → Oct 31']}
/>
      

      <NebulaDivider label="featured" />

      
      {/* 1) What is Hemp’in Fund? */}
      <FundHero />

      <NebulaDivider label="upcoming" />

      {/* 3) Upcoming campaigns */}
      <section className="section" id="upcoming">
        <div className="container">
          <div className="center">
            <p className="eyebrow">All campaigns</p>
            <h2 className="display-title hemp-underline-aurora">Upcoming campaigns</h2>
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

              {/* WORK — Add your campaign */}
              <a
                href="#work"
                className="card planet work-add-card"
                style={{
                  background: 'linear-gradient(180deg, rgba(236,72,153,.22), rgba(236,72,153,.08))',
                  borderColor: 'rgba(236,72,153,.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none'
                }}
              >
                <span className="big-plus">+</span>
                <span className="caption">Add your campaign</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <NebulaDivider label="pros" compact />

      {/* 4) For Hemp Professionals */}
      <section id="work">
        <WorkTeaser />
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container row">
          <span className="muted tiny">© {new Date().getFullYear()} Hemp’in</span>
          <nav className="tiny">
            <a className="muted" href="https://www.hempin.org/about">About</a>
            <span className="muted" style={{ margin: '0 8px' }}>·</span>
            <a className="muted" href="/work">WORK</a>
            <span className="muted" style={{ margin: '0 8px' }}>·</span>
            <a className="muted" href="https://www.hempin.org/trust">Trust Center / policy & Data</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
