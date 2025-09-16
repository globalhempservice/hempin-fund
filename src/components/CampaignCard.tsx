// src/components/CampaignCard.tsx
type CampaignCardProps = {
    href?: string;
    title: string;
    description: string;
    status?: "active" | "featured" | "upcoming";
  };
  
  export default function CampaignCard({
    href,
    title,
    description,
    status,
  }: CampaignCardProps) {
    const statusLabel =
      status === "active"
        ? "🌱 Active Campaign"
        : status === "featured"
        ? "⭐ Featured"
        : "📅 Upcoming";
  
    const inner = (
      <div className="block rounded-2xl border border-white/10 bg-white/5 px-6 py-5 hover:bg-white/10 transition">
        <div className="text-sm opacity-70">{statusLabel}</div>
        <div className="mt-1 text-xl font-semibold">{title}</div>
        <p className="mt-2 text-sm opacity-80">{description}</p>
        {status === "active" && (
          <div className="mt-3 text-xs opacity-60">View tiers & pledge →</div>
        )}
      </div>
    );
  
    return href ? (
      <a href={href} className="block">
        {inner}
      </a>
    ) : (
      <div className="opacity-70">{inner}</div>
    );
  }