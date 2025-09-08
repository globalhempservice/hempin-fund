'use client';

type Props = {
  title: string;
  amount: number;
  perk?: string;
  onPledge: () => void;
};

export default function TierCard({ title, amount, perk, onPledge }: Props) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div>
        <p className="text-sm text-zinc-400">{title}</p>
        <p className="mt-1 text-2xl font-semibold">${amount}</p>
        {perk ? (
          <p className="mt-3 text-sm text-zinc-300">{perk}</p>
        ) : null}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={() => onPledge?.({ amount, tierKey: title })}
          className="w-full rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 transition"
        >
          Pledge
        </button>
      </div>
    </div>
  );
}