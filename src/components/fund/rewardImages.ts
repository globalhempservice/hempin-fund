// src/components/fund/rewardImages.ts
// ✅ Central registry for all campaign reward images
// This lets you reference images by REWARD_IMG.seed.raffle etc.
// Later we can swap these URLs to production Supabase public URLs.

export const REWARD_IMG = {
    /** universal campaign visuals **/
    common: {
      allPrev: 'campaigns/hempin-launch/rewards/common/all-previous-kit@2x.v1.webp',
      thankYou: 'campaigns/hempin-launch/rewards/common/thank-you-wall@2x.v1.webp',
    },
  
    /** $20 – SEED */
    seed: {
      raffle: 'campaigns/hempin-launch/rewards/seed/surprise-box-raffle@2x.v1.webp',
      sticker: 'campaigns/hempin-launch/rewards/seed/random-sticker@2x.v1.webp',
    },
  
    /** $50 – SPROUT */
    sprout: {
      stickerSet: 'campaigns/hempin-launch/rewards/sprout/sticker-set-full@2x.v1.webp',
      orbTeeRaffle: 'campaigns/hempin-launch/rewards/sprout/orb-tee-raffle@2x.v1.webp',
    },
  
    /** $100 – STEM */
    stem: {
      velcroKit: 'campaigns/hempin-launch/rewards/stem/velcro-logo-kit@2x.v1.webp',
    },
  
    /** $250 – LEAF */
    leaf: {
      limitedTee: 'campaigns/hempin-launch/rewards/leaf/limited-tee@2x.v1.webp',

    },
  
    /** $500 – FIBER */
    fiber: {
      guaranteedBox: 'campaigns/hempin-launch/rewards/fiber/guaranteed-surprise-box@2x.v1.webp',
    },
  
    /** $1000 – BAST */
    bast: {
      fourBoxes: 'campaigns/hempin-launch/rewards/bast/four-surprise-boxes@2x.v1.webp',
    },
  
    /** $2000 – CORE */
    core: {
      tenBoxes: 'campaigns/hempin-launch/rewards/core/ten-surprise-boxes@2x.v1.webp',
    },
  } as const;
  
  /**
   * optional helper for resolving Supabase public URLs
   */
  import { createBrowserClient } from '@supabase/ssr';
  
  export function publicUrl(path: string) {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    return supabase.storage.from('assets').getPublicUrl(path).data.publicUrl;
  }