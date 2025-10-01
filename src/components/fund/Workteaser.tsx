'use client';

export default function WorkTeaser() {
  return (
    <section
      aria-labelledby="work-teaser-title"
      className="hemp-panel"
      style={{
        marginTop: 16,
        padding: 14,
        background: 'rgba(255,255,255,.045)',
        borderColor: 'rgba(255,255,255,.08)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p className="eyebrow">WORK — for hemp professionals</p>
        <h2
          id="work-teaser-title"
          className="display-title"
          style={{ fontSize: 'clamp(22px,3.8vw,34px)', marginTop: 4 }}
        >
          Host your hemp campaign on Hemp’in
        </h2>
        <div className="cta-scanline" aria-hidden />
        <p className="muted" style={{ margin: '10px auto 0', maxWidth: 680 }}>
          Raise for cultivation, processing lines, R&amp;D, or community builds. Hemp’in provides
          the glassy campaign page, progress tracking, and trusted checkout.
        </p>
      </div>

      <ul
        className="muted"
        style={{
          display: 'grid',
          gap: 8,
          margin: '14px 0 0',
          paddingLeft: 18,
          maxWidth: 760,
          marginInline: 'auto',
        }}
      >
        <li>Beautiful, branded campaign pages with your colors.</li>
        <li>Milestones &amp; transparent updates for backers.</li>
        <li>Simple fees: small setup + % of funds raised.</li>
      </ul>

      <div
        style={{
          display: 'grid',
          gap: 8,
          gridTemplateColumns: '1fr',
          marginTop: 12,
          maxWidth: 520,
          marginInline: 'auto',
        }}
      >
        <a
          className="btn primary thruster"
          href="/work-interest"
          style={{ textAlign: 'center' }}
        >
          I’m interested — notify me
        </a>
        <a
          className="btn ghost"
          href="/campaigns/hempin-launch"
          style={{ textAlign: 'center' }}
        >
          See a live example
        </a>
      </div>

      <p className="muted" style={{ marginTop: 10, textAlign: 'center', fontSize: '.92rem' }}>
        WORK tools are visible now; creation opens soon. Share your interest so we can prioritize.
      </p>
    </section>
  );
}