"use client";

import { useState, useMemo, useEffect } from "react";
import RecipeCard from "@/components/RecipeCard";
import CategoryFilter from "@/components/CategoryFilter";
import type { Recipe } from "@/lib/supabase/types";
import { MOCK_RESTAURANTS, MOCK_CAFES, GHANA_REGIONS, RegionTop10, Top10Item } from "@/data/taste";
import Top10Card from "@/components/Top10Card";
import MapModal from "@/components/MapModal";
import { cn } from "@/lib/utils";

const MAIN_TABS = ["Recipes", "Restaurants", "Cafes"];
const RECIPE_CATEGORIES = ["All", "Soups", "Rice Dishes", "Street Food", "Drinks", "Snacks"];

interface ClientTastePageProps {
  recipes: Recipe[];
}

export default function ClientTastePage({ recipes }: ClientTastePageProps) {
  const [activeMainTab, setActiveMainTab] = useState("Recipes");
  
  // Recipe-specific state
  const [activeRecipeCategory, setActiveRecipeCategory] = useState("All");

  // Top 10 specific state
  const [selectedRegion, setSelectedRegion] = useState(GHANA_REGIONS[0]);
  const [selectedOccasion, setSelectedOccasion] = useState("");
  
  // Modal state
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapSelectedItem, setMapSelectedItem] = useState<Top10Item | null>(null);

  const handleItemClick = (item: Top10Item) => {
    setMapSelectedItem(item);
    setIsMapModalOpen(true);
  };

  const filteredRecipes = recipes.filter((recipe) => {
    if (activeRecipeCategory === "All") return true;
    return (recipe.category ?? "").toLowerCase().replace("-", " ") === activeRecipeCategory.toLowerCase();
  });

  const activeTop10Data = activeMainTab === "Restaurants" ? MOCK_RESTAURANTS : MOCK_CAFES;
  
  const regionData = useMemo(() => {
    return activeTop10Data.find(r => r.region === selectedRegion);
  }, [activeTop10Data, selectedRegion]);

  const occasions = useMemo(() => {
    return regionData?.occasions.map(o => o.name) ?? [];
  }, [regionData]);

  // Set default occasion if not set or not in current list
  useEffect(() => {
    if (occasions.length > 0 && (!selectedOccasion || !occasions.includes(selectedOccasion))) {
      setSelectedOccasion(occasions[0]);
    }
  }, [occasions, selectedOccasion]);

  const activeTop10Items = useMemo(() => {
    return regionData?.occasions.find(o => o.name === selectedOccasion)?.items ?? [];
  }, [regionData, selectedOccasion]);

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent">Culinary Journey</span>
          <h1 className="font-display text-5xl md:text-6xl text-text leading-tight">
            Taste Ghana
          </h1>
          <p className="font-body text-muted text-lg leading-relaxed">
            {activeMainTab === "Recipes" 
              ? "From the fiery heat of Jollof rice to the street corner aromas of Kelewele, discover the recipes that define Ghanaian hospitality."
              : `Explore the finest ${activeMainTab.toLowerCase()} across Ghana, handpicked for quality and authentic local flavor.`}
          </p>
        </div>

        {/* Main Category Tabs - Pill Style */}
        <div className="flex flex-wrap gap-4 mb-16 border-b border-border/40 pb-8">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveMainTab(tab)}
              className={cn(
                "px-8 py-2 border font-body text-[10px] uppercase font-bold tracking-widest transition-all duration-300",
                activeMainTab === tab 
                  ? "bg-text text-bg border-text shadow-sm" 
                  : "bg-transparent text-muted border-border hover:border-accent hover:text-accent"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Recipes View */}
        {activeMainTab === "Recipes" && (
          <>
            <div className="mb-12 border-y border-border/50">
              <CategoryFilter 
                categories={RECIPE_CATEGORIES}
                activeCategory={activeRecipeCategory}
                onCategoryChange={setActiveRecipeCategory}
              />
            </div>

            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard key={recipe.slug} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <p className="font-display text-2xl text-muted italic">No recipes found in this category yet.</p>
              </div>
            )}
          </>
        )}

        {/* Restaurants/Cafes View */}
        {activeMainTab !== "Recipes" && (
          <div className="space-y-12">
            {/* Unified Filter Bar for Restaurants/Cafes */}
            <div className="space-y-0 border-y border-border/50 mb-12">
              <div className="flex flex-col border-b border-border/30 last:border-0">
                <div className="flex items-center justify-center bg-bg/50 py-2 border-b border-border/20">
                    <span className="font-body text-[9px] uppercase font-bold tracking-[0.3em] text-accent/60">Region</span>
                </div>
                <CategoryFilter 
                  categories={GHANA_REGIONS}
                  activeCategory={selectedRegion}
                  onCategoryChange={setSelectedRegion}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-center bg-bg/50 py-2 border-b border-border/20">
                     <span className="font-body text-[9px] uppercase font-bold tracking-[0.3em] text-accent/60">Occasion</span>
                </div>
                <CategoryFilter 
                  categories={occasions}
                  activeCategory={selectedOccasion}
                  onCategoryChange={setSelectedOccasion}
                />
              </div>
            </div>

            {/* Top 10 List */}
            <div className="space-y-16">
              <div className="max-w-2xl mx-auto text-center space-y-4">
                <h2 className="font-display text-4xl md:text-5xl text-text leading-tight uppercase tracking-tight">
                  Top 10 {activeMainTab}
                </h2>
                <div className="flex items-center justify-center space-x-4">
                  <div className="h-[1px] w-12 bg-accent" />
                  <p className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent">
                    {selectedOccasion} in {selectedRegion}
                  </p>
                  <div className="h-[1px] w-12 bg-accent" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                {activeTop10Items.map((item, index) => (
                  <Top10Card 
                    key={item.id} 
                    item={item} 
                    rank={index + 1} 
                    onClick={handleItemClick}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <MapModal 
        isOpen={isMapModalOpen}
        item={mapSelectedItem}
        onClose={() => setIsMapModalOpen(false)}
      />
    </div>
  );
}
