"use client";

import { useEffect, useState } from "react";
import { X, ArrowRight, Clock, MapPin, Info } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GuideModalProps {
  tip: {
    title: string;
    category: string;
    image: string;
    content: string;
    fullContent?: string;
    highlights?: string[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideModal({ tip, isOpen, onClose }: GuideModalProps) {
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

  if (!isMounted || !tip) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 transition-all duration-500",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-text/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className={cn(
          "relative w-full max-w-5xl bg-bg border border-border/50 shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-700 ease-out h-[90vh] md:h-auto md:max-h-[85vh]",
          isOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95"
        )}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 bg-white/90 backdrop-blur-md border border-border/50 hover:bg-accent hover:text-white transition-all duration-300 group shadow-lg"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Visual Side */}
        <div className="w-full md:w-5/12 h-[300px] md:h-auto relative overflow-hidden shrink-0">
          <Image
            src={tip.image}
            alt={tip.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8 space-y-4">
            <span className="bg-accent text-white text-[9px] uppercase font-bold tracking-[0.3em] px-4 py-2 inline-block">
              {tip.category}
            </span>
            <h2 className="font-display text-4xl text-white leading-tight italic">
              {tip.title}
            </h2>
          </div>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-7/12 p-8 md:p-16 overflow-y-auto bg-bg relative">
          <div className="max-w-xl mx-auto space-y-12">
            {/* Introduction */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-accent/30" />
                <span className="font-body text-[10px] uppercase font-bold tracking-[0.4em] text-accent">Introduction</span>
              </div>
              <p className="font-body text-xl text-text leading-relaxed italic font-light">
                {tip.content}
              </p>
            </div>

            {/* Highlights Section */}
            {tip.highlights && (
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-10 border-y border-border/40">
                {tip.highlights.map((h, i) => (
                  <div key={i} className="space-y-3">
                    <div className="text-accent font-display text-2xl italic">0{i+1}</div>
                    <p className="font-body text-[11px] uppercase tracking-wider font-bold text-text/80 leading-tight">
                      {h}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Detailed Content */}
            <div className="space-y-8 pb-10">
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-accent/30" />
                <span className="font-body text-[10px] uppercase font-bold tracking-[0.4em] text-accent">The Guide</span>
              </div>
              
              <div className="prose prose-sm max-w-none font-body text-muted leading-relaxed space-y-6 whitespace-pre-line text-lg">
                {tip.fullContent || "Detailed guide content coming soon..."}
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-12 border-t border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-4 text-muted">
                 <div className="w-10 h-10 border border-border flex items-center justify-center">
                    <Clock size={16} />
                 </div>
                 <span className="text-[10px] uppercase tracking-widest font-bold">5 Min Read</span>
              </div>
              
              <button 
                onClick={onClose}
                className="inline-flex items-center gap-4 group/btn"
              >
                <span className="font-body text-[10px] uppercase font-bold tracking-widest text-accent">
                   Got it, thanks
                </span>
                <div className="w-12 h-12 border border-accent/20 flex items-center justify-center group-hover/btn:bg-accent group-hover/btn:text-white transition-all duration-500">
                   <ArrowRight size={18} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
