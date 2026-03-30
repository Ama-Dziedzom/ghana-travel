import { getRecipeBySlug, getRecipes } from "@/lib/cms/recipes";
import { notFound } from "next/navigation";
import Image from "next/image";
import RecipeCard from "@/components/RecipeCard";
import { Clock, Users, BarChart, ChefHat } from "lucide-react";

export const dynamic = 'force-dynamic';

interface RecipePageProps {
  params: {
    slug: string;
  };
}



export default async function RecipePage({ params }: RecipePageProps) {
  const [recipe, allRecipes] = await Promise.all([
    getRecipeBySlug(params.slug),
    getRecipes(),
  ]);

  if (!recipe) notFound();

  const relatedRecipes = allRecipes
    .filter((r) => r.slug !== recipe.slug && r.category === recipe.category)
    .slice(0, 3);

  const totalTime = (recipe.prep_time ?? 0) + (recipe.cook_time ?? 0);

  return (
    <article className="pb-24">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 lg:px-12 bg-bg">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent">
                  {(recipe.category ?? "").replace("-", " ")}
                </span>
                <h1 className="font-display text-5xl md:text-7xl text-text leading-tight">
                  {recipe.title}
                </h1>
                <p className="font-body text-muted text-lg leading-relaxed max-w-xl">
                  {recipe.description}
                </p>
              </div>

              {/* At-a-glance bar */}
              <div className="flex flex-wrap gap-8 py-8 border-y border-border">
                {totalTime > 0 && (
                  <div className="flex items-center space-x-3">
                    <Clock size={20} className="text-accent" />
                    <div className="flex flex-col">
                      <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Time</span>
                      <span className="font-body text-sm font-semibold">{totalTime} MINS</span>
                    </div>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center space-x-3">
                    <Users size={20} className="text-accent" />
                    <div className="flex flex-col">
                      <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Serves</span>
                      <span className="font-body text-sm font-semibold">{recipe.servings} PERSONS</span>
                    </div>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className="flex items-center space-x-3">
                    <BarChart size={20} className="text-accent" />
                    <div className="flex flex-col">
                      <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Difficulty</span>
                      <span className="font-body text-sm font-semibold uppercase">{recipe.difficulty}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square bg-border overflow-hidden rounded-sm shadow-2xl">
              {recipe.cover_image && (
                <Image
                  src={recipe.cover_image}
                  alt={recipe.title}
                  fill
                  priority
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Content */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          {/* Ingredients */}
          <div className="lg:col-span-4 space-y-12">
            <div className="bg-border/20 p-8 md:p-12 relative overflow-hidden">
               <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none">
                 <ChefHat size={120} />
               </div>
               <h2 className="font-display text-3xl text-text mb-8 border-b border-accent/20 pb-4">Ingredients</h2>
               <ul className="space-y-6">
                 {(recipe.ingredients ?? []).map((ingredient, i) => (
                   <li key={i} className="flex gap-4">
                     <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                     <span className="font-body text-text/80 leading-relaxed">{ingredient}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-8 space-y-12">
            <h2 className="font-display text-4xl text-text mb-8">Instructions</h2>
            <div className="space-y-12">
              {(recipe.instructions ?? []).map((step, i) => (
                <div key={i} className="flex gap-8 group">
                  <span className="font-display text-5xl text-accent/20 group-hover:text-accent/40 transition-colors shrink-0 leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-body text-lg text-text/80 leading-relaxed pt-2">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Cook's Tip */}
            {recipe.tips && (
              <div className="mt-20 p-8 md:p-12 bg-accent/5 border border-accent/10 rounded-sm">
                <h3 className="font-display text-2xl text-accent mb-4">Cook&apos;s Tips</h3>
                <p className="font-body text-text/70 italic leading-relaxed">
                  &ldquo;{recipe.tips}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Recipes */}
      {relatedRecipes.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mt-24 border-t border-border pt-24 text-center">
          <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent mb-6 block">More Flavors</span>
          <h2 className="font-display text-4xl text-text mb-16">Related Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 text-left">
            {relatedRecipes.map((rr) => (
              <RecipeCard key={rr.slug} recipe={rr} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
