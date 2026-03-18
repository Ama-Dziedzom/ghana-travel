"use client";

import { useState } from "react";
import { ChevronDown, Utensils, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface Day {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  eat: string;
  stay: string;
}

interface DayAccordionProps {
  days: Day[];
}

const DayAccordion = ({ days }: DayAccordionProps) => {
  const [openDay, setOpenDay] = useState<number | null>(1);

  return (
    <div className="space-y-4">
      {days.map((day) => (
        <div 
          key={day.day}
          className="border border-border bg-bg overflow-hidden"
        >
          <button
            onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
            className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-border/20 transition-colors"
          >
            <div className="flex items-center space-x-6">
              <span className="font-display text-4xl text-accent/30 font-bold italic">
                {String(day.day).padStart(2, '0')}
              </span>
              <h3 className="font-display text-2xl md:text-3xl text-text">
                {day.title}
              </h3>
            </div>
            <ChevronDown 
              size={24} 
              className={cn("text-muted transition-transform duration-300", 
                openDay === day.day ? "rotate-180" : ""
              )} 
            />
          </button>

          <div 
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              openDay === day.day ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="p-6 md:p-8 pt-0 space-y-8 border-t border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Morning</span>
                    <p className="font-body text-sm text-text leading-relaxed">{day.morning}</p>
                  </div>
                  <div className="space-y-3">
                    <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Afternoon</span>
                    <p className="font-body text-sm text-text leading-relaxed">{day.afternoon}</p>
                  </div>
                  <div className="space-y-3">
                    <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Evening</span>
                    <p className="font-body text-sm text-text leading-relaxed">{day.evening}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-4 bg-accent/5 p-4 border border-accent/10">
                    <Utensils size={18} className="text-accent mt-1 flex-shrink-0" />
                    <div className="space-y-1">
                      <span className="font-body text-[10px] uppercase font-bold tracking-widest text-accent">Eat</span>
                      <p className="font-body text-sm text-text">{day.eat}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 bg-border/20 p-4 border border-border/10">
                    <Home size={18} className="text-muted mt-1 flex-shrink-0" />
                    <div className="space-y-1">
                      <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Stay</span>
                      <p className="font-body text-sm text-text">{day.stay}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DayAccordion;
