import Link from "next/link";
import Image from "next/image";
import { type Itinerary } from "contentlayer/generated";

interface ItineraryCardProps {
  itinerary: Itinerary;
}

const ItineraryCard = ({ itinerary }: ItineraryCardProps) => {
  return (
    <Link 
      href={itinerary.url}
      className="group relative block aspect-[16/9] overflow-hidden rounded-sm bg-border"
    >
      <Image
        src={itinerary.coverImage}
        alt={itinerary.title}
        fill
        className="object-cover transition-transform duration-1000 group-hover:scale-110"
        sizes="100vw"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 space-y-4">
        {/* Pills */}
        <div className="flex flex-wrap gap-2">
          <span className="bg-accent text-white font-body text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            {itinerary.duration} Days
          </span>
          <div className="flex gap-2">
            {itinerary.vibeTags.slice(0, 3).map((tag, i) => (
              <span key={i} className="bg-white/10 backdrop-blur-md text-white border border-white/20 font-body text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h3 className="font-display text-4xl md:text-5xl text-white max-w-2xl leading-tight">
          {itinerary.title}
        </h3>
      </div>
      
      {/* Gold bottom border on hover */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
    </Link>
  );
};

export default ItineraryCard;
