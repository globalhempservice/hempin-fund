// src/app/pay/page.tsx
import { redirect } from 'next/navigation';

export default function PayShim({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const campaign = (searchParams.campaign || '') as string;
  const tier = (searchParams.tier || '') as string;
  const amount = (searchParams.amount || '') as string;

  if (campaign === 'hempin-launch') {
    const url = new URL('/pay/hempin-launch', 'http://local');
    if (tier)   url.searchParams.set('tier', tier);
    if (amount) url.searchParams.set('amount', amount);
    redirect(url.pathname + url.search);
  }

  // Unknown campaign → send to overview (or you could 404)
  redirect('/campaigns/hempin-launch');
}