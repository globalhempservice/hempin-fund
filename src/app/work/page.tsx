import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "WORK — Host your campaign on Hemp’in",
  description:
    "Professionals can apply to raise funds on Hemp’in. Submit your interest to host campaigns for farms, brands, R&D, and community builds.",
};

export default function WorkPage() {
  return (
    <main className="min-h-screen app-shell">
      {/* background starfield */}
      <div className="starfield-root" aria-hidden>
        <div className="starfield layer-a" />
        <div className="starfield layer-b" />
      </div>

      <section
        className="container hemp-panel"
        style={{
          maxWidth: 800,
          margin: '32px auto',
          padding: '28px 20px',
          textAlign: 'center',
        }}
      >
        <p className="eyebrow">WORK — Hemp professionals</p>
        <h1 className="display-title hemp-underline-aurora">
          Host your campaign
        </h1>
        

        <p className="lede" style={{ marginTop: 14 }}>
          Hemp’in is preparing creator tools so professionals can raise funds
          for cultivation, processing lines, R&D, and community builds.
        </p>

        <p className="muted" style={{ marginTop: 12 }}>
          We’re not open for campaign creation yet, but you can submit your
          interest now. This helps us prioritize features and reach out to you
          when the WORK tools unlock.
        </p>

        {/* Interest form — placeholder for now */}
        <form
          action="https://formspree.io/f/mwkggxyz" // replace with Supabase or your API later
          method="POST"
          className="mt-6 grid gap-3 max-w-md mx-auto"
        >
          <input
            type="text"
            name="name"
            placeholder="Your name"
            required
            className="input"
          />
          <input
            type="email"
            name="email"
            placeholder="you@company.com"
            required
            className="input"
          />
          <textarea
            name="message"
            placeholder="Tell us about your campaign idea…"
            rows={4}
            className="input"
            style={{ resize: 'vertical' }}
          />
          <button type="submit" className="btn primary thruster">
            Submit interest
          </button>
        </form>

        <div className="muted tiny" style={{ marginTop: 14 }}>
          Submissions are reviewed by the Hemp’in team. We’ll contact you before
          opening tools for WORK campaigns.
        </div>
      </section>
    </main>
  );
}