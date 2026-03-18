"use client";

import { useState } from "react";
import { allRecipes } from "contentlayer/generated";
import RecipeCard from "@/components/RecipeCard";
import CategoryFilter from "@/components/CategoryFilter";

const RECIPE_CATEGORIES = ["All", "Soups", "Rice Dishes", "Street Food", "Drinks", "Snacks"];

export default function TastePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredRecipes = allRecipes.filter((recipe) => {
    if (activeCategory === "All") return true;
    return recipe.category.toLowerCase().replace("-", " ") === activeCategory.toLowerCase();
  });

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent">Culinary Journey</span>
          <h1 className="font-display text-5xl md:text-6xl text-text leading-tight">
            Taste Ghana
          </h1>
          <p className="font-body text-muted text-lg leading-relaxed">
            From the fiery heat of Jollof rice to the street corner aromas of Kelewele, discover the recipes that define Ghanaian hospitality.
          </p>
        </div>

        {/* Filter */}
        <div className="mb-12 border-y border-border/50">
          <CategoryFilter 
            categories={RECIPE_CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Grid */}
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
      </div>
    </div>
  );
}
