"use client";

import { useState } from "react";
import { ChevronDown, Utensils, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ItineraryDay } from "@/lib/supabase/types";

interface Stops {
  morning?: string | null;
  afternoon?: string | null;
  evening?: string | null;
  eat?: string | null;
  stay?: string | null;
}

interface DayAccordionProps {
  days: ItineraryDay[];
}

const DayAccordion = ({ days }: DayAccordionProps) => {
  const [openDay, setOpenDay] = useState<number | null>(1);

  return (
    <div className="space-y-4">
      {days.map((day) => {
        const stops = (day.stops ?? {}) as Stops;
        return (
          <div
            key={day.id}
            className="border border-border bg-bg overflow-hidden"
          >
            <button
              onClick={() => setOpenDay(openDay === day.day_number ? null : day.day_number)}
              className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-border/20 transition-colors"
            >
              <div className="flex items-center space-x-6">
                <span className="font-display text-4xl text-accent/30 font-bold italic">
                  {String(day.day_number).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl md:text-3xl text-text">
                  {day.title}
                </h3>
              </div>
              <ChevronDown
                size={24}
                className={cn(
                  "text-muted transition-transform duration-300",
                  openDay === day.day_number ? "rotate-180" : ""
                )}
              />
            </button>

            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                openDay === day.day_number
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="p-6 md:p-8 pt-0 space-y-8 border-t border-border/50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stops.morning && (
                      <div className="space-y-3">
                        <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Morning</span>
                        <p className="font-body text-sm text-text leading-relaxed">{stops.morning}</p>
                      </div>
                    )}
                    {stops.afternoon && (
                      <div className="space-y-3">
                        <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Afternoon</span>
                        <p className="font-body text-sm text-text leading-relaxed">{stops.afternoon}</p>
                      </div>
                    )}
                    {stops.evening && (
                      <div className="space-y-3">
                        <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Evening</span>
                        <p className="font-body text-sm text-text leading-relaxed">{stops.evening}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stops.eat && (
                      <div className="flex items-start space-x-4 bg-accent/5 p-4 border border-accent/10">
                        <Utensils size={18} className="text-accent mt-1 flex-shrink-0" />
                        <div className="space-y-1">
                          <span className="font-body text-[10px] uppercase font-bold tracking-widest text-accent">Eat</span>
                          <p className="font-body text-sm text-text">{stops.eat}</p>
                        </div>
                      </div>
                    )}
                    {stops.stay && (
                      <div className="flex items-start space-x-4 bg-border/20 p-4 border border-border/10">
                        <Home size={18} className="text-muted mt-1 flex-shrink-0" />
                        <div className="space-y-1">
                          <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Stay</span>
                          <p className="font-body text-sm text-text">{stops.stay}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DayAccordion;
