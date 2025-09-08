import clsx from 'clsx';

type Props = {
  title: string;
  amount: number;
  perk: string;
  onSelect?: () => void;
  disabled?: boolean;
};

export default function TierCard({ title, amount, perk, onSelect, disabled }: Props) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={clsx(
        'group relative w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left',
        'hover:bg-white/10 transition',
        disabled && 'opacity-60 cursor-not-allowed'
      )}
    >
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-1 text-2xl font-bold">${amount}</div>
      <div className="mt-2 text-sm text-zinc-400">{perk}</div>
      <div className="absolute inset-0 -z-10 rounded-xl blur-2xl opacity-30 group-hover:opacity-50 transition"
           style={{ background: 'radial-gradient(closest-side, rgba(126,85,255,.25), transparent 70%)' }} />
    </button>
  );
}
