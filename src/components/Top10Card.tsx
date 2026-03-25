import Image from "next/image";
import { Top10Item } from "@/data/taste";
import { cn } from "@/lib/utils";

interface Top10CardProps {
  item: Top10Item;
  rank: number;
  onClick?: (item: Top10Item) => void;
}

const Top10Card = ({ item, rank, onClick }: Top10CardProps) => {
  return (
    <div 
      className="group block h-full cursor-pointer"
      onClick={() => onClick?.(item)}
    >
      <div className="relative aspect-[4/3] overflow-hidden mb-6 bg-border">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Hover state overlay and line */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-body text-[10px] uppercase font-bold tracking-[0.3em] text-white border border-white/40 px-4 py-2 bg-white/10 backdrop-blur-sm">
                View on Map
            </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

        <div className="absolute top-4 left-4 z-10">
          <span className="flex items-center justify-center w-8 h-8 font-display text-lg bg-accent text-white shadow-lg">
            {rank}
          </span>
        </div>
        
        {item.highlight && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-emerald-500 text-white text-[10px] uppercase font-bold tracking-[0.2em] px-2 py-1 rounded-sm shadow-sm">
              {item.highlight}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <span className="font-body text-[10px] uppercase font-bold tracking-[0.25em] text-accent">
            {item.location}
          </span>
          <h3 className="font-display text-xl md:text-2xl text-text leading-tight group-hover:text-accent transition-colors">
            {item.name}
          </h3>
        </div>
        
        <p className="font-body text-sm text-muted line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
};

export default Top10Card;
