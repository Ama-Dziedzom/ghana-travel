"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "px-6 py-2 rounded-full border font-body text-xs font-bold uppercase tracking-widest transition-all",
            activeCategory === category
              ? "bg-text text-bg border-text"
              : "bg-transparent text-muted border-border hover:border-accent hover:text-accent"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
