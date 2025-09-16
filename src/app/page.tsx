import Orb from "../ui/organisms/Orb";
import Hero from "@/components/Hero";
import CampaignCard from "@/components/CampaignCard";

export default function FundHome() {
  return (
    <main className="relative min-h-[90vh] flex flex-col items-center justify-start px-6 py-16 text-center overflow-hidden">
      {/* Background orb */}
      <Orb className="absolute inset-0" />

      {/* Hero */}
      <div className="relative z-10">
        <Hero />
      </div>

      {/* Campaigns */}
      <section className="relative z-10 mt-12 grid gap-6 w-full max-w-3xl md:grid-cols-2 text-left">
        <CampaignCard
          href="/campaigns/hempin-launch"
          title="Hemp’in Launch"
          description="Kickstart the Hemp’in ecosystem. Build tools for farmers, brands,
            and citizens in the hemp universe."
          status="active"
        />
        <CampaignCard
          title="Next Campaign"
          description="More hemp projects will appear here as we grow the Fund platform."
          status="featured"
        />
      </section>

      <p className="relative z-10 text-xs opacity-50 pt-12">HEMPIN FUND — 2025</p>
    </main>
  );
}