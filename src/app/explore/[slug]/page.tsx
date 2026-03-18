import { allArticles } from "contentlayer/generated";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MDXContent } from "@/components/MDXContent";
import { formatDate } from "@/lib/utils";
import ArticleCard from "@/components/ArticleCard";
import { Clock, Calendar, User } from "lucide-react";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return allArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = allArticles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = allArticles
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 3);

  return (
    <article className="pb-24">
      {/* Hero */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-border overflow-hidden">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-20 relative z-10">
        <div className="bg-bg p-8 md:p-16 lg:p-20 shadow-xl max-w-article mx-auto">
          {/* Header */}
          <header className="space-y-8 mb-12 border-b border-border pb-12">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent border border-accent/20 px-3 py-1">
                {article.category}
              </span>
              <div className="flex items-center text-muted space-x-2 text-[10px] uppercase tracking-widest">
                <Clock size={12} />
                <span>{article.readTime} MIN READ</span>
              </div>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-text leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 text-muted border-t border-border pt-8">
              <div className="flex items-center space-x-2">
                <User size={14} className="text-accent" />
                <span className="font-body text-xs uppercase tracking-wider">{article.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={14} className="text-accent" />
                <span className="font-body text-xs uppercase tracking-wider">{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </header>

          {/* Body */}
          <div className="prose prose-slate prose-lg max-w-none 
            font-body text-text/80 leading-relaxed
            prose-headings:font-display prose-headings:text-text prose-headings:font-semibold
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-blockquote:font-display prose-blockquote:italic prose-blockquote:text-muted prose-blockquote:border-accent
            prose-img:rounded-sm shadow-sm
          ">
            <MDXContent code={article.body.code} />
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-12 mt-24 border-t border-border pt-24 text-center">
          <span className="font-body text-[10px] uppercase font-bold tracking-[0.3em] text-accent mb-6 block">Continue Reading</span>
          <h2 className="font-display text-4xl text-text mb-16">Related Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 text-left">
            {relatedArticles.map((ra) => (
              <ArticleCard key={ra.slug} article={ra} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
