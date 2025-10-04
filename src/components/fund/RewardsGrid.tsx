'use client';

import { useMemo } from 'react';

type Tier = { id: string; label: string; amount: number; adds?: string };

function splitAdds(t: Tier) {
  if (!t.adds) return [] as string[];
  return t.adds.split(/ · |\s\+\s/g).map(s => s.trim()).filter(Boolean);
}

export default function RewardsGrid({
  tiers,
  selectedIndex,
}: {
  tiers: Tier[];
  selectedIndex: number;
}) {
  const i = Math.min(Math.max(selectedIndex, 0), Math.max(0, tiers.length - 1));
  const nowUnlocked = useMemo(() => splitAdds(tiers[i]), [tiers, i]);
  const alsoIncluded = useMemo(() => {
    const prev = tiers.slice(0, i).flatMap(splitAdds);
    return Array.from(new Set(prev));
  }, [tiers, i]);


  
  return (
    <section className="hemp-panel" style={{ padding: 16, display:'grid', gap: 12 }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>NOW UNLOCKED</div>
        <ul className="reward-row">
          {nowUnlocked.length === 0 ? (
            <li className="reward-card ghost-card">Nothing extra at this tier (yet)</li>
          ) : nowUnlocked.map((p, idx) => (
            <li key={`now-${idx}`} className="reward-card">
              <div className="media" aria-hidden />
              <div className="title">{p}</div>
              <div className="mini muted">Included at this selection</div>
            </li>
          ))}
        </ul>
      </div>

      {alsoIncluded.length > 0 && (
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>ALSO INCLUDED</div>
          <ul className="reward-row">
            {alsoIncluded.map((p, idx) => (
              <li key={`inc-${idx}`} className="reward-card subtle">
                <div className="media" aria-hidden />
                <div className="title">{p}</div>
                <div className="mini muted">Included at this selection</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        .reward-row{
          list-style:none; margin:0; padding:0;
          display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px;
        }
        .reward-card{
          display:grid; align-content:start; gap:10px;
          padding:12px; border-radius:14px;
          background: rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.12);
          box-shadow: 0 6px 18px rgba(0,0,0,.25), 0 0 10px rgba(236,72,153,.12);
          transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
        }
        .reward-card.subtle{ opacity:.9; background:rgba(255,255,255,.04) }
        .reward-card:hover{
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(0,0,0,.32), 0 0 14px rgba(236,72,153,.18);
          border-color: rgba(255,255,255,.18);
        }
        .media{
          width:100%; aspect-ratio: 5/3; border-radius:10px;
          background: linear-gradient(135deg, rgba(236,72,153,.22), rgba(96,165,250,.18));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
        }
        .title{ font-weight:800; letter-spacing:.01em }
        .mini{ font-size:.85rem }
      `}</style>
    </section>
  );
}