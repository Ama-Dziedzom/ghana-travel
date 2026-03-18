import Link from "next/link";
import Image from "next/image";
import { type Recipe } from "contentlayer/generated";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Link 
      href={recipe.url}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden mb-5 bg-border rounded-sm">
        <Image
          src={recipe.coverImage}
          alt={recipe.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 group-hover:ring-accent/40 transition-all duration-300" />
      </div>

      <div className="space-y-2">
        <h3 className="font-display text-xl text-text group-hover:text-accent transition-colors">
          {recipe.title}
        </h3>
        <div className="flex items-center space-x-3 text-muted">
          <span className="font-body text-[10px] uppercase tracking-widest bg-border/50 px-2 py-0.5 rounded-full">
            {recipe.difficulty}
          </span>
          <span className="text-[10px] text-border">•</span>
          <span className="font-body text-[10px] uppercase tracking-widest">
            {recipe.prepTime + recipe.cookTime} MIN
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
