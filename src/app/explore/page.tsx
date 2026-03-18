"use client";

import { useState } from "react";
import { allArticles } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import ArticleCard from "@/components/ArticleCard";
import CategoryFilter from "@/components/CategoryFilter";

const CATEGORIES = ["All", "Culture", "History", "Festivals", "Neighbourhoods"];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles = allArticles
    .filter((article) => {
      if (activeCategory === "All") return true;
      return article.category.toLowerCase() === activeCategory.toLowerCase();
    })
    .sort((a, b) => compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)));

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent">Discover</span>
          <h1 className="font-display text-5xl md:text-6xl text-text leading-tight">
            Explore Ghana
          </h1>
          <p className="font-body text-muted text-lg leading-relaxed">
            From the bustling markets of Accra to the serene history of the Central Region, dive into stories that celebrate the soul of Ghana.
          </p>
        </div>

        {/* Filter */}
        <div className="mb-12 border-y border-border/50">
          <CategoryFilter 
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-display text-2xl text-muted italic">No stories found in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
