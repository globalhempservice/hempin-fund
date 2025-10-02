// src/components/fund/WorkTeaser.tsx
'use client';

export default function WorkTeaser() {
  return (
    <section id="work" className="section">
      <div className="container">
        <div className="center">
          {/* Eyebrow + Title + Underline outside the card */}
          <p className="eyebrow">WORK — for hemp professionals</p>
          <h2
            className="display-title hemp-underline-aurora"
            style={{ fontSize: 'clamp(22px,3.6vw,36px)', marginTop: 4 }}
          >
            Host your hemp campaign on Hemp’in
          </h2>
        </div>

        {/* Card below the heading */}
        <article
          className="hemp-panel"
          style={{
            margin: '16px auto 0',
            maxWidth: 920,
            padding: 18,
          }}
        >
          <p className="muted" style={{ margin: '0 auto', maxWidth: 760, textAlign: 'center' }}>
            Raise funds for cultivation, processing lines, R&amp;D, or community builds. Hemp’in provides the tools
            to easilly build a page, progress tracking, and super efficient checkout.
          </p>

          <ul
            className="muted"
            style={{
              display: 'grid',
              gap: 8,
              margin: '14px auto 0',
              paddingLeft: 18,
              maxWidth: 760,
            }}
          >
            <li>Beautiful, branded campaign pages with your colors.</li>
            <li>Milestones &amp; transparent updates for backers.</li>
            <li>Simple fees: small setup + % of funds raised.</li>
          </ul>

          <div className="center" style={{ marginTop: 14 }}>
            <a className="btn primary thruster" href="/work">
              Submit my campaign
            </a>
          </div>

          <p className="muted center" style={{ marginTop: 10, fontSize: '.92rem' }}>
            Creation opens soon. Share your interest so we can prioritize this module
          </p>
        </article>
      </div>
    </section>
  );
}