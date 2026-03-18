import { allItineraries } from "contentlayer/generated";
import { notFound } from "next/navigation";
import Image from "next/image";
import DayAccordion from "@/components/DayAccordion";
import ItineraryCard from "@/components/ItineraryCard";
import { MapPin, Sun, Thermometer, BarChart } from "lucide-react";

interface ItineraryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return allItineraries.map((itinerary) => ({
    slug: itinerary.slug,
  }));
}

export default function ItineraryPage({ params }: ItineraryPageProps) {
  const itinerary = allItineraries.find((i) => i.slug === params.slug);

  if (!itinerary) {
    notFound();
  }

  const relatedItineraries = allItineraries
    .filter((i) => i.slug !== itinerary.slug)
    .slice(0, 2);

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center pt-20">
        <Image
          src={itinerary.coverImage}
          alt={itinerary.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-6">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <span className="bg-accent text-white font-body text-[10px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
              {itinerary.duration} DAYS
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white max-w-5xl mx-auto leading-tight">
            {itinerary.title}
          </h1>
        </div>
      </section>

      {/* Summary Bar */}
      <section className="bg-bg border-b border-border py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center space-y-2">
            <MapPin size={20} className="text-accent" />
            <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Regions</span>
            <p className="font-body text-sm font-semibold">{itinerary.regions.join(", ")}</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <Sun size={20} className="text-accent" />
            <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Best Season</span>
            <p className="font-body text-sm font-semibold">{itinerary.bestSeason}</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <BarChart size={20} className="text-accent" />
            <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Complexity</span>
            <p className="font-body text-sm font-semibold">Medium</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <Thermometer size={20} className="text-accent" />
            <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Vibe</span>
            <p className="font-body text-sm font-semibold">{itinerary.vibeTags[0]}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Day Breakdown */}
          <div className="lg:col-span-8 space-y-12">
            <div className="prose prose-lg font-body text-text/70 leading-relaxed italic max-w-none mb-12 border-l-2 border-accent/20 pl-8">
              {itinerary.summary}
            </div>
            
            <DayAccordion days={itinerary.days} />

            {/* Map Embed */}
            <div className="pt-12">
              <h2 className="font-display text-3xl text-text mb-8">Route Map</h2>
              <div className="aspect-video w-full bg-border rounded-sm overflow-hidden grayscale contrast-125">
                <iframe
                  src={itinerary.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Sidebar / Recommendations */}
          <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-32">
             <div className="p-8 bg-text text-bg rounded-sm space-y-6">
                <h3 className="font-display text-2xl">Trip Planner Tips</h3>
                <ul className="space-y-4 font-body text-sm text-bg/70 leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="text-accent">•</span>
                    <span>Book your inter-city transportation at least 24 hours in advance.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent">•</span>
                    <span>Download offline maps as data can be spotty in the Central Region.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent">•</span>
                    <span>Carry small notes for market tips and street food.</span>
                  </li>
                </ul>
             </div>
          </div>
        </div>
      </section>

      {/* Also Like */}
      {relatedItineraries.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mt-24 border-t border-border pt-24">
          <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent mb-6 block text-center">More Adventures</span>
          <h2 className="font-display text-4xl text-text mb-16 text-center">You might also like</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
            {relatedItineraries.map((ri) => (
              <ItineraryCard key={ri.slug} itinerary={ri} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
