import { getItineraries } from "@/lib/cms/itineraries";
import ItineraryCard from "@/components/ItineraryCard";

export default async function ItinerariesPage() {
  const itineraries = await getItineraries();
  const sorted = [...itineraries].sort((a, b) => (b.duration ?? 0) - (a.duration ?? 0));

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent">Trip Planning</span>
          <h1 className="font-display text-5xl md:text-6xl text-text leading-tight">
            Curated Itineraries
          </h1>
          <p className="font-body text-muted text-lg leading-relaxed">
            Whether you have three days or two weeks, these routes are designed to help you experience the best of Ghana&apos;s history, nature, and modern culture.
          </p>
        </div>

        {/* List */}
        <div className="space-y-16">
          {sorted.map((itinerary) => (
            <ItineraryCard key={itinerary.slug} itinerary={itinerary} />
          ))}
        </div>
      </div>
    </div>
  );
}
