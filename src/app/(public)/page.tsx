import Link from "next/link";
import Image from "next/image";
import { compareDesc } from "date-fns";
import { ArrowRight } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import NewsletterStrip from "@/components/NewsletterStrip";
import { getArticles } from "@/lib/cms/articles";
import { getRecipes } from "@/lib/cms/recipes";

export default async function Home() {
  const [allArticles, allRecipes] = await Promise.all([getArticles(), getRecipes()]);

  const latestArticles = [...allArticles]
    .sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime())
    .slice(0, 3);

  const featuredRecipe = allRecipes[0];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src="/images/hero_ghana.png"
          alt="Beautiful Ghana Life"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-4xl space-y-6">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1]">
              Ghana. Come for the beaches. <br className="hidden md:block" /> Stay for everything else.
            </h1>
            <p className="font-body text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light tracking-wide">
              An editorial journey through the culture, food, and soul of West Africa.
            </p>
            <div className="pt-8">
              <Link
                href="/explore"
                className="inline-block px-10 py-4 bg-white text-text font-body text-sm font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
              >
                Start Exploring
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-24 px-6 lg:px-12 bg-bg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent">Latest Stories</span>
              <h2 className="font-display text-4xl md:text-5xl text-text">Explore the Culture</h2>
            </div>
            <Link 
              href="/explore" 
              className="group flex items-center space-x-2 font-body text-xs font-bold uppercase tracking-widest text-text hover:text-accent transition-colors"
            >
              <span>View all articles</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Plan Your Trip CTA */}
      <section className="py-20 px-6 lg:px-12 bg-text overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
           <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
             <circle cx="50" cy="50" r="40" />
           </svg>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl space-y-6 text-center md:text-left">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-bg leading-tight">
              Ready to write your <br className="hidden md:block" /> own Ghana story?
            </h2>
            <p className="font-body text-bg/60 text-lg">
              Our curated itineraries cover everything from weekend escapes in Accra to week-long loops across the country.
            </p>
          </div>
          <Link
            href="/itineraries"
            className="px-10 py-5 bg-accent text-white font-body text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-text transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Plan Your Trip
          </Link>
        </div>
      </section>

      {/* Featured Recipe Teaser */}
      {featuredRecipe && (
        <section className="py-24 px-6 lg:px-12 bg-bg overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-24">
              <Link 
                href={`/taste/${featuredRecipe.slug}`}
                className="relative aspect-[4/5] overflow-hidden group rounded-sm shadow-2xl"
              >
                {featuredRecipe.cover_image && (
                  <Image
                    src={featuredRecipe.cover_image}
                    alt={featuredRecipe.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 h-2 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </Link>
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent">Taste of Ghana</span>
                  <h2 className="font-display text-5xl md:text-6xl text-text leading-tight">
                    {featuredRecipe.title}
                  </h2>
                  <p className="font-body text-muted text-lg leading-relaxed max-w-lg">
                    {featuredRecipe.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-8 pt-4">
                  {featuredRecipe.prep_time && (
                    <div className="space-y-1">
                      <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Prep</span>
                      <p className="font-display text-xl text-text">{featuredRecipe.prep_time} Min</p>
                    </div>
                  )}
                  {featuredRecipe.cook_time && (
                    <div className="space-y-1">
                      <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Cook</span>
                      <p className="font-display text-xl text-text">{featuredRecipe.cook_time} Min</p>
                    </div>
                  )}
                  {featuredRecipe.servings && (
                    <div className="space-y-1">
                      <span className="font-body text-[10px] uppercase font-bold tracking-widest text-muted">Serving</span>
                      <p className="font-display text-xl text-text">{featuredRecipe.servings} People</p>
                    </div>
                  )}
                </div>
                <div className="pt-6">
                  <Link
                    href="/taste"
                    className="inline-flex items-center space-x-3 font-body text-xs font-bold uppercase tracking-[0.2em] text-text hover:text-accent transition-colors"
                  >
                    <span>More recipes</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <NewsletterStrip />
    </div>
  );
}
