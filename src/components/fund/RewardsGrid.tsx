// src/components/fund/RewardsGrid.tsx
'use client';

import { useMemo } from 'react';
import type { Tier } from './PledgeChooser';  // <-- unify on this

function splitAdds(t: Tier) {
  if (!t.adds) return [] as string[];
  return t.adds.split(/ · |\s\+\s/g).map(s => s.trim()).filter(Boolean);
}
function slugify(s: string) {
  return s.toLowerCase().replace(/["'’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function RewardsGrid({
  tiers,
  selectedIndex,
  cdnBase,
  images,
}: {
  tiers: Tier[];
  selectedIndex: number;
  cdnBase?: string;
  images?: Record<string, string>;
}) {
  const i = Math.min(Math.max(selectedIndex, 0), Math.max(0, tiers.length - 1));

  const nowUnlocked = useMemo(() => splitAdds(tiers[i]), [tiers, i]);
  const alsoIncluded = useMemo(() => {
    const prev = tiers.slice(0, i).flatMap(splitAdds);
    return Array.from(new Set(prev));
  }, [tiers, i]);

  const getImg = (rewardTitle: string) => {
    const slug = slugify(rewardTitle);
    if (images?.[slug]) return images[slug];
    if (cdnBase) return `${cdnBase}/${slug}.webp`;
    return null;
  };

  return (
    <section className="hemp-panel reward-wrap" style={{ padding: 16, display:'grid', gap: 12 }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>NOW UNLOCKED</div>
        <ul key={`now-${i}`} className="reward-row">
          {nowUnlocked.length === 0 ? (
            <li className="reward-card ghost-card">Nothing extra at this tier (yet)</li>
          ) : nowUnlocked.map((p, idx) => {
              const src = getImg(p);
              return (
                <li
                  key={`now-${idx}`}
                  className="reward-card enter pulse"
                  style={{ ['--delay' as any]: `${idx * 40}ms` }}
                >
                  <div className={`media${src ? ' has-img' : ''}`} aria-hidden>
                    {src ? <img src={src} alt="" loading="lazy" /> : null}
                  </div>
                  <div className="title">{p}</div>
                  <div className="mini muted">Included at this selection</div>
                </li>
              );
            })}
        </ul>
      </div>

      {alsoIncluded.length > 0 && (
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>ALSO INCLUDED</div>
          <ul key={`inc-${i}`} className="reward-row">
            {alsoIncluded.map((p, idx) => {
              const src = getImg(p);
              return (
                <li
                  key={`inc-${idx}`}
                  className="reward-card enter"
                  style={{ ['--delay' as any]: `${idx * 35}ms` }}
                >
                  <div className={`media${src ? ' has-img' : ''}`} aria-hidden>
                    {src ? <img src={src} alt="" loading="lazy" /> : null}
                  </div>
                  <div className="title">{p}</div>
                  <div className="mini muted">Included at this selection</div>
                </li>
              );
            })}
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
          transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease, opacity .16s ease;
        }
        .reward-card.subtle{ opacity:.9; background:rgba(255,255,255,.04) }
        .reward-card:hover{
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(0,0,0,.32), 0 0 14px rgba(236,72,153,.18);
          border-color: rgba(255,255,255,.18);
        }
        .enter{
          opacity: 0; transform: translateY(4px);
          animation: cardIn .28s cubic-bezier(.22,.61,.36,1) both;
          animation-delay: var(--delay, 0ms);
        }
        @keyframes cardIn { to { opacity: 1; transform: none; } }
        .pulse{
          animation:
            cardIn .28s cubic-bezier(.22,.61,.36,1) both,
            pulseGlow .9s ease-out both;
          animation-delay: var(--delay, 0ms), calc(var(--delay, 0ms) + 60ms);
        }
        @keyframes pulseGlow {
          0%  { box-shadow: 0 0 0 0 rgba(236,72,153,.0), 0 0 10px rgba(236,72,153,.12) }
          40% { box-shadow: 0 0 0 6px rgba(236,72,153,.18), 0 0 16px rgba(236,72,153,.22) }
          100%{ box-shadow: 0 0 0 0 rgba(236,72,153,.0), 0 0 10px rgba(236,72,153,.12) }
        }
        .media{
          width:100%; aspect-ratio: 5/3; border-radius:10px;
          background: linear-gradient(135deg, rgba(236,72,153,.22), rgba(96,165,250,.18));
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.08);
          display:grid; place-items:center; overflow:hidden;
        }
        .media.has-img{ background: rgba(255,255,255,.02) }
        .media img{ width:100%; height:100%; object-fit:cover; display:block }
        .title{ font-weight:800; letter-spacing:.01em }
        .mini{ font-size:.85rem }
        @media (prefers-reduced-motion: reduce){
          .enter, .pulse{ animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}