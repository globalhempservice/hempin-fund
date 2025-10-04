'use client';

import React, { useMemo } from 'react';
import type { Tier } from './PledgeSection';

function splitAdds(t: Tier) {
  if (!t.adds) return [] as string[];
  return t.adds.split(/ · |\s\+\s/g).map(s => s.trim()).filter(Boolean);
}

export default function RewardGrid({
  tiers,
  index,
  campaignSlug,
}: {
  tiers: Tier[];
  index: number;
  campaignSlug: string;
}) {
  const nowUnlocked = useMemo(() => splitAdds(tiers[index]), [tiers, index]);

  const alsoIncluded = useMemo(() => {
    const prev = tiers.slice(0, index).flatMap(splitAdds);
    return Array.from(new Set(prev));
  }, [tiers, index]);

  const t = tiers[index];
  const payHref = (tier: Tier) =>
    `/pay/${campaignSlug}?tier=${encodeURIComponent(tier.id)}&amount=${tier.amount}`;

  return (
    <div className="grid-wrap">
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>NOW UNLOCKED</div>
        <ul className="reward-row pop">
          {nowUnlocked.length === 0
            ? <li className="reward-card ghost-card">Nothing extra at this tier (yet)</li>
            : nowUnlocked.map((p, idx) => <RewardCard key={`now-${idx}`} title={p} ctaHref={payHref(t)} />)}
        </ul>
      </div>

      {alsoIncluded.length > 0 && (
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>ALSO INCLUDED</div>
          <ul className="reward-row pop">
            {alsoIncluded.map((p, idx) => (
              <RewardCard key={`inc-${idx}`} title={p} ctaHref={payHref(t)} subtle />
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        .grid-wrap{ display:grid; gap:12px; }
        .reward-row{
          list-style:none; margin:0; padding:0;
          display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px;
        }
        /* subtle enter animation when index changes (container gets .pop via key prop) */
        .pop{ animation: fadeUp .28s ease both; }
        @keyframes fadeUp{
          from{ opacity:0; transform: translateY(6px) }
          to  { opacity:1; transform: translateY(0) }
        }
      `}</style>
    </div>
  );
}

function RewardCard({ title, subtle=false, ctaHref }:{
  title: string;
  subtle?: boolean;
  ctaHref: string;
}) {
  return (
    <li className={`reward-card${subtle ? ' subtle' : ''}`}>
      <div className="media" aria-hidden />
      <div className="title">{title}</div>
      <div className="row">
        <span className="mini muted">Included at this selection</span>
        <a className="btn primary" href={ctaHref} style={{ padding:'8px 10px' }}>Choose</a>
      </div>

      <style jsx>{`
        .reward-card{
          position:relative; display:grid; align-content:start; gap:10px;
          padding:12px; border-radius:14px;
          background: rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.12);
          box-shadow: 0 6px 18px rgba(0,0,0,.25), 0 0 10px rgba(236,72,153,.12);
          transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
        }
        .reward-card:hover{
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(0,0,0,.32), 0 0 14px rgba(236,72,153,.18);
          border-color: rgba(255,255,255,.18);
        }
        .reward-card.subtle{ opacity:.9; background:rgba(255,255,255,.04) }
        .reward-card.ghost-card{ display:flex; align-items:center; justify-content:center; font-style:italic }

        .media{ width:100%; aspect-ratio:5/3; border-radius:10px;
          background: linear-gradient(135deg, rgba(236,72,153,.22), rgba(96,165,250,.18));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
        }
        .title{ font-weight:800; letter-spacing:.01em }
        .row{ display:flex; justify-content:space-between; align-items:center; gap:8px }
        .mini{ font-size:.85rem; opacity:.85 }
      `}</style>
    </li>
  );
}