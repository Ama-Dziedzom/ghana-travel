"use client";

import { useEffect, useState } from "react";
import { X, MapPin, Navigation } from "lucide-react";
import { Top10Item } from "@/data/taste";
import { cn } from "@/lib/utils";

interface MapModalProps {
  item: Top10Item | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MapModal({ item, isOpen, onClose }: MapModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isMounted || !item) return null;

  const mapUrl = `https://maps.google.com/maps?q=${item.lat},${item.lng}&z=15&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-text/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className={cn(
          "relative w-full max-w-4xl bg-bg border border-border/50 shadow-2xl rounded-sm overflow-hidden flex flex-col md:flex-row transition-transform duration-500",
          isOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
        )}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-bg/80 backdrop-blur-md border border-border/50 hover:bg-accent hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Map Side */}
        <div className="w-full md:w-2/3 h-[300px] md:h-[500px] bg-muted/20 relative">
          <iframe
            title={`Map showing location of ${item.name}`}
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={mapUrl}
            className="filter grayscale-[0.2] contrast-[1.1]"
          />
        </div>

        {/* Info Side */}
        <div className="w-full md:w-1/3 p-8 flex flex-col justify-between bg-bg">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="font-body text-[10px] uppercase font-bold tracking-[0.2em] text-accent flex items-center gap-2">
                <MapPin size={12} />
                {item.location}
              </span>
              <h2 className="font-display text-3xl text-text leading-tight uppercase font-medium">
                {item.name}
              </h2>
            </div>

            <p className="font-body text-sm text-muted leading-relaxed">
              {item.description}
            </p>

            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-3 text-xs font-body text-muted">
                <div className="w-8 h-8 bg-accent/10 flex items-center justify-center text-accent">
                   <Navigation size={14} />
                </div>
                <span>Coordinates: {item.lat?.toFixed(4)}, {item.lng?.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/40">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-text text-bg font-body text-[11px] uppercase font-bold tracking-widest hover:bg-accent transition-colors duration-300"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
