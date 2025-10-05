// src/components/fund/RewardsGrid.tsx
'use client';

import { useMemo } from 'react';
import type { Tier } from './PledgeChooser';
import { REWARD_IMG, publicUrl } from './rewardImages';

function splitAdds(t: Tier) {
  if (!t.adds) return [] as string[];
  return t.adds.split(/ · |\s\+\s/g).map(s => s.trim()).filter(Boolean);
}

/** Return { src, subtitle } for a perk line, or nulls if no image. */
function resolveRewardMeta(perk: string, tierId: Tier['id']): { src: string | null; subtitle?: string } {
  const s = perk.toLowerCase();

  // --- SEED ------------------------------------------------
  if ((s.includes('surprise') && s.includes('box') && s.includes('raffle')) || s.includes('drop box')) {
    return {
      src: publicUrl(REWARD_IMG.seed.raffle),
      subtitle: 'For each 20$ pledged, one raffle ticket is issued! explore higher levels to maximize your chances',
    };
  }
  if (s.includes('random') && s.includes('sticker')) {
    return {
      src: publicUrl(REWARD_IMG.seed.sticker),
      subtitle: 'One random Cosmos sticker from the Hemp’in sticker collection ',
    };
  }
  if (s.includes('early backer')) {
    return {
      src: publicUrl(REWARD_IMG.seed.earlyBacker),
      subtitle: 'Rare Profile badge on your upcoming account with Hemp’in',
    };
  }
  if (s.includes('thank you')) {
    return {
      src: publicUrl(REWARD_IMG.seed.thankYou),
      subtitle: 'Optional nickname on the eternal Hemp’in Thank-You wall and with you meet our team',
    };
  }

  // --- SPROUT ----------------------------------------------
  if (s.includes('sticker') && s.includes('collection')) {
    return {
      src: publicUrl(REWARD_IMG.sprout.stickerSet),
      subtitle: 'Full Hemp’in colorfullsticker set (image for illustration only)',
    };
  }
  if (s.includes('tee') && (s.includes('orb') || s.includes('hemp'))) {
    return {
      src: publicUrl(REWARD_IMG.sprout.orbTeeRaffle),
      subtitle: 'A side quest lottery to win our first collab Hemp’in tshirt',
    };
  }

  // --- STEM ------------------------------------------------
  if (s.includes('velcro') || s.includes('logo kit')) {
    return {
      src: publicUrl(REWARD_IMG.stem.velcroKit),
      subtitle: 'We are bringing rare global natural dyes into lively embroideries to make custom products',
    };
  }

  // --- LEAF ------------------------------------------------
  if (s.includes('limited') && s.includes('t-shirt')) {
    return {
      src: publicUrl(REWARD_IMG.leaf.limitedTee),
      subtitle: 'This is it, you are sure to secure this limited edition Hemp’in T-shirt (orb color may vary)',
    };
  }

  // --- FIBER -----------------------------------------------
  if (s.includes('marketplace') && s.includes('box') && s.includes('opening')) {
    return {
      src: publicUrl(REWARD_IMG.fiber.guaranteedBox),
      subtitle: 'Guaranteed high value Surprise Box at opening of the Hemp’in Supermarket from our partner brands (image for illustration only)',
    };
  }

  // --- BAST ------------------------------------------------
  if ((s.includes('four') || s.includes('4')) && s.includes('boxes')) {
    return {
      src: publicUrl(REWARD_IMG.bast.fourBoxes),
      subtitle: 'Four high value boxes over the next year, we will make your investment worth it in soooo many cool products gifts',
    };
  }

  // --- CORE ------------------------------------------------
  if ((s.includes('six') || s.includes('6')) && s.includes('boxes')) {
    // keeping image key "tenBoxes" per your note
    return {
      src: publicUrl(REWARD_IMG.core.tenBoxes),
      subtitle: 'The ultimate trust and friend, you know Hemp potential and you will get the best of what hemp can offer! A total of 10 boxes for you, a hundred raffle tickets and all the prizes of all the previous tiers, we are eternaly grateful for your support',
    };
  }

  // Fallback: no image/known meta
  return { src: null };
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
    <section className="hemp-panel reward-wrap" style={{ padding: 16, display:'grid', gap: 12 }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>YOUR REWARDS</div>
        <ul key={`now-${i}`} className="reward-row">
          {nowUnlocked.length === 0 ? (
            <li className="reward-card ghost-card">Nothing extra at this tier (yet)</li>
          ) : nowUnlocked.map((p, idx) => {
              const { src, subtitle } = resolveRewardMeta(p, tiers[i].id);
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
                  <div className="mini muted">{subtitle ?? 'Included at this selection'}</div>
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
              const { src, subtitle } = resolveRewardMeta(p, tiers[i].id);
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
                  <div className="mini muted">{subtitle ?? 'Included at this selection'}</div>
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